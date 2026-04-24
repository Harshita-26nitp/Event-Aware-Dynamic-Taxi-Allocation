export default function Metrics({ data }: any) {
  if (!data) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h2 className="text-lg font-bold mb-2">Metrics</h2>

      <p>Event: {data.event.eventType}</p>
      <p>Multiplier: {data.event.multiplier}</p>
      <p>Fare: ${data.fare}</p>
    </div>
  );
}