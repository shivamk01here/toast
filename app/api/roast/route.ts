import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { PERSONA_MAP } from "@/lib/personas";
import { PersonaKey, RoastResultData } from "@/types/roast";
import { getFallbackRoast } from "@/lib/roast_fallback";
import { checkAndIncrementRateLimit, getRateLimitStatus } from "@/lib/storage";
import { sendTelegramNotification } from "@/lib/telegram";

export const runtime = "nodejs";


interface RoastRequest {
  email?: string;
  persona?: PersonaKey;
}

interface GeminiErrorShape {
  status?: number;
  message?: string;
}

function parseModelJson(text: string): RoastResultData | null {
  const sanitized = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(sanitized) as Partial<RoastResultData>;
    if (
      typeof parsed.score !== "number" ||
      typeof parsed.roast !== "string" ||
      typeof parsed.fix !== "string" ||
      !Array.isArray(parsed.cringe_words) ||
      typeof parsed.gif_keyword !== "string"
    ) {
      return null;
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      roast: parsed.roast.trim(),
      tip: typeof parsed.tip === "string" ? parsed.tip.trim() : "",
      fix: parsed.fix.trim(),
      cringe_words: parsed.cringe_words
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, 12),
      gif_keyword: parsed.gif_keyword.trim()
    };
  } catch {
    return null;
  }
}

async function generateWithModelFallback(prompt: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const candidates = [
    configuredModel,
    "gemini-2.5-flash",
    "gemini-2.0-flash"
  ].filter(Boolean) as string[];

  let lastError: GeminiErrorShape | null = null;

  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 1.0 + Math.random() * 0.4,
          responseMimeType: "application/json"
        }
      });

      return response.response.text();
    } catch (error) {
      const typed = (error ?? {}) as GeminiErrorShape;
      lastError = typed;
      if (typed.status === 404) {
        continue;
      }
      throw error;
    }
  }

  const unavailableError = new Error(
    "No supported Gemini model found for this API key."
  ) as Error & GeminiErrorShape;
  unavailableError.status = lastError?.status ?? 404;
  throw unavailableError;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || '127.0.0.1';
  const status = getRateLimitStatus(ip);
  return NextResponse.json({ remaining: status.remaining, limit: 3 });
}

export async function POST(req: NextRequest) {
  let selectedPersona: PersonaKey = "wolf";

  // Extract IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || '127.0.0.1';

  // Check rate limit
  const rateLimit = checkAndIncrementRateLimit(ip);
  if (!rateLimit.allowed) {
    await sendTelegramNotification(
      `⚠️ <b>RATE LIMIT HIT</b>\nIP: \`${ip}\` exhausted free roasts.`
    );
    return NextResponse.json(
      { error: "RATE_LIMIT_EXCEEDED", message: "You've used all 3 free roasts for today. Come back in 24 hours or get the extension for unlimited roasts!" },
      { status: 429 }
    );
  }


  try {
    const { email, persona = "wolf", mode = "email" } = (await req.json()) as RoastRequest & { mode?: "email" | "linkedin" | "resume" };
    const sanitizedEmail = email?.trim() ?? "";
    selectedPersona = PERSONA_MAP[persona] ? persona : "wolf";

    if (!sanitizedEmail || sanitizedEmail.length < 15 || !/[A-Za-z]/.test(sanitizedEmail)) {
      return NextResponse.json(
        {
          error:
            "Input is too weak or unreadable. Paste a real pitch/post/resume with at least one coherent sentence."
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await sendTelegramNotification(
        `💀 <b>CRITICAL FAILURE</b>\nGEMINI_API_KEY is missing on server!`
      );
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY on server." },
        { status: 500 }
      );
    }


    let contextInstruction = "";
    if (mode === "linkedin") {
       contextInstruction = `Roast this LinkedIn 'About' section or Post. Mock the humble-brags, the corporate cringe, and the fake visionary tone. Rewrite it to be honest.`;
    } else if (mode === "resume") {
       contextInstruction = `Roast this Resume/CV summary or skills. Mock the buzzwords, the inflated titles, and the generic skills (e.g. 'Microsoft Word'). Rewrite it to be actually hireable.`;
    } else {
       contextInstruction = `Roast this Cold Email. Mock the desperation, the templates, and the lack of value. Rewrite it to be persuasive and concise.`;
    }

    const prompt = `SYSTEM ROLE: You are ${PERSONA_MAP[selectedPersona].systemPrompt}

===
USER SUBMITTED TEXT:
${sanitizedEmail}
===

${contextInstruction}

Now produce a JSON response. Follow these rules EXACTLY for each field:

1. "score" — Integer 0 to 100. How bad is this text? 0 = absolute trash, 100 = perfect.

2. "roast" — 3 to 5 sentences IN CHARACTER. Quote or reference something SPECIFIC from their actual text and tear it apart in your authentic voice. If you are a Desi character (HOD, Babu Bhaiya, Ashneer, etc.): write in raw, aggressive Hinglish. Do NOT be polite. No softening.

3. "tip" — 1 to 2 sentences IN CHARACTER. If you have any character-clichés like "Raju ne sikhaya hai" or "Yeh doglapan hai", put them HERE. Name the single worst thing about their text in your character voice.

4. "fix" — ⚠️ CRITICAL: ZERO CHARACTER VOICE IN THIS FIELD. ⚠️
Write a COMPLETE, FULL professional English rewrite of their ENTIRE submitted text.
Rules for fix:
- NO character voice, NO slang, NO Hinglish, NO humor, NO character names.
- Rewrite the FULL content — do not summarize, do not give a one-liner.
- It must be a ready-to-send, high-quality, professional English version of their text.
- Be direct, concise, and persuasive.

5. "cringe_words" — Array of up to 8 actual words/phrases copied verbatim from their text that were the worst.

6. "gif_keyword" — 2-3 word GIF search term matching the emotional reaction.

Return RAW JSON ONLY. No markdown. No explanation.

{
  "score": <integer>,
  "roast": "<character voice roast>",
  "tip": "<character voice tip>",
  "fix": "<full professional English rewrite>",
  "cringe_words": ["<word1>", "<word2>"],
  "gif_keyword": "<keyword>"
}`;

    const modelText = await generateWithModelFallback(prompt, apiKey);
    const parsed = parseModelJson(modelText);
    if (!parsed) {
      return NextResponse.json(
        { error: "AI returned malformed output. Try roasting again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("CRITICAL ROAST API FAILURE:", error);
    
    await sendTelegramNotification(
      `🚨 <b>ROAST API FAILED</b>\nError: ${error?.message || "Unknown error"}\nDetails: ${JSON.stringify(error).substring(0, 200)}`
    );

    // Explicitly returning an error instead of fallback to allow troubleshooting
    return NextResponse.json(
      { 
        error: "Roast failed. Error logged to server console.",
        details: error?.message || "Unknown server error"
      },
      { status: 500 }
    );
  }

}
