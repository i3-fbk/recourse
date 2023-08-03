# Recourse
This is a financial planning system that generates custom plans to help users achieve their financial goals, such as getting a loan approval from a bank. It uses  machine learning techniques to provide tailored AI based solutions.

## Description `short Instruction - How Run the App`
### For running the frontend
It requires NodeJS >= 14.0.
To run the code, you can follow these instructions:

- Clone the repository by command: ``` git clone https://github.com/delaramesfahani/Recourse.git ```
- In the root directory of the application you can serve the app with the following commands:
- For installing the node packages: ``` npm install ``` or ``` npm i ```
- To start the Front end : ``` npm start ```

### For running the backend
```bash
conda create --name recourse python=3.7
pip install -r requirements.txt
git clone https://github.com/unitn-sml/recourse-fare.git
cd recourse-fare
git checkout feature/add-w-fare 
pip install -e .
cd ..
```
The backend can then be run as:
```bash
export PYTHONPATH=.
flask --app backend/server.py run
```

### JSON File: `Config.json`

The configuration file is a JSON file designed to be compatible with various datasets having a similar structure. Currently, it includes features from the "Adult Census Income" and "Lending Clubs". However, due to its flexible design, this file can seamlessly integrate with other datasets sharing the same structure.

Here's an example of the file structure:

```json
 "features": {
            "education": {
                "dataset": "adult",
                "display_name": "Education",
                "description": "Level of education of the user (e.g., Bachelor)",
                "type": "categorical",
                "actionable": true,
                "values": ["Preschool", "1st-4th", "5th-6th"]
            },
            "capital_gain": {
                "dataset": "adult",
                "display_name": "Income",
                "description": "Self-reported yearly income",
                "type": "numerical",
                "actionable": true,
                "min_value": 0,
                "max_value": 10000
            },
```

- dataset: The source dataset for this feature (Adult Census Income).
- display_name: Human-readable display name (Education).
- description: A brief description of the feature (Level of education of the user).
- type: The type of data (categorical or numerical).
- actionable: Indicates if this feature is actionable (true).
- values: An array of possible values (["Preschool", "1st-4th", ..., "Prof-school"]).

Actionable features encompass the information that users can modify, such as details pertaining to their bank account. These features provide the flexibility for users to update and alter the values as needed.

On the other hand, Non-Actionable (```"actionable": false```) features consist of attributes that remain unchangeable by the user, like their age. These features are inherently fixed and cannot be modified through user interaction.

The presence of both Actionable and Non-Actionable features within the config.json file allows for the management of dynamic and static user data, providing a comprehensive representation of the dataset.

