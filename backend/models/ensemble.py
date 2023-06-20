from typing import List

import pandas as pd
import torch


class EnsembleBlackBox:

    def __init__(self, model_names: List, models: List, preprocessors: List) -> None:
        
        self.model_names = model_names
        self.preprocessors = preprocessors
        self.models = models
    
    def predict(self, x: dict) -> bool:

        outputs = []

        with torch.no_grad():

            for name, model, preprocessor in zip(self.model_names, self.models, self.preprocessors):

                model.eval()
                output = model(
                    torch.FloatTensor(preprocessor.transform(x.get(name)))
                )
                outputs.append(
                    torch.round(output).flatten().numpy()[0]
                )
        
        return sum(outputs) == len(outputs)
