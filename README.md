# Recourse
This is a financial planning system that generates custom plans to help users achieve their financial goals, such as getting a loan approval from a bank. It uses data analysis and machine learning techniques to provide tailored solutions.

## JSON File: `initData.json`

The initData.json file encompasses an array of objects, where each object serves as a data entry. Within the file, there are two distinct types of objects: Actionable and Non-Actionable features. These types categorize the nature of the features and define the user's ability to modify their values.

Actionable features encompass the information that users can modify, such as details pertaining to their bank account. These features provide the flexibility for users to update and alter the values as needed.

On the other hand, Non-Actionable features consist of attributes that remain unchangeable by the user, including their name, age, and gender. These features are inherently fixed and cannot be modified through user interaction.

The presence of both Actionable and Non-Actionable features within the initData.json file allows for the management of dynamic and static user data, providing a comprehensive representation of the dataset.

Here's an example of the file structure:

```json
[
   {
       "name" : "Username",
       "value" : "joe",
       "actionable" : false
   },
   {
       "name" : "Age",
       "value" : "30",
       "actionable" : false
   },
   {
       "name" : "Annual income",
       "value" : 61000,
       "actionable" : true
   }
]

