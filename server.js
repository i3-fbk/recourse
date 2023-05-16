
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5001;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is runnig on port 5001!');
});


// Route to handle JSON data
  app.post('/submit-form',async (req, res) => {

  // Simulate a 5-second delay
  await delay(3000);

  // res.send('Data received!');
  const feedback = {
    planName: 'Plan B',
    features: [
      {
        "name": "Revolving Balance",
        "valueBefore" : 11001,
        "valueAfter" : 11943,
        "valueDiff" : 943,
        "valueInc" : true,
        "type": "numeric"
      },
      {
        "name": "Fico Score",
        "valueBefore" : 600,
        "valueAfter" : 680,
        "valueDiff" : 6,
        "valueInc" : true,
        "type": "numeric"
      },
      {
        "name": "Loan Amount",
        "valueBefore" : "15K",
        "valueAfter" : "13K",
        "valueDiff" : "12K",
        "valueInc" : false,
        "type": "string"
      },
      {
        "name": "Credit Utilization",
        "valueBefore" : 57,
        "valueAfter" : 54,
        "valueDiff" : 3,
        "valueInc" : false,
        "type": "numeric"
      },
      {
        "name": "Annual Income",
        "valueBefore" : "61K",
        "valueAfter" : "65K",
        "valueDiff" : "4K",
        "valueInc" : true,
        "type": "string"
      }
    ]
  };

   // Send the feedback message back to the client as JSON
   res.json({ feedback });

});


 // Utility function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

 
 
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// const express = require('express');

// const app = express();
// const port = process.env.PORT || 5001;

// app.get('/', (req, res) => {
//   res.send('Hello, world!!!');
// });

// app.listen(port, () => {
 
//   console.log(`Server running on port ${port}`);
// });