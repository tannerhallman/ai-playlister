"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initializeMusicKit, getMusicKitInstance } from "@/lib/musicKit";

export default function PlaylistGenerator() {
  const [prompt, setPrompt] = useState("");
  const [playlist, setPlaylist] = useState<{
    name: string;
    songs: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [musicKit, setMusicKit] = useState<MusicKit.MusicKitInstance | null>(
    null
  );

  useEffect(() => {
    initializeMusicKit().then((instance) => {
      setMusicKit(instance);
      setIsAuthorized(instance.isAuthorized);
      instance.addEventListener(
        "authorizationStatusDidChange",
        handleAuthChange
      );
    });

    return () => {
      const music = getMusicKitInstance();
      if (music) {
        music.removeEventListener(
          "authorizationStatusDidChange",
          handleAuthChange
        );
      }
    };
  }, []);

  const handleAuthChange = () => {
    const music = getMusicKitInstance();
    if (music) {
      setIsAuthorized(music.isAuthorized);
    }
  };

  const handleAuth = async () => {
    if (musicKit) {
      if (musicKit.isAuthorized) {
        await musicKit.unauthorize();
      } else {
        await musicKit.authorize();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (response.ok) {
        setPlaylist(data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error generating playlist:", error);
      alert("Failed to generate playlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleAuth} className='mb-4'>
        {isAuthorized ? "Sign Out of Apple Music" : "Sign In to Apple Music"}
      </Button>

      {isAuthorized && (
        <form onSubmit={handleSubmit} className='mb-4'>
          <div className='flex space-x-2'>
            <Input
              type='text'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Enter your prompt'
              className='flex-grow'
            />
            <Button type='submit' disabled={loading}>
              {loading ? "Generating..." : "Generate Playlist"}
            </Button>
          </div>
        </form>
      )}

      {playlist && (
        <Card>
          <CardHeader>
            <CardTitle>{playlist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='list-disc pl-5'>
              {playlist.songs.map((song, index) => (
                <li key={index}>
                  {song.attributes.name} by {song.attributes.artistName}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
