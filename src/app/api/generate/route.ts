import { NextRequest, NextResponse } from "next/server";
import { generateMangaScript, generateFromFreeform } from "@/lib/script-generator";
import type { ReadingDirection } from "@/types/manga";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const direction: ReadingDirection = body.readingDirection || "rtl";

  if (body.eraId && body.eventId) {
    const page = generateMangaScript({
      eraId: body.eraId,
      eventId: body.eventId,
      readingDirection: direction,
    });
    return NextResponse.json(page);
  }

  if (body.prompt) {
    const page = generateFromFreeform({
      prompt: body.prompt,
      readingDirection: direction,
    });
    return NextResponse.json(page);
  }

  return NextResponse.json({ error: "Provide eraId+eventId or prompt" }, { status: 400 });
}
