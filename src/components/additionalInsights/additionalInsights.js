import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import "./additionalInsights.css";
import statusesData from "../../components/statuses.json";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import data from "../newPlan/RecoursePlan.json";
import { useDispatch } from "react-redux";
import { updateInputValue } from "../../action/action";
import { updateScalerValue } from "../../action/action";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import CONFIG from "../../config.json";

function AdditionalInsight(props) {
  const {
    plans,
    isdefault,
    handleOptionChange,
    selectedOptions,
    handleMinMaxChange,
    formData,
    setDifficulty,
  } = props;

  const configuration = CONFIG.loan_approval_task.features;

  const initialScalers = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]; // Initial scalers array
  const [scalers, setScalers] = useState(initialScalers);
  const [statuses, setStatuses] = useState(
    Array(initialScalers.length).fill("moderate")
  );
  const [inputValues, setInputValues] = useState(
    Array(data.features.length).fill("")
  );

  const dispatch = useDispatch(); // to save values in redux store

  const handleScalerChange = (event, index, dataset) => {
    const { value, name } = event.target;
    const newScaler = parseInt(value);
    const updatedScalers = [...scalers];
    updatedScalers[index] = newScaler;
    setScalers(updatedScalers);

    // Update the status for the given index
    updateStatus(newScaler, index);

   
    setDifficulty((prevDifficulty) => ({
      ...prevDifficulty,
      [dataset]: {
        [name]: updatedScalers[index],
        ...prevDifficulty[dataset]
      }
    }));
    
  };

  // Function to update the status based on the scaler value for a specific index
  const updateStatus = (scalerValue, index) => {
    // Logic to determine the status based on the scaler value
    let newStatus = "";
    let statusClass = "";

    switch (scalerValue) {
      case 1:
        newStatus = "Very Difficult";
        statusClass = "very-difficult";
        break;
      case 2:
        newStatus = " Difficult";
        statusClass = "difficult";
        break;
      case 3:
        newStatus = "moderate";
        statusClass = "moderate";
        break;
      case 4:
        newStatus = "Easy";
        statusClass = "easy";
        break;
      case 5:
        newStatus = "Very Easy";
        statusClass = "very-easy";
        break;
      default:
        newStatus = "";
        statusClass = "";
    }

    // Create a new copy of the statuses array and update the status at the given index
    const updatedStatuses = [...statuses];
    updatedStatuses[index] = newStatus;
    setStatuses(updatedStatuses);

    const statusElement = document.getElementById(`status-${index}`);
    if (statusElement) {
      statusElement.className = `status ${statusClass}`;
    }
  };

  // useEffect(() => {
  //   if (props?.feedback != null) {
  //     setFeatureList(props?.feedback.feedback.features);
  //   }
  // }, [props?.feedback]);

  // const handleInputChange = (index, event) => {
  //   const newValues = [...inputValues];
  //   newValues[index] = event.target.value;
  //   setInputValues(newValues);
  // };

  useEffect(() => {
    // saving prefrences values and level of difficulty values in redux store
    dispatch(updateInputValue(inputValues));
    dispatch(updateScalerValue(scalers));
  }, [inputValues, scalers]);

  return (
    <div className="AiOuterLayout">
      {isdefault ? (
        <div className="AiTittle">Additional Insights (optional)</div>
      ) : null}
      {isdefault ? (
        <div className="AiLayout">
          {plans &&
            plans.map((item, planIndex) => (
              <div className="AiBox" key={planIndex}>
                <div className="AiTitleOfBox">
                  <div>
                    {item.name}
                    <small className="differencesAmount">
                      {item.valueDiff}
                    </small>
                  </div>
                  <div id={`status-${planIndex}`} className="status">
                    {statuses[planIndex]}
                  </div>
                </div>
                <hr className="seperateLine" />

                <p className="bodyText">
                  1) How much is it achievable for you?
                </p>
                <div className="sclaerContainer">
                  <small>very difficult</small>
                  <Box sx={{ width: 300 }} key={planIndex}>
                    <Slider
                      aria-label="Temperature"
                      // defaultValue={}
                      value={scalers[planIndex]}
                      name={item.name}
                      onChange={(event) => handleScalerChange(event, planIndex, configuration[item.name].dataset)}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={5}
                      size="small"
                    />
                  </Box>
                  <small>very easy</small>
                </div>

                <div className="bodyTextSecondQuestion">
                  2) Choose your prefred options:
                  <div className="input-container">
                    {item.type === "numeric" ? (
                      <div className="minAndMaxContainer">
                        <TextField
                          className="min"
                          label="Minimum Value"
                          variant="outlined"
                          name={`${item.name}-min_value`}
                          value={formData[item.name]?.min_value || ""}
                          onChange={(event) => handleMinMaxChange(event)}
                          margin="normal"
                        />

                        <TextField
                          className="max"
                          name={`${item.name}-max_value`}
                          value={formData[item.name]?.max_value || ""}
                          label="Maximum Value"
                          variant="outlined"
                          onChange={(event) =>
                            handleMinMaxChange(event, item.name)
                          }
                          margin="normal"
                        />
                      </div>
                    ) : (
                      <Select
                        multiple
                        value={selectedOptions[planIndex] || []}
                        onChange={(event) =>
                          handleOptionChange(event, planIndex, item.name)
                        }
                        renderValue={(selected) => selected.join(", ")}
                        style={{ maxWidth: 340 }}
                      >
                        {configuration[item.name].values.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox
                              checked={
                                (selectedOptions[planIndex] || []).indexOf(
                                  option
                                ) > -1
                              }
                            />
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}

export default AdditionalInsight;
