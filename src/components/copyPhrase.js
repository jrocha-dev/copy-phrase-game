"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import phrasesData from "../phrases.json";
import HUD from "./HUD";

const getRandomPhrase = (phrases) => {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex].text;
};

const CopyPhrase = () => {
  const [phrases] = useState(phrasesData.phrases);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [hearts, setHearts] = useState(6);
  const [timer, setTimer] = useState(300);
  const [progress, setProgress] = useState(0);
  const intervalIdRef = useRef(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [score, setScore] = useState(0);
  const [consecutivePoints, setConsecutivePoints] = useState(0);
  const inputRef = useRef(null);
  const messageRef = useRef(null);
  const phraseRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set currentPhrase only after the component mounts
  useEffect(() => {
    if (isMounted) {
      setCurrentPhrase(getRandomPhrase(phrases));
    }
  }, [isMounted, phrases]);

  const startTimer = useCallback(() => {
    const id = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);
    intervalIdRef.current = id;
  }, []);

  const resetGame = useCallback(() => {
    setTimer(300);
    setMessage("");
    setCurrentPhrase(getRandomPhrase(phrases));
    setInputValue("");
    setProgress(0);
    setErrorOccurred(false);
    setConsecutivePoints(0);

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    startTimer();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [phrases, startTimer]);

  useEffect(() => {
    if (isMounted) {
      startTimer();
      return () => clearInterval(intervalIdRef.current);
    }
  }, [startTimer, isMounted]);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalIdRef.current);
      setMessage("Time's up!");
    }
  }, [timer]);

  useEffect(() => {
    if (message === "Game Over! Try again." && messageRef.current) {
      messageRef.current.focus();
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [message]);

  useEffect(() => {
    if (hearts <= 0) {
      setMessage("Game Over! Try again.");
      setTimeout(resetGame, 3000);
    }
  }, [hearts, resetGame]);

  useEffect(() => {
    if (phraseRef.current && inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }, [currentPhrase]);

  const adjustHeight = () => {
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  };

  const handleCorrectInput = (value) => {
    inputRef.current.classList.remove("border-danger");
    setConsecutivePoints((prev) => prev + 1);
    // Update score
    let points = 5;
    if (consecutivePoints >= 30) points = 20;
    else if (consecutivePoints >= 20) points = 15;
    else if (consecutivePoints >= 10) points = 10;
    setScore((prevScore) => prevScore + points);
    if (value === currentPhrase) handleCorrectPhrase();
  };

  const handleCorrectPhrase = () => {
    const remainingTimeBonus = (timer + 1) * currentPhrase.length;
    setScore((prevScore) => prevScore + remainingTimeBonus);
    setHearts((prevHearts) => Math.min(prevHearts + 1, 20));
    setMessage("");
    setMessage("Congratulations!");
    setProgress((prev) => Math.min(prev + 100 / 15, 100));
    setTimeout(() => {
      setMessage("");
      setCurrentPhrase(getRandomPhrase(phrases));
      setInputValue("");
      setTimer(300);
      setConsecutivePoints(0);
    }, 2000);
  };

  const handleIncorrectPhrase = () => {
    inputRef.current.classList.add("border-danger");
    setConsecutivePoints(0);
    setErrorOccurred(true);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (errorOccurred) {
      if (value.length < inputValue.length || currentPhrase.startsWith(value)) {
        setInputValue(value);
        adjustHeight();
        // Reset error state
        setErrorOccurred(false);
        inputRef.current.classList.remove("border-danger");
      } else {
        // Prevent further typing
        e.preventDefault();
      }
      return;
    }

    setInputValue(value);
    adjustHeight();

    if (value.length < inputValue.length) {
      // if backspace
      // Reset consecutive points
      setConsecutivePoints(0);
      inputRef.current.classList.remove("border-danger");
    } else if (!currentPhrase.startsWith(value)) {
      // If the input is incorrect
      handleIncorrectPhrase();
    } else {
      handleCorrectInput(value);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        <HUD hearts={hearts} timer={timer} score={score} progress={progress} />
        <div className="text-center">
          <h2 className="mt-4 phrase-text" ref={phraseRef}>
            {currentPhrase.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </h2>
          <textarea
            rows={1}
            className="mt-3 phrase-text w-full border p-2"
            value={inputValue}
            onChange={handleChange}
            ref={inputRef}
            placeholder="Type the phrase here"
            aria-label="Type the phrase here"
          />
          {message && (
            <div
              className="mt-3 phrase-text p-2 bg-blue-200 text-blue-800"
              ref={messageRef}
              tabIndex="-1"
              aria-live="assertive"
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyPhrase;
