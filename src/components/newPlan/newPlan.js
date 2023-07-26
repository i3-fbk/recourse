import React, { useState, useEffect, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "../newPlan/newPlan.css";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import AdditionalInsight from "../additionalInsights/additionalInsights";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import axios, * as others from "axios";
// the "data" that has imported below is a sample json named "RecoursePlan.json", and you can replace it with desired json.
// and this json is to show the first plan (Plan A)
import data from "./RecoursePlan.json";
import DiscardedPlans from "../discardedPlans/discardedPlans.js";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Modal from "react-modal";
import MoodScaler from "./moodScaler/moodScaler";
import { logEvent } from "../../logger";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: "600px",
    height: "400px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    borderRadius: "16px",
  },
};

function Welcome() {
  const location = useLocation();
  let adult = location?.state.init.features.adult;
  let lending = location?.state.init.features.lendingclub;
  const navigate = useNavigate();
  const userID = useSelector((state) => state.rootReducer.id);
  const [value, setValue] = useState(false);
  const [isdefault, setIsdefault] = useState(false);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [activeDiscardedPlan, setActiveDiscardedPlan] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeButton, setActiveButton] = useState(false);
  const [featureList, setFeatureList] = useState(data.features);
  const [isLoading, setIsLoading] = useState(false);
  const [overalSatisfication, setOveralSatisfication] = useState(null);
  const inputValue = useSelector((state) => state.rootReducer.inputValue);
  const scalerValue = useSelector((state) => state.rootReducer.scalerValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [plan_id, setplan_id] = useState(1);
  const [discardedPlans, setDiscardedPlans] = useState([]);
  const [interventions, seinterventions] = useState({});
  // const [cookie, setCookie] = useState({
  //   PreviousUserPreferences: preferences,
  //   RecoursePreviousPlans: [
  //     { overall_satisfaction: overalSatisfication, plan: interventions },
  //   ],
  // });
  const [saveToLocalStoraga, setSaveToLocalStoraga] = useState({})
  const [difficulty, setDifficulty] = useState({})


  useEffect(() => {
    if (location.state.init) {
      setUserInfo(location.state.init);
    }
    if (location.state.data.plans) {
      const mergedArray = location.state.data.plans.map((item) => {
        const mergedFeatures = [
          ...item.features.adult,
          ...item.features.lendingclub,
        ];

        return {
          ...item,
          features: mergedFeatures,
        };
      });

      setPlans(mergedArray);
    }
  }, []);

  
  useEffect(() => {
    if (feedback !== null) {

      setDiscardedPlans((prevHistory) => [...prevHistory, plans]);
      setplan_id(plan_id + 1);
    

      const mergedArray = feedback.plans.map((item) => {
        const mergedFeatures = [
          ...item.features.adult,
          ...item.features.lendingclub,
        ];
        return {
          ...item,
          features: mergedFeatures,
        };
      });

      setPlans(mergedArray);
     
    }
  }, [feedback]);

  const set_local = async () => {
    localStorage.setItem(
      "planHistory",
      await JSON.stringify({RecoursePreviousPlans : {plan: discardedPlans, overalSatisfication: overalSatisfication}}),
      { expires: 1 }
    );
  };

  useEffect(() => {

    if (discardedPlans.length > 0) {
      set_local();
    }
  }, [discardedPlans]);

  const handleClick = (divId, index, plansDetails) => {
    setSelectedDiv(divId);
    setValue(true);
    setActiveButton(true);
    setOveralSatisfication(divId);

    let logDetails = ``;

    logDetails = plansDetails?.features
      .map(
        (item) =>
          `#${item.name}#${item.valueBefore}#${item.valueAfter}#smily_value#${index}`
      )
      .join("");

    logEvent(userID, "smily_interaction", logDetails);
  };

  useEffect(() => {
    // Handling the drop down for additional insights
    if (value) {
      setIsdefault(true);
    }
    if (value === false) {
      setIsdefault(false);
    }
  }, [value]);

  const handleMinMaxChange = (event) => {
    // for handling numeric values in additional insight.

    const { name, value } = event.target;
    const [title, type] = name.split("-");
    setFormData((prevData) => ({
      ...prevData,
      [title]: {
        ...prevData[title],
        [type]: parseFloat(value),
      },
    }));

    setPreferences((prevPreferences) => ({ ...prevPreferences, ...formData }));
  };

  const handleOptionChange = (event, index, title) => {
    // for handling categorical values in additional insight.

    const newSelectedValues = [...selectedOptions];
    newSelectedValues[index] = event.target.value;
    setSelectedOptions(newSelectedValues);

    setPreferences((prevData) => ({
      ...prevData,
      [title]: {
        ...prevData[title],
        acceptable_values: event.target.value,
      },
    }));
  };

  function sendJsonToServer() {
    setIsLoading(true);
    setError('')
    
    const info = {
      difficulty: difficulty,
      features: {
        adult: adult,
        lendingclub: lending,
      },
      preferences: preferences,
      overalSatisfication: overalSatisfication,
    };

    axios
      .post("http://127.0.0.1:5000/get_recourse_v2", info)
      .then((res) => {
        setIsLoading(false);
        setFeedback(res.data);
        console.log(`Server responded with status code ${res.status}`);
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsLoading(false);
        setError(err.message)
      });

    setActiveDiscardedPlan(true);
    setActiveButton(false);
    setValue(false);
    setSelectedDiv(null);
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    // Perform actions when "Yes" button is clicked
    setIsModalOpen(false);
    navigate("/quit");
  };

  const handleCancel = () => {
    // Perform actions when "No" button is clicked
    setIsModalOpen(false);
  };

  function generatePlanName(number) {
    switch (number) {
      case 1:
        return "Plan A";
      case 2:
        return "Plan B";
      case 3:
        return "Plan C";
      case 4:
        return "Plan D";
      case 5:
        return "Plan E";
      case 6:
        return "Plan F";
      case 7:
        return "Plan G";
      // Add more cases for additional numbers if needed
      default:
        return "Unknown Plan";
    }
  }

  return (
    <Grid>
      <div className="planGoal">
        <h2 className="">Recourse plans</h2>
      </div>
      <div className="topMessage">
        <Grid item className="userName">
          <div className="GeneralTitle">Message</div>
          <div className="GeneralSubTitle">
            Your loan approaval has been rejected, check recours plans.
          </div>
        </Grid>
      </div>
      {plans.length === 0 &&
      <div className="topMessageError">
         <Grid item className="userName">
          <div className="GeneralTitle">Error!</div>
          <div className="GeneralSubTitle">
            sorry, there is no plan, please try again. 
          </div>
          
        </Grid>
        </div>}
        {
          error !== '' &&
          <div className="topMessageError">
         <Grid item className="userName">
          <div className="GeneralTitle">Error!</div>
          <div className="GeneralSubTitle">
            {error}
          </div>
          
        </Grid>
        </div>
        }

      {isLoading ? (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      ) : null}

      {plans &&
        plans.map((outerItem, outerIndex) => (
          <Grid key={outerIndex} className="layout">
            <div className="planTitle">{generatePlanName(plan_id)}</div>
            <Grid container spacing={1} className="innerLayout">
              {outerItem?.features.map((item, index) => (
                <div key={index} className="PlanData">
                  <span className="dataTitle">{item.name}</span>
                  <div className="innerDisplayNewPlan">
                    {/* <span><ArrowUpwardRoundedIcon fontSize="large" className={item.valueInc ? "upwardArrow" : "downward"} /></span>  */}
                    <span className="dataAmount">{item.valueBefore}</span>
                    <span style={{'padding':'0px 10px'}}>
                      <ArrowRightAltIcon />
                    </span>
                    <span className="dataAmount">{item.valueAfter}</span>
                  </div>
                </div>
              ))}
            </Grid>

            <p className="moodScalerQuestion">
              What do you think about this suggested plan?
            </p>

            <MoodScaler
              className="moodScaler"
              // key={outerIndex}
              index={outerIndex}
              selectedDiv={selectedDiv}
              handleClick={handleClick}
              plansDetails={plans[outerIndex]}
            />

            <AdditionalInsight
              isdefault={isdefault}
              featureList={featureList}
              feedback={feedback}
              plans={outerItem.features}
              handleOptionChange={handleOptionChange}
              handleMinMaxChange={handleMinMaxChange}
              selectedOptions={selectedOptions}
              formData={formData}
              setDifficulty={setDifficulty}
            />

            {value && (
              <Tooltip title="close additional insights">
                <CloseFullscreenIcon
                  className="CloseFullscreenIcon"
                  onClick={(e) => setValue(false)}
                />
              </Tooltip>
            )}
            <div className="button-container-keep">
              <button
                className={
                  activeButton
                    ? "ButtonForKeepPlan"
                    : "DisabledButtonForKeepPlan"
                }
              >
                KEEP THE PLAN
              </button>
            </div>
          </Grid>
        ))}

      
      <div className="SecondButtonContainer">
        <button
          className={
            activeButton ? "ButtonForProposeNewPlan" : "disabledButton"
          }
          onClick={sendJsonToServer}
        >
          PROPOSE NEW PLAN
        </button>
      </div>
      <h3 className="discardedPlansText">History of plans</h3>
      <DiscardedPlans
        overalSatisfication={overalSatisfication}
        discardedPlans={discardedPlans}
      />

      <div className="RejectingButtonContainer">
        <button className="RejectingButton" onClick={handleOpenModal}>
          Quit Recourse Page
        </button>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={modalStyles}
        >
          <h2>Are you sure you want to leave?</h2>
          <button className="confirmToExit" onClick={handleConfirm}>
            Yes
          </button>
          <button className="rejectToExit" onClick={handleCancel}>
            No
          </button>
        </Modal>
      </div>
    </Grid>
  );
}

export default Welcome;
