import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "./newPlan.css";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios, * as others from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MoodScaler from "./moodScaler/moodScaler";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";
import { logEvent } from "../../logger.js";
import buttonLabels from "../buttonLabels.js";
import configuration from "../../config.json";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";


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
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(false);
  const [isdefault, setIsdefault] = useState(false);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [activeButton, setActiveButton] = useState([]);
  const [overalSatisfication, setOveralSatisfication] = useState(null);
  const userID = useSelector((state) => state.rootReducer.id);
  const [moodValues, setMoodvalues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const CONFIG = configuration?.loan_approval_task;
  const [language, setLanguage] = useState("en"); // Default language is English
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (location.state.init) {
      setUserInfo(location.state.init);
    }
    if (location.state.data.plans && location.state.data.plans.length > 0) {
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

  const handleClick = (divId, index, plansDetails) => {
    const allMoods = [...moodValues];
    allMoods[index] = divId;
    setMoodvalues(allMoods);

    setSelectedDiv(divId);
    setValue(true);

    const buttonActivation = [...activeButton];
    buttonActivation[index] = true;
    setActiveButton(buttonActivation);

    setOveralSatisfication(divId);

    let logDetails = ``;

    logDetails = plansDetails?.features
      .map((item) => `#${item.name}#${item.valueBefore}#${item.valueAfter}`)
      .join("");

    logEvent(
      userID,
      "smily_interaction",
      `${logDetails}#smily_value#${allMoods[index]}`
    ).then((res) => {
      console.log("log request done!");
    });
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

  const GoToModifyPage = (planID, planDetails, eventName) => {
    let logDetails = ``;

    logDetails = planDetails?.features
      .map((item) => `#${item.name}#${item.valueBefore}#${item.valueAfter}`)
      .join("");

    logEvent(userID, "modify_plan_button", `#CLICKED${logDetails}`).then(
      (res) => {
        console.log("log request done!");
      }
    );
    // After clicking on Modifying the plan
    const planInfo = {
      planId: planID,
      details: planDetails?.features,
      initData: userInfo,
      planName: generatePlanName(planID),
    };

    navigate("/recourse/modify/", { state: planInfo });
  };

  const keepThePlan = (planID, planDetails, eventName) => {
    let logDetails = ``;

    logDetails = planDetails?.features
      .map((item) => `#${item.name}#${item.valueBefore}#${item.valueAfter}`)
      .join("");

    logEvent(userID, "keep_plan_button", `#CLICKED#${logDetails}`).then(
      (res) => {
        console.log("log request done!");
      }
    );
    // here I should send POST api to server.
    const planInfo = {
      planId: planID,
      details: planDetails?.features,
    };

    navigate("/recourse/keepThePlan/", { state: planInfo });
  };

  const handleOpenModal = () => {
    logEvent(userID, "quit_recourse_page_button", "CLICKED").then((res) => {
      console.log("log request done!");
    });
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    // Perform actions when "Yes" button is clicked
    logEvent(userID, "quit_recourse_yes_button", "CLICKED").then((res) => {
      console.log("log request done!");
    });
    setIsModalOpen(false);
    navigate("/quit");
  };

  const handleCancel = () => {
    // Perform actions when "No" button is clicked
    logEvent(userID, "quit_recourse_no_button", "CLICKED").then((res) => {
      console.log("log request done!");
    });
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
      <h3 className="planGoal">Recourse Page</h3>
      {/* <p className="info" style={{textAlign : 'justify', paddingRight: '80px'}}>
       Welcome to recourse plan page.
      </p> */}
      <div className="topMessage-v2">
        <Grid item className="userName">
          <div className="GeneralTitle">Message</div>
          <div className="GeneralSubTitle">
          Scroll down the page to see all the available plans. You can choose one
        of these plans if you believe it aligns with the persona's requirements.
        Additionally, you can modify any of these plans to make improvements. If
        you find that none of the suggested plans are satisfactory and your
        attempts to modify them have not led to an acceptable solution, you can
        quit the recourse page.
          </div>
        </Grid>
      </div>
      {plans &&
        plans.length > 0 &&
        plans.map((outerItem, outerIndex) => (
          <Grid key={outerIndex} className="layout">
            <div className="planTitle">
              {generatePlanName(outerItem.planId)}
            </div>
            {
              <Grid container spacing={1} className="innerLayout">
                {location.state.data.plans &&
                  outerItem.features.map((item, index) => (
                    <div key={index} className="PlanDataV2">
                      <div className="titleContainer">
                        <span className="dataTitle">
                          {CONFIG?.features[item.name]?.display_name}
                        </span>
                        <Tooltip title={CONFIG?.features[item.name]?.description} placement="top">
                          <HelpOutlineIcon className="HelpIcon" />
                        </Tooltip>
                      </div>
                      <div className="innerDisplayNewPlan">
                        <span className="dataAmountV2">{CONFIG?.features[item.name].valuesWithLabel ? CONFIG?.features[item.name].valuesWithLabel[item.valueBefore] :  item.valueBefore}</span>
                        <span style={{ margin: "0px 10px" }}>
                          <ArrowRightAltIcon />
                        </span>
                        <span className="dataAmountV2">{CONFIG?.features[item.name].valuesWithLabel ? CONFIG?.features[item.name].valuesWithLabel[item.valueAfter] :  item.valueAfter}</span>
                      </div>
                    </div>
                  ))}
                <p className="moodScalerQuestion">
                  What do you think about this suggested plan?
                </p>
                <MoodScaler
                  className="moodScaler"
                  key={outerIndex}
                  moodValues={moodValues}
                  index={outerIndex}
                  selectedDiv={selectedDiv}
                  handleClick={handleClick}
                  plansDetails={plans[outerIndex]}
                />

                <div className="MainButtonContainer">
                  <button
                    onClick={() =>
                      keepThePlan(
                        outerItem?.planId,
                        plans[outerIndex],
                        "keep_the_plan"
                      )
                    }
                    className={
                      activeButton[outerIndex]
                        ? "ButtonForKeepPlan"
                        : "DisabledButtonForKeepPlan"
                    }
                    disabled={activeButton[outerIndex] ? false : true}
                  >
                    {buttonLabels[language].keep_the_plan}
                  </button>

                  <button
                    onClick={() =>
                      GoToModifyPage(
                        outerItem.planId,
                        plans[outerIndex],
                        "modify_the_plan"
                      )
                    }
                    className={
                      activeButton[outerIndex]
                        ? "ButtonForModifyPlan"
                        : "DisabledButtonForModifyPlan"
                    }
                    disabled={activeButton[outerIndex] ? false : true}
                  >
                    {buttonLabels[language].modify_the_plan}
                  </button>
                </div>
              </Grid>
            }
          </Grid>
        ))}
      <div className="RejectingButtonContainer">
        <button className="RejectingButton" onClick={handleOpenModal}>
          {buttonLabels[language].quit_recourse_page}
        </button>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={modalStyles}
        >
          <h2>Are you sure you want to leave?</h2>
          <button className="confirmToExit" onClick={handleConfirm}>
            {buttonLabels[language].yes}
          </button>
          <button className="rejectToExit" onClick={handleCancel}>
            {buttonLabels[language].no}
          </button>
        </Modal>
      </div>
    </Grid>
  );
}

export default Welcome;
