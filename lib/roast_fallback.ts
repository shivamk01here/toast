import { PersonaCategory, PersonaKey, RoastResultData } from "@/types/roast";
import { PERSONAS } from "./personas";

const FALLBACK_ROASTS: Record<PersonaCategory | "default", RoastResultData[]> = {
  sales: [
    {
      score: 12,
      roast: "This pitch has less value than a LinkedIn poll about 'Hustle Culture'. It smells like desperation and a template from 2012.",
      tip: "You're selling yourself, not a solution. Nobody cares about you — they care about their problem.",
      fix: "Hi [Name],\n\nI noticed you're struggling with [Problem]. We fixed this for [Competitor] and increased their revenue by 20%.\n\nWorth a chat?",
      cringe_words: ["synergy", "revolutionary", "disrupt", "leverage"],
      gif_keyword: "bored"
    },
    {
      score: 5,
      roast: "If 'Just checking in' was a person, it would be this email. Stop begging and start selling value, you corporate NPC.",
      tip: "'Just checking in' is a death sentence. Lead with value or don't send anything.",
      fix: "Subject: Quick question about [Goal]\n\n[Name], are you still looking to improve [Metric]? If not, tell me to get lost.",
      cringe_words: ["just checking in", "thoughts?", "touch base"],
      gif_keyword: "facepalm"
    }
  ],
  desi: [
    {
      score: 0,
      roast: "Are deva! Ye kaisa email bheja re baba? Isse accha toh mera dhoti dho leta! Utha le re deva, is email likhne wale ko utha le!",
      tip: "Aye halkat! Raju ne sikhaya hai mujhe, yeh le chup chap copy kar, bilkul ricks nahi lene ka! Word count kam kar, dimag ka dahi mat kar!",
      fix: "Hi [Name],\n\nI'm reaching out to help with [Problem]. We've seen [Result] with other partners. Are you free to discuss?",
      cringe_words: ["kindly", "synergy", "humble"],
      gif_keyword: "baburao hera pheri angry"
    },
    {
      score: 10,
      roast: "Khopdi tod saale ka! Ye pitch hai ya Star Fisheries ka menu card? Bilkul ricks nahi lene ka is faltu email ke saath!",
      tip: "Aye Raju ne sikhaya hai mujhe, yeh le chup chap copy kar, bilkul ricks nahi lene ka! Seedha baat bol re baba, ghuma fira ke baat mat kar!",
      fix: "Hello [Name],\n\nI noticed you have a gap in [Area]. I have a solution that delivers [Outcome]. Can we talk?",
      cringe_words: ["respected", "please", "hope"],
      gif_keyword: "baburao hera pheri angry"
    }
  ],
  tech: [
    {
      score: 40,
      roast: "You used so many buzzwords I think an LLM hallucinated this. 'AI-driven blockchain synergy'? Go touch grass.",
      tip: "Remove every buzzword and rewrite. If you can't explain it simply, you don't understand it.",
      fix: "Hey,\n\nWe built a tool that solves [Specific Problem] for [Target Company Type]. Here's proof it works: [Link/Metric].\n\nWant to see it?",
      cringe_words: ["AI-driven", "blockchain", "web3", "algorithm"],
      gif_keyword: "coding"
    }
  ],
  tv: [
    {
      score: 2,
      roast: "This pitch is more disappointing than the Game of Thrones finale. It lacks character, plot, and a reason to exist.",
      tip: "You have no hook. Nobody keeps reading after line one.",
      fix: "Hi [Name],\n\nYour [specific process] is losing you [estimated cost/time]. We've fixed this for companies like [Example].\n\nOpen to a quick call?",
      cringe_words: ["drama", "waiting", "hope"],
      gif_keyword: "walter white"
    }
  ],
  hollywood: [
    {
      score: 69,
      roast: "Look at that subtle coloring. The tasteful thickness. Oh my god, it even has a typo. This email is a crime scene.",
      tip: "The formatting is an insult. But the content is worse — there's no ask, no value, no point.",
      fix: "Hi [Name],\n\nI'll be direct: we help companies like yours reduce [Problem] by [X]%. Can we talk for 15 minutes?",
      cringe_words: ["impressive", "very nice", "let's see"],
      gif_keyword: "patrick bateman"
    },
    {
      score: 1,
      roast: "I'm not gonna kill you, I'm just gonna hurt you... really, really bad for writing this garbage.",
      tip: "There's no value proposition anywhere in this. What do you actually want them to do?",
      fix: "Hi [Name],\n\nI noticed [specific pain point]. We solved this for [Company] and they saved [Result].\n\nWould you be open to a quick demo?",
      cringe_words: ["society", "joke", "clown"],
      gif_keyword: "joker"
    }
  ],
  anime: [
    {
      score: -9000,
      roast: "NANI?! This pitch implies your power level is 5. It is weak. It is pathetic. You lack hatred!",
      tip: "You have the passion but the execution is zero. Power level means nothing without a plan.",
      fix: "Hi [Name],\n\nI have a solution that directly addresses [Problem]. It's been battle-tested and the results speak for themselves.\n\nAre you ready to level up?",
      cringe_words: ["power", "strength", "believe"],
      gif_keyword: "vegeta"
    },
    {
      score: 0,
      roast: "You are already rejected. Omae wa mou shindeiru. This email has no chakra flow.",
      tip: "Your opening is weak. Nobody cares about your backstory — lead with their problem.",
      fix: "Hi [Name],\n\nI'll get straight to it: [One sentence value prop]. This is how it works: [One sentence explanation]. Can we talk?",
      cringe_words: ["honor", "believe it", "ninja"],
      gif_keyword: "naruto"
    }
  ],
  medieval: [
    {
      score: 3,
      roast: "Keep your forked tongue behind your teeth! This missive is dark and full of terrors (and grammar errors).",
      tip: "Thou hast written much and said nothing. State thy purpose in the first line or die in obscurity.",
      fix: "Dear [Name],\n\nI want to help you solve [Problem]. Here's what I propose: [Clear solution in 2 sentences].\n\nI'd welcome a brief meeting at your convenience.",
      cringe_words: ["thou", "hath", "verily"],
      gif_keyword: "gandalf"
    }
  ],
  cringe: [
    {
      score: 0,
      roast: "Skibidi toilet rizz? No based sigma would read this. It's giving NPC energy. L + Ratio + FLOP.",
      tip: "No one is reading past line one. You're not being quirky, you're being ignored.",
      fix: "Hi [Name],\n\nI'll keep this short: we help with [Problem] and the results are real.\n\nWant to see the numbers?",
      cringe_words: ["slay", "queen", "period", "ick"],
      gif_keyword: "cringe"
    }
  ],
  sigma: [
    {
      score: 100,
      roast: "You are not a wolf. You are a sheep. A beta male would send this email. A Sigma would simply acquire the company.",
      tip: "You asked instead of stating. Sigmas don't ask. Restructure every sentence.",
      fix: "[Name],\n\nI'll be direct. We solve [Problem]. Our clients see [Result] within [Timeframe].\n\nIf this is relevant, reply. If not, don't.",
      cringe_words: ["please", "kindly", "hope", "sorry"],
      gif_keyword: "patrick bateman"
    }
  ],
  default: [
    {
      score: 15,
      roast: "I've seen spam folders with higher standards. This is the email equivalent of soggy bread.",
      tip: "There's no hook. Add a specific insight about their business in the first line.",
      fix: "Hi [Name],\n\nI noticed [specific observation about their company]. We help companies like yours with [Problem] — [Company] saw [Result] after working with us.\n\nWorth a 15-minute chat?",
      cringe_words: ["innovative", "solution", "partner"],
      gif_keyword: "boring"
    }
  ]
};

export function getFallbackRoast(personaId: PersonaKey): RoastResultData {
  const persona = PERSONAS.find(p => p.id === personaId);
  const category = persona?.category ?? "default";
  
  const options = FALLBACK_ROASTS[category] || FALLBACK_ROASTS.default;
  const random = options[Math.floor(Math.random() * options.length)];
  
  return {
    ...random,
    // Add a little randomness to the score so it doesn't look static
    score: Math.max(0, Math.min(100, random.score + Math.floor(Math.random() * 10 - 5)))
  };
}
