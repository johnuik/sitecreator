import React, { useRef, useState, useEffect, use } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import JSZip from "jszip";
import { renderAsync } from "docx-preview";
import toast from "react-hot-toast";
import Select from "react-select";
import { useZirhStref } from "../../context/ZirhContext";
import { METHOD } from "../../api/zirhrpc";
import { sendRpcRequest } from "../../api/webClient";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const ChatPage = () => {
  const fileInputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("shaxsiy");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const dropdownRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [fullName, setFullName] = useState("");
  const [groups, setGroups] = useState([]);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerFileType, setViewerFileType] = useState(null);
  const [viewerZipEntries, setViewerZipEntries] = useState([]);
  const [viewerSelectedFile, setViewerSelectedFile] = useState(null);
  const [viewerNumPages, setViewerNumPages] = useState(null);
  const [viewerDocxHtml, setViewerDocxHtml] = useState(null);
  const [user, setUser] = useState(null);
  const [channelOpen, setChannelOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [isUpdateGroup, setIsUpdateGroup] = useState(false);
  const [singleGroup, setSinglGroup] = useState(null);
  const [showLeft, setShowLeft] = useState(false);
  const [groupAll, setGroupAll] = useState([]);
  const [sGroupUsers, setSGroupUsers] = useState([]);
  const [userAll, setUserAll] = useState([]);

  const docxContainerRef = useRef(null);
  const { stRef } = useZirhStref();

  const people = [
    {
      id: 1,
      name: "Ali Qodirov",
      avatar: "../assets/images/chat/2.png",
      last: "Salom! Yozib qoldim",
      time: "12:30 PM",
      unread: 2,
    },
    {
      id: 2,
      name: "Madina Toirova",
      avatar: "../assets/images/chat/3.png",
      last: "Ertaga uchrashamiz",
      time: "11:05 AM",
      unread: 0,
    },
    {
      id: 3,
      name: "Bekzod Karimov",
      avatar: "../assets/images/chat/4.png",
      last: "Hujjat yuboring iltimos",
      time: "Yesterday",
      unread: 1,
    },
  ];

  const channels = [
    {
      id: 21,
      name: "E'lonlar",
      avatar: "../assets/images/chat/7.png",
      last: "Yangilik: release v1.2",
      time: "Today",
      unread: 0,
    },
    {
      id: 22,
      name: "Texnik yangiliklar",
      avatar: "../assets/images/chat/8.png",
      last: "Server patch o‘rnatildi",
      time: "2 days",
      unread: 0,
    },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const opens = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sampleMessagesFor = (item) => {
    const now = new Date().toLocaleTimeString();
    return [
      {
        id: `${item.id}-1`,
        type: "text",
        sender: "them",
        text: item.last || "Salom",
        time: item.time || now,
      },
      {
        id: `${item.id}-2`,
        type: "text",
        sender: "me",
        text: "Yaxshi, rahmat!",
        time: now,
      },
    ];
  };

  const selectConversation = (item) => {
    setSinglGroup(item);

    setGroupId(formatBufferToId(item.id));
    const group = groupAll.find((g) => g._id === item.id);
    if (!group) return;

    const users = group.otherMembers
      .map((it) => items.find((u) => u.id === formatBufferToId(it?.[2])))
      .filter(Boolean);

    setSGroupUsers(users);

    setSelected(item);
    setMessages(sampleMessagesFor(item));
  };

  useEffect(() => {
    const list =
      activeTab === "shaxsiy"
        ? people
        : activeTab === "guruh"
          ? groups
          : channels;
    if (list.length > 0) {
      setSelected(list[0]);
      setMessages(sampleMessagesFor(list[0]));
    }
  }, [activeTab]);

  const TabButtons = () => {
    const makeClass = (tab) =>
      `px-4 py-2 font-medium w-full text-center ${activeTab === tab ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-white"}`;
    return (
      <>
        <button
          type="button"
          onClick={() => setActiveTab("shaxsiy")}
          className={makeClass("shaxsiy")}
        >
          Shaxsiy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("guruh")}
          className={makeClass("guruh")}
        >
          Guruh
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("kanal")}
          className={makeClass("kanal")}
        >
          Kanal
        </button>
      </>
    );
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIconClass = (mime, name) => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (
      mime?.startsWith("image/") ||
      ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)
    )
      return "ri-image-line";
    if (mime === "application/pdf" || ext === "pdf") return "ri-file-pdf-line";
    if (mime?.startsWith("audio/") || ["mp3", "wav", "ogg"].includes(ext))
      return "ri-file-music-line";
    if (
      mime?.startsWith("video/") ||
      ["mp4", "webm", "mov", "mkv"].includes(ext)
    )
      return "ri-file-video-line";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
      return "ri-file-zip-line";
    if (["doc", "docx"].includes(ext)) return "ri-file-word-line";
    if (["xls", "xlsx"].includes(ext)) return "ri-file-excel-line";
    if (["ppt", "pptx"].includes(ext)) return "ri-file-ppt-line";
    if (["txt", "md", "csv", "json", "xml"].includes(ext))
      return "ri-file-text-line";
    return "ri-file-2-line";
  };

  const handleFile = (file) => {
    if (!file) return;
    const id = Date.now() + Math.random();
    const newMsg = {
      id,
      type: "file",
      sender: "me",
      file: {
        name: file.name,
        size: file.size,
        mime: file.type,
        url: null,
      },
      progress: 0,
      status: "uploading",
    };
    setMessages((s) => [...s, newMsg]);

    const intervalId = setInterval(() => {
      setMessages((cur) =>
        cur.map((m) => {
          if (m.id !== id) return m;
          const next = Math.min(
            100,
            m.progress + Math.floor(Math.random() * 18) + 7,
          );
          const updated = { ...m, progress: next };
          if (next >= 100) {
            updated.status = "done";
            updated.file.url = URL.createObjectURL(file);
          }
          return updated;
        }),
      );
    }, 300);

    const stopCheck = setInterval(() => {
      const cur = messages.find((mm) => mm.id === id);
      if (cur && cur.progress >= 100) {
        clearInterval(intervalId);
        clearInterval(stopCheck);
      }
    }, 500);

    setTimeout(() => {
      clearInterval(intervalId);
      clearInterval(stopCheck);
    }, 30000);
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
    e.target.value = null;
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onSendText = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages((s) => [
      ...s,
      {
        id: Date.now(),
        type: "text",
        sender: "me",
        text,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setText("");
  };

  const onPdfLoadSuccess = ({ numPages }) => setViewerNumPages(numPages);

  const openViewer = async (message) => {
    if (!message || !message.file) return;
    try {
      let blob;
      if (message.file.blob) {
        blob = message.file.blob;
      } else if (message.file.url) {
        const res = await fetch(message.file.url);
        blob = await res.blob();
      } else {
        return;
      }

      const mime = message.file.mime || blob.type || "";
      // ZIP
      if (mime === "application/zip" || message.file.name?.endsWith(".zip")) {
        const zip = await JSZip.loadAsync(blob);
        const entries = [];
        for (const p of Object.keys(zip.files)) {
          const entry = zip.files[p];
          const name = p.split("/").pop();
          if (!entry.dir && (name.endsWith(".pdf") || name.endsWith(".docx"))) {
            const fileBlob = await entry.async("blob");
            entries.push({ name, blob: fileBlob });
          }
        }
        setViewerZipEntries(entries);
        setViewerFileType("application/zip");
        setViewerSelectedFile(null);
        setViewerNumPages(null);
        setViewerDocxHtml(null);
        setViewerOpen(true);
        return;
      }

      if (mime === "application/pdf" || message.file.name?.endsWith(".pdf")) {
        setViewerSelectedFile(blob);
        setViewerFileType("application/pdf");
        setViewerNumPages(null);
        setViewerDocxHtml(null);
        setViewerOpen(true);
        return;
      }

      if (
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        message.file.name?.endsWith(".docx")
      ) {
        setViewerSelectedFile(blob);
        setViewerFileType(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );
        setViewerNumPages(null);
        setViewerDocxHtml(null);
        setViewerOpen(true);
        return;
      }
    } catch (err) {
      console.error("Viewer open error", err);
    }
  };

  const openZipEntry = async (entry) => {
    setViewerSelectedFile(entry.blob);
    const mime = entry.name.endsWith(".pdf")
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    setViewerFileType(mime);
    setViewerDocxHtml(null);
    setViewerNumPages(null);
  };

  const getAllChat = async () => {
    try {
      const res = await sendRpcRequest(stRef, METHOD.CHAT_GET_CONVERSATION, {});
      if (res.status === METHOD.OK) {
        const groupsData = res.result[1]
          .filter((item) => item[1] === 2)
          .map((item) => ({
            id: item._id,
            name: item[3],
            last: "",
            unread: 0,
          }));

        const usersData = res.result[1]
          .filter((item) => item[1] === 1)
          .map((item) => ({
            id: formatBufferToId(item._id),
            id2: formatBufferToId(item[2]),
          }));
        
        setUserAll(usersData);
        setGroupAll(res.result[1]);
        setGroups(groupsData);
        setChats(res.result[1]);
        console.log(res.result[1]);
      } else {
        console.log("Xatolik yuz berdi");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const renderDocx = async () => {
      if (
        viewerSelectedFile &&
        viewerFileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        try {
          const buffer = await viewerSelectedFile.arrayBuffer();
          if (docxContainerRef.current) {
            docxContainerRef.current.innerHTML = "";
            await renderAsync(buffer, docxContainerRef.current);
            setViewerDocxHtml(docxContainerRef.current.innerHTML);
          }
        } catch (e) {
          console.error("docx render err", e);
        }
      }
    };
    renderDocx();
  }, [viewerSelectedFile, viewerFileType]);

  const formatBufferToId = (data) => {
    if (!data) return null;
    const bufferArray = data.buffer
      ? Object.values(data.buffer)
      : Object.values(data);

    return bufferArray
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  };
  function bufferToObjectId(bufferObj) {
    const bytes = Object.values(bufferObj);
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const resU = await sendRpcRequest(stRef, METHOD.USER_GET, {});
        if (resU.status === METHOD.OK) {
          resU.result[1].id = formatBufferToId(resU.result[1]._id);
          const full_name =
            resU.result[1]?.[4]?.[1] + " " + resU.result[1]?.[4]?.[2];
          setFullName(full_name);
          setUser(resU.result[1]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    getAllChat();
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createGroup = async () => {
    try {
      if (!groupName.trim()) return toast.error("Guruh nomi kiriting");
      const payload = {
        1: channelOpen ? 3 : 2,
        2: user.id,
        3: groupName,
      };
      console.log(payload);
      const res = await sendRpcRequest(stRef, METHOD.CHAT_CREATE_CONV, payload);

      if (res.status === METHOD.OK) {
        toast.success("Guruh yaratildi");
        setGroupName("");
        getAllChat();
        setShowModal(false);
      } else {
        toast.error("Guruh yaratishda xatolik");
      }
      console.log("Guruh yaratildi:", res);
    } catch (error) {
      console.log(error);
    }
  };

  const updateGroup = async () => {
    try {
      const payload = {
        1: groupId,
        2: groupName,
      };
      const res = await sendRpcRequest(stRef, METHOD.CHAT_UPDATE_CONV, payload);
      if (res.status === METHOD.OK) {
        toast.success("Guruh tahrirlandi");
        getAllChat();
        setGroupName("");
        setShowModal(false);
        setIsUpdateGroup(false);
      } else {
        toast.error("Guruh tahrirlashda xatolik");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen1(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addMember = async () => {
    try {
      const payload = {
        1: groupId,
        2: userId,
        3: 2,
      };
      console.log(payload);
      if (groupId == null) return;
      // return
      const res = await sendRpcRequest(stRef, METHOD.CHAT_ADD_USER, payload);
      if (res.status === METHOD.OK) {
        toast.success("A'zo qo'shildi");
        setAddModal(false);
      } else {
        toast.error("A'zo qo'shishda xatolik");
      }
      console.log("A'zo qo'shildi:", res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const res = await sendRpcRequest(stRef, METHOD.USER_GET_FULL, {});
        if (res.status === METHOD.OK) {
          const mappedItems = await Promise.all(
            res.result[1].map(async (user, index) => {
              const info = user["4"] || [];

              return {
                id: bufferToObjectId(user._id?.buffer),
                email: user["1"] || "",
                role: user["3"] || "",
                department: info[0] || "",
                surname: info[1] || "",
                name: info[2] || "",
                partName: info[3] || "",
                phone: info[4] || "",
              };
            }),
          );

          setItems(mappedItems);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllUser();
  }, []);

  const getUser = (item) => {
    if (!item || !Array.isArray(item)) return [];

    return item.map((user) => ({
      value: user.id,
      label: `${user.surname} ${user.name}`,
    }));
  };

  const editGroup = () => {
    try {
      setIsUpdateGroup(true);
      setOpen1(false);
      setGroupName(singleGroup.name);
      // setGroupId(singleGroup.id);)
    } catch (error) {
      console.log(error);
    }
  };

  const handleControllerChange = (selectedOptions) => {
    setUserId(selectedOptions.value);
  };

  const handlePrivate = (item) => async () => {
    try {
      const res = await sendRpcRequest(stRef, METHOD.CHAT_PRIVATE_MSG_CREATE, {
        1: item.id,
      });
      if (res.status === METHOD.OK) {
        toast.success("Muffaqiyatli qo'shildi");
      } else {
        toast.error("Xatolik yuz berdi")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {(showModal || channelOpen || isUpdateGroup) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isUpdateGroup
                ? "Tahrirlash"
                : channelOpen
                  ? "Kanal nomini kiriting"
                  : "Guruh nomini kiriting"}
            </h2>

            <input
              type="text"
              placeholder={
                isUpdateGroup
                  ? "Tahrirlash"
                  : channelOpen
                    ? "Kanal nomini kiriting"
                    : "Guruh nomini kiriting"
              }
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setChannelOpen(false);
                  setIsUpdateGroup(false);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Bekor qilish
              </button>
              {isUpdateGroup ? (
                <button
                  onClick={updateGroup}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Tahrirlash
                </button>
              ) : (
                <button
                  onClick={createGroup}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Yaratish
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {addModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-[90%] max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">A'zo qo'shish</h2>

            <div className="mb-4">
              <Select
                name="controllers"
                options={getUser(items)}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Foydalanuvchini tanlang..."
                onChange={handleControllerChange}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "transparent",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.375rem",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setAddModal(false);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Bekor qilish
              </button>
              <button
                onClick={addMember}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative" ref={dropdownRef}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6"></div>
        <div className="chat-wrapper grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="card border-0 overflow-hidden col-span-12 md:col-span-4 xl:col-span-3 relative">
            <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-4">
              <div className="flex items-center gap-4">
                <div className>
                  <img src="../assets/images/user.png" alt="image" />
                </div>
                <div className>
                  <h6 className="text-base mb-0">{fullName}</h6>
                  <p className="mb-0 text-xs">Online</p>
                </div>
              </div>
              {/* chat-sidebar-single end */}
              <div className="dropdown">
                <button
                  onClick={() => setOpen(!open)}
                  className="text-neutral-800 dark:text-white"
                  type="button"
                >
                  <i className="ri-more-2-fill" />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Guruh yaratish
                    </button>

                    <button
                      onClick={() => {
                        setOpen(false);
                        setChannelOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Kanal yaratish
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex  overflow-hidden w-full dark:bg-gray-700">
              <TabButtons />
            </div>

            <div className="chat-all-list flex flex-col gap-1.5 mt-3 max-h-[580px] overflow-y-auto">
              {(activeTab === "shaxsiy"
                ? people
                : activeTab === "guruh"
                  ? groups
                  : channels
              ).map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    selectConversation(item);
                  }}
                  className={`flex items-center justify-between gap-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-600 px-6 py-2.5 ${selected?.id === item.id ? "bg-neutral-100 dark:bg-neutral-700" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar />
                    <div className="info">
                      <h6 className="text-base mb-1 line-clamp-1 text-start font-medium text-[#6b6b6b]">
                        {item.name}
                      </h6>
                      <p className="mb-0 text-xs line-clamp-1">{item.last}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-end">
                    <p className="mb-0 text-neutral-400 text-xs lh-1">
                      {item.time}
                    </p>
                    {item.unread > 0 && (
                      <span className="w-4 h-4 text-xs rounded-full bg-warning-600 text-white inline-flex items-center justify-center">
                        {item.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleClick}
              className="border-none cursor-pointer w-10 h-10 plus-chat bg-blue-700 rounded-full text-white text-xl flex justify-center align-middle items-center absolute right-6 bottom-6 hover:scale-110 hover:bg-blue-800 shadow-md"
            >
              <iconify-icon icon="mi:add" />
            </button>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={opens}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {items &&
                items.map((item) => (
                  <MenuItem onClick={handlePrivate(item)}>
                    <Avatar /> {item.surname} {item.name}
                  </MenuItem>
                ))}
            </Menu>
          </div>
          <div className=" col-span-12 md:col-span-8 xl:col-span-9">
            <div className="flex w-full ">
              <div className="card border-0 overflow-hidden flex w-full relative">
                <div
                  className={`    transition-all duration-300 ease-in-out
 ${showLeft ? "w-[calc(100%-360px)]" : "w-full"}`}
                >
                  <div className="flex items-center justify-between gap-2  px-6 py-2.5 active border-b border-neutral-200 dark:border-neutral-600">
                    <div className="flex items-center gap-2">
                      <div className="img">
                        <img src="../assets/images/chat/11.png" alt="image" />
                      </div>
                      <div className="info">
                        <h6 className="text-base mb-0">
                          {selected ? selected.name : "Kathryn Murphy"}
                        </h6>
                        <p className="mb-0">
                          {selected
                            ? activeTab === "guruh"
                              ? "Guruh"
                              : activeTab === "kanal"
                                ? "Kanal"
                                : "Online"
                            : "Online"}
                        </p>
                      </div>
                    </div>
                    <div className="action inline-flex items-center gap-3">
                      {/* <button
                        type="button"
                        className="text-xl text-neutral-600 dark:text-neutral-200"
                      >
                        <iconify-icon icon="mi:call" />
                      </button> */}
                      <button
                        onClick={() => setShowLeft(!showLeft)}
                        type="button"
                        className="text-xl text-neutral-600 dark:text-neutral-200"
                      >
                        <iconify-icon icon="material-symbols:dock-to-left-outline" />
                        {/* <iconify-icon icon="fluent:video-32-regular" /> */}
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpen1((prev) => !prev)}
                          className="text-neutral-800 dark:text-white text-xl"
                          type="button"
                        >
                          <i className="ri-more-2-fill" />
                        </button>

                        {open1 && (
                          <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-600 w-44 dark:bg-gray-700">
                            <ul className="p-2 text-sm text-gray-700 dark:text-gray-200">
                              <li>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpen1(false);
                                    setAddModal(true);
                                  }}
                                  className="w-full text-start px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded dark:hover:text-white flex items-center gap-2"
                                >
                                  <iconify-icon
                                    icon="ic:round-person-add"
                                    width="20"
                                  />
                                  A'zo qo'shish
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  onClick={() => {
                                    editGroup();
                                  }}
                                  className="w-full text-start px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded dark:hover:text-white flex items-center gap-2"
                                >
                                  <iconify-icon icon="material-symbols:edit-square-outline" />
                                  Tahrirlash
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="chat-message-list max-h-[568px] min-h-[568px] overflow-y-auto flex flex-col p-6 gap-6"
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {messages.length === 0 && <></>}

                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[700px] ${m.sender === "me" ? "ms-auto text-white" : "text-neutral-900 flex items-end gap-3"}`}
                      >
                        {m.type === "text" &&
                          (m.sender === "me" ? (
                            <div className="bg-primary-600 rounded-2xl rounded-ee-none p-5">
                              <p className="mb-3">{m.text}</p>
                              <p className="chat-time mb-0 text-xs">
                                <span>{m.time || ""}</span>
                              </p>
                            </div>
                          ) : (
                            <>
                              <img
                                src="../assets/images/chat/11.png"
                                alt="image"
                                className="avatar-lg object-fit-cover rounded-full"
                              />
                              <div className="bg-neutral-50 dark:bg-dark-3 rounded-2xl rounded-es-none p-5">
                                <p className="mb-3">{m.text}</p>
                                <p className="chat-time mb-0 text-xs text-end text-neutral-500">
                                  <span>{m.time || ""}</span>
                                </p>
                              </div>
                            </>
                          ))}

                        {m.type === "file" && (
                          <div
                            className={`flex items-center gap-3 ${m.sender === "me" ? "ms-auto" : ""}`}
                          >
                            {m.sender !== "me" && (
                              <img
                                src="../assets/images/chat/11.png"
                                alt="image"
                                className="avatar-lg object-fit-cover rounded-full"
                              />
                            )}
                            <div
                              onClick={() => m.file.url && openViewer(m)}
                              role="button"
                              tabIndex={0}
                              className={`cursor-pointer bg-blue-600  rounded-2xl rounded-es-none p-4 w-full max-w-[520px]`}
                            >
                              <div className="flex items-center gap-3">
                                <i
                                  className={`${getFileIconClass(m.file.mime, m.file.name)} text-3xl text-neutral-300`}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm font-medium line-clamp-1">
                                      {m.file.name}
                                    </div>
                                    <div className="text-xs text-neutral-300">
                                      {formatBytes(m.file.size)}
                                    </div>
                                  </div>
                                  <div className="text-xs text-neutral-300 mt-1">
                                    {m.status === "uploading"
                                      ? "Yuklanmoqda..."
                                      : "Yuklandi"}
                                  </div>
                                  <div className="w-full bg-blue-700 rounded h-2 mt-2 overflow-hidden">
                                    <div
                                      style={{ width: `${m.progress}%` }}
                                      className={`h-2 bg-green-600`}
                                    />
                                  </div>
                                </div>
                              </div>
                              {m.status === "done" && m.file.url && (
                                <div className="mt-3">
                                  {m.file.mime?.startsWith("image/") ? (
                                    <img
                                      src={m.file.url}
                                      alt={m.file.name}
                                      className="max-w-full rounded"
                                    />
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={onSendText}
                    className="chat-message-box flex items-center justify-between py-4 border-t border-neutral-200 dark:border-neutral-600 mt-auto"
                  >
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      type="text"
                      className="border-0 grow bg-white dark:bg-transparent focus:border-0 focus:outline-none focus:ring-0"
                      autoComplete="off"
                      name="chatMessage"
                      placeholder="Xabar kiriting..."
                    />
                    <input
                      ref={fileInputRef}
                      onChange={onFileChange}
                      type="file"
                      className="hidden"
                    />
                    <div className="chat-message-box-action flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current && fileInputRef.current.click()
                        }
                        className="text-xl flex"
                        title="Attach file"
                      >
                        <i className="ri-attachment-line" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current && fileInputRef.current.click()
                        }
                        className="text-xl flex"
                        title="Choose image/file"
                      >
                        <iconify-icon icon="solar:gallery-linear" />
                      </button>
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary-600 rounded-lg inline-flex items-center gap-1"
                      >
                        Yuborish
                        <iconify-icon icon="f7:paperplane" />
                      </button>
                    </div>
                  </form>

                  {/* Viewer modal */}

                  {viewerOpen && (
                    <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50 ">
                      <div className="w-[790px] h-[100vh] max-w-[1100px] bg-white dark:bg-[#1e1f25] shadow-xl overflow-auto">
                        <button
                          onClick={() => setViewerOpen(false)}
                          className=" text-white absolute top-8 right-[40px] text-7xl p-2 rounded px-3"
                        >
                          ✕
                        </button>

                        {/* ZIP listing */}
                        {viewerFileType === "application/zip" && (
                          <div>
                            <h3 className="text-lg font-bold mb-3">
                              ZIP ichidagi fayllar:
                            </h3>
                            {viewerZipEntries.length === 0 && (
                              <p>ZIP fayl ichida fayl mavjud emas.</p>
                            )}
                            <ul>
                              {viewerZipEntries.map((e, i) => (
                                <li key={i} className="mb-2">
                                  <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => openZipEntry(e)}
                                  >
                                    {e.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* PDF viewer */}
                        {viewerSelectedFile &&
                          viewerFileType === "application/pdf" && (
                            <Document
                              file={viewerSelectedFile}
                              onLoadSuccess={onPdfLoadSuccess}
                            >
                              {Array.from(new Array(viewerNumPages), (_, i) => (
                                <Page
                                  key={`p_${i}`}
                                  pageNumber={i + 1}
                                  className="mb-4 flex justify-center"
                                />
                              ))}
                            </Document>
                          )}

                        {/* DOCX viewer */}
                        {viewerSelectedFile &&
                          viewerFileType ===
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                            <div>
                              <div ref={docxContainerRef} />
                            </div>
                          )}

                        {!viewerFileType && <p>Fayl yuklanmoqda...</p>}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`
    w-[360px]
    bg-white dark:bg-[#1e2a36]
    h-full
    absolute top-0 right-0
    transition-transform duration-300 ease-in-out pt-[50px]
    ${showLeft ? "translate-x-0 " : "translate-x-[360px]"}
  `}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center w-full">
                      <div className="w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center text-2xl font-bold text-white">
                        {selected
                          ? selected.name?.substring(0, 1).toLocaleUpperCase()
                          : "Kathryn Murphy"}
                      </div>
                      <h2 className="mt-3 text-lg font-semibold dark:text-white">
                        {selected ? selected.name : "Title"}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {sGroupUsers?.length} foydalanuvchi
                      </p>
                    </div>

                    <button
                      onClick={() => setShowLeft(false)}
                      className="absolute right-4 top-[40px] text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      <iconify-icon icon="ic:round-close" width="32" />
                    </button>
                  </div>

                  {/* Actions */}
                  {/* <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      { icon: "ic:round-notifications-off", label: "Mute" },
                      { icon: "ic:round-settings", label: "Manage" },
                      { icon: "ic:round-report", label: "Report" },
                    ].map((item, i) => (
                      <button
                        key={i}
                        className="flex flex-col items-center justify-center gap-1 bg-[#253443] rounded-lg py-3 hover:bg-[#2f4256]"
                      >
                        <iconify-icon icon={item.icon} width="22" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div> */}

                  {/* Media info */}
                  {/* <div className="mt-6 space-y-3 text-sm">
                    {[
                      { icon: "ic:round-bookmark", text: "1 saved message" },
                      { icon: "ic:round-photo", text: "50 photos" },
                      { icon: "ic:round-videocam", text: "2 videos" },
                      { icon: "ic:round-insert-drive-file", text: "3 files" },
                      { icon: "ic:round-link", text: "1 shared link" },
                      { icon: "ic:round-mic", text: "4 voice messages" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <iconify-icon icon={item.icon} width="20" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div> */}

                  {/* Members */}
                  <div className="mt-6 px-[30px]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-500">
                        {sGroupUsers?.length} foydalanuvchi
                      </span>
                      <div
                        className="flex gap-3 text-gray-400 cursor-pointer "
                        onClick={() => {
                          setOpen1(false);
                          setAddModal(true);
                        }}
                      >
                        <iconify-icon icon="ic:round-person-add" width="20" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sGroupUsers.map((user, i) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-semibold text-white">
                            {user?.name[0]?.toLocaleUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">
                              {user.surname} {user.name}
                            </p>
                            <p
                              className={`text-xs ${
                                user.status === "online"
                                  ? "text-green-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {user.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
