import React, { useState, useEffect } from "react";
import "./additionalInsights.css";
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
import { logEvent } from "../../logger";
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
    userID,
    preferences
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
    logEvent(userID, 'level_of_difficulty', `${name}#${updatedScalers[index]}`)
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

    const updatedStatuses = [...statuses];
    updatedStatuses[index] = newStatus;
    setStatuses(updatedStatuses);

    const statusElement = document.getElementById(`status-${index}`);
    if (statusElement) {
      statusElement.className = `status ${statusClass}`;
    }
  };


  useEffect(() => {
    // saving prefrences values and level of difficulty values in redux store
    dispatch(updateInputValue(inputValues));
    dispatch(updateScalerValue(scalers));
  }, [inputValues, scalers]);

  return (
    <div className="AiOuterLayout">
      {isdefault ? (
        <h3 className="AiTittle">Additional Insights (optional)</h3>
      ) : null}
      {isdefault ? (
        <div className="AiLayout">
          {plans &&
            plans.map((item, planIndex) => (
              <div className="AiBox" key={planIndex}>
                <div className="AiTitleOfBox">
                  <div>
                    {configuration[item.name].display_name}
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
                          type="number"
                          className="min"
                          label="Minimum Value"
                          variant="outlined"
                          name={`${item.name}-min_value`}
                          value={formData[item.name]?.min_value || 0}
                          onChange={(event) => handleMinMaxChange(event)}
                          margin="normal"
                        />

                        <TextField
                          type="number"
                          className="max"
                          name={`${item.name}-max_value`}
                          value={formData[item.name]?.max_value || 0}
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
