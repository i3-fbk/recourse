import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import axios, * as others from "axios";
import buttonLabels from "../buttonLabels.js";
import { logEvent } from '../../logger.js';
import { useDispatch } from "react-redux";
import "./login.css";
import { saveUserId } from "../../action/action.js";
import { saveUserInformation } from "../../action/action.js";

function LoginPage() {

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
    logEvent(userID, 'session_started', `clicked#${userID}`)

    axios
      .get("http://127.0.0.1:5000/get_user", { user_id: userID })
      .then((res) => {
        if (res.data) {
          navigate("/form", { state: res.data });
           dispatch(saveUserId(userID));
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }

 

  return (
    <div className="page-container">
     <div style={{ margin:' 10px 60px'}}>
        <h1 className="login-heading">Welcome to Recourse plan <span style={{fontSize: '14px'}}>( version 1 )</span> </h1>
        <span style={{fontSize: '21px'}}>What is this platform?</span>
        <p style={{textAlign: 'justify'}}>
         
          Our platform is designed to assist people to achieve their financial
          goals. Sometimes only small changes in financial factors can lead to
          rejection or approval. Picture this scenario: You apply for a loan
          from a financial institution, but unfortunately, your request gets
          rejected. That's where our platform steps in to help. By analyzing
          your information, we offer tailored plans for you to choose from,
          increasing your chances of securing that much-needed loan approval.
          <br />
          </p>
          <span style={{fontSize: '21px'}}>Participation</span>
         <p>
          At Recourse Plan, your interactions with us are entirely anonymous,
          ensuring your personal information remains protected. Should you
          choose to give your consent, you have the option to actively
          participate in improving our services. Your participation is
          incredibly valuable to us as it drives the continual improvement and
          enhancement of our platform.
        </p>

        <div className="consentContainer">
          <p>Do you consent to participate to this study?</p>
          <label>
            <input
              type="radio"
              value="yes"
              checked={selectedOption === "yes"}
              onChange={handleOptionChange}
            />
            I consent that I am completely participating voluntary.
          </label>
          <label>
            <input
              type="radio"
              value="no"
              checked={selectedOption === "no"}
              onChange={handleOptionChange}
            />
            I do not consent to participate in this study.
          </label>
        </div>

        <div className="loginSection">
          <p>To access the study, you can enter by your unique prolific ID</p>
          <div className="innerLoginSection">
            <TextField
              id="username"
              label="Username"
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
                isValidInput ? "login-button-active" : "login-button-deactive"
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

export default LoginPage;