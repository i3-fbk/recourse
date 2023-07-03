import requests
import pprint

""" 
EXAMPLE OF POST JSON REQUEST: 
{'features': [{'name': 'age', 'value': 53},
              {'name': 'workclass', 'value': 'Private'},
              {'name': 'education', 'value': 'HS-grad'},
              {'name': 'marital_status', 'value': 'Divorced'},
              {'name': 'occupation', 'value': 'Machine-op-inspct'},
              {'name': 'relationship', 'value': 'Own-child'},
              {'name': 'race', 'value': 'White'},
              {'name': 'sex', 'value': 'Male'},
              {'name': 'capital_gain', 'value': 0},
              {'name': 'capital_loss', 'value': 0},
              {'name': 'hours_per_week', 'value': 40},
              {'name': 'native_country', 'value': 'United-States'}]}

EXAMPLE OF COOKIE FOR THE WEIGHTS:

{'RecourseInteractiveWeights23': "{'adult': {'age': 38, 'workclass': 32, "
                                 "'education': 9, 'marital_status': 86, "
                                 "'occupation': 53, 'relationship': 70, "
                                 "'race': 82, 'sex': 88, 'capital_gain': 71, "
                                 "'capital_loss': 94, 'hours_per_week': 46, "
                                 "'native_country': 96}}"}

"""

url = 'http://127.0.0.1:5000/get_recourse'
myobj = {'age': 53, 'workclass': 'Private', 'education': 'HS-grad', 'marital_status': 'Divorced', 'occupation': 'Machine-op-inspct', 'relationship': 'Own-child', 'race': 'White', 'sex': 'Male', 'capital_gain': 0, 'capital_loss': 0, 'hours_per_week': 40, 'native_country': 'United-States'}

myobj = [{
    "name": k, "value": v
} for k,v in myobj.items()]

cookies = {'RecourseInteractiveWeights23': 
           str({'adult': {'age': 38, 'workclass': 32, 'education': 9, 'marital_status': 86, 'occupation': 53, 'relationship': 70, 'race': 82, 'sex': 88, 'capital_gain': 71, 'capital_loss': 94, 'hours_per_week': 46, 'native_country': 96}})
}

preferences = {"hour_per_week": {"max_value": 41, "min_value": 0},
               "education": {"acceptable_values": ['Doctorate', 'Assoc-acdm', 'Assoc-voc', 'Prof-school']}}

# Send the request to the API
x = requests.post(url, json = {"features": myobj, "preferences": preferences}, cookies=cookies)

print("[*] POST REQUEST")
print(pprint.pformat(
    {"features": myobj, "preferences": preferences}
))
print()

# Print the answer
print("[*] POST ANSWER")
print(pprint.pformat(x.json()))
print()