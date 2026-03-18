"use client";

import { Panel, PanelLayout } from "@/types/manga";

interface MangaPanelProps {
  panel: Panel;
  layout: PanelLayout;
  scale: number;
}

function EmotionIcon({ marker }: { marker: string }) {
  const icons: Record<string, string> = {
    anger_vein: "💢",
    sweat_drop: "💧",
    sparkle: "✨",
    spiral_eyes: "💫",
    flame_aura: "🔥",
    freeze_lines: "❄️",
    blush_lines: "💮",
    lightning_bg: "⚡",
    petal_scatter: "🌸",
    ghost_escape: "💀",
  };
  return <span className="absolute top-1 right-2 text-lg z-10">{icons[marker] || ""}</span>;
}

function SpeechBubble({ dialogue }: { dialogue: Panel["dialogue"][0] }) {
  const bubbleClass = `bubble bubble-${dialogue.bubbleType}`;
  return (
    <div className={bubbleClass}>
      {dialogue.bubbleType !== "narration" && dialogue.character !== "Narrator" && (
        <span className="text-[9px] text-gray-500 block">{dialogue.character}</span>
      )}
      <span>{dialogue.text}</span>
    </div>
  );
}

export default function MangaPanel({ panel, layout, scale }: MangaPanelProps) {
  const panelClass = `panel-${panel.type}`;
  const showSpeedLines = panel.type === "action" || panel.type === "bleed";
  const showRadialLines = panel.type === "splash" || panel.type === "closeup";

  return (
    <div
      className={`manga-panel ${panelClass}`}
      style={{
        left: layout.x * scale,
        top: layout.y * scale,
        width: layout.width * scale,
        height: layout.height * scale,
        clipPath: layout.clipPath,
      }}
    >
      <div className="manga-panel-inner">
        {showSpeedLines && <div className="speed-lines" />}
        {showRadialLines && <div className="radial-lines" />}

        {panel.emotionMarkers.map((marker, i) => (
          <EmotionIcon key={i} marker={marker} />
        ))}

        {/* Panel description as scene */}
        <div className="text-center text-xs text-gray-600 italic px-2 mb-1 z-2 relative">
          {panel.description}
        </div>

        {/* Character names */}
        {panel.characters.length > 0 && (
          <div className="text-center text-[10px] text-gray-400 mb-1">
            {panel.characters.join(" · ")}
          </div>
        )}

        {/* Dialogue */}
        <div className="flex flex-col items-center gap-1 z-5 relative">
          {panel.dialogue.map((d, i) => (
            <SpeechBubble key={i} dialogue={d} />
          ))}
        </div>

        {/* SFX */}
        {panel.sfx.length > 0 && (
          <div className="sfx-text bottom-2 right-2">
            {panel.sfx[0].japanese}
          </div>
        )}
      </div>
    </div>
  );
}
