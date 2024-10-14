import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import buttonLabels from "../buttonLabels.js";
import { logEvent } from "../../logger.js";
import { useSelector } from "react-redux";
import CONFIG from "../../config.json";
import { recourseFareWebApi } from "../../webApi.js";
import "./initPage.css";

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

  const GotoRecourseHandler = () => {
    logEvent(userID, "request_plans_button", "clicked").then((res) => {
      console.log("log request done!");
    });
    setIsLoading(true);
    let adultArr = [{ name: "", value: "" }];
    let lendingArr = [{ name: "", value: "" }];

    Object.keys(adult).map((item) => {
      adultArr.push({ name: item, value: adult[item] });
    });
    Object.keys(lending).map((item) => {
      lendingArr.push({ name: item, value: lending[item] });
    });

    adultArr.splice(0, 1);
    lendingArr.splice(0, 1);

    const info = {
      features: {
        adult: adultArr,
        lendingclub: lendingArr,
      },
      preferences: {},
    };
    recourseFareWebApi
      .post("/get_recourse_v2", info)
      .then((res) => {
        if (res.status == 200) {
          setIsLoading(false);

          const dataUserInfo = {
            data: res.data,
            init: info,
          };

          navigate("/recourse", { state: dataUserInfo });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <Grid>
      <p className="MainTitle">Initial information</p>
      <div className="topMessage">
        <Grid item className="userName">
          <div className="GeneralTitle">Message</div>
          <div className="GeneralSubTitle">
          This is the detailed profile of the persona you are asked to
        impersonate. As mentioned earlier, the persona's loan request has been
        declined. Your task is to engage with the platform as if you were this
        individual, seeking to find a compromise between her preferences and the
        attainment of the desired loan. To proceed, begin by clicking the
        "Request a Recourse Plan" button.
        </div>
        </Grid>
      </div>
      
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
                  disabled
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
