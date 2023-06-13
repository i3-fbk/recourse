import React, {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import data from './initData.json';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Link, useNavigate } from 'react-router-dom';
import './initPage.css';


function InitPage() {
    const navigate = useNavigate();
    const [actionable, setActionable] = useState([]);
    const [nonActionable, setNonActionable] = useState([]);
    const [username, setUsername] = useState('-')
    const [isHovered, setIsHovered] = useState(false);
    const [labelDescription, setLabelDescription] = useState('');  
    const features = data.features;
    const actionableFeatures = features.filter(feature => feature.actionable);
    const nonActionableFeatures = features.filter(feature => !feature.actionable);
   

    useEffect(() => {
        setActionable(actionableFeatures);
        setNonActionable(nonActionableFeatures);
        setUsername(data?.userId)
    }, [])
    

    const GotoRecourseHandler = () => {
      // directing to recourse page.
      navigate('/recourse');
    };
    
    const handleMouseEnter = (description,index) => {
      console.log('1111',description,index)
      setIsHovered(true);
      setLabelDescription(description);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
      setLabelDescription('');
    };

    
    return <Grid>
      <p className="MainTitle">Initial information</p>
      <h5 className="subtitleForMaintitle">Fill the below form with your information</h5>
     
      <Grid className="layout">
     <div className="featureDescription"> {
      isHovered && 
       <div className="innerFeatureDescription">{labelDescription}</div>}
      </div>
            <Grid className="ActionableFeatures" >
              {data && data.features.map((item,index) => (
                <TextField
                className="initiPageTextField"
                onMouseEnter={() => handleMouseEnter(item.description,index)}
                onMouseLeave={handleMouseLeave}
                id="outlined-required"
                label={item.name}
                defaultValue={item.value}
                />
              ))}
               
            </Grid>
      </Grid>
      <Grid className="initButtonContainer">
        <button className="GotoRecourseButton" onClick={GotoRecourseHandler}>Go to recourse Page</button>
      </Grid>
       
    </Grid>
     
}

export default InitPage