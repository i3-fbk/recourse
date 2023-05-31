import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';



function LoginPage() {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Perform login logic here
    
    if(username && password) {
        if(username == 123 && password == 123) {
            navigate('/form');
        }
    }
  };

  return (
    <div className="page-container">
        <div className="login-container">
            <h1 className="login-heading">Login</h1>
            <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
            margin="normal"
            className='textFieldinput'
            />
            <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            className='textFieldinput'
            />
            <button className='login-button' variant="contained" color="primary" onClick={handleLogin}>
            Login
            </button>
    </div>
  </div>
  );
}

export default LoginPage;
