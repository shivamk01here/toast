import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { PERSONA_MAP } from "@/lib/personas";
import { PersonaKey, RoastResultData } from "@/types/roast";
import { getFallbackRoast } from "@/lib/roast_fallback";

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
          temperature: 1,
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

export async function POST(req: NextRequest) {
  let selectedPersona: PersonaKey = "wolf";

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

    const prompt = `You are ${PERSONA_MAP[selectedPersona].systemPrompt}.
${contextInstruction}
Return JSON ONLY with exact shape:
{
  "score": number (0-100),
  "roast": "brutal 2 sentence insult",
  "fix": "rewritten version",
  "cringe_words": ["list", "of", "bad", "words"],
  "gif_keyword": "search term"
}
Do not wrap in markdown.

Input Text:
${sanitizedEmail}`;

    const modelText = await generateWithModelFallback(prompt, apiKey);
    const parsed = parseModelJson(modelText);
    if (!parsed) {
      return NextResponse.json(
        { error: "AI returned malformed output. Try roasting again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Roast API failure, switching to fallback", error);

    // FALLBACK MECHANISM
    // If anything fails (Gemini 429, 500, network, parsing), we return a local roast
    // so the user ALWAYS gets a result.
    const fallback = getFallbackRoast(selectedPersona);
    
    // Return 200 OK because from the frontend perspective, it succeeded
    return NextResponse.json(fallback);
  }
}
