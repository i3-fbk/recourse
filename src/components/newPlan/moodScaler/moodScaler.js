import React, { useState } from "react";
import "../moodScaler/moodScaler.css";

function MoodScaler(props) {
  const { selectedDiv, index, plansDetails, handleClick } = props;

  return (
    <div key={index} className="moodScalerLayout">
      <div
        className={
            selectedDiv === 1 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => handleClick(1, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: selectedDiv === 1 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Terrible</p>
        <p>😣</p>
      </div>
      <div
        className={
            selectedDiv === 2 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => handleClick(2, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: selectedDiv === 2 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Bad</p>
        <p>🙁</p>
      </div>

      <div
        className={
            selectedDiv === 3 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => handleClick(3, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: selectedDiv === 3 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Neutral</p>
        <p>😶</p>
      </div>
      <div
        className={
          selectedDiv === 4 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => handleClick(4, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: selectedDiv === 4 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Good</p>
        <p>😃</p>
      </div>
      <div
        className={
          selectedDiv === 5 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => handleClick(5, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: selectedDiv === 5 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Great</p>
        <p>😍</p>
      </div>
    </div>
  );
}

export default MoodScaler;