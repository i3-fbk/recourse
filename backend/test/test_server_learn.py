import requests
import pprint
import json

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

url = 'http://127.0.0.1:5000/get_recourse_v2'
myobj = {'age': 53, 'workclass': 'Private', 'education': 'HS-grad', 'marital_status': 'Divorced', 'occupation': 'Machine-op-inspct', 'relationship': 'Own-child', 'race': 'White', 'sex': 'Male', 'capital_gain': 0, 'capital_loss': 0, 'hours_per_week': 40, 'native_country': 'United-States'}
myobj_lending = {"acc_now_delinq":0,"acc_open_past_24mths":4,"all_util":62,"annual_inc":35000.0,"application_type":"Individual","avg_cur_bal":3115,"bc_open_to_buy":3496.0,"bc_util":36.4,"chargeoff_within_12_mths":0,"collections_12_mths_ex_med":0,"debt_settlement_flag":"N","delinq_2yrs":0,"delinq_amnt":0,"dti":20.37,"emp_length":"9 years","fico_range_high":674,"fico_range_low":670,"grade":"D","hardship_flag":"N","home_ownership":"RENT","il_util":71.0,"initial_list_status":"f","inq_fi":0,"inq_last_12m":1,"inq_last_6mths":1,"installment":68.24,"int_rate":21.45,"last_fico_range_high":499,"last_fico_range_low":0,"loan_amnt":1800,"max_bal_bc":1492,"mo_sin_old_il_acct":120.0,"mo_sin_old_rev_tl_op":13,"mo_sin_rcnt_rev_tl_op":5,"mo_sin_rcnt_tl":5,"mort_acc":0,"mths_since_last_delinq":41.0,"mths_since_last_major_derog":67.0,"mths_since_rcnt_il":8.0,"mths_since_recent_bc":5.0,"mths_since_recent_inq":5.0,"mths_since_recent_revol_delinq":24.0,"num_accts_ever_120_pd":0,"num_actv_bc_tl":2,"num_actv_rev_tl":2,"num_bc_sats":2,"num_bc_tl":3,"num_il_tl":4,"num_op_rev_tl":2,"num_rev_accts":3,"num_rev_tl_bal_gt_0":2,"num_sats":4,"num_tl_120dpd_2m":0.0,"num_tl_30dpd":0,"num_tl_90g_dpd_24m":0,"num_tl_op_past_12m":3,"open_acc":4,"open_acc_6m":1,"open_act_il":2,"open_il_12m":1,"open_il_24m":1,"open_rv_12m":2,"open_rv_24m":3,"pct_tl_nvr_dlq":100.0,"percent_bc_gt_75":50.0,"policy_code":1,"pub_rec":0,"pub_rec_bankruptcies":0,"purpose":"credit_card","pymnt_plan":"n","revol_bal":2004,"revol_util":36.4,"sub_grade":"D5","tax_liens":0,"term":"36 months","tot_coll_amt":0,"tot_cur_bal":12458,"tot_hi_cred_lim":20253,"total_acc":7,"total_bal_ex_mort":12458,"total_bal_il":10454,"total_bc_limit":5500,"total_cu_tl":1,"total_il_high_credit_limit":14753,"verification_status":"Source Verified"}

myobj = [{
    "name": k, "value": v
} for k,v in myobj.items()]
myobj_lending = [{
    "name": k, "value": v
} for k,v in myobj_lending.items()]

previous_recourse_plans = [
    {
        'overall_satisfaction': 1,
        'plan': {
            'adult': [['CHANGE_EDUCATION', 'Prof-school'],
                                        ['CHANGE_OCCUPATION',
                                         'Exec-managerial'],
                                        ['CHANGE_HOURS', 1],
                                        ['STOP', 0]],
            'lendingclub': [
                            ['acc_now_delinq', 1.0],
                            ['hardship_flag', 'Y'],
                            ['home_ownership', 'ANY'],
                            ['STOP', 0]]

        }
    },
    {
        'overall_satisfaction': 2,
        'plan': {
            'adult': [['CHANGE_EDUCATION', 'Prof-school'],
                                        ['CHANGE_OCCUPATION',
                                         'Exec-managerial'],
                                        ['STOP', 0]],
            'lendingclub': [
                            ['acc_now_delinq', 1.0],
                            ['hardship_flag', 'Y'],
                            ['home_ownership', 'ANY'],
                            ['STOP', 0]]
        }
    },
    {
        'overall_satisfaction': 5,
        'plan':
            {
                'adult': [['CHANGE_EDUCATION', 'Prof-school'],
                                        ['CHANGE_OCCUPATION',
                                         'Exec-managerial'],
                                        ['STOP', 0]],
                'lendingclub': [
                                ['acc_now_delinq', 1.0],
                                ['hardship_flag', 'Y'],
                                ['STOP', 0]]
            }
    }
]


cookies = {'RecourseInteractiveWeights23': 
           str({
               'lendingclub': {k.get("name"): 1 for k in myobj_lending},
               'adult': {'age': 1, 'workclass': 1, 'education': 1, 'marital_status': 1, 'occupation': 1, 'relationship': 1, 'race': 1, 'sex': 1, 'capital_gain': 1, 'capital_loss': 1, 'hours_per_week': 1, 'native_country': 1}}),
            'RecoursePreviousPlans': str(previous_recourse_plans),
            'PreviousUserPreferences': str(
                {"hour_per_week": {"max_value": 41, "min_value": 25},
                "annual_inc": {"min_value": 100}}
            )
}

preferences = {"hour_per_week": {"max_value": 41, "min_value": 0},
               "education": {"acceptable_values": ['Doctorate', 'Assoc-acdm', 'Assoc-voc', 'Prof-school']}}

print("[*] POST REQUEST")
print(pprint.pformat(
    {"features": {"adult": myobj, "lendingclub": myobj_lending}, "preferences": preferences}
))
print()

# Send the request to the API
x = requests.post(url, json = {"features": {"adult": myobj, "lendingclub": myobj_lending}, "preferences": preferences}, cookies=cookies)

# Save the dictionary to files
json.dump(
    {"features": {"adult": myobj, "lendingclub": myobj_lending}, "preferences": preferences},
    open("request.json", "w"),
    indent=4, separators=(", ", ": "), sort_keys=True
)

# Save cookies to file
json.dump(
    cookies,
    open("cookies.json", "w"),
    indent=4, separators=(", ", ": "), sort_keys=True
)



# Print the answer
print("[*] POST ANSWER")
print(pprint.pformat(x.json()))
print()

json.dump(
    x.json(),
    open("response.json", "w"),
    indent=4, separators=(", ", ": "), sort_keys=True
)