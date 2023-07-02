import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios, * as others from 'axios';
import './login.css';



function LoginPage() {

  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [data, setData] = useState({})


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

  const handleLogin = () => {
    // sneding user id to the server and receiving initial json as a feedback.

        axios.get('http://127.0.0.1:5000/get_user', {"user_id" : userID})
          .then(res => {
          
           if(res.data) {
              navigate('/form',{ state: res.data });
           }
          
          })
          .catch(err => {
              console.error("Error:",err);
          });
  };

  return (
 
    <div className="page-container">
        <div className="">
        <h1 className="login-heading">Welcome to Recourse plan #1</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
           
           <div className='consentContainer'>
             <p>Do you consent to participate to this study?</p>
             <label>
                <input
                  type="radio"
                  value="yes"
                  checked={selectedOption === 'yes'}
                  onChange={handleOptionChange} 
                  />
                I consent that I am completely participating voluntary. 
             </label>
             <label >
                <input 
                 type="radio" 
                 value="no"
                 checked={selectedOption === 'no'}
                 onChange={handleOptionChange}
                />
                I do not consent to participate in this study.
             </label>
           </div>
           
           <div className='loginSection'>
             <p>To access the study, you can enter by your unique prolific ID</p>
             <div className='innerLoginSection'>
              <TextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  value={userID}
                  onChange={handleUsernameChange}
                  fullWidth
                  margin="normal"
                  className='textFieldinputForLoing'
                  inputProps={{
                    maxLength: 4,
                    pattern: "\\d{4}",
                  }}
                /> 
              <button 
                className='login-button' 
                variant="contained" 
                color="primary" 
                onClick={handleLogin}
                disabled={!isValidInput}
                style={{
                  backgroundColor: isValidInput ? '#106FDF' : '#BCC8D6',
                  color: 'white',
                }}>
                Enter
              </button>
             </div>
           </div>
    </div>
  </div>
 
  );
}

export default LoginPage;
