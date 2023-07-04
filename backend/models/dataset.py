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
            self._filter_dataset(d)
        
    def _filter_dataset(self, dataset_name):

        # Filter the training dataset by picking only the examples which are classified negatively by the model
        with torch.no_grad():
            output = self.blackbox(torch.FloatTensor(self.preprocessor.transform(self.datasets[dataset_name]))).numpy()
        
        self.datasets[dataset_name]["predicted"] = output
        self.datasets[dataset_name] = self.datasets[dataset_name][self.datasets[dataset_name].predicted <= 0.5]
        self.datasets[dataset_name].drop(columns="predicted", inplace=True)



    def sample(self) -> dict:
        return {
            k: x.sample(1) for k,x in self.datasets.items()
        }