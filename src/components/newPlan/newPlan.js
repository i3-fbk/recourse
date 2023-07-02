import React,{useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import '../newPlan/newPlan.css';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AdditionalInsight from '../additionalInsights/additionalInsights';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import axios, * as others from 'axios';
// the "data" that has imported below is a sample json named "RecoursePlan.json", and you can replace it with desired json.
// and this json is to show the first plan (Plan A)
import data from './RecoursePlan.json';
import DiscardedPlans from '../discardedPlans/discardedPlans.js';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useSelector } from 'react-redux';
import {useLocation} from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Modal from 'react-modal';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      width: '600px',
      height: '400px',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      borderRadius: '16px'
    },
  };


    function Welcome(props) {

        const location = useLocation();
        const navigate = useNavigate();
        const [value, setValue] = useState(false);
        const [isdefault, setIsdefault] = useState(false);
        const [selectedDiv, setSelectedDiv] = useState(null);
        const [activeDiscardedPlan, setActiveDiscardedPlan] = useState(false);
        const [feedback, setFeedback] = useState(null);
        const [planName, setPlanName] = useState("plan A");
        const [activeButton, setActiveButton] = useState(false);
        const [featureList,setFeatureList] = useState(data.features)
        const [discardedPlans,setDiscardedPlans] = useState(data.features)
        const [isLoading, setIsLoading] = useState(false);
        const [overalSatisfication, setOveralSatisfication] = useState(null)
        const inputValue = useSelector((state) => state.rootReducer.inputValue);
        const scalerValue = useSelector((state) => state.rootReducer.scalerValue);
        const [isModalOpen, setIsModalOpen] = useState(false);
     
        // This recourse data below is a static sample and it should be change with dinamic information from dataset
        const [recoursesData, setRecourseData] = useState({
            "userId" : "#",
            "planId" : "01", 
            "overalSatisfication": overalSatisfication,
            "newConfig" : [{
                "name" :"FICO score",
                "newValue" : 700,
                "levelOfDifficulty": 2
            },
            {
                "name" :"Credit utilisation",
                "newValue" : 80.5,
                "levelOfDifficulty": 1
            },{
                "name" :"Loan amount",
                "newValue" : 30,
                "levelOfDifficulty": 3
            }]
                })
    

        const updateUserPrefrences = () => {
           // This function will update user prefrences with new values othervise will sent default values.
          
           // update prefrence value based on inputes.
           inputValue && inputValue.map((newValue,index) => {
                setRecourseData((prevData) => {
                const updatedConfig = [...prevData.newConfig];
                updatedConfig[index].newValue = newValue;
            
                return {
                  ...prevData,
                  newConfig: updatedConfig,
                };
              }); 
            })

          // update level of difficulty based on scaler.  
          scalerValue && scalerValue.map((value,index) => {
            setRecourseData((prevData) => {
                const updatedConfig = [...prevData.newConfig];
                updatedConfig[index].levelOfDifficulty = value;
            
                return {
                  ...prevData,
                  newConfig: updatedConfig,
                };
              }); 
          })  
        }     

        const handleClick = (divId) => {
            setSelectedDiv(divId);
            setValue(true)
            setActiveButton(true)
            setOveralSatisfication(divId)
          };


          useEffect(() => {
            // everytime that user changes the overalsatisfication, the value of OS will be updated in recourse json.
            setRecourseData(prevData => ({ 
                ...prevData,
                 "overalSatisfication": overalSatisfication,
                }))
            //this function can update user prefrences    
            updateUserPrefrences()

        }, [overalSatisfication,inputValue])
          
      
        
      

        useEffect(() => {
        // Handling the drop down for additional insights
            if(value){
                setIsdefault(true)
            }
             if(value === false) {
                setIsdefault(false)
            }
        }, [value])
        
        useEffect(() => {
            //receiving new recourse plan (feedback) from server and save it in FeatureList
            if (feedback != null && feedback.feedback?.planName) {
                setPlanName(feedback.feedback.planName)
                setFeatureList(feedback.feedback.features)
                
            }
            const newList = [...discardedPlans]
            setDiscardedPlans(newList)
        
            
        }, [feedback?.feedback])
        
       

        function sendJsonToServer() {
        // This function send json including recourse information and use prefrences to the server after clicking on Propose new plan button
        
        setIsLoading(true);

          axios.post('http://localhost:5001/submit-form', recoursesData)
            .then(res => {
              setIsLoading(false);
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
        
        const handleOpenModal = () => {
            setIsModalOpen(true);
          };
          
          const handleConfirm = () => {
            // Perform actions when "Yes" button is clicked
            setIsModalOpen(false);
            navigate('/quit')
          };
          
          const handleCancel = () => {
            // Perform actions when "No" button is clicked
            setIsModalOpen(false);
          };
       
        return <Grid>
            <div className="planGoal">
                    <h2 className="">Recourse Page</h2>
                  
                </div>
                <div className="topMessage">
                    <Grid  item className="userName">
                        <div className="GeneralTitle">Message</div>
                        <div className="GeneralSubTitle">Oops! your loan approaval has been rejected, check recourses below. </div>
                    </Grid>
                </div>

                
                    {isLoading ?  <div className="overlay">
                    <span className='loader'></span></div> : null}
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

                        <AdditionalInsight 
                            isdefault={isdefault} 
                            featureList={featureList} 
                            feedback={feedback}
                        />

                       
                            {value && <Tooltip title='close additional insights'>
                                <CloseFullscreenIcon 
                                className="CloseFullscreenIcon"
                                onClick={e => setValue(false)} /> 
                                </Tooltip>}
                            <div className="button-container-keep">
                                <button className={activeButton ? "ButtonForKeepPlan" : "DisabledButtonForKeepPlan"}>KEEP THE PLAN</button>
                            </div>    
                        
                     </Grid>
                    <div className="SecondButtonContainer">
                        <button className={activeButton ? "ButtonForProposeNewPlan" : "disabledButton"} onClick={sendJsonToServer}>PROPOSE NEW PLAN</button>
                    </div>
                    <p className="discardedPlansText">Discarded plans</p>
                   {activeDiscardedPlan ? 
                   <DiscardedPlans overalSatisfication={overalSatisfication} discardedPlans={discardedPlans} /> : 
                   <p className="emptyMessage">The history list is empty!</p> }

                    <div className="RejectingButtonContainer">
                        <button className="RejectingButton" onClick={handleOpenModal}> Quit Recourse Page</button>
                        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={modalStyles}>
                        <h2>Are you sure you want to leave?</h2>
                        <button className="confirmToExit" onClick={handleConfirm}>Yes</button>
                        <button className="rejectToExit" onClick={handleCancel}>No</button>
                        </Modal>
                    </div>  
         </Grid>
    }


export default Welcome;