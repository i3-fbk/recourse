import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './initPage.css';



function InitPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // initJson is a data that passed from login page.
    const initJson = location.state;
    const [actionable, setActionable] = useState([]);
    const [nonActionable, setNonActionable] = useState([]);
    const [features, setFeatures] = useState()


   
    // features that user can modify them every time saves in "actionableFeatures"
    // const actionableFeatures = features.filter(feature => feature.actionable);

    // features that user can NOT modify them later saves in "nonActionableFeatures"
    // const nonActionableFeatures = features.filter(feature => !feature.actionable);
   
   

    // useEffect(() => {
    //     setActionable(actionableFeatures);
    //     setNonActionable(nonActionableFeatures);
    //     setUsername(initJson.feedback?.userId)
    // }, [])
    
    useEffect(() => {
      if(initJson) {
        setFeatures({
          age: initJson.adult.age,
          capital_gain: initJson.adult.capital_gain,
          capital_loss: initJson.adult.capital_loss,
          education: initJson.adult.education ,
          hours_per_week: initJson.adult.hours_per_week,
          marital_status: initJson.adult.marital_status,
          native_country: initJson.adult.native_country,
          occupation: initJson.adult.occupation,
          race: initJson.adult.race,
          relationship: initJson.adult.relationship,
          sex: initJson.adult.sex,
          workclass: initJson.adult.workclass
        })
      }

    }, [])
    


    const GotoRecourseHandler = () => {
      // directing torecourse page.
      navigate('/recourse');
    };
    
    
    return <Grid>
      <p className="MainTitle">Initial information</p>
      <h5 className="subtitleForMaintitle">Fill the below form with your information</h5>
     
      <Grid className="layout">
            <Grid className="ActionableFeatures" >
             
               <div className="descriptionIconAndInput">
               <TextField
                className="initiPageTextField"
                id="outlined-required"
                label="Age"
                value={features?.age}
                />
                <Tooltip title='your age' placement='top'>
                  <HelpOutlineIcon className="HelpIcon" />
                </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Capital Gain"
                  value={features?.capital_gain}
                  />
                  <Tooltip title='Capital Gain' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Capital Loss"
                  value={features?.capital_loss}
                  />
                  <Tooltip title='Capital Loss' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                <TextField
                className="initiPageTextField"
                id="outlined-required"
                label="Education"
                value={features?.education}
                />
                <Tooltip title='Level of your education' placement='top'>
                  <HelpOutlineIcon className="HelpIcon" />
                </Tooltip>
               
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Houres per week"
                  value={features?.hours_per_week}
                  />
                  <Tooltip title='hours of your work per week' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Marital Status"
                  value={features?. marital_status}
                  />
                  <Tooltip title='your current marital status' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Native Country"
                  value={features?.native_country}
                  />
                  <Tooltip title='your native country' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Occupation"
                  value={features?.occupation}
                  />
                  <Tooltip title='your current job' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Race"
                  value={features?.race}
                  />
                  <Tooltip title='your race' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Relationship"
                  value={features?.relationship}
                  />
                  <Tooltip title='your relationship status' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="Sex"
                  value={features?.sex}
                  />
                  <Tooltip title='your gender' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>

                <div className="descriptionIconAndInput">
                  <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label="workclass"
                  value={features?.workclass}
                  />
                  <Tooltip title='workclass' placement='top'>
                    <HelpOutlineIcon className="HelpIcon" />
                  </Tooltip>
                </div>
            
                
            </Grid>
      </Grid>
      <Grid className="initButtonContainer">
        <button className="GotoRecourseButton" onClick={GotoRecourseHandler}>Request Loan Approaval </button>
      </Grid>
       
    </Grid>
     
}

export default InitPage