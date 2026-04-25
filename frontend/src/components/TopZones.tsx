export default function TopZones({ zones }: any) {
  if (!zones || !Array.isArray(zones) || zones.length === 0) return null;

  const sorted = [...zones]
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 5);

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h2 className="text-lg font-bold mb-2">Top Zones by Demand</h2>
      {sorted.map((z: any, i: number) => (
        <div
          key={i}
          className="flex justify-between py-1 border-b border-gray-700"
        >
          <span className="text-cyan-400">Zone {z.PULocationID}</span>
          <span className="text-yellow-400">
            {Math.round(z.demand)} trips
          </span>
        </div>
      ))}
    </div>
  );
}