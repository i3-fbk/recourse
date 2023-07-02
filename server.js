

const express = require('express');
const initJson = require('./initData.json');
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors')
const app = express();
app.use(cors())


const port = process.env.PORT || 5001;
app.use(express.static(path.join(__dirname, 'build')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));

  // res.send('Server is runnig on port 5002!');
});


// Route to handle JSON data

  app.post('/login',async (req, res) => {

    const feedback = initJson
    res.json({ feedback });
  })

  app.post('/receivingInitialData',async (req, res) => {

    const feedback = initJson
    res.json({ feedback });
  })

  app.post('/submit-form',async (req, res) => {

  // Simulate a 5-second delay
  await delay(3000);

  // This sample json is just a static data that server send back to the interface as a feedback.
  const feedback = {
    planId : "#02",
    userId : "#",
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
