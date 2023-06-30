from typing import List

import pandas as pd
import torch

class JointDataset:

    def __init__(self, dataset_names: List, files_paths: List, blackbox, preprocessor) -> None:
        self.datasets = {}
        self.blackbox = blackbox[0]
        self.preprocessor = preprocessor[0]
        for d, f in zip(dataset_names, files_paths):
            self.datasets[d] = pd.read_csv(f)
            self._filter_dataset()
        
    def _filter_dataset(self):

        # Filter the training dataset by picking only the examples which are classified negatively by the model
        with torch.no_grad():
            output = self.blackbox(torch.FloatTensor(self.preprocessor.transform(self.datasets["adult"]))).numpy()
        
        self.datasets["adult"]["predicted"] = output
        self.datasets["adult"] = self.datasets["adult"][self.datasets["adult"].predicted <= 0.5]
        self.datasets["adult"].drop(columns="predicted", inplace=True)



    def sample(self) -> dict:
        return {
            k: x.sample(1) for k,x in self.datasets.items()
        }