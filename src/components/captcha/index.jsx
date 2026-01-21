import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Loader from "../loader";
import "../../styles/captcha.css";
import { METHOD } from "../../api/zirhrpc";
import { sendRpcRequest } from "../../api/webClient";
import { useZirhStref } from "../../context/ZirhContext";

const GRID_SIZE = 10;

const Captcha = forwardRef(({ onSolve }, ref) => {
  const [captcha, setCaptcha] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 230 }); // Boshlang'ich pozitsiya
  const [timer, setTimer] = useState(30);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  const puzzleRef = useRef(null);
  const containerRef = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const { stRef } = useZirhStref();
  const [oldCaptcha, setOldCaptcha] = useState(null);

  // Captchani yangilash funksiyasi
  const fetchCaptcha = async () => {
    try {
      // Yangilashdan oldin eski holatlarni tozalaymiz
      setCaptcha(null); 
      
      const res = await sendRpcRequest(stRef, METHOD.CAPTCHA_GET, {});
      // console.log(res);
      if (res.status === METHOD.OK) {

        
        setCaptcha(res.result[1]);
        setPosition({ x: 20, y: 230 }); // Puzzleni joyiga qaytarish
        setDragging(false);            // Draggingni to'xtatish
        setTimer(30);                  // Timerni yangilash
      }
    } catch (error) {
      console.error("Captcha yuklashda xatolik:", error);
    }
  };

  // Tashqaridan (ref orqali) chaqirish uchun
  useImperativeHandle(ref, () => ({
    refreshCaptcha: fetchCaptcha,
  }));

  useEffect(() => {
    fetchCaptcha();
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      fetchCaptcha();
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleMouseDown = (e) => {
    if (!captcha) return;
    setDragging(true);
    const rect = puzzleRef.current.getBoundingClientRect();
    startPosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging || !containerRef.current || !captcha) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - startPosition.current.x;
    const y = e.clientY - containerRect.top - startPosition.current.y;

    // Chegaralardan chiqib ketmaslik
    const newX = Math.max(0, Math.min(x, containerRect.width - 40));
    const newY = Math.max(0, Math.min(y, containerRect.height - 40));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);

    const roundedX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
    const roundedY = Math.round(position.y / GRID_SIZE) * GRID_SIZE;

    if (onSolve) {
      onSolve({ x: roundedX, y: roundedY, captchaId: captcha.captchaId });
    }
  };

  // Refresh tugmasi uchun maxsus handler
  const handleRefreshClick = (e) => {
    setOldCaptcha(captcha)
    e.preventDefault();
    e.stopPropagation(); // OnMouseUp va boshqa eventlar ishlab ketmasligi uchun
    fetchCaptcha();
  };

  if (!captcha){
    return (
      <div className="d-center" style={{ height: "300px", minWidth: "300px"}}>
        <Loader />
      </div>
    );}

  return (
    <div style={{ width: "300px" }}>
      <div
        ref={containerRef}
        className="puzzle-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // Faqat konteyner ustida MouseDown bo'lganda ishlamasligi uchun ehtiyot bo'ling
        // Captcha piece (puzle) ustiga MouseDown qo'yish ma'qulroq
        style={{
          cursor: dragging ? "grabbing" : "default",
          position: "relative",
          userSelect: "none",
          overflow: "hidden"
        }}
      >
        <img
          src={captcha.mainImage}
          alt="Main CAPTCHA"
          className="full-img"
          style={{ pointerEvents: "none" }}
        />

        {/* Progress Bar */}
        <div
          className="progress-bar-container"
          style={{ width: "100%", height: "5px", backgroundColor: "#eee" }}
        >
          <div
            style={{
              width: `${(timer / 30) * 100}%`,
              height: "100%",
              backgroundColor: timer < 10 ? "red" : "#0000ff",
              transition: "width 1s linear",
            }}
          />
        </div>

        {/* Puzzle Piece */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: dragging ? "grabbing" : "grab",
            zIndex: 10,
          }}
        >
          <img
            ref={puzzleRef}
            src={captcha.puzzlePiece}
            alt="Piece"
            style={{ width: "60px", pointerEvents: "none" }}
          />
        </div>

        {/* Refresh Button */}
        <button 
          type="button"
          onClick={handleRefreshClick} 
          className="btn-captcha"
          style={{
            position: "absolute",
            right: "5px",
            bottom: "30px",
            zIndex: 20,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "50%",
            padding: "5px",
            cursor: "pointer"
          }}
        >
          <img 
            src="/assets/images/update.jpg" 
            alt="Refresh" 
            style={{ width: "20px", height: "20px" }}
          />
        </button>
      </div>
    </div>
  );
});

export default Captcha;