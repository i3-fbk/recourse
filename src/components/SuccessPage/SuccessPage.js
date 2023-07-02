import React from "react";
import Grid from '@mui/material/Grid';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './SuccessPage.css'

function SuccessPage(params) {
    return <Grid className="layout">
        <Grid>
            <p className="blueTitle">Congratulations!!!</p>
            <p>Your "Loan Approaval" is accepted 🎉 </p>
        </Grid>
        <div className="okButtonContainer">
          {/* <button className='okButton'>OK and return</button> */}
          <Link className="okButton" to="/">OK and return</Link>
        </div>
    </Grid>
}


export default SuccessPage;