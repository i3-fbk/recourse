import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import axios, * as others from "axios";
import buttonLabels from "../buttonLabels.js";
import { logEvent } from "../../logger.js";
import { useDispatch } from "react-redux";
import "./login.css";
import { saveUserId } from "../../action/action.js";
import { saveUserInformation } from "../../action/action.js";
import { recourseFareWebApi, printEnvs } from "../../webApi.js";


function LoginPagePersonaOne() {
  const navigate = useNavigate();
  const [userID, setUserID] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language is English
  const dispatch = useDispatch(); // to save values in redux store
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleUsernameChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input value is a 4-digit number
    const isValid = /^\d{4}$/.test(inputValue);

    setUserID(inputValue);
    setIsValidInput(isValid);
  };

  function handleLogin() {
    logEvent(userID, "session_started", `"clicked#${userID}"`)
      .then((res) => {
		    console.log("log request done!");
	    });
    printEnvs();
    if (selectedOption === 'yes'){
		recourseFareWebApi
      .get("/get_user?persona_id=1", { user_id: userID })
      .then((res) => {
        if (res.data) {
          navigate("/form", { state: res.data });
          dispatch(saveUserId(userID));
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });}
  }

  return (
    <div className="page-container">
      <div style={{ margin:' 10px 60px'}}>
        <h1 className="login-heading">Welcome to Recourse plan <span style={{fontSize: '14px'}}>( version 1 )</span> </h1>
        <span style={{fontSize: '21px'}}>What is this platform?</span>
        <p style={{ textAlign: "justify" }}>
          Our platform is designed to assist people in accomplishing their
          financial objectives, with a specific focus on assisting them in
          obtaining loans for particular purposes. Sometimes, even small changes
          in financial factors can determine whether an application is rejected
          or approved.
          <br />
          <br />
          Picture this scenario: A person submits a loan application to a
          financial institution; however, regrettably, her request is declined.
          This is precisely where our platform intervenes to provide assistance.
          Through a comprehensive analysis of her data and preferences, we offer
          tailored plans for her consideration. thereby enhancing the likelihood
          of obtaining the loan approval.
          <br />
        </p>
        {/* <span style={{fontSize: '21px'}}>Participation</span> */}
        <p>
          Imagine that you are
          <span style={{ fontWeight: 700, fontSize: 18, color: "#000", padding: '0px 3px'}}>
            this person
          </span>
          who submitted the loan application and had her application has been
          <storng style={{ fontWeight: 700, fontSize: 18, color: "#000", padding: '0px 3px' }}>
            declined
          </storng>
          :
        </p>
        <ul>
          <li>Age: 28</li>
          <li>Gender: Female</li>
          <li>Location: United States</li>
          <li>Education: Associate vocational certificate</li>
          <li>Occupation: Professional specialty (40 hours per week)</li>
          <li>Marital status: Married, own child</li>
          <li>Annual income: $89,000</li>
        </ul>
        <p>The loan that you requested is: $21,775</p>
        <br />
        <p style={{ textAlign: "justify" }}>
          Your task is to <span style={{ fontWeight: 700, fontSize: 18, color: "#000" }}>interact with the platform as if you were this person</span>,
          aiming to strike a balance between her preferences and the achievement
          of the desired loan.
        </p>

        <p style={{ textAlign: "justify" }}>
          Your participation is incredibly valuable to us as it drives the
          continual improvement and enhancement of our platform.
        </p>

        <p style={{ textAlign: "justify" }}>
          Your interactions will remain entirely anonymous. It is your right to
          stop and withdraw from the experiment at any moment and without
          providing any reason for your withdrawal. If you do not wish to give
          your consent to participate in the study or if you want to interrupt
          the experiment, simply close the browser.
        </p>

        <div className="consentContainer">
         
          <label>
            <input
              type="radio"
              value="yes"
              checked={selectedOption === "yes"}
              onChange={handleOptionChange}
            />
            I declare to have examined the information provided about the
            study and I agree to participate in the proposed study by my own
            free choice.
          </label>
         
        </div>

        <div className="loginSection">
          <p>To access the study, please enter your unique ID</p>
          <div className="innerLoginSection">
            <TextField
              id="username"
              label="Enter your 4 digit ID here"
              variant="outlined"
              value={userID}
              onChange={handleUsernameChange}
              fullWidth
              margin="normal"
              className="textFieldinputForLoing"
              inputProps={{
                maxLength: 4,
                pattern: "\\d{4}",
              }}
            />
            <button
              className={
                (isValidInput && selectedOption === 'yes') ? "login-button-active" : "login-button-deactive"
              }
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={!isValidInput}
            >
              {buttonLabels[language].enter}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPagePersonaOne;
