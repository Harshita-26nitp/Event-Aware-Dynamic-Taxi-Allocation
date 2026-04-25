import { useEffect, useRef, useState } from "react";
import { ZONES } from "../zones";

export function useTaxiEngine(serverTaxis: any[] = []) {
  const [taxis, setTaxis] = useState<any[]>([]);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    if (!serverTaxis || serverTaxis.length === 0) return;

    const init = serverTaxis.map((t: any) => ({
      ...t,
      from: ZONES[t.fromZone ?? 0],
      to: ZONES[t.toZone ?? Math.floor(Math.random() * 25)],
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
    }));

    setTaxis(init);
  }, [serverTaxis]);

  useEffect(() => {
    const animate = () => {
      setTaxis((prev) =>
        prev.map((t) => {
          if (!t.from || !t.to) return t;

          let p = t.progress + t.speed;
          if (p >= 1) {
            return {
              ...t,
              from: t.to,
              to: ZONES[Math.floor(Math.random() * 25)],
              progress: 0,
            };
          }
          return { ...t, progress: p };
        })
      );
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return taxis;
}