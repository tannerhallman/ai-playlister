import { getMusicKitInstance } from "@/lib/musicKit";

import { NextResponse } from "next/server";

// Placeholder for AI API call
async function callAIAPI(prompt: string): Promise<string[]> {
  // Replace this with actual AI API call
  return [
    "Shape of You",
    "Blinding Lights",
    "Dance Monkey",
    "Rockstar",
    "Someone You Loved",
  ];
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // Call AI API
    const songTitles = await callAIAPI(prompt);

    // Search Apple Music and create playlist
    const music = getMusicKitInstance();
    if (!music) {
      throw new Error("MusicKit is not initialized");
    }

    const songs: any[] = [];

    for (const title of songTitles) {
      const result = await music.api.search(title, {
        types: ["songs"],
        limit: 1,
      });
      if (result.songs && result.songs.data.length > 0) {
        songs.push(result.songs.data[0]);
      }
    }

    // Create the playlist
    const playlist = await music.api.library.createPlaylist({
      name: `AI Playlist: ${prompt}`,
      description: `Generated from prompt: ${prompt}`,
      tracks: songs,
    });

    return NextResponse.json({
      name: playlist.attributes.name,
      songs: songs,
    });
  } catch (error) {
    console.error("Error generating playlist:", error);
    return NextResponse.json(
      { error: "Failed to generate playlist" },
      { status: 500 }
    );
  }
}
