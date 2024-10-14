import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Checkbox, FormControlLabel, Button } from '@mui/material';
import configuration from '../../config.json';



const ExpandableCard = (props) => {
  const {
    title,
    value,
    commonNames,
    number,
    actionable,
    displayName,
    minValue,
    maxValue,
    handleChange,
    handleScalerChange,
    selectedValues,
    handleCheckboxChange,
    setPreferences
  } = props;
  const [expanded, setExpanded] = useState(false);
  const [labels, setLabels] = useState("");
  const [modifyValue, setModifyValue] = useState();
  const CONFIG = configuration.loan_approval_task;
  

  const saveData = () => {
    const data = {
      [title]: {
        acceptable_values: selectedValues,
      },
    };

    setPreferences(data);
    setExpanded(false)
  };


  useEffect(() => {
    const allNames = [...commonNames.map((item) => item.name)];
    setLabels(allNames);
  }, [commonNames]);

  const handleClick = (title) => {
     setExpanded(!expanded);
   
  };

  
  const marks = [
    { value: minValue, label: 'Min' },
    { value: maxValue, label: 'Max' },
    { value: value, label: 'original' },
  ];
  return (
    <div
      className={`card ${
        expanded && actionable && actionable !== undefined ? "expanded" : ""
      }`}
     
      style={{
        backgroundColor:
          labels && labels.find((obj) => obj === title)
            ? "rgb(248, 251, 255)"
            : `${actionable ? "#ffffff" : "#EEE"}`,
        border:
          labels && labels.find((obj) => obj === title)
            ? "1px solid #106FDF"
            : "1px solid #ccc",
      }}
    >
      <div onClick={() => handleClick(title)} className={`Innercard ${expanded ? "expanded" : ""}`}>
        <span className="featuresTitle"  >
          {displayName ? displayName : title}
        </span>
        <span className="featureValue">
          {modifyValue ? modifyValue : (CONFIG?.features[title]?.valuesWithLabel ? CONFIG?.features[title]?.valuesWithLabel[value] : value)}
        </span>
      </div>

      {expanded && actionable && actionable !== undefined && (
        <div className="modifyingSection">
          <p className="dropDownTitle">choose your acceptable {displayName}</p>
          {CONFIG?.features[title] ? (
            <div className="CategoricalBox">
              {CONFIG?.features[title].type === "categorical" ? (
                <Box sx={{ minWidth: 200 }}>
                  {
                  CONFIG?.features[title]?.valuesWithLabel ?
                    Object.entries(CONFIG?.features[title]?.valuesWithLabel).map((entry,index) => (
                      <FormControlLabel
                      key={index}
                      control={<Checkbox 
                        value={entry[0]}
                        onChange={(event) => handleCheckboxChange(event,displayName)}
                        checked={selectedValues.includes(entry[0])}
                         />}
                      label={entry[1]}
                    />
                    ))
                  
                  : CONFIG?.features[title]?.values.map((option,index) => (
                    <FormControlLabel
                      key={index}
                      control={<Checkbox 
                        value={option}
                        onChange={(event) => handleCheckboxChange(event,displayName)}
                        checked={selectedValues.includes(option)}
                         />}
                      label={option}
                    />
                  ))}
                  <Button variant="contained" onClick={saveData}>save</Button>
                  
                </Box>
              ) : (
                CONFIG?.features[title].type === "numerical" && (
                  <Box sx={{ minWidth: 200 }}>
                    <Slider
                      aria-label="Temperature"
                      defaultValue={value}
                      //   value={}
                      onChange={(event) =>
                        handleScalerChange(event,title, number, displayName, value)
                      }
                      // key={index}
                      valueLabelDisplay="auto"
                      step={1}
                      min={minValue}
                      max={maxValue}
                      size="big"
                      marks={marks}
                    />  
                  </Box>
                )
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;
