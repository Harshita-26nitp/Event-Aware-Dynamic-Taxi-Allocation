import { useTaxiEngine } from "../hooks/useTaxiEngine";
import { ZONES } from "../zones";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function MapView({ taxisData }: { taxisData: any[] }) {
  const taxis = useTaxiEngine(taxisData || []);

  return (
    <div className="bg-black p-4 rounded-xl overflow-hidden">
      <svg width="100%" viewBox="0 0 900 650">
        {ZONES.map((z) => (
          <circle
            key={z.id}
            cx={z.x}
            cy={z.y}
            r={18}
            fill="#22d3ee"
            opacity={0.4}
          />
        ))}

        {ZONES.map((z) => (
          <text
            key={`label-${z.id}`}
            x={z.x}
            y={z.y + 4}
            textAnchor="middle"
            fontSize={9}
            fill="#0e7490"
          >
            {z.id}
          </text>
        ))}

        {taxis.map((t, i) => {
          if (!t.from || !t.to) return null;
          const x = lerp(t.from.x, t.to.x, t.progress);
          const y = lerp(t.from.y, t.to.y, t.progress);
          return (
            <g key={i}>
              <line
                x1={t.from.x}
                y1={t.from.y}
                x2={x}
                y2={y}
                stroke="rgba(255,255,0,0.2)"
                strokeWidth={1}
              />
              <circle cx={x} cy={y} r={6} fill="yellow" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}