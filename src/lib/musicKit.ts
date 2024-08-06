declare global {
  interface Window {
    MusicKit: typeof MusicKit;
  }
}

let musicKitInstance: MusicKit.MusicKitInstance | null = null;

export async function initializeMusicKit(): Promise<MusicKit.MusicKitInstance> {
  if (!musicKitInstance) {
    await loadMusicKitScript();
    const developerToken = await fetchDeveloperToken();
    musicKitInstance = await window.MusicKit.configure({
      developerToken,
      app: {
        name: "AI Playlist Generator",
        build: "1.0.0",
      },
    });
  }
  return musicKitInstance;
}

export function getMusicKitInstance(): MusicKit.MusicKitInstance | null {
  return musicKitInstance;
}

function loadMusicKitScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.MusicKit) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function fetchDeveloperToken(): Promise<string> {
  const response = await fetch("/api/developer-token");
  if (!response.ok) {
    throw new Error("Failed to fetch developer token");
  }
  const data = await response.json();
  return data.token;
}
