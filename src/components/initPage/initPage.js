import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import data from './initData.json'
import './initPage.css';

console.log('data',data)

function InitPage() {
 
    const [actionable, setActionable] = useState([]);
    const [nonActionable, setNonActionable] = useState([]);
    const [username, setUsername] = useState('-')
    const features = data.features;
    const actionableFeatures = features.filter(feature => feature.actionable);
    const nonActionableFeatures = features.filter(feature => !feature.actionable);
   

    useEffect(() => {
        setActionable(actionableFeatures);
        setNonActionable(nonActionableFeatures);
        setUsername(data?.userId)
    }, [])
    

    return <Grid>
         <p className="MainTitle">Personal information</p>
         
            <Grid className="layout">
                <Grid className="userInfo" constainer spacing={2} xs={4}>
                    <Grid item className="userName">
                        <div className="GeneralTitle">user id</div>
                        <div className="GeneralSubTitle">{username}</div>
                    </Grid>
                    <Grid item className="MessageContainer">
                        <div className="GeneralTitle">Message</div>
                        <div className="messageGeneralSubTitle">Your application is rejected, go to the recourse page to get new plan! </div>
                        {/* <Link  to="/recourse">Go to recourse Page</Link> */}
                    </Grid>
                </Grid>
            </Grid>

      <p className="MainTitle">General information</p>
      <Grid className="layout">
            <Grid className="NonActionableContainer" constainer spacing={2} xs={4}>
              
                 {nonActionable && nonActionable.map((item,index) => (
                    <Grid  item className="userName">
                        <div className="GeneralTitle">{item.name}</div>
                        <div className="GeneralSubTitle">{item.value}</div>
                    </Grid>
                 ))}
               
                
            </Grid>
      </Grid>

      <p className="MainTitle">Configuration</p>
      <Grid className="layout">
            <Grid className="ActionableFeatures" >
              {actionable && actionable.map((item,index) => (
                <TextField
                id="outlined-required"
                label={item.name}
                defaultValue={item.value}
                />
              ))}
               
            </Grid>
            
      </Grid>
      <Grid className="initButtonContainer">
        <Link className="GotoRecourseButton" to="/recourse">Go to recourse Page</Link>
      </Grid>
       
    </Grid>
     
}

export default InitPage