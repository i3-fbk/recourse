import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import "./discardedPlans.css";

function DiscardedPlans() {
  const [History, setHistory] = useState([])
  const [status, setStatus] = useState([])

 
  useEffect(() => {
    const retrievedData = localStorage.getItem("planHistory");
    let planStatus = localStorage.getItem("status");
    
    try {
      if (retrievedData !== null) {
        const saved = JSON.parse(retrievedData);
        setHistory(saved?.RecoursePreviousPlans?.plan)

        planStatus = planStatus && JSON.parse(planStatus)
        setStatus(planStatus)
      }
    } catch (error) {
      // Handle any potential errors
      console.error("Error retrieving data from Local Storage:", error);
    }
  }, []);



  const statusGenerator = (status) => {
    if (status) {
      switch (status) {
        case 1:
          return "😣 Terrible";

        case 2:
          return "🙁 Bad";

        case 3:
          return "😶 Neutral";

        case 4:
          return "😃 Good";

        case 5:
          return "😍 Great";

        default:
          break;
      }
    }
  };

  function generatePlanName(number) {

    switch (number) {
      case 0:
        return "Plan A";
      case 1:
        return "Plan B";
      case 2:
        return "Plan C";
      case 3:
        return "Plan D";
      case 4:
        return "Plan E";
      case 5:
        return "Plan F";
      case 6:
        return "Plan G";
      // Add more cases for additional numbers if needed
      default:
        return "Unknown Plan";
    }
  }


  return (
    <div>
      {History.length > 0 ?
        History.map((plans, index) => (
          <Grid key={index} className="layoutDiscard">
            <Grid item xs={4} className="HistoryinnerLayout">
              <div className="discardedPlansTitle">
                <div className="planTitle">{generatePlanName(index)}</div>
                <div className="discardedPlansStatus">{statusGenerator(status[index])}</div>
              </div>
              <div className="historyDetails">
                {plans?.map((item) =>
                  item?.features?.map((element,inx) => (
                    <div key={inx} className="PlanData">
                      <span className="dataTitle">{element.name}</span>
                      <div className="innerDisplayNewPlan">
                        <span className="dataAmount">
                          {element.valueBefore}
                        </span>
                        <span>
                          <ArrowRightAltIcon />
                        </span>
                        <span className="dataAmount">{element.valueAfter}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Grid>
          </Grid>
        )):  <p className="emptyMessage">The history list is empty!</p>}
    </div>
  );
}


export default DiscardedPlans;
