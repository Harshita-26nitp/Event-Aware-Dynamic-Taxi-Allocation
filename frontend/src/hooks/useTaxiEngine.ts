import { useEffect, useRef, useState, useMemo } from "react";
import { ZONES } from "../zones";

export function useTaxiEngine(serverTaxis: any[] = []) {
  const initialTaxis = useMemo(() => {
    return serverTaxis.map((t: any) => {
      const from = ZONES.find((z) => z.name === t.zone)
                ?? ZONES[Math.floor(Math.random() * ZONES.length)];
      const to   = ZONES[Math.floor(Math.random() * ZONES.length)];

      return {
        ...t,
        from,
        to,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.007,
      };
    });
  }, [serverTaxis]);

  const [taxis, setTaxis] = useState<any[]>(initialTaxis);

  useEffect(() => {
    setTaxis(initialTaxis);
  }, [initialTaxis]);

  const rafRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setTaxis((prev) =>
        prev.map((t) => {
          let p = t.progress + t.speed;

          if (p >= 1) {
            const next = ZONES[Math.floor(Math.random() * ZONES.length)];
            return { ...t, from: t.to, to: next, progress: 0 };
          }

          return { ...t, progress: p };
        })
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return taxis;
}