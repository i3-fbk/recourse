import numpy as np
import pandas as pd

import torch
from torch.utils.data import Dataset

def fix_lendingclub(data, y):

    columns = pd.read_csv("models/lendingclub/raw/columns.csv")["name"]
    data = data[columns]

    # Drop the columns if they have more tha 80% nans
    nan_count = data.isna().sum()
    nan_percent = nan_count / len(data)
    drop_cols = nan_percent[nan_percent > 0.8].index
    X = data.drop(drop_cols, axis=1)

    # Interpolate missing values
    X = X.interpolate(method='linear')

    X = X.dropna()

    # Fix revol util
    X["revol_util"] = X["revol_util"].apply(lambda x: float(x.replace("%", "")))
    X["int_rate"] = X["int_rate"].apply(lambda x: float(x.replace("%", "")))
    X['term'] = X['term'].apply(lambda x: x.strip())

    # Change 
    # X = X[X.loan_status.isin([
    #    "Charged Off", "Current", "Fully Paid"    
    # ])]
    # X["loan_status"] = X["loan_status"].apply(lambda x: "Fully Paid" if x in ["Current", "Fully Paid"] else x)

    X = X.convert_dtypes()

    X.drop(columns=["emp_title", "earliest_cr_line"], inplace=True)

    return X

def fix_adult(data):
    # https://www.kaggle.com/code/alokevil/simple-eda-for-beginners
    data.dropna(inplace=True)
    attrib, counts = np.unique(data['workclass'], return_counts = True)
    most_freq_attrib = attrib[np.argmax(counts, axis = 0)]
    data['workclass'] = data['workclass'].apply(lambda x: most_freq_attrib if x=='?' else x)

    attrib, counts = np.unique(data['occupation'], return_counts = True)
    most_freq_attrib = attrib[np.argmax(counts, axis = 0)]
    data['occupation'] = data['occupation'].apply(lambda x: most_freq_attrib if x=='?' else x)

    attrib, counts = np.unique(data['native_country'], return_counts = True)
    most_freq_attrib = attrib[np.argmax(counts, axis = 0)]
    data['native_country'] = data['native_country'].apply(lambda x: most_freq_attrib if x=='?' else x)

    return data

class Data(Dataset):

    def __init__(self, X, y):
        self.data = X
        self.y = y

    def feature_size(self):
        return len(self.data.columns)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        features = torch.tensor(self.data.iloc[idx].values).float()
        response = torch.tensor(self.y.iloc[idx]).float()
        return features, response