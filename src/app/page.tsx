// Súbor: src/app/page.tsx
import SportSelector from "./components/SportSelector";
import LiveMatches from "./components/LiveMatches";

export default async function HomePage(props: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const { sport } = await props.searchParams;
  const selectedSport = sport || "football";

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Live Matches</h1>

      <SportSelector />

      {/*Sem príde LIVE AUTO REFRESH komponent */}
      <LiveMatches sport={selectedSport} />
    </main>
  );
}
