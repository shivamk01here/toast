import { PersonaCategory, PersonaKey, RoastResultData } from "@/types/roast";
import { PERSONAS } from "./personas";

const FALLBACK_ROASTS: Record<PersonaCategory | "default", RoastResultData[]> = {
  sales: [
    {
      score: 12,
      roast: "This pitch has less value than a LinkedIn poll about 'Hustle Culture'. It smells like desperation and a template form 2012.",
      fix: "Hi [Name],\n\nI noticed you're struggling with [Problem]. We fixed this for [Competitor] and increased their revenue by 20%.\n\nWorth a chat?",
      cringe_words: ["synergy", "revolutionary", "disrupt", "leverage"],
      gif_keyword: "bored"
    },
    {
      score: 5,
      roast: "If 'Just checking in' was a person, it would be this email. Stop begging and start selling value, you corporate npc.",
      fix: "Subject: Quick question about [Goal]\n\n[Name], are you still looking to improve [Metric]? If not, tell me to get lost.",
      cringe_words: ["just checking in", "thoughts?", "touch base"],
      gif_keyword: "facepalm"
    }
  ],
  desi: [
    {
      score: 0,
      roast: "Bhai, this pitch is weaker than RCB's bowling lineup. Even a scammer from Jamtara writes better scripts than this.",
      fix: "Namaste [Name],\n\nSeedhi baat, no bakwaas. I can save you money. Call me if you want to win, otherwise keep losing like a loser.",
      cringe_words: ["kindly", "needful", "revert", "same"],
      gif_keyword: "laughing indian"
    },
    {
      score: 10,
      roast: "Beta, tumse na ho payega. You wrote a novel, not an email. My father would beat me with a chappal if I sent this.",
      fix: "Hi [Name],\n\nHere is the deal: [Value].\n\nYes or No?",
      cringe_words: ["respected sir", "humble request", "dear"],
      gif_keyword: "disappointed"
    }
  ],
  tech: [
    {
      score: 40,
      roast: "You used so many buzzwords I think an LLM hallucinated this. 'AI-driven blockchain synergy'? Go touch grass.",
      fix: "Hey,\n\nWe built a thing that actually works. It solves [Problem].\n\nWant to see the code?",
      cringe_words: ["AI-driven", "blockchain", "web3", "algorithm"],
      gif_keyword: "coding"
    }
  ],
  tv: [
    {
      score: 2,
      roast: "This pitch is more disappointing than the Game of Thrones finale. It lacks character, plot, and a reason to exist.",
      fix: "Listen,\n\nI'm the one who knocks. And I'm knocking to tell you your operations are a mess. Let me fix them.",
      cringe_words: ["drama", "waiting", "hope"],
      gif_keyword: "walter white"
    }
  ],
  hollywood: [
    {
      score: 69,
      roast: "Look at that subtle coloring. The tasteful thickness. Oh my god, it even has a typo. This email is a crime scene.",
      fix: "I have to return some videotapes. Also, buy my product.",
      cringe_words: ["impressive", "very nice", "let's see"],
      gif_keyword: "patrick bateman"
    },
    {
      score: 1,
      roast: "I'm not gonna kill you, I'm just gonna hurt you... really, really bad for writing this garbage.",
      fix: "Why so serious? Just buy the thing.",
      cringe_words: ["society", "joke", "clown"],
      gif_keyword: "joker"
    }
  ],
  anime: [
    {
      score: -9000,
      roast: "NANI?! This pitch implies your power level is 5. It is weak. It is pathetic. You lack hatred!",
      fix: "Notice me, Senpai.\n\nI have the ultimate technique to solve your [Problem].",
      cringe_words: ["power", "strength", "believe"],
      gif_keyword: "vegeta"
    },
    {
      score: 0,
      roast: "You are already rejected. Omae wa mou shindeiru. This email has no chakra flow.",
      fix: "Dattebayo! I will become the Hokage of Sales!",
      cringe_words: ["honor", "believe it", "ninja"],
      gif_keyword: "naruto"
    }
  ],
  medieval: [
    {
      score: 3,
      roast: "Keep your forked tongue behind your teeth! This missive is dark and full of terrors (and grammar errors).",
      fix: "My Lord,\n\nWinter is coming. Prepare your Q4 with our solution.",
      cringe_words: ["thou", "hath", "verily"],
      gif_keyword: "gandalf"
    }
  ],
  cringe: [
    {
      score: 0,
      roast: "Skibidi toilet rizz? No based sigma would read this. It's giving NPC energy. L + Ratio + FLOP.",
      fix: "Yo,\n\nNo cap, this solves your issue. Fr fr.\n\nBet?",
      cringe_words: ["slay", "queen", "period", "ick"],
      gif_keyword: "cringe"
    }
  ],
  sigma: [
    {
      score: 100,
      roast: "You are not a wolf. You are a sheep. A beta male would send this email. A Sigma would simply acquire the company.",
      fix: "I don't ask for meetings. I grant audiences.\n\nBe ready at 3 AM.",
      cringe_words: ["please", "kindly", "hope", "sorry"],
      gif_keyword: "patrick bateman"
    }
  ],
  default: [
    {
      score: 15,
      roast: "I've seen spam folders with higher standards. This is the email equivalent of soggy bread.",
      fix: "Hi,\n\nI can help you with [Problem].\n\nLet's talk.",
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
