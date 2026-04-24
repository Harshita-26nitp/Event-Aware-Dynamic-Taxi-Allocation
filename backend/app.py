from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ml.event_tfidf import EventClassifier
from ml.pipeline import load_data, aggregate
from ml.surge_engine import compute_fare
import random  # Added for allocations

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "http://localhost:3000",   # Alternative local port
        "https://solid-invention-x5r94jj4qg64h9xpw-5174.app.github.dev",  # Codespaces frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = EventClassifier()

# Load data lazily to avoid startup errors
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
            print(f"Error loading data: {e}")
            # Mock data if loading fails
            import pandas as pd
            df = pd.DataFrame({
                'PULocationID': [1, 2, 3, 4, 5],
                'demand': [10, 20, 15, 25, 30],
                'trip_distance': [2.0, 3.0, 1.5, 4.0, 2.5],
                'fare_amount': [10.0, 15.0, 8.0, 20.0, 12.0]
            })
    return df
@app.get("/")
def home():
    return {"message": "NYC AI Dispatch Backend Running"}

@app.post("/predict")
def predict(payload: dict):
    text = payload["text"]
    event = classifier.predict(text)
    base_fare = 10
    fare = compute_fare(base_fare, event)
    
    # Generate allocations
    data_df = get_data()
    top_zones = data_df.nlargest(5, 'demand')['PULocationID'].tolist()
    allocations = [
        {"zone_id": zone, "taxis_needed": random.randint(1, 10)}
        for zone in top_zones
    ]
    
    return {
        "event": event,
        "fare": fare,
        "zones": data_df.to_dict(),
        "allocations": allocations
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
                "status": "active"
            })
            taxi_id += 1
    
    return {"taxis": taxis}