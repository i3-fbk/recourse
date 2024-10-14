import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useLocation } from 'react-router-dom';
import './planAccepted.css';
import configuration from "../../config.json";



function PlanAccepted() {

    const location = useLocation();
    const planInformation = location.state;
    const CONFIG = configuration?.loan_approval_task;

    return <Grid>
      <p className="MainTitle">{planInformation?.planName} Accepted</p>
      <h5 className="subtitleForMaintitle">Thank you for using this platform, You can continue following this plan to work towards getting the loan approval.</h5>
     
      <Grid className="layout">
           
        <div className="card-container">
       
        { planInformation?.details.map((item,index) => (
                      <div key={index} className="PlanData">
                      <span className="dataTitle">{item?.name}</span>
                          <div className="innerDisplayNewPlan">
                              {/* <span><ArrowUpwardRoundedIcon fontSize="large" className={item.valueInc ? "upwardArrow" : "downward"} /></span>  */}
                              <span className="dataAmount">{CONFIG?.features[item.name]?.valuesWithLabel ? CONFIG?.features[item.name]?.valuesWithLabel[item.valueBefore] : item.valueBefore}</span>
                              <span><ArrowRightAltIcon /></span>
                              <span className="dataAmount">{CONFIG?.features[item.name]?.valuesWithLabel ? CONFIG?.features[item.name]?.valuesWithLabel[item.valueAfter] : item.valueAfter}</span>
                          </div>
                      </div>
                  ))}
        </div>

      </Grid>
      <Grid className="initButtonContainer">
        <button className="GotoRecourseButton">Start new plan</button>
      </Grid>
       
    </Grid>
     
}

export default PlanAccepted