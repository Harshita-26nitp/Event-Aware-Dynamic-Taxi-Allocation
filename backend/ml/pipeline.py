import pandas as pd

def load_data():
    try:
        trips = pd.read_parquet("data/yellow_tripdata_2026-01.parquet")
        zones = pd.read_csv("data/taxi_zone_lookup.csv")

        # ✅ Safety check — ensure required columns exist before merging
        if "PULocationID" not in trips.columns:
            raise ValueError("trips data missing 'PULocationID' column")
        if "LocationID" not in zones.columns:
            raise ValueError("zones data missing 'LocationID' column")

        trips = trips.merge(zones, left_on="PULocationID", right_on="LocationID", how="left")

        return trips, zones

    except FileNotFoundError as e:
        raise FileNotFoundError(f"Data file not found: {e}. Make sure parquet and CSV files are in /data folder.")


def aggregate(trips):
    # ✅ Safety check — ensure required columns exist
    required = ["tpep_pickup_datetime", "PULocationID", "trip_distance", "fare_amount"]
    missing = [col for col in required if col not in trips.columns]
    if missing:
        raise ValueError(f"Missing columns in trips data: {missing}")

    trips = trips.copy()
    trips["hour"] = pd.to_datetime(trips["tpep_pickup_datetime"]).dt.hour
    trips["dow"] = pd.to_datetime(trips["tpep_pickup_datetime"]).dt.dayofweek

    grouped = trips.groupby("PULocationID").agg(
        trip_distance=("trip_distance", "mean"),
        fare_amount=("fare_amount", "mean"),
        demand=("PULocationID", "count")  # ✅ Named aggregation — avoids rename confusion
    ).reset_index()

    return grouped
