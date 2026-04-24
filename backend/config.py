import os

# ======================
# DATA PATHS
# ======================
DATA_DIR = "data"

TLC_TRIPS_PATH = os.path.join(DATA_DIR, "nyc_yellow_tripdata_2026-01.parquet")
ZONE_LOOKUP_PATH = os.path.join(DATA_DIR, "taxi_zone_lookup.csv")

EVENT_DATASET_PATH = os.path.join(DATA_DIR, "event_dataset.csv")
EVENT_VOCAB_PATH = os.path.join(DATA_DIR, "event_vocab.json")

# ======================
# GRAPH SETTINGS
# ======================
NUM_ZONES = 25
GRAPH_K_NEIGHBORS = 4
GRAPH_REWIRE_PROB = 0.3

# GNN features per node
NODE_FEATURES = 5  # demand, traffic, event, weather, user_density

# ======================
# RL (DQN) SETTINGS
# ======================
STATE_DIM = NUM_ZONES * NODE_FEATURES
ACTION_DIM = NUM_ZONES

EPSILON = 0.1
GAMMA = 0.95
LEARNING_RATE = 0.001

# ======================
# SURGE PRICING CAPS
# ======================
SURGE_CAPS = {
    "concert": 1.8,
    "sports": 1.7,
    "weather": 1.5,
    "travel": 1.6,
    "commute": 1.4,
    "exam": 1.35,
    "normal": 1.2,
    "emergency": 1.0
}

BASE_FARE = 10

# ======================
# API SETTINGS
# ======================
API_HOST = "0.0.0.0"
API_PORT = 8000

CORS_ORIGINS = ["*"]