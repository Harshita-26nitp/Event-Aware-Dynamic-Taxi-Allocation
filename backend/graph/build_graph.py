import networkx as nx
import torch
from torch_geometric.data import Data
import numpy as np

def build_graph(features):
    G = nx.watts_strogatz_graph(25, 4, 0.3)

    edge_index = torch.tensor(list(G.edges)).t().contiguous()

    x = torch.tensor(features, dtype=torch.float)

    return Data(x=x, edge_index=edge_index)