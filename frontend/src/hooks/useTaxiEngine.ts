import { useEffect, useRef, useState } from "react";
import { ZONES } from "../zones";

const getZone = (id: number) =>
  ZONES.find((z) => z.id === (id % ZONES.length)) ?? ZONES[0];

export function useTaxiEngine(serverTaxis: any[] = []) {
  const [taxis, setTaxis] = useState<any[]>([]);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const isRunning = useRef(false); // ✅ track loop state without triggering re-renders

  // Initialize taxis from server data
  useEffect(() => {
    if (!serverTaxis || serverTaxis.length === 0) {
      setTaxis([]);
      return;
    }
    const init = serverTaxis.map((t: any) => ({
      ...t,
      from: getZone(t.fromZone ?? 0),
      to: getZone(t.toZone ?? Math.floor(Math.random() * ZONES.length)),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
    }));
    setTaxis(init);
  }, [serverTaxis]);

  // Animation loop — starts once taxis exist, cleans up on unmount
  useEffect(() => {
    if (taxis.length === 0 || isRunning.current) return; // ✅ don't double-start

    isRunning.current = true;

    const animate = () => {
      setTaxis((prev) => {
        if (prev.length === 0) {
          isRunning.current = false; // ✅ stop loop if taxis cleared
          return prev;
        }
        return prev.map((t) => {
          if (!t.from || !t.to) return t;
          const p = t.progress + t.speed;
          if (p >= 1) {
            return {
              ...t,
              from: t.to,
              to: getZone(Math.floor(Math.random() * ZONES.length)),
              progress: 0,
            };
          }
          return { ...t, progress: p };
        });
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      isRunning.current = false; // ✅ reset on cleanup
    };
  }, [taxis.length > 0]); // ✅ only cares about "has taxis or not" — boolean, not count

  return taxis;
}