from typing import List

import pandas as pd

class JointDataset:

    def __init__(self, dataset_names: List, files_paths: List) -> None:
        self.datasets = {}
        for d, f in zip(dataset_names, files_paths):
            self.datasets[d] = pd.read_csv(f)
    
    def sample(self) -> dict:
        return {
            k: x.sample(1) for k,x in self.datasets.items()
        }