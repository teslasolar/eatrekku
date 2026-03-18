import { EraPack } from "@/types/manga";

export const edoJapan: EraPack = {
  id: "edo-japan",
  name: "Edo Japan",
  nameJp: "江戸時代",
  period: "1603–1868",
  icon: "🏯",
  characters: [
    "Tokugawa Ieyasu",
    "Miyamoto Musashi",
    "Matsuo Basho",
    "Chikamatsu Monzaemon",
    "Hokusai",
    "Commodore Perry",
  ],
  style: {
    name: "Ukiyo-e Manga",
    palette: ["#2B1B17", "#8B4513", "#DAA520", "#DC143C", "#F5F5DC", "#1C1C1C"],
    textures: ["woodblock", "washi_paper", "gold_leaf"],
    motifs: ["wave_pattern", "cloud_motif", "mon_crests", "cherry_blossom"],
    description: "Ukiyo-e influenced manga (浮世絵 meets 漫画) — flat color with woodblock texture, bold outlines, wave patterns and cloud motifs, mon (family crests) on clothing",
  },
  events: [
    {
      id: "sekigahara",
      name: "Battle of Sekigahara",
      year: "1600",
      description: "The decisive battle that established Tokugawa dominance over Japan. 160,000 warriors clashed in fog and betrayal.",
      characters: ["Tokugawa Ieyasu", "Ishida Mitsunari", "Kobayakawa Hideaki"],
      dramaticPeak: "Kobayakawa's betrayal — switching sides mid-battle, turning the tide for Tokugawa",
      suggestedTemplate: "action",
    },
    {
      id: "sakoku",
      name: "Sakoku Decree",
      year: "1635",
      description: "Japan closes its borders to the outside world. No Japanese may leave. No foreigner may enter. An island becomes a fortress.",
      characters: ["Tokugawa Iemitsu"],
      dramaticPeak: "The decree is read aloud as ships are turned away and borders seal shut",
      suggestedTemplate: "revelation",
    },
    {
      id: "47-ronin",
      name: "The 47 Ronin",
      year: "1703",
      description: "47 masterless samurai avenge their lord's forced suicide, then surrender to face execution themselves. The ultimate story of loyalty.",
      characters: ["Oishi Kuranosuke", "Lord Asano", "Lord Kira"],
      dramaticPeak: "The ronin storm Kira's mansion in a midnight snowstorm",
      suggestedTemplate: "action",
    },
    {
      id: "musashi-duel",
      name: "Musashi vs Sasaki Kojiro",
      year: "1612",
      description: "Japan's greatest swordsman arrives late to Ganryu Island, wielding a wooden sword carved from an oar. One strike. One kill.",
      characters: ["Miyamoto Musashi", "Sasaki Kojiro"],
      dramaticPeak: "The single decisive blow — Musashi's wooden oar-sword against Kojiro's legendary Drying Pole",
      suggestedTemplate: "splash",
    },
    {
      id: "black-ships",
      name: "Perry's Black Ships",
      year: "1853",
      description: "Four American warships steam into Edo Bay. 250 years of isolation end with cannon smoke on the horizon.",
      characters: ["Commodore Perry", "Tokugawa Iesada"],
      dramaticPeak: "The black iron ships appear through the morning mist, unlike anything Japan has ever seen",
      suggestedTemplate: "revelation",
    },
    {
      id: "boshin-war",
      name: "Boshin War",
      year: "1868–1869",
      description: "The final war between the Tokugawa shogunate and imperial forces. Samurai with swords against soldiers with rifles. An era ends.",
      characters: ["Emperor Meiji", "Saigo Takamori", "Tokugawa Yoshinobu"],
      dramaticPeak: "Traditional samurai charge into modern gunfire — the old world dies in smoke and steel",
      suggestedTemplate: "action",
    },
  ],
};

