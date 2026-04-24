export default function TopZones({ zones }: any) {
  if (!zones) return null;

  const sorted = [...zones].sort((a, b) => b.demand - a.demand).slice(0, 5);

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h2 className="text-lg font-bold mb-2">Top Zones</h2>

      {sorted.map((z: any, i: number) => (
        <p key={i}>
          Zone {z.PULocationID}: {z.demand}
        </p>
      ))}
    </div>
  );
}