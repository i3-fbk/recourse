import React from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./messagePage.css";

function MessagePage() {
  const navigate = useNavigate();

  const goToRecoursePage = () => {
    navigate("/recourse");
  };

  return (
    <Grid>
      <p className="MainTitle">Message!</p>
      {/* <h5 className="subtitleForMaintitle">Now you can keep go on with this plan for getting the loan approaval.</h5> */}

      <Grid className="layout">
        <div className="text-container">
          Your request for the loan approaval has been rejected. You can click
          on “Recourse Page” button to direct to the Recourse page and to
          receive a plan for getting the loan approval
          <Grid className="MessageButton">
            <button
              className="GotoRecoursePageButton"
              onClick={goToRecoursePage}
            >
              RECOURSE PAGE
            </button>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}

export default MessagePage;
