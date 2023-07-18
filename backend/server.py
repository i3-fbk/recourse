from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request

import dill as pickle

from recourse_fare.utils.functions import import_dyn_class

from models.config import NN_CONFIG
from models.utils.net import Net
from models.utils.functions import convert_plans_into_json
from models.ensemble import EnsembleBlackBox
from models.dataset import JointDataset

from models.user.sampler import Sampler

import torch

import numpy as np
import pandas as pd 

MAX_RECOURSE_PLANS = 5

app = Flask(__name__)
CORS(app, support_credentials=True)

dataset_models = [
    ["adult", "nn", 102],
    ["lendingclub", "nn", 157]
]

dataset_paths = [
    "backend/models/adult/test_data_adult.csv",
    "backend/models/lendingclub/test_data_lendingclub.csv"
]

recourse_paths = [
    ["adult", "backend/models/adult/wfare_recourse_nn_adult.pth"],
    ["lendingclub", "backend/models/lendingclub/wfare_recourse_nn_lendingclub.pth"]
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
    ["adult", "lendingclub"], dataset_paths, ensemble_models, ensemble_preprocessors
)

# Load the recourse method
recourse_method = {}
for t, r_path in recourse_paths:
    recourse_method[t] = pickle.load(open(r_path, "rb"))

# Initialize Sampler
nodes = dataset.get_feature_names()
sampler = Sampler(nodes)

# Get configs 
environment_configs = {
    k: v.environment_config for k,v in recourse_method.items()
}

