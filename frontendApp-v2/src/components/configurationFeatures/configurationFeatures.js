import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./configurationFeatures.css";
import configuration from "../../config.json";
import ExpandableCard from "./ExpandableCard.js";
import { useSelector } from "react-redux";
import { logEvent } from "../../logger.js";
import buttonLabels from "../buttonLabels.js";
import { recourseFareWebApi } from "../../webApi.js";

function ConfigurationPage() {
  // const userInformation = useSelector((state) => state.rootReducer.initData);

  const CONFIG = configuration?.loan_approval_task;
  const userID = useSelector((state) => state.rootReducer.id);
  const navigate = useNavigate();
  const location = useLocation();
  const planInformation = location.state;
  const [commonNames, setCommonNames] = useState([]);
  const plan = planInformation?.planName;

  const [preferences, setPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  let adult = planInformation?.initData.features.adult;
  let lending = planInformation?.initData.features.lendingclub;
  let modifyForm = [...adult, ...lending];
  
  const handleCheckboxChange = (event, displayName) => {
    const { value, checked } = event.target;
    
    if (checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }

    logEvent(
      userID,
      "modify_value_categorical",
      `${displayName}#Prefrences_acceptable_values:${value}`
    ).then((res) => {
      console.log("log request done!");
    });
  };

  useEffect(() => {
    const findCommonNames = () => {
      const planFeature = planInformation?.details;

      const commonNames =
        modifyForm &&
        modifyForm.filter((obj1) =>
          planFeature.some((obj2) => obj2.name === obj1.name)
        );
      setCommonNames(commonNames);
    };
    findCommonNames();
  }, [planInformation?.details]);

  const handleScalerChange = (
    event,
    name,
    number,
    displayName,
    value_before
  ) => {
    const data = {
      [name]: { max_value: event.target.value, min_value: 0 },
    };

    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      ...data,
    }));

    logEvent(
      userID,
      "modify_value_numerical",
      `${displayName}#original_value:${value_before}#Prefrences_value:${event.target.value}`
    ).then((res) => {
      console.log("log request done!");
    });
  };

  const resubmitToServer = () => {
    setIsLoading(true);

    const info = {
      features: {
        adult: adult,
        lendingclub: lending,
      },
      preferences: preferences,
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
    logEvent(userID, "interface_2", "resubmit_loan_plan", "CLICKED").then(
      (res) => {
        console.log("log request done!");
      }
    );
  };

  const sortedModifyForm =
    modifyForm &&
    modifyForm.length > 0 &&
    modifyForm.slice().sort((a, b) => {
      if (
        CONFIG?.features[a.name]?.actionable ===
        CONFIG?.features[b.name]?.actionable
      ) {
        return 0;
      }
      return CONFIG?.features[a.name]?.actionable ? -1 : 1;
    });

    return (
    <Grid>
      <p className="MainTitle">Modifying page ({plan})</p>
      {isLoading ? (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      ) : null}
      <Grid className="layout">
        <div className="card-container">
          {planInformation?.details.map((item, index) => (
            <div key={index} className="PlanData">
              <span className="dataTitle">
                {CONFIG?.features[item.name]?.display_name}
              </span>
              <div className="innerDisplayNewPlan">
                <span className="dataAmount">{CONFIG?.features[item.name]?.valuesWithLabel ? CONFIG?.features[item.name]?.valuesWithLabel[item.valueBefore] : item.valueBefore}</span>
                <span>
                  <ArrowRightAltIcon style={{ margin: "0 10px" }} />
                </span>
                <span className="dataAmount">{CONFIG?.features[item.name]?.valuesWithLabel ? CONFIG?.features[item.name]?.valuesWithLabel[item.valueAfter] : item.valueAfter}</span>
              </div>
            </div>
          ))}
        </div>
      </Grid>
      <h5 className="subtitleForMaintitle">
        Please try to enhance the plan by suggesting different values in one or
        more white cells, aiming to strike a balance between the persona's
        preferences and the achievement of the desired loan.
      </h5>
      <Grid className="layout">
        <div className="feature-container">
          {sortedModifyForm &&
            sortedModifyForm.length > 0 &&
            sortedModifyForm.map((card, index) => (
              <div key={index} className="helpAndCardContainer">
                <ExpandableCard
                  number={index}
                  title={card.name}
                  displayName={CONFIG?.features[card.name]?.display_name}
                  description={CONFIG?.features[card.name]?.description}
                  actionable={CONFIG?.features[card.name]?.actionable}
                  value={card.value}
                  commonNames={
                    modifyForm.length > 0 &&
                    modifyForm.filter((item) =>
                      commonNames.some((obj2) => obj2.name === item.name)
                    )
                  }
                  minValue={
                    CONFIG?.features[card.name]?.type === "numerical"
                      ? CONFIG?.features[card.name]?.min_value
                      : ""
                  }
                  maxValue={
                    CONFIG?.features[card.name]?.type === "numerical"
                      ? CONFIG?.features[card.name]?.max_value
                      : ""
                  }
                  handleScalerChange={handleScalerChange}
                  handleCheckboxChange={handleCheckboxChange}
                  selectedValues={selectedValues}
                  setPreferences={setPreferences}
                />
                <Tooltip
                  title={CONFIG?.features[card.name]?.description}
                  placement="top"
                >
                  <HelpOutlineIcon className="HelpIcon" />
                </Tooltip>
              </div>
            ))}
        </div>
      </Grid>

      <Grid className="initButtonContainer">
        <button className="resubmitButton" onClick={resubmitToServer}>
          {buttonLabels["en"].resubmit}
        </button>
      </Grid>
    </Grid>
  );
}

export default ConfigurationPage;
