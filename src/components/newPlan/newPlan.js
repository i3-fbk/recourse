import React,{useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import '../newPlan/newPlan.css'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import MoodScaler from './moodScaler/moodScaler';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AdditionalInsight from '../additionalInsights/additionalInsights';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import axios, * as others from 'axios';
import data from './data.json';
import DiscardedPlans from '../discardedPlans/discardedPlans.js';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


function PlanData(value,befor,after,increment) {
 
        return <div className="PlanData">
            <span className="dataTitle">feature {value}</span>
            <div className="innerDisplayNewPlan">
                <span><ArrowUpwardRoundedIcon fontSize="large" className={increment ? "upwardArrow" : "downward"} /></span> 
                <span className="dataAmount">{befor}</span>
                <span><ArrowRightAltIcon /></span>
                <span className="dataAmount">{after}</span>
            </div>
          
        </div>
}  


    function Welcome() {

        const [value, setValue] = useState(false);
        const [isdefault, setIsdefault] = useState(false);
        const [selectedDiv, setSelectedDiv] = useState(null);
        const [activeDiscardedPlan, setActiveDiscardedPlan] = useState(false);
        const [feedback, setFeedback] = useState(null);
        const [planName, setPlanName] = useState("plan A");
        const [activeButton, setActiveButton] = useState(false);
        const [featureList,setFeatureList] = useState(data.features)
        const [discardedPlans,setDiscardedPlans] = useState(data.features)
        
     
        // const [feedbackData,setFeedbackData] = useState({
        //     title : 0,
        //     numberOfFeatures: 3,
        //     features : {
        //         features1Before: 600,
        //         features1After: '800',
        //         features2Before: 90.1,
        //         features2After: '63.5',
        //         features3Before: '25K',
        //         features3After: '40K',
        //     },

        // })


        const handleClick = (divId) => {
            setSelectedDiv(divId);
            setValue(true)
            setActiveButton(true)
          };

        useEffect(() => {
            if(value){
                setIsdefault(true)
            }
             if(value === false) {
                setIsdefault(false)
            }
        }, [value])
        

        useEffect(() => {
            if (feedback != null && feedback.feedback?.planName) {
                setPlanName(feedback.feedback.planName)
                setFeatureList(feedback.feedback.features)
                
            }
            const newList = [...discardedPlans]
            setDiscardedPlans(newList)
        
            
        }, [feedback?.feedback])
        
       

        function sendJsonToServer() {
        
          axios.post('http://localhost:5001/submit-form', data)
            .then(res => {
              setFeedback(res.data);
              console.log(`Server responded with status code ${res.status}`);
            })
            .catch(err => {
              console.error("Error:",err);
            });

            setActiveDiscardedPlan(true)
            setActiveButton(false)
            setValue(false)
            setSelectedDiv(null)
        }
        

        return <Grid >
                <div className="planGoal">
                    <p className="returnButton"><ArrowBackIosIcon />  <Link style={{color: "#106FDF", textDecoration: 'none'}} to="/">Return to initial Page</Link></p>
                    <p>Plan for: Loan Approaval</p>
                </div>
                    <Grid className="layout">
                    <div className="planTitle">{planName}</div>
                    <Grid container spacing={1} className="innerLayout">
                  { featureList && featureList.map((item,index) => (
                      <div key={index} className="PlanData">
                      <span className="dataTitle">{item.name}</span>
                          <div className="innerDisplayNewPlan">
                              <span><ArrowUpwardRoundedIcon fontSize="large" className={item.valueInc ? "upwardArrow" : "downward"} /></span> 
                              <span className="dataAmount">{item.valueBefore}</span>
                              <span><ArrowRightAltIcon /></span>
                              <span className="dataAmount">{item.valueAfter}</span>
                          </div>
                      </div>
                  ))}
                    </Grid>

                        <p className="moodScalerQuestion">What do you think about this suggested plan?</p>
                        {/* <MoodScaler isdefault={value}  /> */}

                        <div className="moodScalerLayout">
                            <div 
                            className={selectedDiv === 1 ? 'withBorder' : 'innerMoodScalerLayout'}
                            onClick={() => handleClick(1)}
                            style={{
                             cursor: 'pointer',
                             border: selectedDiv === 1 ? '2px solid #106FDF' : ''
                           }}><p>Terrible</p><p>😣</p></div>
                            <div 
                            className={selectedDiv === 2 ? 'withBorder' : 'innerMoodScalerLayout'}
                            onClick={() => handleClick(2)}
                            style={{
                            cursor: 'pointer',
                            border: selectedDiv === 2 ? '2px solid #106FDF' : ''
                             }}><p>Bad</p><p>🙁</p></div>

                            <div
                             className={selectedDiv === 3 ? 'withBorder' : 'innerMoodScalerLayout'}
                             onClick={() => handleClick(3)}
                             style={{
                             cursor: 'pointer',
                             border: selectedDiv === 3 ? '2px solid #106FDF' : ''
                              }}
                            ><p>Neutral</p><p>😶</p></div>
                            <div 
                             className={selectedDiv === 4 ? 'withBorder' : 'innerMoodScalerLayout'}
                             onClick={() => handleClick(4)}
                             style={{
                             cursor: 'pointer',
                             border: selectedDiv === 4 ? '2px solid #106FDF' : ''
                              }}
                            ><p>Good</p><p>😃</p></div>
                            <div
                             className={selectedDiv === 5 ? 'withBorder' : 'innerMoodScalerLayout'}
                             onClick={() => handleClick(5)}
                             style={{
                             cursor: 'pointer',
                             border: selectedDiv === 5 ? '2px solid #106FDF' : ''
                              }}
                            ><p>Great</p><p>😍</p></div>
                        </div>

                        <AdditionalInsight isdefault={isdefault} />
                        <div className="MainButtonContainer">
                            <CloseFullscreenIcon 
                                className="CloseFullscreenIcon"
                                onClick={e => setValue(false)}  />
                            <button className={activeButton ? "ButtonForKeepPlan" : "DisabledButtonForKeepPlan"}>KEEP THE PLAN</button>
                        </div>
                     </Grid>
                    <div className="SecondButtonContainer">
                        <button className={activeButton ? "ButtonForProposeNewPlan" : "disabledButton"} onClick={sendJsonToServer}>PROPOSE NEW PLAN</button>
                    </div>
                    <p className="discardedPlansText">Discarded plans</p>
                   {activeDiscardedPlan ? <DiscardedPlans discardedPlans={discardedPlans} /> : <p className="emptyMessage">The history list is empty!</p> }
         </Grid>
  }


export default Welcome;