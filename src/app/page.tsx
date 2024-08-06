import PlaylistGenerator from "@/components/PlaylistGenerator";

export default function Home() {
  return (
    <main className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>AI Playlist Generator</h1>
      <PlaylistGenerator />
    </main>
  );
}
