from typing import List

import pandas as pd
import numpy as np
import torch

class JointDataset:

    def __init__(self, dataset_names: List, files_paths: List, blackboxes, preprocessors, recourse_methods, max_elements=300) -> None:
        self.datasets = {}
        self.blackboxes = blackboxes
        self.preprocessors = preprocessors

        for d, f, b, p in zip(dataset_names, files_paths, blackboxes, preprocessors):
            self.datasets[d] = pd.read_csv(f)
            self._filter_dataset(d,b,p, max_elements=max_elements)
            self._filter_only_succesfull(d, b, p, recourse_methods.get(d))
    
    def _filter_only_succesfull(self, dataset_name, classifier, preprocessor, recourse_method):
        """Filter examples and pick only users for which we have a recourse solution."""

        dummu_user_weights = pd.DataFrame.from_records([{k:1 for k in self.datasets[dataset_name].columns} for _ in range(len(self.datasets[dataset_name]))])
        found_instances = recourse_method.predict(self.datasets[dataset_name],
                                                  dummu_user_weights,
                                                  verbose=True)

        # Predict again the counterfactual instances
        with torch.no_grad():
            output = classifier(torch.FloatTensor(preprocessor.transform(found_instances))).numpy()
        
        self.datasets[dataset_name]["predicted"] = output
        self.datasets[dataset_name] = self.datasets[dataset_name][self.datasets[dataset_name].predicted >= 0.5]
        self.datasets[dataset_name].drop(columns="predicted", inplace=True)
        print(dataset_name, len(self.datasets[dataset_name]))

    def _filter_dataset(self, dataset_name, classifier, preprocessor, max_elements=300):

        # Filter the training dataset by picking only the examples which are classified negatively by the model
        with torch.no_grad():
            output = classifier(torch.FloatTensor(preprocessor.transform(self.datasets[dataset_name]))).numpy()
        
        self.datasets[dataset_name]["predicted"] = output
        self.datasets[dataset_name] = self.datasets[dataset_name][self.datasets[dataset_name].predicted < 0.5]
        self.datasets[dataset_name].drop(columns="predicted", inplace=True)

        # Sample only a subset of those elements
        self.datasets[dataset_name] = self.datasets[dataset_name].sample(max_elements)

    def sample(self) -> dict:
        return {
            k: x.sample(1) for k,x in self.datasets.items()
        }

    def get_feature_names(self) -> list:
        return {
            k: x.columns.tolist() for k,x in self.datasets.items()
        }