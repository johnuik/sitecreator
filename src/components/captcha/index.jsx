import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import Loader from "../loader";
import "../../styles/captcha.css";
const GRID_SIZE = 10;
const SECRET_KEY = "your_secret_key";

const Captcha = () => {
  const [captcha, setCaptcha] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [response, setResponse] = useState(null);
  const [timer, setTimer] = useState(300);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const puzzleRef = useRef(null);
  const containerRef = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });

  const fetchCaptcha = async () => {
    try {
      const res = await axios.get("http://192.168.225.128:5000/generate-captcha");
      setCaptcha(res.data);
      setPosition({ x: 20, y: 230 });
      setTimer(30);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    document.title = "Puzzle Captcha";
    fetchCaptcha();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      fetchCaptcha();
    }
  }, [timer]);

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = puzzleRef.current.getBoundingClientRect();
    startPosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging || !containerRef.current || !captcha) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - startPosition.current.x;
    const y = e.clientY - containerRect.top - startPosition.current.y;

    const newX = Math.max(0, Math.min(x, containerRect.width - 40));
    const newY = Math.max(0, Math.min(y, containerRect.height - 40));

    const magneticThreshold = 20;
    const xDiff = Math.abs(targetPosition.x - newX);
    const yDiff = Math.abs(targetPosition.y - newY);

    let finalX, finalY;

    if (xDiff <= magneticThreshold && yDiff <= magneticThreshold) {
      finalX = targetPosition.x;
      finalY = targetPosition.y;
    } else {
      finalX = newX;
      finalY = newY;
    }

    setPosition({ x: finalX, y: finalY });
  };

  const handleMouseUp = async () => {
    if (!dragging) return;

    setDragging(false);

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = position.x;
    const y = position.y;

    const isOverMainImage =
      x >= 0 &&
      x <= containerRect.width - 40 &&
      y >= 0 &&
      y <= containerRect.height - 40;

    if (!isOverMainImage) {
      setResponse({
        status: 403,
        message: "Puzzle bo'lakcha rasm ustida emas!",
      });
      return;
    }

    try {
      const roundedX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
      const roundedY = Math.round(position.y / GRID_SIZE) * GRID_SIZE;
      const hashValue =  CryptoJS.SHA256(`${roundedX+GRID_SIZE},${roundedY+GRID_SIZE},${SECRET_KEY}`).toString(CryptoJS.enc.Hex);

      const res = await axios.post("http://192.168.225.128:5000/verify-captcha",{}, {
        headers: {
          "captcha-id": captcha.captchaId,
          "point": hashValue
        }
      });

      if (res.status === 200 && res.data.success) {
        setResponse({
          status: 200,
          message: "true success",
        });
      } else {
        setResponse({
          status: 403,
          message: "false incorrect-answer",
        });
      }
      setTimeout(() => {
        fetchCaptcha();
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setResponse({
          status: 403,
          message: "false incorrect-answer",
        });
        setTimeout(() => {
          fetchCaptcha();
        }, 1000);
      } else {
        console.error("Internal server error", error);
        alert("Server bilan bog'lanishda xatolik!");
      }
    }
  };

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };


  if (!captcha)
    return (
      <div className="d-center">
        <Loader />
      </div>
    );

  return (
    <div style={{ width: '300px' }}>
      <div className="result-box" style={{  width: '100%'}}>
        {response && (
          <p
            className={`${
              response?.status !== 403 ? "bg-success" : "bg-danger"
            }`}
          >
            {response.message}
          </p>
        )}
      </div>
      <div
        ref={containerRef}
        className="puzzle-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        style={{
          cursor: dragging ? "move" : "default",
          position: "relative",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        
        <img
          src={captcha.mainImage}
          alt="Main CAPTCHA"
          className="full-img"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            pointerEvents: "none",
          }}
        />
        <div className="progress-bar-container" style={{ width: '100%', height: '10px', backgroundColor: '#f8f7f7', marginTop: '-7px' }}>
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${((30 - timer) / 30) * 100}%`, 
            height: '100%', 
            backgroundColor: '#0000ff',
            transition: 'width 1s linear'
          }}
        />
      </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isHovering || dragging ? "move" : "default",
            zIndex: 10,
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          <img
            ref={puzzleRef}
            src={captcha.puzzlePiece}
            alt="Puzzle Piece"
            className="puzzle-img"
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          />
        </div>
        <button onClick={fetchCaptcha} className="btn-captcha">
          <img src="/assets/images/update.jpg" alt="Upload" />
        </button>
      </div>
    </div>
  );
};

export default Captcha;
