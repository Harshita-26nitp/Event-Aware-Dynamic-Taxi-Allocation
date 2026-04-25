import { useTaxiEngine } from "../hooks/useTaxiEngine";
import { ZONES } from "../zones";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function MapView({ taxisData, allocations }: { taxisData: any[]; allocations?: any[] }) {
  const taxis = useTaxiEngine(taxisData || []);

  const allocMap: Record<number, number> = {};
  (allocations || []).forEach((a: any) => { allocMap[a.zone_id] = a.taxis_needed; });
  const maxTaxis = Math.max(...Object.values(allocMap), 1);

  const getZoneColor = (zoneId: number) => {
    const t = allocMap[zoneId];
    if (!t) return { fill: "#0a1628", stroke: "#0ff3", r: 18 };
    const intensity = t / maxTaxis;
    if (intensity > 0.7) return { fill: "#a855f733", stroke: "#a855f7", r: 22 };
    if (intensity > 0.4) return { fill: "#3b82f633", stroke: "#3b82f6", r: 20 };
    return { fill: "#00fff722", stroke: "#00fff7", r: 18 };
  };

  return (
    <div style={{ background: "#070d1a", border: "1px solid #0ff2", borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#00fff7", letterSpacing: 2, fontWeight: 700 }}>NYC ZONE MAP — GNN GRAPH</div>
        <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#0ff8" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", display: "inline-block" }} /> High demand
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} /> Medium
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00fff7", display: "inline-block" }} /> Active
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} /> Taxi
          </span>
        </div>
      </div>

      <svg width="100%" viewBox="0 0 760 520" style={{ display: "block" }}>
        {/* Grid lines */}
        {[1, 2, 3, 4].map(i => (
          <line key={`h${i}`} x1={60} y1={60 + i * 90} x2={700} y2={60 + i * 90} stroke="#0ff1" strokeWidth={0.5} strokeDasharray="4 4" />
        ))}
        {[1, 2, 3, 4].map(i => (
          <line key={`v${i}`} x1={60 + i * 130} y1={60} x2={60 + i * 130} y2={500} stroke="#0ff1" strokeWidth={0.5} strokeDasharray="4 4" />
        ))}

        {/* GNN Edges */}
        {ZONES.map((z, i) =>
          ZONES.slice(i + 1, i + 3).map((z2, j) => (
            <line key={`e${i}-${j}`} x1={z.x} y1={z.y} x2={z2.x} y2={z2.y} stroke="#0ff1" strokeWidth={0.5} />
          ))
        )}

        {/* Zones */}
        {ZONES.map((z) => {
          const { fill, stroke, r } = getZoneColor(z.id);
          return (
            <g key={z.id}>
              <circle cx={z.x} cy={z.y} r={r + 4} fill={stroke} opacity={0.08} />
              <circle cx={z.x} cy={z.y} r={r} fill={fill} stroke={stroke} strokeWidth={1} />
              <text x={z.x} y={z.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={stroke} fontFamily="monospace">{z.id}</text>
              {allocMap[z.id] && (
                <text x={z.x} y={z.y + r + 10} textAnchor="middle" fontSize={8} fill="#a855f7" fontFamily="monospace">{allocMap[z.id]}t</text>
              )}
            </g>
          );
        })}

        {/* Taxis */}
        {taxis.map((t, i) => {
          if (!t.from || !t.to) return null;
          const x = lerp(t.from.x, t.to.x, t.progress);
          const y = lerp(t.from.y, t.to.y, t.progress);
          return (
            <g key={i}>
              <line x1={t.from.x} y1={t.from.y} x2={x} y2={y} stroke="#fbbf2444" strokeWidth={1} />
              <circle cx={x} cy={y} r={4} fill="#fbbf24" />
              <circle cx={x} cy={y} r={7} fill="none" stroke="#fbbf2444" strokeWidth={1} />
            </g>
          );
        })}

        {/* Taxi count badge */}
        {taxis.length > 0 && (
          <g>
            <rect x={10} y={490} width={120} height={20} rx={4} fill="#0a1628" stroke="#fbbf2444" />
            <text x={70} y={504} textAnchor="middle" fontSize={10} fill="#fbbf24" fontFamily="monospace">{taxis.length} TAXIS ACTIVE</text>
          </g>
        )}
      </svg>
    </div>
  );
}
