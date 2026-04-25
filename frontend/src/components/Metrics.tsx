export default function Metrics({ data }: any) {
  if (!data) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h2 className="text-lg font-bold mb-2">Metrics</h2>
      <p>
        Event:{" "}
        <span className="text-cyan-400">
          {data.event?.eventType ?? "—"}
        </span>
      </p>
      <p>
        Multiplier:{" "}
        <span className="text-yellow-400">
          {data.event?.multiplier ?? "—"}x
        </span>
      </p>
      <p>
        Fare:{" "}
        <span className="text-green-400">
          ${data.fare ?? "—"}
        </span>
      </p>
    </div>
  );
}