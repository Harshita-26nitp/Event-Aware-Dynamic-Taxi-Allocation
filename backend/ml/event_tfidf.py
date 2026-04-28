import json
import re
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# ✅ NYC-related keywords — input must relate to NYC context
NYC_KEYWORDS = [
    "nyc", "new york", "manhattan", "brooklyn", "queens", "bronx",
    "staten island", "jfk", "laguardia", "ewr", "newark",
    "madison square", "central park", "times square", "wall street",
    "harlem", "bronx", "flushing", "astoria", "hoboken",
    "subway", "metro", "mta", "PATH train",
    # ✅ Generic event words that are NYC-context safe (no location needed)
    "concert", "game", "match", "rain", "snow", "storm", "flood",
    "traffic", "rush hour", "commute", "flight", "delay", "airport",
    "emergency", "fire", "accident", "exam", "university", "graduation",
    "parade", "festival", "marathon", "protest", "rally", "conference",
    "snowstorm", "hurricane", "nba", "nfl", "mlb", "nhl", "yankees",
    "mets", "knicks", "nets", "giants", "jets", "rangers", "islanders"
]

class EventClassifier:
    def __init__(self):
        self.df = pd.read_csv("data/event_dataset.csv")
        self.vectorizer = TfidfVectorizer()
        self.model = LogisticRegression(max_iter=1000)

        X = self.vectorizer.fit_transform(self.df["text"])
        self.model.fit(X, self.df["label"])

        self.multiplier_map = dict(zip(self.df["label"], self.df["multiplier"]))

        with open("data/event_vocab.json") as f:
            self.vocab = json.load(f)

    def is_valid_input(self, text):
        """Check if input is real english text."""
        if not text or len(text.strip()) < 5:
            return False, "Input is too short. Please describe a real event."

        words = re.findall(r'[a-zA-Z]{3,}', text)
        if len(words) < 2:
            return False, "Please enter at least 2 real words describing an event."

        # Check for gibberish — words with no vowels
        gibberish_count = 0
        for word in words:
            vowels = sum(1 for c in word.lower() if c in 'aeiou')
            if len(word) > 3 and vowels == 0:
                gibberish_count += 1

        if gibberish_count >= len(words):
            return False, "Input looks like gibberish. Please describe a real event like 'concert at madison square garden'."

        return True, None

    def is_nyc_relevant(self, text):
        """
        ✅ Check if input is relevant to NYC context.
        Rejects inputs that mention non-NYC cities explicitly.
        """
        t = text.lower()

        # ✅ List of non-NYC cities — reject these
        non_nyc_cities = [
            "patna", "mumbai", "delhi", "london", "paris", "chicago",
            "houston", "phoenix", "philadelphia", "san antonio", "san diego",
            "dallas", "austin", "bangalore", "hyderabad", "chennai", "kolkata",
            "pune", "ahmedabad", "jaipur", "lucknow", "kanpur", "nagpur",
            "los angeles", "las vegas", "miami", "boston", "seattle",
            "denver", "atlanta", "portland", "detroit", "memphis",
            "tokyo", "beijing", "shanghai", "dubai", "toronto", "sydney"
        ]

        for city in non_nyc_cities:
            if city in t:
                return False, f"This system only handles NYC events. '{city.title()}' is not in New York City."

        return True, None

    def rule_override(self, text):
        t = text.lower()
        for label, words in self.vocab.items():
            for w in words:
                if w in t:
                    return label, 0.99, self.multiplier_map[label]
        return None

    def predict(self, text):
        # Step 1 — Validate input (gibberish check)
        valid, error_msg = self.is_valid_input(text)
        if not valid:
            return {
                "eventType": "unknown",
                "confidence": 0.0,
                "multiplier": 1.0,
                "is_emergency": False,
                "error": error_msg
            }

        # ✅ Step 2 — NYC relevance check
        nyc_ok, nyc_error = self.is_nyc_relevant(text)
        if not nyc_ok:
            return {
                "eventType": "unknown",
                "confidence": 0.0,
                "multiplier": 1.0,
                "is_emergency": False,
                "error": nyc_error
            }

        # Step 3 — Rule-based override
        rule = self.rule_override(text)
        if rule:
            label, conf, mult = rule
            return {
                "eventType": label,
                "confidence": conf,
                "multiplier": mult,
                "is_emergency": label == "emergency",
                "error": None
            }

        # Step 4 — ML prediction with confidence check
        X = self.vectorizer.transform([text])
        pred = self.model.predict(X)[0]
        proba = self.model.predict_proba(X)[0]
        max_confidence = float(np.max(proba))

        if max_confidence < 0.40:
            return {
                "eventType": "unknown",
                "confidence": round(max_confidence, 2),
                "multiplier": 1.0,
                "is_emergency": False,
                "error": "Could not confidently classify this event. Please describe it more clearly."
            }

        return {
            "eventType": pred,
            "confidence": round(max_confidence, 2),
            "multiplier": self.multiplier_map.get(pred, 1.0),
            "is_emergency": pred == "emergency",
            "error": None
        }