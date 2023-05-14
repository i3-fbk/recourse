import React,{useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import "./discardedPlans.css"




function DiscardedPlans(props) {

  

    return(
        <Grid className="layoutDiscard">
            <div className="discardedPlansTitle">
                <div className="planTitle">Plan A</div>
                <div className="discardedPlansStatus">😃 Good</div>
            </div>
           
            <Grid  item xs={4} className="innerLayout">
            { props && props.discardedPlans.map((item,index) => (
                      <div key={index} className="PlanData">
                      <span className="dataTitle">{item.name}</span>
                          <div className="innerDisplayNewPlan">
                              <span><ArrowUpwardRoundedIcon fontSize="large" className={item.valueInc ? "upwardArrow" : "downward"} /></span> 
                              <span className="dataAmount">{item.valueBefore}</span>
                              <span><ArrowRightAltIcon /></span>
                              <span className="dataAmount">{item.valueAfter}</span>
                          </div>
                      </div>
                  ))}
            </Grid>
        </Grid>
    )
}

export default DiscardedPlans;