import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

class EventClassifier:
    def __init__(self):
        self.df = pd.read_csv("data/event_dataset.csv")
        self.vectorizer = TfidfVectorizer()
        self.model = LogisticRegression()

        X = self.vectorizer.fit_transform(self.df["text"])
        self.model.fit(X, self.df["label"])

        self.multiplier_map = dict(zip(self.df["label"], self.df["multiplier"]))

        with open("data/event_vocab.json") as f:
            self.vocab = json.load(f)

    def rule_override(self, text):
        t = text.lower()

        for label, words in self.vocab.items():
            for w in words:
                if w in t:
                    return label, 0.99, self.multiplier_map[label]

        return None

    def predict(self, text):
        rule = self.rule_override(text)

        if rule:
            label, conf, mult = rule
            return {
                "eventType": label,
                "confidence": conf,
                "multiplier": mult,
                "is_emergency": label == "emergency"
            }

        X = self.vectorizer.transform([text])
        pred = self.model.predict(X)[0]

        return {
            "eventType": pred,
            "confidence": 0.86,
            "multiplier": self.multiplier_map[pred],
            "is_emergency": pred == "emergency"
        }