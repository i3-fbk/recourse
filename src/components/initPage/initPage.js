import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios, * as others from "axios";
import buttonLabels from "../buttonLabels.js";
import { logEvent } from "../../logger.js";
import { useSelector } from "react-redux";
import CONFIG from "../../config.json";
import "./initPage.css";
import Cookies from 'js-cookie';

function InitPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initJson = location.state;
  const [isLoading, setIsLoading] = useState(false);
  const dataset = CONFIG.loan_approval_task.features;
  const [language, setLanguage] = useState("en"); // Default language is English
  const userID = useSelector((state) => state.rootReducer.id);
  let adult = initJson?.adult;
  let lending = initJson?.lendingclub;
  let mergedDataset = { ...adult, ...lending };
  const cookieToSave = {
    "PreviousUserPreferences" : {},
    "RecourseInteractiveWeights23": {
      "adult":adult,
      "lendingclub":lending
    },
    "RecoursePreviousPlans": [
     { "overall_satisfaction": 1,
      "plan": {
        "adulut":[],
        "lendingClub":[]
      }}
    ]
  }
  const stringCookie = JSON.stringify(cookieToSave)
 

  const GotoRecourseHandler = async() => {
    setIsLoading(true);

      // Convert adult and lending objects to arrays of key-value pairs
    let adultArr = Object.entries(adult).map(([name, value]) => ({ name, value }));
    let lendingArr = Object.entries(lending).map(([name, value]) => ({ name, value }));


    const info = {
      features: {
        adult: adultArr,
        lendingclub: lendingArr,
      },
      preferences: {},
    };
      Cookies.set('cookie', stringCookie, { expires: 1 });
    try {
      const res = await axios.post("http://127.0.0.1:5000/get_recourse_v2", info);
  console.log('ressss',res)
      const dataUserInfo = {
        data: res.data,
        init: info,
        preferences: {}
      };
  
      navigate("/recourse", { state: dataUserInfo });
    } catch (err) {
      console.error("Error:", err);
      // Handle the error here or throw it to be handled at a higher level.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid>
      <p className="MainTitle">Initial information</p>
      <h5 className="subtitleForMaintitle">
        Fill the below form with your information
      </h5>
      {isLoading ? (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      ) : null}
      <Grid className="layout">
        <Grid className="ActionableFeatures">
          {Object.keys(mergedDataset) &&
            Object.keys(mergedDataset).map((feature, index) => (
              <div key={index} className="descriptionIconAndInput">
                <TextField
                  className="initiPageTextField"
                  id="outlined-required"
                  label={
                    dataset[feature]?.display_name
                      ? dataset[feature]?.display_name
                      : feature
                  }
                  value={mergedDataset[feature] || "" || 0}
                />
                <Tooltip title={dataset[feature]?.description} placement="top">
                  <HelpOutlineIcon className="HelpIcon" />
                </Tooltip>
              </div>
            ))}
        </Grid>
      </Grid>
      <Grid className="initButtonContainer">
        <button className="GotoRecourseButton" onClick={GotoRecourseHandler}>
          {buttonLabels[language].request_loan_approval}
        </button>
      </Grid>
    </Grid>
  );
}

export default InitPage;