export const ancientRome: EraPack = {
  id: "ancient-rome",
  name: "Ancient Rome",
  nameJp: "古代ローマ",
  period: "753 BC–476 AD",
  icon: "🏛️",
  characters: [
    "Julius Caesar",
    "Augustus",
    "Nero",
    "Spartacus",
    "Cleopatra",
    "Marcus Aurelius",
    "Commodus",
  ],
  style: {
    name: "Roman Mosaic Manga",
    palette: ["#8B4513", "#F5F5DC", "#CD853F", "#B8860B", "#800020", "#2F4F4F"],
    textures: ["marble", "mosaic", "bronze_patina"],
    motifs: ["laurel_wreath", "spqr_banner", "roman_arch", "eagle_standard"],
    description: "Roman mosaic influenced manga — earthy palette (terracotta, marble, bronze), laurel wreaths and togas rendered manga-style, SPQR banners in backgrounds, Roman architectural details",
  },
  events: [
    {
      id: "romulus-remus",
      name: "Romulus and Remus",
      year: "753 BC",
      description: "Twin brothers raised by a she-wolf found Rome. Then Romulus kills Remus over a wall. Every empire begins with blood.",
      characters: ["Romulus", "Remus"],
      dramaticPeak: "Romulus strikes down Remus for jumping over his wall — fratricide at the founding of civilization",
      suggestedTemplate: "splash",
    },
    {
      id: "crossing-rubicon",
      name: "Crossing the Rubicon",
      year: "49 BC",
      description: "Caesar leads his legion across a small river. This illegal act starts a civil war and ends the Republic. 'The die is cast.'",
      characters: ["Julius Caesar"],
      dramaticPeak: "Caesar on horseback at the river's edge, speaking the words that end the Republic: 'Alea iacta est'",
      suggestedTemplate: "revelation",
    },
    {
      id: "ides-of-march",
      name: "Ides of March",
      year: "44 BC",
      description: "23 stab wounds. 60 conspirators. One dictator falls at the feet of Pompey's statue. The most famous assassination in history.",
      characters: ["Julius Caesar", "Brutus", "Cassius"],
      dramaticPeak: "Caesar sees Brutus among the assassins — 'Kai su, teknon?' — and stops resisting",
      suggestedTemplate: "action",
    },
    {
      id: "colosseum-opening",
      name: "Colosseum Opening",
      year: "80 AD",
      description: "100 days of games. 50,000 spectators. 9,000 animals killed. Emperor Titus opens the greatest arena ever built.",
      characters: ["Emperor Titus"],
      dramaticPeak: "The Colosseum gates open for the first time — the roar of 50,000 Romans shakes the earth",
      suggestedTemplate: "buildup",
    },
    {
      id: "pompeii",
      name: "Destruction of Pompeii",
      year: "79 AD",
      description: "Vesuvius erupts. A city of 20,000 is buried in ash and pumice. Preserved forever in their final moments.",
      characters: ["Pliny the Elder", "Pliny the Younger"],
      dramaticPeak: "The pyroclastic surge — a wall of superheated gas racing toward the city at 700 km/h",
      suggestedTemplate: "splash",
    },
    {
      id: "fall-of-rome",
      name: "Fall of Rome",
      year: "476 AD",
      description: "Romulus Augustulus, the last Western Roman Emperor, is deposed by Odoacer. 1,229 years of Rome end not with a bang but a whimper.",
      characters: ["Romulus Augustulus", "Odoacer"],
      dramaticPeak: "A teenage emperor hands over the imperial regalia — the Western Roman Empire ceases to exist",
      suggestedTemplate: "revelation",
    },
  ],
};

export const eraPacks: EraPack[] = [edoJapan, ancientRome];

export function getEraPack(id: string): EraPack | undefined {
  return eraPacks.find((p) => p.id === id);
}

export function getEvent(eraId: string, eventId: string) {
  const era = getEraPack(eraId);
  return era?.events.find((e) => e.id === eventId);
}
