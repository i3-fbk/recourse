import React, {useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import './additionalInsights.css';
import statusesData from '../../components/statuses.json'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';



function DiscreteSlider() {
    return (
        <Box sx={{ width: 300 }}>
            <Slider
                aria-label="Temperature"
                defaultValue={2}
                //getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={4}
                size="small"
                 />
            {/* <Slider defaultValue={30} step={10} marks min={10} max={110} disabled /> */}
        </Box>
    );
}


let MyComponent = (props) => {
    const { statusId } = props;
    const statusObj = statusesData.statuses.find(s => s.id === statusId);


    switch (statusObj?.value) {
      case 'Very difficult':
        return <div>this is Very difficult</div>

      case 'Difficult':
        return <div>this is  Difficult</div>

      case 'Default':
        return <div className="defaultStatus">
            <DoDisturbOnIcon fontSize="small" className="defaultIcon" color="#FF8F00"/>
            <p class="defaultText">DEFAULT</p> 
            </div>

      case 'Easy':
            return <div>this is  Easy</div>

      case 'Very easy':
        return <div>this is Very Easy</div>
        
      default:
        return <div>oops</div>
        
    }
  
  }


function AdditionalInsight (props) {
          
        return <div className="AiOuterLayout">
            
        {props?.isdefault ? <div className="AiTittle">Additional Insights (optional)</div> : null}
          {props?.isdefault ?   <div className="AiLayout">
                <div className="AiBox">
                    <div className="AiTitleOfBox">
                        <div>Feature 1
                            <small className="differencesAmount">+18</small>
                        </div>
                        <div>
                           <MyComponent statusId={2} />
                        </div>
                    </div>
                    <hr className="seperateLine" />

                    <p className="bodyText">How much is it achievable for you?  </p>
                    <div className="sclaerContainer">
                        <small>very difficult</small>
                        <DiscreteSlider />
                        <small>very easy</small>
                    </div>

                    <p className="bodyTextSecondQuestion">The maximum affordable increment: 
                        <div className="input-container">
                            <input type="number" className="custom-input" value="800"  />
                        </div>
                    </p>
                </div>

                <div className="AiBox">
                <div className="AiTitleOfBox">
                        <div>Feature 2
                            <small className="differencesAmount">-26</small>
                        </div>
                        <div>
                           <MyComponent statusId={2} />
                        </div>
                    </div>
                    <hr className="seperateLine" />

                    <p className="bodyText">How much is it achievable for you?  </p>
                    <div className="sclaerContainer">
                        <small>very difficult</small>
                        <DiscreteSlider />
                        <small>very easy</small>
                    </div>

                    <p className="bodyTextSecondQuestion">The maximum affordable decrement: 
                        <div className="input-container">
                            <input type="number" className="custom-input" />
                        </div>
                    </p>
                </div>
                <div className="AiBox">
                <div className="AiTitleOfBox">
                        <div>Feature 3
                            <small className="differencesAmount">+15K</small>
                        </div>
                        <div>
                           <MyComponent statusId={2} />
                        </div>
                    </div>
                    <hr className="seperateLine" />

                    <p className="bodyText">How much is it achievable for you?  </p>
                    <div className="sclaerContainer">
                        <small>very difficult</small>
                        <DiscreteSlider />
                        <small>very easy</small>
                    </div>

                    <p className="bodyTextSecondQuestion">The maximum affordable increment: 
                        <div className="input-container">
                            <input type="number" className="custom-input"  />
                        </div>
                    </p>
                </div>
            </div> : null}
        </div>
    
}
  
export default AdditionalInsight;
