import { SoundEffect } from "@/types/manga";

export const sfxLibrary: Record<string, SoundEffect> = {
  sword_draw: { japanese: "シャキーン", romanji: "SHAKIIN", meaning: "Sword being drawn" },
  sword_clash: { japanese: "ガキーン", romanji: "GAKIIN", meaning: "Metal clashing" },
  arrow_release: { japanese: "ヒュッ", romanji: "HYUU", meaning: "Arrow in flight" },
  impact: { japanese: "ドゴッ", romanji: "DOGOO", meaning: "Heavy impact" },
  crowd_murmur: { japanese: "ザワザワ", romanji: "ZAWAZAWA", meaning: "Crowd murmuring" },
  dramatic_silence: { japanese: "シーン", romanji: "SHIIN", meaning: "Silence" },
  footsteps: { japanese: "カツカツ", romanji: "KATSUKATSU", meaning: "Footsteps on stone" },
  explosion: { japanese: "ドカーン", romanji: "DOKAAN", meaning: "Explosion" },
  door_sliding: { japanese: "ガラッ", romanji: "GARA", meaning: "Door sliding open" },
  horse_gallop: { japanese: "パカパカ", romanji: "PAKAPAKA", meaning: "Horse hooves" },
  fire_crackling: { japanese: "パチパチ", romanji: "PACHIPACHI", meaning: "Fire crackling" },
  rain: { japanese: "ザーザー", romanji: "ZAAZAA", meaning: "Heavy rain" },
  heartbeat: { japanese: "ドクドク", romanji: "DOKUDOKU", meaning: "Heartbeat" },
  dramatic_reveal: { japanese: "バーン", romanji: "BAAN", meaning: "Dramatic reveal" },
  menacing_presence: { japanese: "ゴゴゴゴ", romanji: "GOGOGOGO", meaning: "Menacing aura" },
  thunder: { japanese: "ゴロゴロ", romanji: "GOROGORO", meaning: "Thunder rolling" },
  wind: { japanese: "ビューー", romanji: "BYUUU", meaning: "Strong wind" },
  splash: { japanese: "バシャッ", romanji: "BASHA", meaning: "Water splash" },
  crumble: { japanese: "ガラガラ", romanji: "GARAGARA", meaning: "Something crumbling" },
  cheer: { japanese: "ワーワー", romanji: "WAAWAA", meaning: "Crowd cheering" },
};

export function getSfxForContext(context: string): SoundEffect[] {
  const contextLower = context.toLowerCase();
  const results: SoundEffect[] = [];

  if (contextLower.includes("sword") || contextLower.includes("blade") || contextLower.includes("katana")) {
    results.push(sfxLibrary.sword_draw, sfxLibrary.sword_clash);
  }
  if (contextLower.includes("battle") || contextLower.includes("fight") || contextLower.includes("war")) {
    results.push(sfxLibrary.impact, sfxLibrary.sword_clash, sfxLibrary.crowd_murmur);
  }
  if (contextLower.includes("horse") || contextLower.includes("cavalry") || contextLower.includes("charge")) {
    results.push(sfxLibrary.horse_gallop);
  }
  if (contextLower.includes("fire") || contextLower.includes("burn") || contextLower.includes("flame")) {
    results.push(sfxLibrary.fire_crackling);
  }
  if (contextLower.includes("rain") || contextLower.includes("storm")) {
    results.push(sfxLibrary.rain, sfxLibrary.thunder);
  }
  if (contextLower.includes("assassin") || contextLower.includes("stab") || contextLower.includes("kill")) {
    results.push(sfxLibrary.dramatic_silence, sfxLibrary.impact);
  }
  if (contextLower.includes("reveal") || contextLower.includes("discover") || contextLower.includes("appear")) {
    results.push(sfxLibrary.dramatic_reveal);
  }
  if (contextLower.includes("crowd") || contextLower.includes("arena") || contextLower.includes("colosseum")) {
    results.push(sfxLibrary.crowd_murmur, sfxLibrary.cheer);
  }
  if (contextLower.includes("volcano") || contextLower.includes("erupt") || contextLower.includes("explod")) {
    results.push(sfxLibrary.explosion, sfxLibrary.crumble);
  }
  if (contextLower.includes("ship") || contextLower.includes("sea") || contextLower.includes("water")) {
    results.push(sfxLibrary.splash, sfxLibrary.wind);
  }
  if (contextLower.includes("menac") || contextLower.includes("threat") || contextLower.includes("ominous")) {
    results.push(sfxLibrary.menacing_presence);
  }
  if (contextLower.includes("silence") || contextLower.includes("quiet") || contextLower.includes("still")) {
    results.push(sfxLibrary.dramatic_silence);
  }
  if (contextLower.includes("footstep") || contextLower.includes("walk") || contextLower.includes("approach")) {
    results.push(sfxLibrary.footsteps);
  }

  if (results.length === 0) {
    results.push(sfxLibrary.dramatic_silence);
  }

  return results;
}
