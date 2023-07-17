from recourse_fare.environment_w import EnvironmentWeights

from collections import OrderedDict
from typing import Any

import pandas as pd
import numpy as np

import torch
import torch.nn as nn
import torch.nn.functional as F

""" 
loan_amnt
term
installment
emp_length
home_ownership
annual_inc
verification_status
pymnt_plan
purpose
open_acc
total_acc
application_type
annual_inc_joint
acc_now_delinq
tot_cur_bal
total_cu_tl
mort_acc
num_actv_bc_tl
num_actv_rev_tl
num_op_rev_tl
num_rev_accts
percent_bc_gt_75
pub_rec_bankruptcies
hardship_flag
hardship_status
debt_settlement_flag
"""

class LendingClubEnvironment(EnvironmentWeights):
    """ Simple class showcasing how to build an environment to play with FARE
    """

    def __init__(self, features: dict, weights: dict, model: Any,
                 preprocessor: Any,
                 remove_edges: list=None,
                 agnostic: bool=False,
                 model_type="svc",
                 user_constraints: dict={}):
        
        self.model_type = model_type
        self.agnostic = agnostic
        self.user_constraints = user_constraints

        # Preprocessor element. Please have a look below to understand how it is called.
        self.preprocessor = preprocessor

        # The maximum length of an intervention. It considers also the STOP action.
        # It should be min(n_of_actions, feature/2).
        self.max_intervention_depth = 10

        # Dictionary specifying, for each action, the corresponding implementation of
        # such action in the environment.
        self.prog_to_func = OrderedDict(sorted({'STOP': self._stop,
                                                'loan_amnt': self._loan_amnt,
                                                'term': self._term,
                                                'installment': self._installment,
                                                'emp_length': self._emp_length,
                                                'home_ownership': self._home_ownership,
                                                'annual_inc': self._annual_inc,
                                                'verification_status': self._verification_status,
                                                #'pymnt_plan': self._pymnt_plan,
                                                'purpose': self._purpose,
                                                'open_acc': self._open_acc,
                                                'total_acc': self._total_acc,
                                                'application_type': self._application_type,
                                                #'annual_inc_joint': self._annual_inc_joint,
                                                'acc_now_delinq': self._acc_now_delinq,
                                                'tot_cur_bal': self._tot_cur_bal,
                                                'total_cu_tl': self._total_cu_tl,
                                                'mort_acc': self._mort_acc,
                                                'num_actv_bc_tl': self._num_actv_bc_tl,
                                                'num_actv_rev_tl': self._num_actv_rev_tl,
                                                'num_op_rev_tl': self._num_op_rev_tl,
                                                'num_rev_accts': self._num_rev_accts,
                                                'percent_bc_gt_75': self._percent_bc_gt_75,
                                                'pub_rec_bankruptcies': self._pub_rec_bankruptcies,
                                                'hardship_flag': self._hardship_flag,
                                                #'hardship_status': self._hardship_status,
                                                'debt_settlement_flag': self._debt_settlement_flag,
                                                'last_fico_range_high': self._last_fico_range_high,
                                                'last_fico_range_low': self._last_fico_range_low
                                                }.items()))
        
        # Dictionary specifying, for each action, the corresponding precondition which needs 
        # to be verified to be able to apply such action. For example, if I already have a bachelor's
        # degree, the action "change_education(high-school diploma)" would be meaningless.
        self.prog_to_precondition = (None)

        # Function which validate the environment and it checks if we reached recourse.
        self.prog_to_postcondition = self._intervene_postcondition

        # Programs library. It contains all the available actions the user can perform. For each action, we need to
        # specify three things: the index (it goes from 0 to n), the level and the argument type that function accepts.
        #
        # Here we have two small caveats:
        #  * level: 1 represent the program we want to learn (INTERVENE), 0 represents the action we can take and
        # -1 represents the stop action, which is called to signal the termination of an intervention;
        # * The program library MUST contain the STOP and INTERVENE programs as defined below;
        self.programs_library = OrderedDict(sorted({'STOP': {'index': 0, 'level': -1, 'args': 'NONE'},
                                                    'loan_amnt': {'index': 1, 'level': 0, 'args': 'loan_amnt'},
                                                    'term': {'index': 2, 'level': 0, 'args': 'term'},
                                                    'installment': {'index': 3, 'level': 0, 'args': 'installment'},
                                                    'emp_length': {'index': 4, 'level': 0, 'args': 'emp_length'},
                                                    'home_ownership': {'index': 5, 'level': 0, 'args': 'home_ownership'},
                                                    'annual_inc': {'index': 6, 'level': 0, 'args': 'annual_inc'},
                                                    'verification_status': {'index': 7, 'level': 0, 'args': 'verification_status'},
                                                    #'pymnt_plan': {'index': 8, 'level': 0, 'args': 'pymnt_plan'},
                                                    'purpose': {'index': 8, 'level': 0, 'args': 'purpose'},
                                                    'open_acc': {'index': 9, 'level': 0, 'args': 'open_acc'},
                                                    'total_acc': {'index': 10, 'level': 0, 'args': 'total_acc'},
                                                    'application_type': {'index': 11, 'level': 0, 'args': 'application_type'},
                                                    #'annual_inc_joint': {'index': 13, 'level': 0, 'args': 'LOAN'},
                                                    'acc_now_delinq': {'index': 12, 'level': 0, 'args': 'acc_now_delinq'},
                                                    'tot_cur_bal': {'index': 13, 'level': 0, 'args': 'tot_cur_bal'},
                                                    'total_cu_tl': {'index': 14, 'level': 0, 'args': 'total_cu_tl'},
                                                    'mort_acc': {'index': 15, 'level': 0, 'args': 'mort_acc'},
                                                    'num_actv_bc_tl': {'index': 16, 'level': 0, 'args': 'num_actv_bc_tl'},
                                                    'num_actv_rev_tl': {'index': 17, 'level': 0, 'args': 'num_actv_rev_tl'},
                                                    'num_op_rev_tl': {'index': 18, 'level': 0, 'args': 'num_op_rev_tl'},
                                                    'num_rev_accts': {'index': 19, 'level': 0, 'args': 'num_rev_accts'},
                                                    'percent_bc_gt_75': {'index': 20, 'level': 0, 'args': 'percent_bc_gt_75'},
                                                    'pub_rec_bankruptcies': {'index': 21, 'level': 0, 'args': 'pub_rec_bankruptcies'},
                                                    'hardship_flag': {'index': 22, 'level': 0, 'args': 'hardship_flag'},
                                                    #'hardship_status': {'index': 25, 'level': 0, 'args': 'LOAN'},
                                                    'debt_settlement_flag': {'index': 23, 'level': 0, 'args': 'debt_settlement_flag'},
                                                    'last_fico_range_high': {'index': 24, 'level': 0, 'args': 'last_fico_range_high'},
                                                    'last_fico_range_low': {'index': 25, 'level': 0, 'args': 'last_fico_range_low'},
                                                    'INTERVENE': {'index': 26, 'level': 1, 'args': 'NONE'}}.items()))

        # The available arguments. For each type, we need to specify a list of potential values. Each action will be
        # tied to the correspoding type. 
        # The arguments need to contain the NONE type, with a single value 0.
        self.arguments = OrderedDict(
            sorted(
                {
                    "NONE": [0],
                    "annual_inc": list(np.linspace(1.0, 300622.49678082764, num=100)),
                    "loan_amnt": list(np.arange(1000, 40000, step=780.0)) + list(np.arange(-1000, -40000, step=-780.0)),
                    "term": ['60 months', '36 months'],
                    "installment": list(np.linspace(30.12, 1719.83, num=50)) + list(np.linspace(-30.12, -1719.83, num=50)),
                    "emp_length": ['< 1 year', '10+ years', '8 years', '6 years', '5 years', '9 years', '3 years', '2 years', '7 years', '4 years', '1 year'],
                    "home_ownership": ['RENT', 'MORTGAGE', 'OWN', 'ANY'],
                    "verification_status": ['Not Verified', 'Source Verified', 'Verified'],
                    "purpose": ['debt_consolidation', 'credit_card', 'car', 'major_purchase', 'other', 'home_improvement', 'medical', 'house', 'small_business', 'moving', 'vacation', 'renewable_energy', 'wedding'],
                    "open_acc": list(np.arange(1, 93, step=2.0)) + list(np.arange(-1, -93, step=-2.0)),
                    "total_acc": list(np.arange(2, 165, step=4.0)) + list(np.arange(-2, -165, step=-4.0)),
                    "application_type": ['Joint App', 'Individual'],
                    "acc_now_delinq": list(np.arange(1, 3, step=1.0)) + list(np.arange(-1, -3, step=-1.0)),
                    "tot_cur_bal": list(np.arange(1, 4348538, step=86971.0)) + list(np.arange(-1, -4348538, step=-86971.0)),
                    "total_cu_tl": list(np.arange(1, 65, step=2.0)) + list(np.arange(-1, -65, step=-2.0)),
                    "mort_acc": list(np.arange(1, 41, step=1.0)) + list(np.arange(-1, -41, step=-1.0)),
                    "num_actv_bc_tl": list(np.arange(1, 33, step=1.0)) + list(np.arange(-1, -33, step=-1.0)),
                    "num_actv_rev_tl": list(np.arange(1, 60, step=2.0)) + list(np.arange(-1, -60, step=-2.0)),
                    "num_op_rev_tl": list(np.arange(1, 91, step=2.0)) + list(np.arange(-1, -91, step=-2.0)),
                    "num_rev_accts": list(np.arange(2, 151, step=3.0)) + list(np.arange(-2, -151, step=-3.0)),
                    "percent_bc_gt_75": list(np.linspace(1, 100.0, num=50)) + list(np.linspace(-1, -100.0, num=50)),
                    "pub_rec_bankruptcies": list(np.arange(1, 7, step=1.0)) + list(np.arange(-1, -7, step=-1.0)),
                    "last_fico_range_low": list(np.arange(1, 845, step=17.0)) + list(np.arange(-1, -845, step=-17.0)),
                    "last_fico_range_high": list(np.arange(1, 850, step=17.0)) + list(np.arange(-1, -850, step=-17.0)),
                    "hardship_flag": ['Y', 'N'],
                    "debt_settlement_flag": ['N', 'Y'],
                }.items()
            )
        )

        self.program_feature_mapping = {"":1}

        # Call parent constructor
        super().__init__(features, weights, None, model, self.prog_to_func, self.prog_to_precondition, self.prog_to_postcondition,
                         self.programs_library, self.arguments, self.max_intervention_depth, prog_to_cost=None,
                         program_feature_mapping=self.program_feature_mapping
                         )

    # Some utilites functions

    def reset_to_state(self, state):
        self.features = state.copy()

    def get_stop_action_index(self):
        return self.programs_library["STOP"]["index"]

    ### PRECONDITIONS

    def can_be_called(self, program_index, args_index):

        if args_index == None:
            return False

        program = self.get_program_from_index(program_index)
        args = self.complete_arguments.get(args_index)

        mask_over_args = self.get_mask_over_args(program_index)
        if mask_over_args[args_index] == 0:
            return False
        
        if program == "STOP":
            return True
        
        if isinstance(args, str):
            type_args = self.programs_library.get(program).get("args")
            return self._check_user_categorical_constraints(program, args, type_args)
        else:
            return self._check_user_continuous_constraints(program, args)

    ### ACTIONS

    def _last_fico_range_high(self, arguments=None):
        self.features["last_fico_range_high"] += arguments
    
    def _last_fico_range_low(self, arguments=None):
        self.features["last_fico_range_low"] += arguments

    def _hardship_flag(self, arguments=None):
        self.features["hardship_flag"] = arguments
    
    def _hardship_status(self, arguments=None):
        self.features["hardship_status"] += arguments
    
    def _debt_settlement_flag(self, arguments=None):
        self.features["debt_settlement_flag"] = arguments

    def _num_actv_bc_tl(self, arguments=None):
        self.features["num_actv_bc_tl"] += arguments
    
    def _num_actv_rev_tl(self, arguments=None):
        self.features["num_actv_rev_tl"] += arguments
    
    def _num_op_rev_tl(self, arguments=None):
        self.features["num_op_rev_tl"] += arguments
    
    def _percent_bc_gt_75(self, arguments=None):
        self.features["percent_bc_gt_75"] += arguments
    
    def _num_rev_accts(self, arguments=None):
        self.features["num_rev_accts"] += arguments
    
    def _pub_rec_bankruptcies(self, arguments=None):
        self.features["pub_rec_bankruptcies"] += arguments

    def _application_type(self, arguments=None):
        self.features["application_type"] = arguments
    
    def _annual_inc_joint(self, arguments=None):
        self.features["annual_inc_joint"] += arguments
    
    def _acc_now_delinq(self, arguments=None):
        self.features["acc_now_delinq"] += arguments
    
    def _mort_acc(self, arguments=None):
        self.features["mort_acc"] += arguments
    
    def _tot_cur_bal(self, arguments=None):
        self.features["tot_cur_bal"] += arguments
    
    def _total_cu_tl(self, arguments=None):
        self.features["total_cu_tl"] += arguments

    def _loan_amnt(self, arguments=None):
        self.features["loan_amnt"] += arguments
    
    def _term(self, arguments=None):
        self.features["term"] = arguments
    
    def _installment(self, arguments=None):
        self.features["installment"] += arguments
    
    def _emp_length(self, arguments=None):
        self.features["emp_length"] = arguments
    
    def _home_ownership(self, arguments=None):
        self.features["home_ownership"] = arguments
    
    def _annual_inc(self, arguments=None):
        self.features["annual_inc"] += arguments
    
    def _pymnt_plan(self, arguments=None):
        self.features["pymnt_plan"] += arguments
    
    def _verification_status(self, arguments=None):
        self.features["verification_status"] = arguments

    def _purpose(self, arguments=None):
        self.features["purpose"] = arguments
    
    def _open_acc(self, arguments=None):
        self.features["open_acc"] += arguments
    
    def _total_acc(self, arguments=None):
        self.features["total_acc"] += arguments

    def _stop(self, arguments=None):
        return True


    ### POSTCONDITIONS
    def _intervene_postcondition(self, init_state, current_state):
        # We basically check if the model predicts a 0 (which means
        # recourse) given the current features. We discard the 
        # init_state
        obs = self.preprocessor.transform(
            pd.DataFrame.from_records(
                [current_state]
            )
        )
        if self.model_type != "nn":
            return self.model.predict(obs)[0] == 1
        else:
            with torch.no_grad():
                self.model.eval()
                output = self.model(torch.FloatTensor(obs)).round().numpy()
                return output[0][0] == 1

    ## OBSERVATIONS
    def get_observation(self):
        obs = self.preprocessor.transform_dict(self.features)
        if self.agnostic:
             return torch.FloatTensor(obs)
        else:
            costs = self.get_list_of_costs()
            return torch.FloatTensor(np.concatenate([obs, costs]))

       # CUSTOM COST
    def get_cost(self, program_index: int, args_index: int):
        
        # Get a copy of the previous state
        prev_state = self.features.copy()

        # Get action name and arguments
        program = self.idx_to_prog.get(program_index)
        argument = self.complete_arguments.get(args_index)

        # Compute the cost only if the action is different than the cost
        if program == "STOP":
            return 1
        
        # Get the feature we are going to change
        # HERE WE DO NOT NEED THE MAPPING
        feature_name = program

        if isinstance(self.features.get(feature_name), int) or isinstance(self.features.get(feature_name), float):

            old_value = self.features.get(feature_name)

            # Perform the action on the environment
            # We avoid using act() because of a dangerous recoursion loop.
            self.has_been_reset = True
            self.prog_to_func[program](argument)

            # Get the new value of the feature
            resulting_value = self.features.get(feature_name)

            # Action cost 
            action_cost = self.weights.get(feature_name) * np.log(1+np.abs(resulting_value-old_value))

        else:
            # If it is categorical, then we just return the feature cost
            action_cost = self.weights.get(feature_name)

        # Reset the previous environment
        self.features = prev_state

        return action_cost
    
    # USER CONSTRAINTS
    def _check_user_categorical_constraints(self, feature_name: str, argument: str, argument_type: str):

        default_values = self.arguments.get(argument_type)
        preferred_list = self.user_constraints.get(feature_name, {}).get("acceptable_values", default_values)

        return self.features.get(feature_name) != argument and argument in preferred_list

    def _check_user_continuous_constraints(self, feature_name: str, argument):

        max_value = self.user_constraints.get(feature_name, {}).get("max_value", np.inf)
        min_value = self.user_constraints.get(feature_name, {}).get("min_value", 0)

        return min_value <= self.features.get(feature_name)+argument <= max_value and argument != 0.0