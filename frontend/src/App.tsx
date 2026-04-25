import { useState } from "react";
import { predict, simulateTaxis } from "./api";

import MapView from "./components/MapView";
import Metrics from "./components/Metrics";
import TopZones from "./components/TopZones";
import Sidebar from "./components/Sidebar";

/* ---------------- TYPES ---------------- */

type Allocation = {
  zone?: string;
  taxis?: number;
  demand?: number;
  lat?: number;
  lng?: number;
};

type Zone = {
  name: string;
  value?: number;
};

type PredictionData = {
  allocations?: Allocation[];
  zones?: Zone[];
};

type Taxi = {
  id?: string | number;
  lat: number;
  lng: number;
  status?: string;
};

/* ---------------- COMPONENT ---------------- */

export default function App() {
  const [data, setData] = useState<PredictionData | null>(null);
  const [taxis, setTaxis] = useState<Taxi[]>([]);

  const run = async (text: string) => {
    console.log("🚀 Event Input:", text);

    if (!text || text.trim() === "") {
      console.log("⚠️ Empty input ignored");
      return;
    }

    try {
      // 1️⃣ Call prediction API
      const res = await predict(text);
      console.log("📦 Predict response:", res);

      // 2️⃣ Get allocations safely
      const allocations = res?.allocations || [];

      // 3️⃣ Simulate taxis
      const taxiSim = await simulateTaxis(allocations);
      console.log("🚕 Taxi response:", taxiSim);

      // 4️⃣ Update UI
      setData(res || null);
      setTaxis(Array.isArray(taxiSim) ? taxiSim : []);
    } catch (error) {
      console.error("❌ Error in run:", error);
    }
  };

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">

      {/* Sidebar */}
      <Sidebar onRun={run} />

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">

        <h1 className="text-2xl font-bold text-blue-400">
          🚕 Event Aware Dynamic Taxi Allocation
        </h1>

        {/* Metrics */}
        <Metrics data={data} />

        {/* Top Zones */}
        tsx<TopZones zones={Array.isArray(data?.zones) ? data.zones : []} />

        {/* Map */}
        <div className="bg-gray-900 p-2 rounded-lg">
          <MapView taxisData={taxis} />
        </div>

      </div>
    </div>
  );
}