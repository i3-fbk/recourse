import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useLocation } from 'react-router-dom';
import './keepPlan.css';




function PlanAccepted() {

    const location = useLocation();
    const planInformation = location.state;



    return <Grid>
      {/* <p className="MainTitle">{planInformation?.planName} Accepted</p> */}
      <h5 className="subtitleForMaintitle">Now you can keep go on with this plan for getting the loan approaval.</h5>
     
      <Grid className="layout">
           
        <div className="card-container">
       
        { planInformation.map((item,index) => (
                      <div key={index} className="PlanData">
                      <span className="dataTitle">{item?.name}</span>
                          <div className="innerDisplayNewPlan">
                              {/* <span><ArrowUpwardRoundedIcon fontSize="large" className={item.valueInc ? "upwardArrow" : "downward"} /></span>  */}
                              <span className="dataAmount">{item?.valueBefore}</span>
                              <span><ArrowRightAltIcon /></span>
                              <span className="dataAmount">{item?.valueAfter}</span>
                          </div>
                      </div>
                  ))}
        </div>

      </Grid>
      <Grid className="initButtonContainer">
        {/* <button className="GotoRecourseButton">Export</button> */}
      </Grid>
       
    </Grid>
     
}

export default PlanAccepted