"use client";

import { eraPacks } from "@/data/era-packs";
import type { EraPack, HistoricalEvent } from "@/types/manga";

interface EraSelectorProps {
  onSelect: (eraId: string, eventId: string) => void;
  selectedEra?: string;
  selectedEvent?: string;
}

export default function EraSelector({ onSelect, selectedEra, selectedEvent }: EraSelectorProps) {
  return (
    <div className="space-y-6">
      {eraPacks.map((era) => (
        <div key={era.id}>
          <h3 className="text-lg font-bold mb-2">
            {era.icon} {era.name}{" "}
            <span className="text-sm font-normal text-gray-400">
              {era.nameJp} · {era.period}
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {era.events.map((event) => {
              const isSelected = selectedEra === era.id && selectedEvent === event.id;
              return (
                <button
                  key={event.id}
                  onClick={() => onSelect(era.id, event.id)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800"
                  }`}
                >
                  <div className="font-semibold text-sm">{event.name}</div>
                  <div className="text-xs text-gray-400">
                    {event.year} · {event.characters.slice(0, 2).join(", ")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
