import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import "./discardedPlans.css";
import CONFIG from "../../config.json";

function DiscardedPlans(props) {
  const {History, statusGenerator, status} = props
  const dataset = CONFIG.loan_approval_task.features;


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
                    <div key={inx} className="PlanDataV1">
                      <span className="dataTitle">{element.name}</span>
                      <div className="innerDisplayNewPlan">
                        <span className="dataAmountV1">
                          {dataset[element.name].valuesWithLabel ? dataset[element.name].valuesWithLabel[element.valueBefore] : element.valueBefore}
                        </span>
                        <span>
                          <ArrowRightAltIcon />
                        </span>
                        <span className="dataAmountV1">{dataset[element.name].valuesWithLabel ? dataset[element.name].valuesWithLabel[element.valueAfter] : element.valueAfter}</span>
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
