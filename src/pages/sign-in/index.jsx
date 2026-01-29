import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Captcha from "../../components/captcha";
import { ec as EC } from "elliptic";
import { METHOD } from "../../api/zirhrpc";
import { sendRpcRequest } from "../../api/webClient";
import { useZirhStref } from "../../context/ZirhContext";
import SHA256 from "crypto-js/sha256";
import toast from "react-hot-toast";

const ec = new EC("secp256k1");
const BN = require("bn.js");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SignIn = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [keyPair, setKeyPair] = useState(null);
  const [step, setStep] = useState(1);
  const [uuidCaptcha, setUuidCaptcha] = useState(null);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  //   const [uuidR, setUuidR] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const { stRef } = useZirhStref();
  const [randomText, setRandomText] = useState("");
  const captchaRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const refreshCaptchaFromParent = () => {
    console.log("test captcha");
    captchaRef.current?.refreshCaptcha();
  };

  const deriveKeyPairFromPassword = (password) => {
    const hash = SHA256(password).toString();
    const keyPair = ec.keyFromPrivate(hash, "hex");
    const privateKey = keyPair.getPrivate("hex");

    return hash;
  };

  const generateRandomText = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  const handleLogin = async (xc, y, captchaId) => {
    try {
      refreshCaptchaFromParent();

      const key = deriveKeyPairFromPassword(password);

      const k = ec.genKeyPair().getPrivate(); // Tasodifiy k
      console.log("K:", k);
      const R = ec.g.mul(k).encode("hex", false);

      const res1 = await sendRpcRequest(stRef, METHOD.LOGIN_CHECK, {
        1: email,
        2: R,
        3: captchaId,
        4: xc,
        5: y,
      });

      if (res1.status !== METHOD.OK) {
        if (res1.status === METHOD.CAPTCHA_ERR) {
          toast.error("Captcha natijasi xato!");
          setOpen(false);
          refreshCaptchaFromParent();
          return;
        } else if (res1.status == METHOD.Not_Found) {
          if (res1.result["1"] == "user not found") {
            toast.error("Bunday foydalanuvchi mavjud emas!");
            setOpen(false);
            refreshCaptchaFromParent();
          }
        }
        setOpen(false);
        return;
      }
      if (res1.status == METHOD.OK) {
        toast.success(email + " pochta manziliga tasdiqlash kodi yuborildi");
        setSeconds(120);
        setIsRunning(true);
      }

      const uuidR = res1.result["1"].id;

      const x = new BN(key, "hex");
      const c = new BN(res1.result["1"].c, "hex");
      const n = ec.curve.n;
      const s = k.add(c.mul(x)).umod(n);

      const newS = s.toString("hex");

      const res2 = await sendRpcRequest(stRef, METHOD.LOGIN_GET_OTP, {
        1: uuidR,
        2: newS,
      });
      if (res2.status === METHOD.BAD_REQUEST) return;

      if (res2.status == METHOD.PASSWORD_ERR) {
        toast.error("Parol xato!");
        setOpen(false);
        return;
      }
      if (res2.status === METHOD.OK) {
        setUuidCaptcha(res2.result[1].uuid);
        setStep(2);
        setOpen(false);
      }
    } catch (err) {
      toast.error("Xatolik yuz berdi!");
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (seconds === 0) {
      setIsRunning(false);
      setStep(1);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isRunning]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleLogin2 = async (x, y, captchaId) => {
    const rT = generateRandomText(10);
    setRandomText(rT);
    try {
      refreshCaptchaFromParent();

      console.log({ uuidCaptcha, x, y, captchaId });
      const res = await sendRpcRequest(stRef, METHOD.LOGIN_VERIFY_OTP, {
        1: uuidCaptcha,
        2: code,
        4: captchaId,
        5: x,
        6: y,
      });
      if (res.status === METHOD.OK) {
        toast.success("Muvaffaqiyatli tizimga kirdingiz");
        localStorage.setItem("checkUser", randomText);
        navigate("/page/dashboard");
      } else {
        if (res.status == METHOD.OTP_ERR) {
          toast.error("Tasdiqlash kodi xato!");
        }
        if (res.status == METHOD.CAPTCHA_ERR) {
          setOpen2(false);
          refreshCaptchaFromParent();
          toast.error("Captcha natijasi xato!");
        }
      }
      setOpen2(false);
    } catch (error) {}
  };

  const handleClickOpen = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
      setOpen(false);
      return;
    }

    if (password.length < 8) {
      setOpen(false);
      return;
    }

    setOpen(true);
  };

  const handleClickOpen2 = (e) => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleCaptchaSolve = async ({ x, y, captchaId }) => {
    await handleLogin(x, y, captchaId);
  };
  const handleCaptchaSolve2 = async ({ x, y, captchaId }) => {
    console.log({ x, y, captchaId });
    await handleLogin2(x, y, captchaId);
  };

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://10.10.115.40:8080/wsock`);

    ws.onopen = () => console.log("✅ WS connected");
    ws.onmessage = (e) => console.log("📩 message", e.data);
    ws.onerror = (err) => console.error("❌ WS error", err);

    return () => ws.close();
  }, []);
  return (
    <>
      <div className="flex justify-center items-center">
        <section className="bg-white dark:bg-white flex flex-wrap min-h-[100vh] max-w-7xl w-full">
          <div className="lg:w-1/2 lg:block hidden">
            <div className="flex items-center flex-col h-full justify-center">
              <img src="../assets/images/auth-img.jpg" alt="img" />
            </div>
          </div>
          {step === 1 && (
            <div className="lg:w-1/2 py-8 px-6 flex flex-col justify-center">
              <div className="lg:max-w-[464px] mx-auto w-full">
                <div className="mb-5">
                  <div className="w-full justify-center flex items-center gap-[5px] mb-8">
                    <img
                      src="../assets/images/jamoa.jpg"
                      className="w-[90px] h-[100px]"
                      alt="Jamoa"
                    />
                  </div>
                </div>
                <form action="#">
                  <div className="icon-field mb-4 relative">
                    <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                      <iconify-icon icon="mage:email" />
                    </span>
                    <input
                      type="email"
                      className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-neutral-50 rounded-xl"
                      placeholder="Email manzilingizni kiriting"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative mb-5">
                    <div className="icon-field">
                      <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                        <iconify-icon icon="solar:lock-password-outline" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-neutral-50 rounded-xl"
                        id="your-password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {showPassword ? (
                      <span
                        className="toggle-password ri-eye-off-line cursor-pointer absolute end-0 top-1/2 -translate-y-1/2 me-4 text-secondary-light"
                        data-toggle="#your-password"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <span
                        className="toggle-password ri-eye-line cursor-pointer absolute end-0 top-1/2 -translate-y-1/2 me-4 text-secondary-light"
                        data-toggle="#your-password"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                  <div className="mt-7">
                    <div className="flex justify-between gap-2 items-center">
                      <div className="flex items-center"></div>
                      <Link
                        to="/forgot-password"
                        className="text-primary-600 font-medium hover:underline"
                      >
                        Parolni tiklash?
                      </Link>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary justify-center text-sm btn-sm px-3 py-4 w-full rounded-xl mt-8"
                    onClick={handleClickOpen}
                  >
                    Kirish
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="lg:w-1/2 py-8 px-6 flex flex-col justify-center">
              <div className="lg:max-w-[464px] mx-auto w-full">
                <div className="mb-5">
                  <div className="w-full justify-center flex items-center gap-[5px] mb-8">
                    <img
                      src="../assets/images/jamoa.jpg"
                      className="w-[90px] h-[100px]"
                      alt="Jamoa"
                    />
                  </div>
                  <div>
                    <a
                      href={`mailto:${email}`}
                      className="text-blue-500 dark:text-blue-500 text-bold"
                    >
                      <b>{email}</b>
                    </a>{" "}
                    pochta manziliga tasdiqlash kodi yuborildi. Kod amal qilish
                    muddati:{" "}
                    <b className="text-green-400">{formatTime(seconds)} </b>
                  </div>
                </div>
                <form action="#">
                  <div className="icon-field mb-4 relative">
                    <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none flex text-xl">
                      <iconify-icon icon="mage:email" />
                    </span>
                    <input
                      type="number"
                      className="form-control h-[56px] ps-11 border-neutral-300 bg-neutral-50 dark:bg-neutral-50 rounded-xl"
                      placeholder="Kodni kiriting"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary justify-center text-sm btn-sm px-3 py-4 w-full rounded-xl mt-8"
                    onClick={handleClickOpen2}
                  >
                    Tasdiqlash
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogContent>
          <Captcha ref={captchaRef} onSolve={handleCaptchaSolve} />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose2}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogContent>
          <Captcha ref={captchaRef} onSolve={handleCaptchaSolve2} />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default SignIn;
