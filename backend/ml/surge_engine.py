def compute_fare(base, event):
    caps = {
        "concert": 1.8,
        "sports": 1.7,
        "weather": 1.5,
        "travel": 1.6,
        "commute": 1.4,
        "exam": 1.35,
        "normal": 1.2,
        "emergency": 1.0
    }

    cap = caps.get(event["eventType"], 1.2)

    if event["is_emergency"]:
        return base

    return base * min(event["multiplier"], cap)