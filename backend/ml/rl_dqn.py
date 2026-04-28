import random
import torch
import torch.nn as nn
import numpy as np

class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),   # ✅ Added extra layer for better learning
            nn.ReLU(),
            nn.Linear(64, action_dim)
        )

    def forward(self, x):
        return self.net(x)


class Agent:
    def __init__(self, model):
        self.model = model
        self.epsilon = 0.1
        self.gamma = 0.95

    def act(self, state):
        # ✅ Safety check — empty state
        if not state or len(state) == 0:
            return 0

        # ✅ Safety check — replace any NaN or inf values
        state = [float(s) if not (np.isnan(s) or np.isinf(s)) else 0.0 for s in state]

        # Explore randomly
        if random.random() < self.epsilon:
            return random.randint(0, len(state) - 1)

        # ✅ Use no_grad for inference — saves memory, faster
        with torch.no_grad():
            q = self.model(torch.FloatTensor(state))
            return torch.argmax(q).item()
