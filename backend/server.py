from flask import Flask
from flask import request

import dill as pickle

from models.config import NN_CONFIG
from models.utils.net import Net
from models.utils.functions import convert_plans_into_json
from models.ensemble import EnsembleBlackBox
from models.dataset import JointDataset

import torch

import numpy as np
import pandas as pd 

MAX_RECOURSE_PLANS = 5

app = Flask(__name__)

dataset_models = [
    #["lendingclub", "nn", 157],
    ["adult", "nn", 102]
]

dataset_paths = [
    "backend/models/adult/test_data_adult.csv",
    #"backend/models/lendingclub/test_data_lendingclub.csv"
]

recourse_paths = [
    ["adult", "backend/models/adult/wfare_recourse_nn_adult.pth"]
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
    ["adult"], dataset_paths, ensemble_models, ensemble_preprocessors
    #["adult", "lendingclub"], dataset_paths
)

# Load the recourse method
recourse_method = {}
for t, r_path in recourse_paths:
    recourse_method[t] = pickle.load(open(r_path, "rb"))

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

@app.route("/get_recourse", methods=['GET', 'POST'])
def get_recourse():

    # We extract the user preferences, data and weigths from the cookies
    # If those values are none, we will set a default value
    user_data_and_preferences = request.get_json(force=True, silent=True)

    # TODO: VERY DANGEROUS!!!! We need a way to sanitize the cookie to prevent code execution.
    # Once everything is dockerized, it should not be an issue (they would destroy only the docker).
    # We are restricting the usage to only __builtins__ but it could still be dangerous.
    user_current_weights = None
    if request.cookies.get("RecourseInteractiveWeights23", None):
        user_current_weights = eval(request.cookies.get("RecourseInteractiveWeights23", None), {})

    if user_data_and_preferences is None:
        user_data_and_preferences = dataset.sample()
        user_preferences = {}
    else:
        # Convert the user and get its preferences
        user_preferences = user_data_and_preferences.get("preferences", {})
        user_data_and_preferences = {"adult": pd.DataFrame.from_records([{v.get("name"):v.get("value") for v in user_data_and_preferences.get("features")}])}

    if user_current_weights is None:
        user_current_weights = {k: np.random.randint(1,100, size=len(user_data_and_preferences.get(k).columns)) for k,v in user_data_and_preferences.items()}
    
    user_current_weights = {k: pd.DataFrame([user_current_weights.get(k)], columns=user_data_and_preferences.get(k).columns) for k,v in user_data_and_preferences.items()}

    # Potential interventions
    potential_interventions = []
    previous_solutions = []
    current_traces = []

    for k in range(0,10):
        for k, v in user_data_and_preferences.items():
            df_cfs, Y_full, competitor_traces, costs_efare, root_node = recourse_method.get(k).predict(v,
                                                                                                    user_current_weights.get(k),
                                                                                                    full_output=True,
                                                                                                    verbose=False,
                                                                                                    mcts_steps=5,
                                                                                                    noise=0.3,
                                                                                                    previous_solutions=previous_solutions,
                                                                                                    user_constraints=user_preferences)
            if Y_full[0] == 1:
                trace_tuple = "---".join([f"{p}_{a}" for p,a in competitor_traces[0]])
                if trace_tuple not in current_traces:
                    potential_interventions.append((competitor_traces[0], costs_efare[0], df_cfs.to_dict('records')[0]))
                    current_traces.append(trace_tuple)
                    previous_solutions.append(
                        df_cfs.to_dict('records')[0]
                    )

    # Pick only the MAX_RECOURSE_PLANS plans with the lowest cost
    potential_interventions = sorted(potential_interventions, key=lambda x: x[1])
    potential_interventions = [x[2] for x in potential_interventions[0:MAX_RECOURSE_PLANS]]
    
    return convert_plans_into_json(potential_interventions, v.to_dict('records')[0], user_preferences)

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