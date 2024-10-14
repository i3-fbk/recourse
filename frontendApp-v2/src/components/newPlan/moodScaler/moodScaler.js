import React, { useState } from "react";
import "./moodScaler.css";

function MoodScaler(props) {
  const { moodValues, index, plansDetails } = props;

  return (
    <div key={index} className="moodScalerLayout">
      <div
        className={
          moodValues[index] === 1 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => props.handleClick(1, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: moodValues[index] === 1 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Terrible</p>
        <p>😣</p>
      </div>
      <div
        className={
          moodValues[index] === 2 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => props.handleClick(2, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: moodValues[index] === 2 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Bad</p>
        <p>🙁</p>
      </div>

      <div
        className={
          moodValues[index] === 3 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => props.handleClick(3, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: moodValues[index] === 3 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Neutral</p>
        <p>😶</p>
      </div>
      <div
        className={
          moodValues[index] === 4 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => props.handleClick(4, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: moodValues[index] === 4 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Good</p>
        <p>😃</p>
      </div>
      <div
        className={
          moodValues[index] === 5 ? "withBorder" : "innerMoodScalerLayout"
        }
        onClick={() => props.handleClick(5, index, plansDetails)}
        style={{
          cursor: "pointer",
          border: moodValues[index] === 5 ? "2px solid #106FDF" : "",
        }}
      >
        <p>Great</p>
        <p>😍</p>
      </div>
    </div>
  );
}

export default MoodScaler;
