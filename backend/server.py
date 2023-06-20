from flask import Flask
from flask import request

import dill as pickle

from models.config import NN_CONFIG
from models.utils.net import Net
from models.ensemble import EnsembleBlackBox
from models.dataset import JointDataset

import torch

app = Flask(__name__)

dataset_models = [
    ["lendingclub", "nn", 157],
    ["adult", "nn", 102]
]

dataset_paths = [
    "backend/models/adult/test_data_adult.csv",
    "backend/models/lendingclub/test_data_lendingclub.csv"
]

# Load the models for the ensemble
ensemble_names = []
ensemble_models = []
ensemble_preprocessors = []

# Load all the models weights
for dataset, model, feat_size in dataset_models:

    # Load the neural network
    mdl = Net(feat_size, NN_CONFIG.get(dataset).get(model).get("layers", 0))
    mdl.load_state_dict(torch.load(f"backend/models/{dataset}/model_{model}_{dataset}.pth"))

    # Load the preprocessors
    mdl_preprocessors = pickle.load(open(f"backend/models/{dataset}/preprocessor_{model}_{dataset}.pth", "rb"))

    ensemble_names.append(dataset)
    ensemble_models.append(mdl)
    ensemble_preprocessors.append(mdl_preprocessors)


# Build the ensemble
ensemble = EnsembleBlackBox(
    ensemble_names, ensemble_models, ensemble_preprocessors
)

# Build the dataset
dataset = JointDataset(
    ["adult", "lendingclub"], dataset_paths
)

# /ask
# The route should accept a JSON object which comprises:
# - User features;
# - User costraints;
# We would save as cookie the user weights, such to retrieve them
# each time they enter the system.
#
# It would then return a JSON object representing the proposed
# recourse plan, which would be rendered by the app.

@app.route("/")
def hello_world():
    x = dataset.sample()
    result = ensemble.predict(x)

    return f"<p>{str(x)}</p><br /><p>{result}</p>"

@app.route("/get_user", methods=['GET'])
def get_user():
    x = dataset.sample()
    x = {k: v.to_dict("records")[0] for k,v in x.items()}
    return x

@app.route("/ask", methods=['POST', 'GET'])
def return_recourse():
    error = None
    if request.method == 'POST':
        pass
    elif request.method == 'GET':

        x = dataset.sample()
        result = ensemble.predict(x)

        return f"<p>{str(x)}</p><br /><p>{result}</p>"

    return f"{error}"
