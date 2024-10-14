import numpy as np
import scipy
from tqdm import tqdm

import copy

from recourse_fare.utils.functions import compute_intervention_cost

class Sampler():

    def __init__(self, nodes, nparticles=100, temperature=0.9):

        self.nodes = nodes
        self.datasets = [k for k in nodes.keys()]
        self.nparticles = nparticles
        self.temperature = temperature
    
        self.prior = {k: scipy.stats.multivariate_normal(np.zeros(len(nodes.get(k))), np.fill_diagonal(np.zeros((len(nodes.get(k)), len(nodes.get(k)))), 1)) for k in self.datasets}

        self.current_particles = []
        self.particles_likelihood = []
        self.constraints = []
    
    def _convert_weights(self, w: np.array, dataset: str):
        return {k:v for k,v in zip(self.nodes.get(dataset), w)}

    def log_prior_mu(self, w: np.array, dataset):
        assert w is not None
        return self.prior.get(dataset).pdf(w)
    
    def log_boundaries(self, w_weights, constraints, env, dataset):
        if not all([v != 0.0 for v in w_weights]):
            return -np.inf
        w = {k: v for k, v in zip(self.nodes.get(dataset), w_weights)}
        return self.log_likelihood(w, constraints, env)

    def log_likelihood(self, w, constraints, env):

        # Initialize probability. Since we are directly summing the log probabilities,
        # this must be zero at the beginning.
        probability = 0

        # Evaluate the consistency of these weights with the linear constraints
        for best_intervention, choices in constraints:

            # No other choices, the user picks only one action
            if len(choices) == 1:
                continue
            
            # Compute the cost given the weights
            md = [compute_intervention_cost(env, current_env, intervention, w)[0] for intervention, current_env in choices]

            # Get intervention of the best choice
            best_intervention_idx = -1
            for i, (current_best_int, current_env) in enumerate(choices):
                if str(current_best_int) == str(best_intervention):
                    best_intervention_idx = i
                    break
            assert best_intervention_idx != -1
            
            # Compute the best action for this user
            md = -self.temperature * np.array(md)
            md = md - md.max()
            md = [np.exp(m) for m in md]
            total_cost = np.sum(md)
            probabilitiy_choices = [(c / total_cost) for c in md]

            if probabilitiy_choices[best_intervention_idx] > 0:
                probability += np.log(probabilitiy_choices[best_intervention_idx])
            else:
                probability = -np.inf
                break

        return probability if np.isfinite(probability) else -np.inf

    def logpost(self, w, constraints, env, dataset):
        lp = self.log_boundaries(w, constraints, env, dataset)
        if not np.isfinite(lp):
            return -np.inf
        return self.log_prior_mu(w, dataset) + lp

    def get_mean_high_likelihood_particles(self, dataset):

        if len(self.current_particles) == 0:
            print("Empty current particles when getting the mean.")
            return None

        if len(self.particles_likelihood) == 0:
            print("Empty precomputed likelihood when getting the mean.")
            return None

        particles_likelihood = list(zip(
            self.current_particles, self.particles_likelihood
        ))
        particles_likelihood = sorted(particles_likelihood, key=lambda x: x[1], reverse=True)
        particles_likelihood = particles_likelihood[0:25]
        particles_likelihood = [x[0] for x in particles_likelihood]

        particle_mean = np.mean(particles_likelihood, axis=0).tolist()
        return {k:v for k,v in zip(self.nodes.get(dataset), particle_mean)} 

    def sample(self, constraints, envs, user_difficulty=None, keep=False):

        new_particles = {}

        for dataset in self.datasets:

            # Get the corresponding constraints/values for each dataset
            env = envs.get(dataset)
            self.constraints = constraints.get(dataset)

            # Generating starting points
            self.start = []

            # Reset the current particles
            self.current_particles = []

            if len(self.current_particles) < self.nparticles:
                max_retries = 100
                while(len(self.current_particles) < self.nparticles and max_retries > 0):
                    w_current = self.prior.get(dataset).rvs(self.nparticles)
                    
                    # Rescale the weights if the user specified some difficulty
                    if user_difficulty:
                        w_current = {k: v for k, v in zip(self.nodes.get(dataset), w_current)}
                        for k in user_difficulty.get(dataset, {}):
                            w_current[k] = w_current.get(k)*user_difficulty.get(dataset).get(k)
                        w_current = [v for k,v in w_current.items()]

                    w_current = list(filter(
                        lambda wx: np.isfinite(self.logpost(wx, self.constraints, copy.deepcopy(env), dataset)),
                        tqdm(w_current)
                    ))
                    self.current_particles += w_current
                    max_retries -= 1
            else:
                w_current = self.current_particles
            
            print("\nFound particles: ", len(self.current_particles))
            
            if len(self.current_particles) < self.nparticles:
                return None, None
            else:
                np.random.shuffle(self.current_particles)
                self.current_particles = self.current_particles[0:self.nparticles]

            # Compute the likelihood for each particle (for this case is equal to the pdf, in case of the logistic noise is different)
            self.particles_likelihood = [self.logpost(p, self.constraints, copy.deepcopy(env), dataset) for p in self.current_particles]

            new_particles[dataset] = self.get_mean_high_likelihood_particles(dataset)
        
        return new_particles