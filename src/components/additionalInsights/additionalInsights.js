import React, {useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import './additionalInsights.css';
import statusesData from '../../components/statuses.json'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import data from '../newPlan/RecoursePlan.json';





// let StatusManager = (props) => {
//     const { statusId } = props;
//     const statusObj = statusesData.statuses.find(s => s.id === statusId);


//     switch (statusObj?.value) {
//       case 'Very difficult':
//         return <div>this is Very difficult</div>

//       case 'Difficult':
//         return <div>this is  Difficult</div>

//       case 'Default':
//         return <div className="defaultStatus">
//             <DoDisturbOnIcon fontSize="small" className="defaultIcon" color="#FF8F00"/>
//             <p class="defaultText">DEFAULT</p> 
//             </div>

//       case 'Easy':
//             return <div>this is  Easy</div>

//       case 'Very easy':
//         return <div>this is Very Easy</div>
        
//       default:
//         return <div>oops</div>
        
//     }
  
//   }




function AdditionalInsight (props) {
    const initialScalers = [3, 3, 3]; // Initial scalers array
    const [scalers, setScalers] = useState(initialScalers);
    const [statuses, setStatuses] = useState(Array(initialScalers.length).fill('moderate'));


    
    const [featureList,setFeatureList] = useState(data.features)
    
    // Function to handle scaler change for a specific index
  const handleScalerChange = (event, index) => {
    const newScaler = parseInt(event.target.value);

    // Create a new copy of the scalers array and update the scaler at the given index
    const updatedScalers = [...scalers];
    updatedScalers[index] = newScaler;
    setScalers(updatedScalers);

    // Update the status for the given index
    updateStatus(newScaler, index);
  };


  // Function to update the status based on the scaler value for a specific index
  const updateStatus = (scalerValue, index) => {
    // Logic to determine the status based on the scaler value
    let newStatus = '';
    let statusClass = '';

    switch (scalerValue) {
      case 1:
        newStatus = 'Very Difficult';
        statusClass = 'very-difficult';
        break;
      case 2:
        newStatus = ' Difficult';
        statusClass = 'difficult';
        break;
      case 3:
        newStatus = 'moderate';
        statusClass = 'moderate';
        break;
      case 4:
        newStatus = 'Easy';
        statusClass = 'easy';
        break;
      case 5:
        newStatus = 'Very Easy';
        statusClass = 'very-easy';
        break;
      default:
        newStatus = '';
        statusClass = '';
    }

    // Create a new copy of the statuses array and update the status at the given index
    const updatedStatuses = [...statuses];
    updatedStatuses[index] = newStatus;
    setStatuses(updatedStatuses);  
    
    const statusElement = document.getElementById(`status-${index}`);
    if (statusElement) {
        statusElement.className = `status ${statusClass}`;
    }
    
  };

  


  useEffect(() => {
      if(props?.feedback != null) {
          setFeatureList(props?.feedback.feedback.features)
      }

  }, [props?.feedback])
  

        return <div className="AiOuterLayout">
            
        {props?.isdefault ? <div className="AiTittle">Additional Insights (optional)</div> : null}
          {props?.isdefault ?   <div className="AiLayout">
              {featureList && featureList.map((item,index) => (
                <div className="AiBox" key={index}>
                    <div className="AiTitleOfBox">
                        <div>{item.name}
                            <small className="differencesAmount">{item.valueDiff}</small>
                        </div>
                        <div id={`status-${index}`} className="status">
                           {statuses[index]}
                        </div>
                    </div>
                    <hr className="seperateLine" />

                    <p className="bodyText">How much is it achievable for you?  </p>
                    <div className="sclaerContainer">
                        <small>very difficult</small>
                        <Box sx={{ width: 300 }}>
                            <Slider
                                aria-label="Temperature"
                                // defaultValue={}
                                value={scalers[index]}
                                onChange={(event) => handleScalerChange(event, index)}
                                key={index}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={1}
                                max={5}
                                size="small"
                            />
                        </Box>
                        <small>very easy</small>
                    </div>

                    <p className="bodyTextSecondQuestion">The maximum affordable increment: 
                        <div className="input-container">
                            <input type="number" className="custom-input" value="800"  />
                        </div>
                    </p>
                </div>
              ))  }
            </div> : null}
        </div>
    
}
  
export default AdditionalInsight;
