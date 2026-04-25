import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const predict = async (text: string) => {
  console.log("Calling predict with:", text);
  const res = await axios.post(`${BASE}/predict`, { text });
  console.log("Predict API response:", res.data);
  return res.data;
};

export const simulateTaxis = async (allocations: any[]) => {
  console.log("Calling simulateTaxis with:", allocations);
  const res = await axios.post(`${BASE}/simulate-taxis`, { allocations });
  console.log("SimulateTaxis API response:", res.data);
  return res.data.taxis;
};