from typing import Any, Dict, List, Tuple

import numpy as np
import pandas as pd
from pandas.api.types import is_categorical_dtype, is_numeric_dtype, is_object_dtype

from itertools import product


def convert_plans_into_json(plans: dict, current_state: dict, user_preferences: dict={}, max_recourse_plans: int=5):

    json_response = {
        "userId": "#",
        "plans": [],
        "overalSatisfication": None,
        "UserPreferences": user_preferences
    }

    # We want to generate the cartesian product between plans
    plans_datasets = [k for k,v in plans.items()]
    all_plans = product(*[v[0] for k,v in plans.items()])
    all_interventions = product(*[v[1] for k,v in plans.items()])

    for k,(plan,intervention) in enumerate(zip(all_plans,all_interventions)):

        # TODO: check that with this way, we are really returning the cheapest plans
        # If we have generated too many recourse plans, return
        if k+1 > max_recourse_plans:
            break
        
        new_plan = {
            "planId": k+1,
            "features": {d:[] for d in plans_datasets},
            "interventions": {d: intervention[idx] for idx, d in enumerate(plans_datasets)}
        }

        for dataset, subplan in zip(plans_datasets, plan):

            for feature, new_value in subplan.items():

                if current_state.get(dataset).get(feature) != new_value:
                    new_plan["features"][dataset].append(
                        {
                            "name": feature,
                            "valueBefore": current_state.get(dataset).get(feature),
                            "valueAfter": new_value,
                            "valueDiff": (new_value-current_state.get(dataset).get(feature)) if isinstance(new_value, int) or isinstance(new_value, float) else new_value,
                            "type": "numeric" if isinstance(new_value, int) or isinstance(new_value, float) else "categorical"
                        }
                    )
        
        json_response["plans"].append(
            new_plan
        )
    
    return json_response


def fare_actions_factory(
    df: pd.DataFrame, immutables: List[str], bins: int = 50
) -> Tuple[Dict[Any, Any], Dict[Any, Any]]:
    """Returns a set of actions/types needed by FARE by looking at the training set.
    It works best with unprocessed features.

    :param df: training set of the task
    :type df: pd.DataFrame
    :param immutables: columns we cannot modify
    :type immutables: List[str]
    :return: actions and types which can work with FARE
    :type bins: int
    :return: num parameter for the np.linspace method for numerical features
    :rtype: Tuple[Dict[Any], Dict[Any]]
    """

    actions = {
        "STOP": {"index": 0, "level": -1, "args": "NONE"},
        "INTERVENE": {"index": 0, "level": 1, "args": "NONE"},
    }

    types = {"NONE": [0]}

    # Check if there are binary variables
    binary_features = df.columns[df.isin([0, 1]).all()]

    # Set the action index
    action_index = 1

    # Build the corresponding types, one for each feature.
    for c in df.columns:

        # Skip the columns we cannot change
        if c in immutables:
            continue

        # Add the corresponding action
        actions[c] = {"index": action_index, "level": 0, "args": c}

        if is_numeric_dtype(df[c]) and c not in binary_features:
            min_value = df[c].min()
            max_value = df[c].max()

            types[c] = np.linspace(
                0, np.sqrt(max_value - min_value), dtype=df[c].dtype, num=bins
            )
            types[c] += np.linspace(
                -(np.sqrt(max_value - min_value)), 0, dtype=df[c].dtype, num=bins
            )
            types[c] = [value for value in types[c] if value != 0]  # Remove zeros
            types[c] = list(set(types[c]))  # Remove potential harmful duplicates

        elif (
            is_categorical_dtype(df[c])
            or is_object_dtype(df[c])
            or c in binary_features
        ):
            types[c] = df[c].unique().tolist()
        else:
            print(f"Skipping over column {c}. It is not categorical not numeric")

        action_index += 1

    # Restore the INTERVENE action index
    actions["INTERVENE"]["index"] = action_index

    return actions, types