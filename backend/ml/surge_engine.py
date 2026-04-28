def compute_fare(base, event):
    caps = {
        "concert": 1.8,
        "sports": 1.7,
        "weather": 1.5,
        "travel": 1.6,
        "commute": 1.4,
        "exam": 1.35,
        "normal": 1.2,
        "emergency": 1.0,
        "unknown": 1.0,  # ✅ NEW — gibberish/invalid input gets base fare, no surge
    }

    cap = caps.get(event["eventType"], 1.2)

    # ✅ No surge for emergency or unknown/invalid events
    if event["is_emergency"] or event["eventType"] == "unknown":
        return base

    # ✅ Safety check — multiplier must be a valid number
    multiplier = event.get("multiplier", 1.0)
    if not isinstance(multiplier, (int, float)) or multiplier <= 0:
        return base

    return base * min(multiplier, cap)
