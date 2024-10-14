import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useLocation } from 'react-router-dom';
import buttonLabels from "../buttonLabels.js";
import configuration from "../../config.json";
import './keepPlan.css';




function PlanAccepted() {

    const location = useLocation();
    const planInformation = location.state;
    const CONFIG = configuration?.loan_approval_task;
    const [language, setLanguage] = useState("en"); // Default language is English



    return <Grid>
     <h3 style={{display: 'flex', marginLeft: '80px'}}>Keeping plan</h3>
      <h5 className="subtitleForMaintitle">Thank you for using this platform, You can continue following this plan to work towards getting the loan approval.</h5>
     
      <Grid className="layout">
           
        <div className="card-container">
       
        { planInformation?.map((item,index) => (
                      <div key={index} className="PlanDataV1">
                      <span className="dataTitle">{item?.name}</span>
                          <div className="innerDisplayNewPlan">
                              {/* <span><ArrowUpwardRoundedIcon fontSize="large" className={item.valueInc ? "upwardArrow" : "downward"} /></span>  */}
                              <span className="dataAmountV1">{CONFIG?.features[item.name]?.valuesWithLabel ? CONFIG?.features[item.name]?.valuesWithLabel[item.valueBefore] : item.valueBefore}</span>
                              <span><ArrowRightAltIcon /></span>
                              <span className="dataAmountV1">{CONFIG?.features[item.name]?.valuesWithLabel ? CONFIG?.features[item.name]?.valuesWithLabel[item.valueAfter] : item.valueAfter}</span>
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