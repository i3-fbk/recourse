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
    const [dropDownValue, setDropDownValue] = useState('');
    const features = data.features;
    const actionableFeatures = features.filter(feature => feature.actionable);
    const nonActionableFeatures = features.filter(feature => !feature.actionable);
   

    useEffect(() => {
        setActionable(actionableFeatures);
        setNonActionable(nonActionableFeatures);
        setUsername(data?.userId)
    }, [])
    
    

    const handleChange = (event) => {
      setDropDownValue(event.target.value);
    };

    const GotoRecourseHandler = () => {
      // directing to recourse page, and also passing the the loan approaval purpose (dropDownValue) to recourse page.
      navigate('/recourse',{state:dropDownValue});
    };
    
    return <Grid>
      <p className="MainTitle">Initial information</p>
      <h5 className="subtitleForMaintitle">Fill the below form with your information</h5>
      <Grid className="layout-1">
      <p>To better assist you, what is the purpose of this loan approval</p>
      <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Loan approaval for</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={dropDownValue}
          onChange={handleChange}
          autoWidth
          label="Loan approaval for"
          className="loanApproavalDropDown"
        >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value='House'>House</MenuItem>
            <MenuItem value='Car'>Car</MenuItem>
            <MenuItem value='Land'>Land</MenuItem>
          </Select>
        </FormControl>
      </div>
      </Grid>
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
        <button className="GotoRecourseButton" onClick={GotoRecourseHandler}>Go to recourse Page</button>
      </Grid>
       
    </Grid>
     
}

export default InitPage