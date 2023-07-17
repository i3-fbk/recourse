from recourse_fare.user.user import User
from recourse_fare.utils.functions import compute_intervention_cost

import numpy as np

class LogisticNoiseUser(User):

    def __init__(self, temperature: float=0.9):
        self.temperature = temperature
        super().__init__()

    def compute_probabilities(self, env, choice_set, custom_weights):

        intervention_cost_values = []
        intervention_cost_values_original = []
        for _, _, intervention, current_env, _ in choice_set:
            int_cost_tmp, _ = compute_intervention_cost(env, current_env, intervention, custom_weights)
            intervention_cost_values.append(-self.temperature*int_cost_tmp)
            intervention_cost_values_original.append(int_cost_tmp)
        
        intervention_cost_values = np.array(intervention_cost_values)

        intervention_cost_values -= intervention_cost_values.max()
        cost_values = [np.exp(c) for c in intervention_cost_values]
        total_cost = np.sum(cost_values)

        probabilities = [(c / total_cost) for c in cost_values]

        # If we need to rescale, then we rescale the probabilities
        probabilities = np.array(probabilities).astype(float)

        return probabilities, intervention_cost_values_original