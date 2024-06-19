"use client";

import React from "react";

const HUD = ({ hearts, timer, score, progress }) => {
  const renderHearts = (count, color) => {
    const heartsArray = [];
    for (let i = 0; i < count; i++) {
      heartsArray.push(
        <span key={i} className={`heart ${color}`}>
          &hearts;
        </span>
      );
    }
    return heartsArray;
  };

  return (
    <>
      <div className="flex justify-between items-center bg-gray-100 p-4">
        <div className="hearts">
          <div className="flex">
            {renderHearts(hearts > 10 ? 10 : hearts, "text-red-500")}
            {renderHearts(10 - (hearts > 10 ? 10 : hearts), "text-blue-300")}
          </div>
          <div className="flex">
            {renderHearts(hearts > 10 ? hearts - 10 : 0, "text-red-500")}
            {renderHearts(hearts > 10 ? 20 - hearts : 10, "text-blue-300")}
          </div>
        </div>
        <div className="timer">
          <h4 className="text-xl">{timer}</h4>
        </div>
        <div className="player-info text-right">
          <div className="player text-lg font-bold">Player</div>
          <div className="score text-xl font-mono">
            {score.toString().padStart(8, "0")}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full p-3 bg-gray-100">
        <div className="container mx-auto">
          <div className="h-5 bg-blue-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </>
  );
};

export default HUD;
