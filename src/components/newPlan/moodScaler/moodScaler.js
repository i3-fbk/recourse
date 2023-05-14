import React,{useState} from "react";
import '../moodScaler/moodScaler.css';


function MoodScaler() {

    const [isdefault, setIsdefault] = useState(false);


        return <div className="moodScalerLayout">
            <div className="innerMoodScalerLayout" onClick={e => setIsdefault(true)} ><p>Terrible</p><p>😣</p></div>
            <div className="innerMoodScalerLayout"><p>Bad</p><p>🙁</p></div>
            <div className="innerMoodScalerLayout"><p>Neutral</p><p>😶</p></div>
            <div className="innerMoodScalerLayout"><p>Good</p><p>😃</p></div>
            <div className="innerMoodScalerLayout"><p>Great</p><p>😍</p></div>
        </div>
    
}

export default MoodScaler;