import { useEffect, useState } from "react";
import { ZONES } from "../zones";

export function useTaxiEngine(serverTaxis: any[] = []) {
  const [taxis, setTaxis] = useState<any[]>([]);

  useEffect(() => {
    const init = serverTaxis.map((t: any) => ({
      ...t,
      from: ZONES[t.fromZone],
      to: ZONES[t.toZone],
    }));

    setTaxis(init);
  }, [serverTaxis]);

  useEffect(() => {
    const animate = () => {
      setTaxis((prev) =>
        prev.map((t) => {
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

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return taxis;
}