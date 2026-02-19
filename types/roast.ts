export type PersonaKey =
  | "wolf"
  | "chef"
  | "genz"
  | "ashneer"
  | "elon"
  | "michael"
  | "karen"
  | "shark"
  | "munna"
  | "kaleen"
  | "raju"
  | "babu"
  | "vasooli"
  | "acp"
  | "sunny"
  | "arnab"
  | "tharoor"
  | "champak"
  | "nawaz"
  | "virat"
  | "shastri"
  | "house"
  | "deadpool"
  | "jesse"
  | "bateman"
  | "tyler"
  | "joker"
  | "eminem"
  | "tate"
  | "chandler"
  | "future_self"
  | "vegeta"
  | "light"
  | "naruto"
  | "gandalf"
  | "geralt";

export type PersonaCategory = "sales" | "tv" | "tech" | "cringe" | "desi" | "anime" | "medieval" | "hollywood" | "sigma";

export type RoastMode = "email" | "linkedin" | "resume";

export interface RoastResultData {
  score: number;
  roast: string;
  fix: string;
  cringe_words: string[];
  gif_keyword: string;
}
