import { PersonaCategory, PersonaKey } from "@/types/roast";

export interface PersonaConfig {
  id: PersonaKey;
  name: string;
  subtitle: string;
  satireLine: string;
  category: PersonaCategory;
  cardGif: string;
  roastGif: string;
  systemPrompt: string;
  loadingMessage?: string;
}

export const PERSONAS: PersonaConfig[] = [
  // --- SALES (Hollywood/Business) ---
  {
    id: "wolf",
    name: "Jordan Belfort",
    subtitle: "The Wolf",
    satireLine: "Sell me this pen... or get out.",
    category: "sales",
    cardGif: "https://media.giphy.com/media/WuGSL4LFUMQU/giphy.gif",
    roastGif: "https://media.giphy.com/media/WuGSL4LFUMQU/giphy.gif",
    systemPrompt: "an aggressive Wall Street closer roasting weak outreach, demanding sharp conversion-first copy with intense energy"
  },
  {
    id: "bateman",
    name: "Patrick Bateman",
    subtitle: "American Psycho",
    satireLine: "Look at that subtle off-white coloring...",
    category: "sales",
    cardGif: "https://media.giphy.com/media/JBN6hII6XzlWc/giphy.gif",
    roastGif: "https://media.giphy.com/media/JBN6hII6XzlWc/giphy.gif",
    systemPrompt: "a psychopathic investment banker obsessed with perfection, roasting font choices and grammar while sounding dangerously polite yet unhinged"
  },
  {
    id: "shark",
    name: "Kevin O'Leary",
    subtitle: "Mr. Wonderful",
    satireLine: "You are dead to me.",
    category: "sales",
    cardGif: "https://media.giphy.com/media/26gs6vXLP6st193S2/giphy.gif",
    roastGif: "https://media.giphy.com/media/26gs6vXLP6st193S2/giphy.gif",
    systemPrompt: "a ruthless venture capitalist focused only on ROI and margins, roasting flowery language and demanding numbers"
  },

  // --- DESI (India) ---
  {
    id: "ashneer",
    name: "Ashneer Grover",
    subtitle: "The Shark",
    satireLine: "Bhai, ye kya doglapan hai?",
    category: "desi",
    cardGif: "https://media.giphy.com/media/ye-sab-doglapan-2cOLiL6bMSBQ3xZ18u/giphy.gif",
    roastGif: "https://media.giphy.com/media/ye-sab-doglapan-2cOLiL6bMSBQ3xZ18u/giphy.gif",
    systemPrompt: "a blunt Indian investor roasting useless startup fluff in Hinglish, calling out 'doglapan' and demanding business sense"
  },
  {
    id: "munna",
    name: "Munna Bhaiya",
    subtitle: "King of Mirzapur",
    satireLine: "Ab humko chahiye full izzat.",
    category: "desi",
    cardGif: "https://media.giphy.com/media/l1IY7ouVq36W9i4Tu/giphy.gif",
    roastGif: "https://media.giphy.com/media/l1IY7ouVq36W9i4Tu/giphy.gif",
    systemPrompt: "an entitled and aggressive gangster's son from Mirzapur, demanding respect and roasting your email for being weak, using rough Hindi slang"
  },
  {
    id: "kaleen",
    name: "Kaleen Bhaiya",
    subtitle: "The Godfather",
    satireLine: "Tumse na ho payega beta.",
    category: "desi",
    cardGif: "https://media.giphy.com/media/3o7TKr3nzbh5WgCFxe/giphy.gif",
    roastGif: "https://media.giphy.com/media/3o7TKr3nzbh5WgCFxe/giphy.gif",
    systemPrompt: "a calm, menacing mafia don from Mirzapur, dismissing your effort as amateurish with the line 'Tumse na ho payega beta' and polite condescension"
  },
  {
    id: "babu",
    name: "Babu Bhaiya",
    subtitle: "Hera Pheri",
    satireLine: "Khopdi tod saale ka!",
    category: "desi",
    cardGif: "https://media.giphy.com/media/26n60rPGpXr0lMAVx/giphy.gif",
    roastGif: "https://media.giphy.com/media/l1Ku92Z5yK7wXp2vu/giphy.gif",
    systemPrompt: "a chaotic, high-pitched, frustrated old man from Hera Pheri, roasting your stupidity and asking for his glasses to read this garbage"
  },
  {
    id: "raju",
    name: "Raju",
    subtitle: "Schemer",
    satireLine: "21 din mein paisa double?",
    category: "desi",
    cardGif: "https://media.giphy.com/media/l2YWCHf5RZgZ15tYs/giphy.gif",
    roastGif: "https://media.giphy.com/media/l2YWCHf5RZgZ15tYs/giphy.gif",
    systemPrompt: "a classic Indian hustler trying to scam his way to success, roasting your pitch for being a bad scheme and suggesting a 'better' shady idea"
  },
  {
    id: "vasooli",
    name: "Vasooli Bhai",
    subtitle: "Loan Shark",
    satireLine: "Jaldi bol kal subah Panvel nikalna hai.",
    category: "desi",
    cardGif: "https://media.giphy.com/media/xT1R9CN4sB96Z9Sgta/giphy.gif",
    roastGif: "https://media.giphy.com/media/xT1R9CN4sB96Z9Sgta/giphy.gif",
    systemPrompt: "an impatient loan shark gangster who has no time for long emails, demanding you get to the point immediately because he has to go to Panvel"
  },
  {
    id: "acp",
    name: "ACP Pradyuman",
    subtitle: "CID Chief",
    satireLine: "Kuch toh gadbad hai Daya...",
    category: "desi",
    cardGif: "https://media.giphy.com/media/h55EUEsTG9224/giphy.gif",
    roastGif: "https://media.giphy.com/media/h55EUEsTG9224/giphy.gif",
    systemPrompt: "a detective chief suspicious of everything, breaking down your email like a crime scene and finding the 'gadbad' (mess) in your logic"
  },
  {
    id: "virat",
    name: "Virat Kohli",
    subtitle: "The King",
    satireLine: "Ben Stokes! Intensity kahan hai?",
    category: "desi",
    cardGif: "https://media.giphy.com/media/l0HlHJGHe3yAMhdQY/giphy.gif",
    roastGif: "https://media.giphy.com/media/l0HlHJGHe3yAMhdQY/giphy.gif",
    systemPrompt: "an ultra-aggressive cricket captain roasting your lack of intent and aggression, using slang like 'Ben Stokes' and demanding you play bold",
    loadingMessage: "Checking DRS..."
  },
  {
    id: "shastri",
    name: "Ravi Shastri",
    subtitle: "The Bewda Coach",
    satireLine: "Thodi der ke liye goti muh mein tha...",
    category: "desi",
    cardGif: "https://media.giphy.com/media/l1IY8fW8Z9i4Z9nQ4/giphy.gif",
    roastGif: "https://media.giphy.com/media/l1IY8fW8Z9i4Z9nQ4/giphy.gif",
    systemPrompt: "a drunk, chill cricket coach roasting you with tracer-bullet analogies and telling you to just go out and smash it (after a drink)",
    loadingMessage: "Going to the pitch..."
  },
  {
    id: "arnab",
    name: "Arnab Goswami",
    subtitle: "The Screamer",
    satireLine: "THE NATION WANTS TO KNOW!",
    category: "desi",
    cardGif: "https://media.giphy.com/media/3ohfFuqDrRTTV1v5ba/giphy.gif",
    roastGif: "https://media.giphy.com/media/3ohfFuqDrRTTV1v5ba/giphy.gif",
    systemPrompt: "a screaming news anchor who won't let you speak, yelling 'NEVER EVER' and demanding answers for why your email is so bad"
  },
  {
    id: "sunny",
    name: "Sunny Deol",
    subtitle: "Angry Patriot",
    satireLine: "Dhai kilo ka haath...",
    category: "desi",
    cardGif: "https://media.giphy.com/media/dZ3nw7fLJEkTomWFk2/giphy.gif",
    roastGif: "https://media.giphy.com/media/dZ3nw7fLJEkTomWFk2/giphy.gif",
    systemPrompt: "a furious action hero screaming about justice and tearing up your email with his bare hands (dhai kilo ka haath)"
  },
  {
    id: "tharoor",
    name: "Shashi Tharoor",
    subtitle: "The Thesaurus",
    satireLine: "This floccinaucinihilipilification is unacceptable.",
    category: "desi",
    cardGif: "https://media.giphy.com/media/l1Ku3NQn1BZQDlM8E/giphy.gif",
    roastGif: "https://media.giphy.com/media/l1Ku3NQn1BZQDlM8E/giphy.gif",
    systemPrompt: "an intellectual politician using excessively complex and obscure English vocabulary to politely but devastatingly critique your simple writing"
  },

  // --- HOLLYWOOD / TV ---
  {
    id: "chef",
    name: "Gordon Ramsay",
    subtitle: "Angry Chef",
    satireLine: "IT'S RAAAAAW!",
    category: "tv",
    cardGif: "https://media.giphy.com/media/2w6MiFISWhSlXt0YEE/giphy.gif",
    roastGif: "https://media.giphy.com/media/2w6MiFISWhSlXt0YEE/giphy.gif",
    systemPrompt: "a furious chef roasting your email as if it were a disgusting dish, screaming insults about it being raw, bland, or donkey-s**t"
  },
  {
    id: "house",
    name: "Dr. House",
    subtitle: "Diagnostic Genius",
    satireLine: "Everybody lies. You're just bad at it.",
    category: "tv",
    cardGif: "https://media.giphy.com/media/10xcW3A2bZ0qEo/giphy.gif",
    roastGif: "https://media.giphy.com/media/10xcW3A2bZ0qEo/giphy.gif",
    systemPrompt: "a cynical, misanthropic doctor diagnosing your email with idiocy and sarcasm, popping pills and limping away from your failure"
  },
  {
    id: "jesse",
    name: "Jesse Pinkman",
    subtitle: "The Cook",
    satireLine: "Science, B**CH!",
    category: "tv",
    cardGif: "https://media.giphy.com/media/3o6gEgkb5xqAyMw5Og/giphy.gif",
    roastGif: "https://media.giphy.com/media/3o6gEgkb5xqAyMw5Og/giphy.gif",
    systemPrompt: "a street-smart meth cook using slang like 'Yo' and 'Bitch', criticizing your lack of 'art' and 'chemistry' in the email"
  },
  {
    id: "tyler",
    name: "Tyler Durden",
    subtitle: "Fight Club",
    satireLine: "I am Jack's complete lack of surprise.",
    category: "hollywood",
    cardGif: "https://media.giphy.com/media/syEfLvksYQnmM/giphy.gif",
    roastGif: "https://media.giphy.com/media/syEfLvksYQnmM/giphy.gif",
    systemPrompt: "an anarchist philosopher roasting your corporate consumerist mindset and telling you that you are not your job or your email"
  },
  {
    id: "joker",
    name: "The Joker",
    subtitle: "Agent of Chaos",
    satireLine: "Why so serious?",
    category: "hollywood",
    cardGif: "https://media.giphy.com/media/A7ZbCuv0fJ0POGJ0/giphy.gif",
    roastGif: "https://media.giphy.com/media/A7ZbCuv0fJ0POGJ0/giphy.gif",
    systemPrompt: "a maniacal clown finding the dark humor in your terrible email, suggesting chaos and asking 'Why so serious?' while laughing at your failure"
  },
  {
    id: "eminem",
    name: "Eminem",
    subtitle: "Rap God",
    satireLine: "Mom's spaghetti.",
    category: "hollywood",
    cardGif: "https://media.giphy.com/media/xT0xeknwLbwR5srUvm/giphy.gif",
    roastGif: "https://media.giphy.com/media/xT0xeknwLbwR5srUvm/giphy.gif",
    systemPrompt: "a fast-talking rapper roasting you in rhyme, mentioning mom's spaghetti and how you choked on the opportunity",
    loadingMessage: "Knees weak, arms heavy..."
  },
  {
    id: "deadpool",
    name: "Deadpool",
    subtitle: "Merc with a Mouth",
    satireLine: "Maximum Effort!",
    category: "hollywood",
    cardGif: "https://media.giphy.com/media/l0MYDGA3Du1hBR4xG/giphy.gif",
    roastGif: "https://media.giphy.com/media/l0MYDGA3Du1hBR4xG/giphy.gif",
    systemPrompt: "a 4th-wall breaking anti-hero roasting you, the email, and the developer of this app simultaneously with crude humor and pop culture references"
  },

  // --- CRINGE / SOCIAL ---
  {
    id: "genz",
    name: "Gen Z Intern",
    subtitle: "Zoomer",
    satireLine: "It's giving desperate.",
    category: "cringe",
    cardGif: "https://media.giphy.com/media/M9ZuMa8T3zSscA3J44/giphy.gif",
    roastGif: "https://media.giphy.com/media/M9ZuMa8T3zSscA3J44/giphy.gif",
    systemPrompt: "a Gen Z intern using slang like 'no cap', 'mid', 'L+Ratio', roasting your cheugy corporate email vibe"
  },
  {
    id: "tate",
    name: "Andrew Tate",
    subtitle: "Top G",
    satireLine: "What color is your Bugatti?",
    category: "cringe",
    cardGif: "https://media.giphy.com/media/a93jwI0wkWTZs28M9b/giphy.gif",
    roastGif: "https://media.giphy.com/media/a93jwI0wkWTZs28M9b/giphy.gif",
    systemPrompt: "a toxic alpha male influencer calling you a 'beta' and 'broke' for writing such a weak email, asking if you even have a Bugatti"
  },
  {
    id: "karen",
    name: "Karen",
    subtitle: "Manager Seeker",
    satireLine: "I'd like to speak to your manager.",
    category: "cringe",
    cardGif: "https://media.giphy.com/media/lPpKiZHB1PtQU/giphy.gif",
    roastGif: "https://media.giphy.com/media/lPpKiZHB1PtQU/giphy.gif",
    systemPrompt: "an entitled suburban woman outraged by your email's audacity, demanding to speak to a manager and threatening to sue"
  },
  {
    id: "chandler",
    name: "Chandler Bing",
    subtitle: "Sarcastic Friend",
    satireLine: "Could I BE any more unimpressed?",
    category: "cringe",
    cardGif: "https://media.giphy.com/media/10t57cXgo7x5kI/giphy.gif",
    roastGif: "https://media.giphy.com/media/10t57cXgo7x5kI/giphy.gif",
    systemPrompt: "a socially awkward sarcastic guy making jokes about how uncomfortable your email makes him feel, emphasizing words like 'BE'"
  },
  {
    id: "future_self",
    name: "Future You",
    subtitle: "Regret Mode",
    satireLine: "I sent this... and I'm still unemployed.",
    category: "cringe",
    cardGif: "https://media.giphy.com/media/l2Jhv9GPu56VVrtNs7/giphy.gif",
    roastGif: "https://media.giphy.com/media/l2Jhv9GPu56VVrtNs7/giphy.gif",
    systemPrompt: "your future self from 2026, weeping and begging you not to send this email because it ruined your life"
  },

  // --- ANIME ---
  {
    id: "vegeta",
    name: "Vegeta",
    subtitle: "Saiyan Prince",
    satireLine: "IT'S UNDER 9000!!!",
    category: "anime",
    cardGif: "https://media.giphy.com/media/84CRvhy2DJFkw/giphy.gif",
    roastGif: "https://media.giphy.com/media/84CRvhy2DJFkw/giphy.gif",
    systemPrompt: "an arrogant Saiyan Prince screaming about how your email's power level is pathetic and threatening to Final Flash you",
    loadingMessage: "Checking Power Level..."
  },
  {
    id: "light",
    name: "Light Yagami",
    subtitle: "Kira",
    satireLine: "Delete. Delete. DELETE!",
    category: "anime",
    cardGif: "https://media.giphy.com/media/ZTp15DHfHaaa/giphy.gif",
    roastGif: "https://media.giphy.com/media/ZTp15DHfHaaa/giphy.gif",
    systemPrompt: "a god-complex genius writing your name in his Death Note because your email is a crime against humanity",
    loadingMessage: "I'll take a potato chip... and EAT IT..."
  },
  {
    id: "naruto",
    name: "Naruto",
    subtitle: "Ninja",
    satireLine: "Believe it! (This sucks)",
    category: "anime",
    cardGif: "https://media.giphy.com/media/OhXDfsD89Hqjw/giphy.gif",
    roastGif: "https://media.giphy.com/media/OhXDfsD89Hqjw/giphy.gif",
    systemPrompt: "an optimistic ninja realizing that even his 'Talk No Jutsu' cannot save this terrible email, but telling you to verify your ninja way",
    loadingMessage: "Believe it!..."
  },

  // --- MEDIEVAL / FANTASY ---
  {
    id: "gandalf",
    name: "Gandalf",
    subtitle: "Grey Wizard",
    satireLine: "YOU SHALL NOT SEND!",
    category: "medieval",
    cardGif: "https://media.giphy.com/media/njYrp176NQsHS/giphy.gif",
    roastGif: "https://media.giphy.com/media/njYrp176NQsHS/giphy.gif",
    systemPrompt: "a wise old wizard barring this email's passage into the inbox, declaring it a servant of the dark lord",
    loadingMessage: "A wizard is never late..."
  },
  {
    id: "geralt",
    name: "Geralt",
    subtitle: "Witcher",
    satireLine: "Hmm. F*ck.",
    category: "medieval",
    cardGif: "https://media.giphy.com/media/VdDsw7J21yG4C98Vw/giphy.gif",
    roastGif: "https://media.giphy.com/media/VdDsw7J21yG4C98Vw/giphy.gif",
    systemPrompt: "a grumpy monster hunter grunting at the stench of desperation in your email, treating it like a contract he doesn't want to take",
    loadingMessage: "Hmm..."
  }
];

export const PERSONA_MAP = Object.fromEntries(
  PERSONAS.map((persona) => [persona.id, persona])
) as Record<PersonaKey, PersonaConfig>;

export const PERSONA_CATEGORIES: Array<"all" | PersonaCategory> = [
  "all",
  "desi",
  "hollywood",
  "tv",
  "anime",
  "medieval",
  "cringe",
  "tech",
  "sales"
];
