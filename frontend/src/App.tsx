import { useState } from "react";
import { predict, simulateTaxis } from "./api";

import MapView from "./components/MapView";
import Metrics from "./components/Metrics";
import TopZones from "./components/TopZones";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [taxis, setTaxis] = useState<any[]>([]); // ✅ FIXED TYPE

  const run = async (text: string) => {
    console.log("Running with text:", text);
    try {
      const res = await predict(text);
      console.log("Predict response:", res);

      // ✅ safe fallback
      const taxiSim = await simulateTaxis(res.allocations || []);
      console.log("Taxi sim response:", taxiSim);

      setData(res);
      setTaxis(taxiSim || []); // ✅ always array
    } catch (error) {
      console.error("Error in run:", error);
    }
  };

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar onRun={run} />

      <div className="flex-1 p-4 space-y-4">
        <Metrics data={data} />
        <TopZones zones={data?.zones || []} />
        <MapView taxisData={taxis} />
      </div>
    </div>
  );
}