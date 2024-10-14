from recourse_fare.utils.preprocess.fast_preprocessor import StandardPreprocessor

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, f1_score

from sklearn.svm import SVC 
from sklearn.tree import DecisionTreeClassifier

import numpy as np
import pandas as pd

from argparse import ArgumentParser
import random

import dill as pickle

import torch

from models.utils.trainer_torch import train_nn
from models.config import NN_CONFIG, DATA_CONFIG

if __name__ == "__main__":

    # Initialize the parser
    parser = ArgumentParser()
    parser.add_argument("--dataset", type=str, default="adult", help="Dataset name (adult, givemecredit)")
    parser.add_argument("--model", type=str, default="nn", help="Model type we want to train (nn, linear)")

    args = parser.parse_args()

    # Seed for reproducibility
    np.random.seed(2023)
    torch.manual_seed(2023)
    random.seed(2023)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

    # Extract the right information from the available configs
    target = DATA_CONFIG.get(args.dataset).get("target")
    target_bad_value = DATA_CONFIG.get(args.dataset).get("target_negative")
    columns_to_drop = DATA_CONFIG.get(args.dataset).get("drop")
    data_path = DATA_CONFIG.get(args.dataset).get("dataset")
    preprocessing_step = DATA_CONFIG.get(args.dataset).get("preprocessing")

    # Read data and preprocess them
    X = pd.read_csv(data_path)

    y = X[target].apply(lambda x: 0 if x==target_bad_value else 1)
    X.drop(columns=[target], inplace=True)

    # We drop some columns we consider hardly interpretable or duplicates.
    X.drop(columns=columns_to_drop, inplace=True)

    # Apply some custom preprocessing to further clean the data
    if preprocessing_step:
        X = preprocessing_step(X, y)
        y = y.loc[X.index]
        X.reset_index(inplace=True, drop=True)
        y.reset_index(inplace=True, drop=True)

    # Split the dataset into train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=2023)

    # Reset the index
    X_train.reset_index(drop=True, inplace=True)
    X_test.reset_index(drop=True, inplace=True)
    y_test.reset_index(drop=True, inplace=True)

    # Save the training/testing datasets
    X_train.to_csv(f"models/{args.dataset}/train_data_{args.dataset}.csv", index=None)
    X_test.to_csv(f"models/{args.dataset}/test_data_{args.dataset}.csv", index=None)

    # Train the preprocessor
    preprocessor = StandardPreprocessor()
    preprocessor.fit(X_train)

    # Train the neural network
    best_model = train_nn(
        preprocessor.transform(X_train, type="dataframe"), y_train.copy(),
        preprocessor.transform(X_test, type="dataframe"), y_test.copy(),
        linear=(args.model == "linear"),
        iterations=NN_CONFIG.get(args.dataset).get(args.model).get("iterations"),
        layers=NN_CONFIG.get(args.dataset).get(args.model).get("layers", 0),
        batch_size=NN_CONFIG.get(args.dataset).get(args.model).get("batch_size")
    )

    # Evaluate the model and print the classification report for the two classes
    if args.model != "nn" and args.model != "linear":
        output = best_model.predict(preprocessor.transform(X_test))
    else:
        with torch.no_grad():
            best_model.eval()
            output = best_model(
                torch.FloatTensor(preprocessor.transform(X_test))
            )
            output = torch.round(output).flatten().numpy()        
    
    print(classification_report(output, y_test))
    print(f1_score(output, y_test))

    # Save the best estimator to disk
    torch.save(best_model.state_dict(),
                f"models/{args.dataset}/model_{args.model}_{args.dataset}.pth")
    
    # Save the preprocessor to disk
    with open(f"models/{args.dataset}/preprocessor_{args.model}_{args.dataset}.pth", "wb") as p:
        pickle.dump(preprocessor, p)