@app.route("/get_user", methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user():
    x = dataset.sample()
    x = {k: v.to_dict("records")[0] for k,v in x.items()}
    return x

@app.route("/get_recourse", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def get_recourse():

    # Get user data, preferences, current_weights and plans
    # In this case, we discard the previous plans
    user_data, user_preferences, user_current_weights, _ = extract_features_and_preferences()

    # Potential interventions
    potential_interventions = generate_interventions(user_data, user_current_weights, user_preferences)

    return convert_plans_into_json(potential_interventions, {k:v.to_dict('records')[0] for k,v in user_data.items()}, user_preferences)

@app.route("/get_recourse_v2", methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def get_recourse_and_learn():

    # Get user data, preferences, current_weights and plans
    user_data, user_preferences, user_current_weights, recourse_previous_plans = extract_features_and_preferences()

    # Compute the new weights
    new_weights = improve_weights(user_data, user_current_weights, recourse_previous_plans)
    new_weights = {k: pd.DataFrame([new_weights.get(k)], columns=user_data.get(k).columns) for k,v in user_data.items()}

    # Potential interventions
    potential_interventions = generate_interventions(user_data, new_weights, user_preferences)

    return convert_plans_into_json(potential_interventions, {k:v.to_dict('records')[0] for k,v in user_data.items()}, user_preferences)


def extract_features_and_preferences():

    # We extract the user preferences, data and weigths from the cookies
    # If those values are none, we will set a default value
    user_data_and_preferences = request.get_json(force=True, silent=True)

    # TODO: VERY DANGEROUS!!!! We need a way to sanitize the cookie to prevent code execution.
    # Once everything is dockerized, it should not be an issue (they would destroy only the docker).
    # We are restricting the usage to only __builtins__ but it could still be dangerous.
    user_current_weights = None
    if request.cookies.get("RecourseInteractiveWeights23", None):
        user_current_weights = eval(request.cookies.get("RecourseInteractiveWeights23", None), {})
    
    # Extract previous plans
    recourse_previous_plans = None
    if request.cookies.get("RecoursePreviousPlans", None):
        recourse_previous_plans = eval(request.cookies.get("RecoursePreviousPlans", None), {})

    # Extract previous preferences
    previous_user_preferences = {}
    if request.cookies.get("PreviousUserPreferences", None):
        previous_user_preferences = eval(request.cookies.get("PreviousUserPreferences", None), {})

    if user_data_and_preferences is None:
        user_data = dataset.sample()
        user_preferences = {}
    else:
        # Convert the user and get its preferences
        user_preferences = user_data_and_preferences.get("preferences", {})
        user_data = {}
        for dataset_type in user_data_and_preferences.get("features"):
            current_features = user_data_and_preferences.get("features").get(dataset_type)
            user_data[dataset_type] = pd.DataFrame.from_records([{v.get("name"):v.get("value") for v in current_features}])

    # Merge previous user preferences
    user_preferences = merge_user_preferences(user_preferences, previous_user_preferences)

    if user_current_weights is None:
        user_current_weights = {k: np.random.randint(1,100, size=len(user_data.get(k).columns)) for k,v in user_data.items()}
    
    user_current_weights = {k: pd.DataFrame([user_current_weights.get(k)], columns=user_data.get(k).columns) for k,v in user_data.items()}

    return user_data, user_preferences, user_current_weights, recourse_previous_plans


def generate_interventions(user_data: dict, user_weights: dict, user_preferences: dict) -> dict:
    """Generate recourse plans.

    :param user_data: user features 
    :type user_data: dict
    :param user_weights: user weights
    :type user_weights: dict
    :param user_preferences: user preferences
    :type user_preferences: dict
    :return: the recourse plans
    :rtype: dict
    """


    potential_interventions = dict()

    for k, v in user_data.items():

        temp_potential_interventions = []
        previous_solutions = []
        current_traces = []

        for int_idx in range(0,3):

            print(f"generating id {int_idx}, {k}")
            
            df_cfs, Y_full, competitor_traces, costs_efare, root_node = recourse_method.get(k).predict(v,
                                                                                                    user_weights.get(k),
                                                                                                    full_output=True,
                                                                                                    verbose=False,
                                                                                                    mcts_steps=5,
                                                                                                    noise=0.3,
                                                                                                    previous_solutions=previous_solutions,
                                                                                                    user_constraints=user_preferences)
            if Y_full[0] == 1:
                
                trace_tuple = "---".join([f"{p}_{a}" for p,a in competitor_traces[0]])
                
                if trace_tuple not in current_traces:
                    
                    temp_potential_interventions.append((competitor_traces[0], costs_efare[0], df_cfs.to_dict('records')[0]))
                    
                    current_traces.append(trace_tuple)
                    previous_solutions.append(
                        df_cfs.to_dict('records')[0]
                    )

        # Pick only the MAX_RECOURSE_PLANS plans with the lowest cost
        temp_potential_interventions = sorted(temp_potential_interventions, key=lambda x: x[1])
        temp_full_plans = [x[0] for x in temp_potential_interventions[0:MAX_RECOURSE_PLANS]]
        temp_potential_interventions = [x[2] for x in temp_potential_interventions[0:MAX_RECOURSE_PLANS]]

        # Save the top interventions there
        potential_interventions[k] = (temp_potential_interventions, temp_full_plans)

    return potential_interventions

def merge_user_preferences(previous_preferences: dict, new_preferences: dict) -> dict:
    """Merge the current user preferences with the new ones.

    The strategy is the following: for continuous values, we take the minimum between the
    current and new maximum value, and we take the maximum between the current and new
    minimum value. For categorical values, we simply replace the current selection with
    the new one. Lastly, we add the new preferences if they were not specified before. 

    :param previous_preferences: previous preferences as dictionary {feature_name: preferences}
    :type previous_preferences: dict
    :param new_preferences: new preferences as dictionary
    :type new_preferences: dict
    :return: updated preferences
    :rtype: dict
    """

    updated_preferences = previous_preferences.copy()

    # Add new preferences if they were never specified before
    for k in new_preferences.keys():
        if k not in updated_preferences:
            updated_preferences[k] = new_preferences.get(k)

    # Update previous values
    for k in previous_preferences.keys():
        # Check if in the preferences exist
        if k in new_preferences:

            # If this is numerical, then extend the range if it exist:
            if "max_value" in new_preferences.get(k):

                updated_preferences[k]["max_value"] = min(
                    updated_preferences[k]["max_value"],
                    new_preferences.get(k).get("max_value")
                )

                updated_preferences[k]["min_value"] = max(
                    updated_preferences[k]["min_value"],
                    new_preferences.get(k).get("min_value")
                )

            else:
                updated_preferences[k]["acceptable_values"] = new_preferences.get(k).get("acceptable_values")

    return updated_preferences

def improve_weights(X: dict, previous_w: dict, previous_plans: dict) -> dict:
    """Update the current user weights given new interaction

    :param X: user features
    :type X: dict
    :param previous_w: previous weights
    :type previous_w: dict
    :param previous_plans: previous plans ranked
    :type previous_plans: dict
    :return: new user weights
    :rtype: dict
    """
    
    previous_plans = sorted(previous_plans, key=lambda x: x.get("overall_satisfaction"), reverse=True)
    constraints = {}
    for k in recourse_method.keys():

        # Get the best plans and generate choices
        choices = []
        
        for p in previous_plans:
            choices.append(
                [p.get("plan").get(k), X.get(k).to_dict('records')[0].copy()]
            )
        
        # Build the constraints
        constraints[k] = [[previous_plans[0].get("plan").get(k), choices]]

    # Build the environments
    envs = {}
    for k in recourse_method.keys():

        env = import_dyn_class(environment_configs.get(k).get("class_name"))(
                    X.get(k).to_dict('records')[0].copy(),
                    previous_w.get(k).to_dict('records')[0].copy(),
                    ensemble.get_model(k),
                    **environment_configs.get(k).get("additional_parameters"),
                )      
        envs[k] = env 

    new_particles = sampler.sample(
        constraints, envs
    )

    return new_particles