import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sendRpcRequest } from "../../api/webClient";
import { METHOD } from "../../api/zirhrpc";
import { useZirhStref } from "../../context/ZirhContext";
import toast from "react-hot-toast";

const Header = () => {
  const location = useLocation();

  const [messageOpen, setMessageOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState({});

  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const { stRef } = useZirhStref();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (messageRef.current && !messageRef.current.contains(e.target))
        setMessageOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setNotificationOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await sendRpcRequest(stRef, METHOD.LOGIN_LOG_OUT, {});
      console.log(res);
      if (res.status == METHOD.OK) {
        localStorage.removeItem("AUTH_KEY_B64");
        localStorage.removeItem("data");
        localStorage.removeItem("checkUser");
        toast.success("Tizimdan muvaffaqiyatli chiqildi");
        window.location.href = "/login";
      }else{
        toast.error("Tizimdan chiqishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
     try {
       const resU = await sendRpcRequest(stRef, METHOD.USER_GET, {});
      if (resU.status === METHOD.OK) {
        setUser(resU.result[1]);
      } else if (resU.status === METHOD.Not_Found) {
        localStorage.removeItem("checkUser");
      }
     } catch (error) {
      console.log(error);
     }
    };

    getUser();
  }, []);

  return (
    <div className="navbar-header border-b border-neutral-200 dark:border-neutral-600">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="col-auto">
          <div className="flex flex-wrap items-center gap-[16px]">
            <button type="button" className="sidebar-toggle">
              <iconify-icon
                icon="heroicons:bars-3-solid"
                className="icon non-active"
              />
              <iconify-icon
                icon="iconoir:arrow-right"
                className="icon active"
              />
            </button>
            <button
              type="button"
              className="sidebar-mobile-toggle d-flex !leading-[0]"
            >
              <iconify-icon
                icon="heroicons:bars-3-solid"
                className="icon !text-[30px]"
              />
            </button>
            <form className="navbar-search">
              <input type="text" name="search" placeholder="Search" />
              <iconify-icon icon="ion:search-outline" className="icon" />
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-auto">
          <div className="flex flex-wrap items-center gap-3">
            {/* THEME TOGGLE */}
            <button
              type="button"
              id="theme-toggle"
              className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-full flex justify-center items-center"
            >
              <span id="theme-toggle-dark-icon" className="hidden">
                <i className="ri-sun-line" />
              </span>
              <span id="theme-toggle-light-icon" className="hidden">
                <i className="ri-moon-line" />
              </span>
            </button>

            {/* MESSAGE */}
            <div className="relative" ref={messageRef}>
              <button
                type="button"
                onClick={() => {
                  setMessageOpen(!messageOpen);
                  setNotificationOpen(false);
                  setProfileOpen(false);
                }}
                className="has-indicator w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex justify-center items-center"
              >
                <iconify-icon
                  icon="mage:email"
                  className="text-neutral-900 dark:text-white text-xl"
                />
              </button>

              {messageOpen && (
                <div
                  style={{ width: "340px" }}
                  className="z-10 absolute right-0 mt-2 bg-white dark:bg-neutral-700 rounded-2xl overflow-hidden shadow-lg max-w-[394px] w-full"
                >
                  <div className="py-3 px-4 rounded-lg bg-primary-50 dark:bg-primary-600/25 m-4 flex items-center justify-between gap-2">
                    <h6 className="text-lg text-neutral-900 font-semibold mb-0">
                      Messaage
                    </h6>
                    <span className="w-10 h-10 bg-white dark:bg-neutral-600 text-primary-600 dark:text-white font-bold flex justify-center items-center rounded-full">
                      05
                    </span>
                  </div>
                  <div className="scroll-sm !border-t-0 max-h-[400px] overflow-y-auto">
                    {[
                      "profile-3",
                      "profile-4",
                      "profile-5",
                      "profile-6",
                      "profile-7",
                    ].map((img, idx) => (
                      <a
                        key={idx}
                        className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 relative">
                            <img
                              className="rounded-full w-11 h-11"
                              src={`../assets/images/notification/${img}.png`}
                              alt="Profile"
                            />
                            <span className="absolute end-[2px] bottom-[2px] w-2.5 h-2.5 bg-success-500 border border-white rounded-full dark:border-gray-600" />
                          </div>
                          <div>
                            <h6 className="text-sm fw-semibold mb-1">
                              Kathryn Murphy
                            </h6>
                            <p className="mb-0 text-sm line-clamp-1">
                              hey! there i'm...
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className="text-sm text-neutral-500">
                            12:30 PM
                          </span>
                          <span className="w-4 h-4 text-xs bg-warning-600 text-white rounded-full flex justify-center items-center">
                            8
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="text-center py-3 px-4">
                    <a className="text-primary-600 dark:text-primary-600 font-semibold hover:underline text-center">
                      See All Message{" "}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* NOTIFICATION */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setMessageOpen(false);
                  setProfileOpen(false);
                }}
                className="has-indicator w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex justify-center items-center relative"
              >
                <iconify-icon
                  icon="iconoir:bell"
                  className="text-neutral-900 dark:text-white text-xl"
                />
                <span className="w-2 h-2 min-h-2 min-w-2 rounded-full bg-red-400 absolute bottom-[3px] right-[3px]"></span>
              </button>

              {notificationOpen && (
                <div
                  style={{ width: "340px" }}
                  className="z-10 absolute right-0 mt-2 bg-white dark:bg-neutral-700 rounded-2xl overflow-hidden shadow-lg max-w-[394px] w-full"
                >
                  <div className="py-3 px-4 rounded-lg bg-primary-50 dark:bg-primary-600/25 m-4 flex items-center justify-between gap-2">
                    <h6 className="text-lg text-neutral-900 font-semibold mb-0">
                      Notification
                    </h6>
                    <span className="w-10 h-10 bg-white dark:bg-neutral-600 text-primary-600 dark:text-white font-bold flex justify-center items-center rounded-full">
                      05
                    </span>
                  </div>
                  <div className="scroll-sm !border-t-0 max-h-[400px] overflow-y-auto">
                    {/* Notification items */}
                    <div className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 relative w-11 h-11 bg-success-200 dark:bg-success-600/25 text-success-600 flex justify-center items-center rounded-full">
                          <iconify-icon
                            icon="bitcoin-icons:verify-outline"
                            className="text-2xl"
                          />
                        </div>
                        <div>
                          <h6 className="text-sm fw-semibold mb-1">
                            Congratulations
                          </h6>
                          <p className="mb-0 text-sm line-clamp-1">
                            Your profile has been Verified. Your profile has
                            been Verified
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="text-sm text-neutral-500">
                          23 Mins ago
                        </span>
                      </div>
                    </div>
                    <div className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 relative">
                          <img
                            className="rounded-full w-11 h-11"
                            src="../assets/images/notification/profile-4.png"
                            alt="Joseph"
                          />
                        </div>
                        <div>
                          <h6 className="text-sm fw-semibold mb-1">
                            Ronald Richards
                          </h6>
                          <p className="mb-0 text-sm line-clamp-1">
                            You can stitch between artboards
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="text-sm text-neutral-500">
                          23 Mins ago
                        </span>
                      </div>
                    </div>
                    {/* Shu tarzda qolgan notification itemlarini ham qo‘shish mumkin */}
                  </div>
                  <div className="text-center py-3 px-4">
                    <a className="text-primary-600 dark:text-primary-600 font-semibold hover:underline text-center">
                      See All Notification{" "}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setMessageOpen(false);
                  setNotificationOpen(false);
                }}
              >
                <img
                  src="/assets/images/user.png"
                  alt="image"
                  className="w-10 h-10 object-fit-cover rounded-full"
                />
              </button>

              {profileOpen && (
                <div className="z-10 absolute right-0 mt-2 bg-white dark:bg-neutral-700 rounded-lg shadow-lg dropdown-menu-sm p-3">
                  <div className="py-3 px-4 rounded-lg bg-primary-50 dark:bg-primary-600/25 mb-4 flex items-center justify-between gap-2">
                    <div>
                      <h6 className="text-lg text-neutral-900 font-semibold mb-0">
                        {user[4][1]} {user[4][2]} 
                      </h6>
                      <span className="text-neutral-500">Admin</span>
                    </div>
                    <button
                      type="button"
                      className="hover:text-danger-600"
                      onClick={() => {
                        setProfileOpen(!profileOpen);
                      }}
                    >
                      <iconify-icon
                        icon="radix-icons:cross-1"
                        className="icon text-xl"
                      />
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto scroll-sm pe-2">
                    <ul className="flex flex-col">
                      <li>
                        <Link
                          className="text-black px-0 py-2 hover:text-primary-600 flex items-center gap-4"
                          to="/page/view-profile"
                        >
                          <iconify-icon
                            icon="solar:user-linear"
                            className="icon text-xl"
                          />{" "}
                          Mening hisobim
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="text-black px-0 py-2 hover:text-primary-600 flex items-center gap-4"
                          to="https://mail.csec.uz"
                        >
                          <iconify-icon
                            icon="tabler:message-check"
                            className="icon text-xl"
                          />{" "}
                          Inbox
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="text-black px-0 py-2 hover:text-primary-600 flex items-center gap-4"
                          to="/company"
                        >
                          <iconify-icon
                            icon="icon-park-outline:setting-two"
                            className="icon text-xl"
                          />{" "}
                          Sozlamalar
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => handleLogout()}
                          className="dark:text-white px-0 py-2 hover:text-danger-600 flex items-center gap-4"
                        >
                          <iconify-icon
                            icon="lucide:power"
                            className="icon text-xl"
                          />{" "}
                          Tizimdan chiqish
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
