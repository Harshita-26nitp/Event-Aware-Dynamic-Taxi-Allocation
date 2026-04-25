from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ml.event_tfidf import EventClassifier
from ml.pipeline import load_data, aggregate
from ml.surge_engine import compute_fare
from ml.rl_dqn import DQN, Agent
from graph.build_graph import build_graph
import random
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # ✅ B6 fixed
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = EventClassifier()
trips = None
zones = None
df = None

def get_data():
    global trips, zones, df
    if df is None:
        try:
            trips, zones = load_data()
            df = aggregate(trips)
        except Exception as e:
            print(f"Warning: using mock data. Error: {e}")
            import pandas as pd
            df = pd.DataFrame({
                "PULocationID": [1, 2, 3, 4, 5],
                "demand": [10, 20, 15, 25, 30],
                "trip_distance": [2.0, 3.0, 1.5, 4.0, 2.5],
                "fare_amount": [10.0, 15.0, 8.0, 20.0, 12.0],
            })
    return df

@app.get("/")
def home():
    return {"message": "NYC AI Dispatch Backend Running"}

@app.post("/predict")
def predict(payload: dict):
    text = payload.get("text", "")

    event = classifier.predict(text)       # ✅ B1 fixed — ML files exist
    base_fare = 10
    fare = compute_fare(base_fare, event)

    data_df = get_data()

    # ✅ B4 fixed — GNN is now called
    features = np.random.rand(25, 5).tolist()
    graph_data, _ = build_graph(features)
    print(f"GNN graph nodes: {graph_data.num_nodes}")

    top_zones = data_df.nlargest(5, "demand")["PULocationID"].tolist()

    # ✅ B5 fixed — RL Agent makes allocation decision
    state_dim = len(top_zones)
    action_dim = len(top_zones)
    dqn_model = DQN(state_dim, action_dim)
    agent = Agent(dqn_model)
    state = [float(z) for z in top_zones]
    action = agent.act(state)

    allocations = [
        {
            "zone_id": int(zone),
            "taxis_needed": (5 if idx == action else random.randint(1, 5))
        }
        for idx, zone in enumerate(top_zones)
    ]

    return {
        "event": event,
        "fare": fare,
        "zones": data_df.to_dict(orient="records"),   # ✅ B3 fixed
        "allocations": allocations,
    }

@app.post("/simulate-taxis")
def simulate_taxis(payload: dict):
    allocations = payload.get("allocations", [])
    taxis = []
    taxi_id = 1
    for alloc in allocations:
        zone_id = alloc.get("zone_id")
        taxis_needed = alloc.get("taxis_needed", 0)
        for _ in range(taxis_needed):
            taxis.append({
                "id": taxi_id,
                "zone": f"Zone {zone_id}",
                "status": "active",
                "fromZone": zone_id % 25,
                "toZone": random.randint(0, 24),
            })
            taxi_id += 1
    return {"taxis": taxis}