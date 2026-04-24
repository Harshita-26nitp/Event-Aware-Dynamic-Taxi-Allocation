import pandas as pd

def load_data():
    trips = pd.read_parquet("data/yellow_tripdata_2026-01.parquet")  # Fixed filename
    zones = pd.read_csv("data/taxi_zone_lookup.csv")

    trips = trips.merge(zones, left_on="PULocationID", right_on="LocationID")

    return trips, zones


def aggregate(trips):
    trips["hour"] = pd.to_datetime(trips["tpep_pickup_datetime"]).dt.hour
    trips["dow"] = pd.to_datetime(trips["tpep_pickup_datetime"]).dt.dayofweek

    grouped = trips.groupby("PULocationID").agg({
        "trip_distance": "mean",
        "fare_amount": "mean",
        "PULocationID": "count"
    })

    grouped.rename(columns={"PULocationID": "demand"}, inplace=True)

    return grouped.reset_index()