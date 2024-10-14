"""Train the FARE model by using the given python class instead of the script."""

from models.WFAREMul import WFAREMul

from models.utils.net import Net
from models.utils.functions import fare_actions_factory

import torch

import pandas as pd
import numpy as np

import os
import random

import dill as pickle

from argparse import ArgumentParser

from config import MIXTURE_MEAN_LIST, WFARE_CONFIG, NN_CONFIG

if __name__ == "__main__":

    # Initialize the parser
    parser = ArgumentParser()
    parser.add_argument("--dataset", type=str, default="adult", help="Dataset name (adult, givemecredit)")
    parser.add_argument("--model", type=str, default="nn", help="Model type we want to train (svc, tree, nn)")
    parser.add_argument("--retrain", default=False, action="store_true", help="Retrain the model if present.")
    parser.add_argument("--clean", default=False, action="store_true", help="Retrain the model starting from scratch.")
    parser.add_argument("--quantile", default=1.0, type=float, help="Quantile we want to use.")
    parser.add_argument("--num-examples", default=500, type=int, help="How many examples to use to train E-WFARE.")

    args = parser.parse_args()

    # Seed for reproducibility
    np.random.seed(2024)
    torch.manual_seed(2024)
    random.seed(2024)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

    train_data_path = f"models/{args.dataset}/train_data_{args.dataset}.csv"
    test_data_path = f"models/{args.dataset}/test_data_{args.dataset}.csv"
    blackbox_model_path = f"models/{args.dataset}/model_{args.model}_{args.dataset}.pth"
    preprocessor_path = f"models/{args.dataset}/preprocessor_{args.model}_{args.dataset}.pth"

    # Read data and preprocess them
    X_train = pd.read_csv(train_data_path)
    X_test = pd.read_csv(test_data_path)

    # Build actions
    #immutable_features = [f for f in X_train.columns if f not in mutable_features.get(args.dataset)]
    #actions, types = fare_actions_factory(X_train, immutable_features, bins=10)

    # Build weights dataframes
    keys_weights = X_train.columns
    print("Current Mixture dimension: ", len(keys_weights))

    # Generate random weights.
    # For training, we use the expected value (sampled) of the mixture.
    # For testing, we sample the weights from the mixture.
    #mixture = MixtureModel(mixture_means=MIXTURE_MEAN_LIST.get(args.dataset))
    #W_expectation = np.mean(mixture.sample(1000), axis=0)
    W_train = np.random.randint(1,10, size=(len(X_train), len(keys_weights)))
    W_test = np.random.randint(1,10, size=(len(X_test), len(keys_weights)))

    # Transform the weights into dataframes.
    W_train = pd.DataFrame(W_train, columns=keys_weights)
    W_test = pd.DataFrame(W_test, columns=keys_weights)

    # Save weights to disk
    W_test.to_csv(f"models/{args.dataset}/weights_test_{args.dataset}.csv", index=None)

    # Build a preprocessing pipeline, which can be used to preprocess
    # the elements of the dataset.
    # The Fast preprocessor does min/max scaling and categorical encoding.
    # It is much faster than then scikit learn ones and it uses dictionaries
    # and sets to perform operations on the fly.
    preprocessor = pickle.load(open(f"models/{args.dataset}/preprocessor_{args.model}_{args.dataset}.pth", "rb"))

    blackbox_model = Net(len(preprocessor.transform(X_train)[0]),
                            layers=NN_CONFIG.get(args.dataset).get("nn").get("layers"))
    blackbox_model.load_state_dict(
        torch.load(blackbox_model_path)
    )
    blackbox_model.eval()

    # Filter the training dataset by picking only the examples which are classified negatively by the model
    with torch.no_grad():
        output = blackbox_model(torch.FloatTensor(preprocessor.transform(X_train))).numpy()
    
    X_train["predicted"] = output
    X_train = X_train[X_train.predicted <= 0.5]
    quantile = X_train.predicted.quantile(args.quantile)
    X_train = X_train[(X_train.predicted <= quantile)]
    print("[*] Training with quantile: ", args.quantile)

    # Get hard examples
    X_hard = X_train[(X_train.predicted <= X_train.predicted.quantile(0.45))].copy()
    W_hard = W_train.iloc[X_hard.index].copy()
    X_hard.reset_index(inplace=True, drop=True)
    W_hard.reset_index(inplace=True, drop=True)
    print("[*] Training hard examples: ", len(X_hard))

    X_train.drop(columns="predicted", inplace=True)

    print("[*] Training examples: ", len(X_train))

    policy_config = WFARE_CONFIG.get(args.dataset).get("policy_config")

    environment_config = {
        "class_name": WFARE_CONFIG.get(args.dataset).get("environment"),
        "additional_parameters": {
            #"programs_library": actions,
            #"arguments": types,
            "preprocessor": preprocessor,
            "model_type": args.model,
            "agnostic":  WFARE_CONFIG.get(args.dataset).get("agnostic", False),
            "remove_edges": None
        }
    }
    
    mcts_config = WFARE_CONFIG.get(args.dataset).get("mcts_config")
    policy_config = WFARE_CONFIG.get(args.dataset).get("policy_config")

    model = WFAREMul(blackbox_model, policy_config, environment_config, mcts_config,
                  batch_size=WFARE_CONFIG.get(args.dataset).get("batch_size", 50),
                  training_buffer_size=WFARE_CONFIG.get(args.dataset).get("buffer_size", 200),
                  expectation=None)
    print(model.policy)

    # Train a FARE model given the previous configurations
    if args.retrain:
        
        if not args.clean and os.path.isfile(f"models/{args.dataset}/wfare_{args.model}_{args.dataset}.pth"):
            print("[*] Loading checkpoint from file")
            model.load(f"models/{args.dataset}/wfare_{args.model}_{args.dataset}.pth")
        
        model.fit(X_train, W_train, X_hard=X_hard, W_hard=W_hard,
                  max_iter=WFARE_CONFIG.get(args.dataset).get("training_steps"), 
                  tensorboard="./wfare")
        
        # We save the trained WFARE model to disc
        model.save(f"models/{args.dataset}/wfare_{args.model}_{args.dataset}.pth")
        pickle.dump(model, open(f"models/{args.dataset}/wfare_recourse_{args.model}_{args.dataset}.pth", "wb"))
    else:
        if os.path.isfile(f"models/{args.dataset}/wfare_{args.model}_{args.dataset}.pth"):
            model.load(f"models/{args.dataset}/wfare_{args.model}_{args.dataset}.pth")
        else:
            print(f"No model available (models/{args.dataset}/wfare_{args.model}_{args.dataset}.pth)!")
            exit()

    # For testing, we use the test data
    with torch.no_grad():
        output = blackbox_model(torch.FloatTensor(preprocessor.transform(X_test))).round().numpy()

    X_test["predicted"] = output
    X_test = X_test[X_test.predicted == 0]
    X_test.drop(columns="predicted", inplace=True)

    # Reset the index of both test features and weights
    W_test = W_test.iloc[X_test.index]
    W_test.reset_index(inplace=True, drop=True)
    X_test.reset_index(inplace=True, drop=True)

    print("[*] Test W-EFARE with true weights.")
    df_cfs, Y_full, competitor_traces, costs_efare, _ = model.predict(X_test[0:100], W_test[0:100], full_output=True)
    print(sum(Y_full)/len(Y_full), round(np.mean(costs_efare), 2), round(np.mean([len(t) for t in competitor_traces]), 2))
    
    # We use the model to predict the test data
    print("[*] Test model with expected weights given the mixture.")
    _, Y_full, traces_full, c_full_e, _ = model.predict(X_test[0:100], W_train[0:100], full_output=True)
    print(sum(Y_full)/len(Y_full), round(np.mean(c_full_e), 2), round(np.mean([len(t) for t in traces_full]), 2))