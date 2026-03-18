"use client";

import { useState } from "react";

interface FreeformInputProps {
  onSubmit: (prompt: string) => void;
}

const SUGGESTIONS = [
  "Caesar's assassination",
  "Battle of Sekigahara",
  "Perry's Black Ships arrive in Japan",
  "Miyamoto Musashi's duel on Ganryu Island",
  "The eruption of Vesuvius buries Pompeii",
  "47 Ronin storm Kira's mansion",
  "Crossing the Rubicon",
  "Fall of Rome",
];

export default function FreeformInput({ onSubmit }: FreeformInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  const handleSurpriseMe = () => {
    const random = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
    setText(random);
    onSubmit(random);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe a historical moment... e.g. &quot;Caesar's assassination&quot;"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Generate
        </button>
      </form>
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={handleSurpriseMe}
          className="text-sm bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1 rounded-full transition-colors"
        >
          🎲 Surprise me
        </button>
        <span className="text-xs text-gray-500">or try:</span>
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s}
            onClick={() => {
              setText(s);
              onSubmit(s);
            }}
            className="text-xs text-gray-400 hover:text-white bg-gray-800 px-2 py-1 rounded-full transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
