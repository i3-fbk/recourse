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
       
        
    

      <p className="MainTitle">Initial information</p>
      <h5 className="subtitleForMaintitle">Fill the below form with your information</h5>
      <Grid className="layout">
            <Grid className="ActionableFeatures" >
              {data && data.features.map((item,index) => (
                <TextField
                className="initiPageTextField"
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