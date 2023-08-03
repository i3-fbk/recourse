import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useLocation } from 'react-router-dom';
import buttonLabels from "../buttonLabels.js";
import './keepPlan.css';




function PlanAccepted() {

    const location = useLocation();
    const planInformation = location.state;
    const [language, setLanguage] = useState("en"); // Default language is English



    return <Grid>
     <h3 style={{display: 'flex', marginLeft: '80px'}}>Keeping plan</h3>
      <h5 className="subtitleForMaintitle">You chose to keep this below plan for getting loan approval.</h5>
     
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
        <button className="GotoRecourseButton">
          {buttonLabels[language].start_another_plan}
        </button>
      </Grid>
       
    </Grid>
     
}

export default PlanAccepted