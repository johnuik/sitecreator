import React, { useRef, useState, useEffect, use } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import JSZip, { file } from "jszip";
import { renderAsync } from "docx-preview";
import toast from "react-hot-toast";
import Select from "react-select";
import { useZirhStref } from "../../context/ZirhContext";
import { METHOD } from "../../api/zirhrpc";
import {
  downloadFileViaRpc,
  downloadFileViaRpcNew,
  sendRpcRequest,
  uploadFileViaRpc,
} from "../../api/webClient";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useZirhEvent } from "../../api/useZirh";

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
  const [people, setUserAll] = useState([]);
  const [channels, setChannels] = useState([]);
  const [convId, setConvId] = useState(null);
  const docxContainerRef = useRef(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [openT, setOpenT] = React.useState(false);
  const [avatars, setAvatars] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [privateId, setPrivateId] = useState(null);
  const [countD, setCountD] = useState(0);

  const bottomRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollCallRef = useRef(0);
  const messageCountRef = useRef(0);
  const skipNextScrollRef = useRef(false);
  const scrollTypeRef = useRef("initial"); // 'initial' | 'top' | 'bottom'
  const scrollContainerRef = useRef(null);

  const { stRef } = useZirhStref();

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
    return [];
  };

  const getImage = (fileId) => {
    if (fileId === null) return;
    const imageAvatar = localStorage.getItem(fileId);
    return imageAvatar;
  };

  const selectConversation = async (item) => {
    setSinglGroup(item);

    await handleOnlineUser();

    if (!item?.userId) {
      getMsg(item?.id);
      setConvId(item?.id);
    } else {
      getMsg(item?.userId);
      setConvId(item?.userId);
    }

    const group = groupAll.find((g) => formatBufferToId(g._id) === item?.id);
    if (!group) return;

    setGroupId(item.id);

    if (group[1] === 2 || group[1] === 3) {
      const users = Array.from(
        new Map(
          group.otherMembers
            .map((it) => items.find((u) => u.id === formatBufferToId(it?.[2])))
            .filter(Boolean)
            .map((u) => [u.id, u]),
        ).values(),
      );
      setSGroupUsers(users);
    } else {
      setSGroupUsers([]);
    }

    setSelected(item);
    setMessages(sampleMessagesFor(item));
  };

  useEffect(() => {
    if (selected && groupAll.length > 0 && items.length > 0) {
      const group = groupAll.find(
        (g) => formatBufferToId(g._id) === selected.id,
      );
      if (!group) return;

      if (group[1] === 2 || group[1] === 3) {
        const users = Array.from(
          new Map(
            group.otherMembers
              .map((it) =>
                items.find((u) => u.id === formatBufferToId(it?.[2])),
              )
              .filter(Boolean)
              .map((u) => [u.id, u]),
          ).values(),
        );
        setSGroupUsers(users);
      }
    }
  }, [items, groupAll, selected]);

  useEffect(() => {
    const list =
      activeTab === "shaxsiy"
        ? people
        : activeTab === "guruh"
          ? groups
          : channels;
    if (list.length > 0) {
      selectConversation(list[0]);
    }
  }, [activeTab, people, groups, channels]);

  useZirhEvent(null, async (data) => {
    console.log(data);
    if (data.methodId == METHOD.CHAT_SEND_MSG_SERVER) {
      // mark as incoming so effect will auto-scroll
      scrollTypeRef.current = "initial";
      const message = {
        id: formatBufferToId(data.params._id),
        id2: formatBufferToId(data.params[1]),
        id3: formatBufferToId(data.params[2]),
        type: data.params[3][1] === 1 ? "text" : "file",
        sender:
          formatBufferToId(data.params[2]) === user.id
            ? "me"
            : formatBufferToId(data.params[2]),
        text: data.params[3][2],
        file: {
          id: data.params[3][3]?.[1],
          name: data.params[3][3]?.[2],
          size: "30",
          mime: "application/pdf",
          url: null,
        },
        read: formatBufferToId(data.params[2]) === user.id ? true : false,
        progress: 0,
        status: "done",
      };
      if (
        data.params[3][3]?.[2]?.endsWith(".jpg") ||
        data.params[3][3]?.[2]?.endsWith(".png") ||
        data.params[3][3]?.[2]?.endsWith(".jpeg") ||
        data.params[3][3]?.[2]
      ) {
        const url = await downloadFileAll(message.file.id);
        message.file.id = url;
      }

      setMessages((s) => [...s, message]);
    } else if (data.methodId === METHOD.CHAT_MSG_CONV) {
      const tpe = data?.params[1].value;
      console.log(tpe, people);

      const members = data?.params?.otherMembers;

      if (!Array.isArray(members)) return;

      members.forEach((member) => {
        const type = tpe;

        if (type === 1 && member.user_info) {
          const userId = formatBufferToId(member.user_info._id);

          const user = {
            id: userId,
            id2: formatBufferToId(member[2]),
            userId,
            name:
              member.user_info.field4?.[1] + " " + member.user_info.field4?.[2],
            partname: member.user_info.field4?.[3],
            phone: member.user_info.field4?.[4],
            avatar: member.user_info.field4?.[5],
            last: "",
            unread: 0,
          };

          setUserAll((prev) => {
            if (prev.some((u) => u.id === user.id)) return prev;
            return [user, ...prev];
          });

          selectConversation(user);
        } else if (type === 2) {
          const groupId = formatBufferToId(member._id || member[1]);

          const group = {
            id: groupId,
            name: member?.[4] || "Yangi guruh",
            last: "",
            unread: 0,
          };

          setGroups((prev) => {
            if (prev.some((g) => g.id === group.id)) return prev;
            return [group, ...prev];
          });
        } else if (type === 3) {
          const channelId = formatBufferToId(member._id || member[1]);

          const channel = {
            id: channelId,
            name: member?.[4] || "Yangi kanal",
            last: "",
            unread: 0,
          };

          setChannels((prev) => {
            if (prev.some((c) => c.id === channel.id)) return prev;
            return [channel, ...prev];
          });
        }
      });
    }
  });

  const TabButtons = () => {
    const makeClass = (tab) =>
      `px-4 py-2 font-medium w-full text-center ${activeTab === tab ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-white"}`;
    return (
      <>
        <button
          type="button"
          onClick={() => setBtnActive("shaxsiy")}
          className={makeClass("shaxsiy")}
        >
          Shaxsiy
        </button>
        <button
          type="button"
          onClick={() => setBtnActive("guruh")}
          className={makeClass("guruh")}
        >
          Guruh
        </button>
        <button
          type="button"
          onClick={() => setBtnActive("kanal")}
          className={makeClass("kanal")}
        >
          Kanal
        </button>
      </>
    );
  };

  const setBtnActive = (tab) => {
    setActiveTab(tab);
    if (tab === "shaxsiy") {
      selectConversation(people[0]);
    } else if (tab === "guruh") {
      selectConversation(groups[0]);
    } else if (tab === "kanal") {
      selectConversation(channels[0]);
    }
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

  const downloadFileAll = async (id) => {
    const blob = await downloadFileViaRpcNew(stRef, id, id, (p) => {
      setUploadProgress(p);
      setIsUploading(true);
      if (p === 100) setIsUploading(false);
    });
    const url = URL.createObjectURL(blob);
    localStorage.setItem(id, url);
    return url;
  };
  const downloadFileDocAll = async (id) => {
    return await downloadFileViaRpcNew(stRef, id, id, (p) => {
      setUploadProgress(p);
      setIsUploading(true);
      if (p === 100) setIsUploading(false);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    const nameLength = file?.name?.length || 0;

    if (nameLength > 50) {
      toast.error("Iltimos fayli nomini 50 ta belgidan kichik kiriting");
      return;
    }

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
      read: false,
    };

    if (convId === null) return;

    const doneRes = await uploadFileViaRpc(
      stRef,
      file,
      convId,

      (p) => {
        console.log(p);
        // setUploadProgress(p);
      },
    );

    const fileId = doneRes.result["fileId"];
    if (fileId && file.type.startsWith("image/")) {
      const url = await downloadFileAll(fileId);
      newMsg.file.id = url;
    }

    const res = await sendRpcRequest(stRef, METHOD.CHAT_SEND_MSG_CLIENT, {
      1: convId,
      2: user.id,
      3: {
        1: 2,
        3: {
          1: fileId,
          2: file.name,
        },
      },
      4: null,
    });

    console.log(file?.name?.length)
    console.log(res)
    setMessages((s) => [...s, newMsg]);
    // ensure autoscroll for sent file messages
    scrollTypeRef.current = "initial";

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

  const onSendText = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // ensure autoscroll for sent messages
    scrollTypeRef.current = "initial";
    setMessages((s) => [
      ...s,
      {
        id: Date.now(),
        type: "text",
        sender: "me",
        text,
        time: new Date().toLocaleTimeString(),
        read: false,
      },
    ]);

    // return

    if (convId === null) return;

    const res = await sendRpcRequest(stRef, METHOD.CHAT_SEND_MSG_CLIENT, {
      1: convId,
      2: user.id,
      3: {
        1: 1,
        2: text,
      },
      4: null,
    });
    if (res.status === METHOD.OK) {
    }
    setText("");
  };

  const getMsg = async (id, msgId = null, msgType = false) => {
    try {
      if (convId === null) return;

      let type;

      if (msgId === null && msgType === false) {
        type = 1;
      } else if (msgId !== null && msgType === false) {
        type = 2;
      } else if (msgId !== null && msgType === true) {
        type = 3;
      }

      const payload = {
        1: type,
        2: id,
        3: msgId,
      };
      const res = await sendRpcRequest(stRef, METHOD.CHAT_GET_MSG, payload);
      console.log(res.result[1]);
      if (res.status === METHOD.OK) {
        const raw = res.result[1];
        setCountD(raw?.count);

        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        const messages = list.map((item) => {
          return {
            id: formatBufferToId(item._id),
            id2: formatBufferToId(item[1]),
            id3: formatBufferToId(item[2]),
            type: item[3][1] === 1 ? "text" : "file",
            sender:
              formatBufferToId(item[2]) === user.id
                ? "me"
                : formatBufferToId(item[2]),
            text: item[3][2],
            file: {
              id: item[3][3]?.[1],
              name: item[3][3]?.[2],
              size: "30",
              mime: "application/pdf",
              url: null,
            },
            read: Boolean(item[5]),
            progress: 0,
            status: "done",
          };
        });
        for (const item of messages) {
          const fileName = item?.file?.name || item?.name;
          if (
            fileName?.endsWith(".docx") ||
            fileName?.endsWith(".doc") ||
            fileName?.endsWith(".pdf") ||
            fileName?.endsWith(".doc") ||
            fileName?.endsWith(".docx") ||
            fileName?.endsWith(".pdf") ||
            fileName?.endsWith(".zip")
          ) {
            item.file.url = null;
          } else {
            if (item.file.id) {
              item.file.id = await downloadFileAll(item.file.id);
            }
          }
        }

        if (msgType === true) {
          skipNextScrollRef.current = true;
          setMessages((prev) => [...messages, ...prev]);
          const _t = setTimeout(() => {
            skipNextScrollRef.current = false;
          }, 600);
          return () => clearTimeout(_t);
        } else {
          setMessages(messages);
        }
      }
    } catch (error) {
      console.log(error);
    }
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
        setIsUploading(true);
        blob = await downloadFileDocAll(message.file.id);
        setIsUploading(false);
      }

      const mime = message.file.mime || blob.type || "";

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
        const groupsData = Array.from(
          new Map(
            res.result[1]
              .filter((item) => item[1] === 2)
              .map((item) => [
                formatBufferToId(item._id),
                {
                  id: formatBufferToId(item._id),
                  name: item[3],
                  last: "",
                  unread: 0,
                },
              ]),
          ).values(),
        );

        const usersData = Array.from(
          new Map(
            res.result[1]
              .filter(
                (item) =>
                  item[1] === 1 &&
                  item.otherMembers?.[0]?.user_info &&
                  !(
                    item.otherMembers[0]?.user_info?.field4?.[1] === "user" &&
                    item.otherMembers[0]?.user_info?.field4?.[2] === "user"
                  ),
              )
              .map((item) => {
                const userId = formatBufferToId(item.otherMembers[0]?.[1]);

                return [
                  userId,
                  {
                    id: userId,
                    id2: formatBufferToId(item.otherMembers[0]?.[2]),
                    userId,
                    name:
                      item.otherMembers[0]?.user_info.field4[1] +
                      " " +
                      item.otherMembers[0]?.user_info.field4[2],
                    partname: item.otherMembers[0]?.user_info.field4[3],
                    phone: item.otherMembers[0]?.user_info.field4[4],
                    avatar: item.otherMembers[0]?.user_info.field4[5],
                    last: "",
                    unread: 0,
                  },
                ];
              }),
          ).values(),
        );

        const channelData = Array.from(
          new Map(
            res.result[1]
              .filter((item) => item[1] === 3)
              .map((item) => [
                formatBufferToId(item._id),
                {
                  id: formatBufferToId(item._id),
                  name: item[3],
                  last: "",
                  unread: 0,
                },
              ]),
          ).values(),
        );

        selectConversation(usersData[0]);

        setChannels(channelData);
        setUserAll(usersData);
        setGroupAll(res.result[1]);
        setGroups(groupsData);
        setChats(res.result[1]);
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

  const handleOnlineUser = async () => {
    await sendRpcRequest(stRef, METHOD.ONLINE, {});
  };
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
      const res = await sendRpcRequest(stRef, METHOD.CHAT_CREATE_CONV, payload);

      if (res.status === METHOD.OK) {
        toast.success("Guruh yaratildi");
        setGroupName("");
        getAllChat();
        setShowModal(false);
      } else {
        toast.error("Guruh yaratishda xatolik");
      }
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
    handleOnlineUser();
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
      if (groupId == null) return;
      const res = await sendRpcRequest(stRef, METHOD.CHAT_ADD_USER, payload);
      if (res.status === METHOD.OK) {
        toast.success("A'zo qo'shildi");
        setAddModal(false);
      } else {
        toast.error("A'zo qo'shishda xatolik");
      }
      getAllChat();
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
                avatar: info[5] || "",
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleControllerChange = (selectedOptions) => {
    setUserId(selectedOptions.value);
  };

  const handlePrivate = (item) => async () => {
    handleOnlineUser();
    try {
      const res = await sendRpcRequest(stRef, METHOD.CHAT_PRIVATE_MSG_CREATE, {
        1: item,
      });
      console.log(res);
      if (res.status === METHOD.OK) {
        toast.success("Muffaqiyatli qo'shildi");
        setPrivateId(null);
        setUserEmail("");
        getAllChat();
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setOpenT(false);
  };

  useEffect(() => {
    if (scrollTypeRef.current === "top" || scrollTypeRef.current === "bottom") {
      const _r = setTimeout(() => {
        scrollTypeRef.current = "initial";
      }, 300);
      return () => clearTimeout(_r);
    }

    skipNextScrollRef.current = true;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const _t = setTimeout(() => {
      skipNextScrollRef.current = false;
    }, 600);
    return () => clearTimeout(_t);
  }, [messages]);

  const senders = [...new Set(messages.map((m) => m.sender))];

  const getUserAvatar = async (id) => {
    if (id === "me") {
      return user.avatar;
    }

    const res = await sendRpcRequest(stRef, METHOD.USER_GET_PHOTO, { 1: id });

    const foundAvatar = res.result[1];
    let avatarUrl = null;
    if (res.status === METHOD.OK) {
      avatarUrl = await downloadFileAll(foundAvatar);
    }
    return avatarUrl;
  };

  useEffect(() => {
    const loadAvatars = async () => {
      for (const sender of senders) {
        if (sender !== "me" && !avatars[sender]) {
          const avatarUrl = await getUserAvatar(sender);
          setAvatars((prev) => ({
            ...prev,
            [sender]: avatarUrl,
          }));
        }
      }
    };

    loadAvatars();
  }, [messages]);

  const handleGetUser = async () => {
    try {
      if (!userEmail) return;
      const res = await sendRpcRequest(stRef, METHOD.USER_GET_ID, {
        1: userEmail,
      });
      const user = people.find(
        (item) => item.userId === formatBufferToId(res.result[1]),
      );

      if (user) {
        toast.error("Foydalanuvchi allaqachon mavjud");
        return;
      }
      if (res.status === METHOD.OK) {
        setPrivateId(formatBufferToId(res.result[1]));
      } else {
        setPrivateId("1");
        toast.error("Foydalanuvchi topilmadi");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chatViewUpdate = async (fromMsgId, toMsgId, convId) => {
    try {
      const res = await sendRpcRequest(stRef, METHOD.CHAT_VIEW_UPDATE, {
        1: fromMsgId,
        2: toMsgId,
        3: convId,
      });
      console.log(res);

      if (res.status === METHOD.OK) {
        const compareIds = (a, b) => {
          const toComparable = (id) => {
            try {
              const BigIntFn =
                (typeof window !== "undefined" && window["BigInt"]) ||
                (typeof global !== "undefined" && global["BigInt"]) ||
                null;
              if (BigIntFn) {
                if (typeof id === "number") return BigIntFn(id);
                if (/^[0-9]+$/.test(String(id))) return BigIntFn(String(id));
                return BigIntFn("0x" + String(id));
              }
              let s = String(id) || "";
              if (s.startsWith("0x") || s.startsWith("0X")) s = s.slice(2);
              return s.toLowerCase();
            } catch (e) {
              return null;
            }
          };

          const A = toComparable(a);
          const B = toComparable(b);
          if (typeof A === "string" || typeof B === "string") {
            const aStr = String(A || "");
            const bStr = String(B || "");
            if (aStr.length < bStr.length) return -1;
            if (aStr.length > bStr.length) return 1;
            if (aStr < bStr) return -1;
            if (aStr > bStr) return 1;
            return 0;
          }
          if (A < B) return -1;
          if (A > B) return 1;
          return 0;
        };

        setMessages((prev) =>
          prev.map((m) => {
            try {
              if (m.sender !== "me" && !m.read) {
                const cmpFrom = compareIds(m.id, fromMsgId);
                const cmpTo = compareIds(m.id, toMsgId);
                if (
                  (cmpFrom === 0 || cmpFrom === 1) &&
                  (cmpTo === 0 || cmpTo === -1)
                ) {
                  return { ...m, read: true };
                }
              }
            } catch (e) {
              // ignore and keep original message
            }
            return m;
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selected || !messages.length || !user || !convId) return;

    const unreadMessages = messages.filter((m) => m.read === false);

    if (unreadMessages.length === 0) return;

    const compareIds = (a, b) => {
      const toComparable = (id) => {
        try {
          const BigIntFn =
            (typeof window !== "undefined" && window["BigInt"]) ||
            (typeof global !== "undefined" && global["BigInt"]) ||
            null;
          if (BigIntFn) {
            if (typeof id === "number") return BigIntFn(id);
            if (/^[0-9]+$/.test(String(id))) return BigIntFn(String(id));
            return BigIntFn("0x" + String(id));
          }
          let s = String(id) || "";
          if (s.startsWith("0x") || s.startsWith("0X")) s = s.slice(2);
          return s.toLowerCase();
        } catch (e) {
          return null;
        }
      };

      const A = toComparable(a);
      const B = toComparable(b);
      if (typeof A === "string" || typeof B === "string") {
        const aStr = String(A || "");
        const bStr = String(B || "");
        if (aStr.length < bStr.length) return -1;
        if (aStr.length > bStr.length) return 1;
        if (aStr < bStr) return -1;
        if (aStr > bStr) return 1;
        return 0;
      }
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    };

    unreadMessages.sort((a, b) => compareIds(a.id, b.id));

    const fromMsgId = unreadMessages[0].id;
    const toMsgId = unreadMessages[unreadMessages.length - 1].id;

    chatViewUpdate(fromMsgId, toMsgId, convId);
  }, [messages, selected, user, convId]);

  const handleChatScroll = (e) => {
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }

    const element = e.target;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const prevScrollTop = scrollTop;
    const prevScrollHeight = scrollHeight;

    isUserScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;

      const now = Date.now();
      if (now - lastScrollCallRef.current < 1200) return;

      if (messages.length === countD) {
        return;
      }

      if (scrollTop === 0) {
        scrollTypeRef.current = "top";
        lastScrollCallRef.current = now;
        chatScrollToTop(prevScrollHeight, prevScrollTop);
      }

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        scrollTypeRef.current = "bottom";
        lastScrollCallRef.current = now;
        chatScrollToBottom();
      }
    }, 150);
  };

  const chatScrollToTop = async (prevScrollHeight = 0, prevScrollTop = 0) => {
    const msgId = messages[0]?.id;
    if (!msgId || !convId) return;
    await getMsg(convId, msgId, true);

    const container = scrollContainerRef.current;
    if (!container) return;

    const adjust = () => {
      const newScrollHeight = container.scrollHeight;
      if (newScrollHeight > prevScrollHeight) {
        container.scrollTop =
          newScrollHeight - prevScrollHeight + prevScrollTop;
        return;
      }
      requestAnimationFrame(adjust);
    };
    requestAnimationFrame(adjust);
  };

  const chatScrollToBottom = () => {
    const msgId = messages[messages.length - 1]?.id;
    if (!msgId || !convId) return;
    getMsg(convId, msgId);
  };

  return (
    <>
      {openT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />

          {/* modal box */}
          <div className="relative z-10 w-[60vw] h-[95vh] bg-white rounded-xl shadow-xl overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold text-gray-700">Fayl ko‘rish</h2>

              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {previewUrl && (
              <object
                data={previewUrl}
                type="application/pdf"
                className="w-full h-full"
                onContextMenu={(e) => e.preventDefault()}
              >
                <p>Fayl ochilmadi</p>
              </object>
            )}
          </div>
        </div>
      )}
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

            <div className="chat-all-list flex flex-col gap-1.5 mt-3 max-h-[70vh] min-h-[70vh] overflow-y-auto">
              {(activeTab === "shaxsiy"
                ? people
                : activeTab === "guruh"
                  ? groups
                  : channels
              ).map((item) => (
                <button
                  key={item.id}
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

            <div
              onClick={() => !opens && setAnchorEl(true)}
              className={`
          absolute
          bg-blue-500
          flex items-center justify-center
          transition-[width,height,border-radius,bottom,left,transform]
          duration-200 ease-in-out
          ${
            opens
              ? "w-full h-full bottom-0 right-0 rounded-none bg-white dark:bg-gray-800"
              : "w-12 h-12 bottom-4 right-[-13px] -translate-x-1/2 rounded-full cursor-pointer"
          }
        `}
            >
              <span
                className={`
            text-3xl font-bold text-white
            transition-opacity duration-100 mb-[5px]
            ${opens ? "opacity-0" : "opacity-100"}
          `}
              >
                +
              </span>

              <div
                className={`
            absolute inset-0 p-6
            transition-all duration-100 ease-out
            ${
              opens
                ? "opacity-100 scale-100 delay-300"
                : "opacity-0 scale-95 pointer-events-none"
            }
          `}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(false);
                    setPrivateId(null);
                    setUserEmail("");
                  }}
                  className="absolute top-4 right-4 text-xl dark:text-white font-bold"
                >
                  ✕
                </button>

                <form className="w-full max-w-md mx-auto mt-14 mb-6">
                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-1 shadow-sm focus-within:ring-2 overflow-hidden focus-within:ring-blue-500 relative">
                    <input
                      name="userEmail"
                      type="email"
                      placeholder="Emailni kiriting"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 border-none focus:ring-0"
                    />

                    <button
                      type="button"
                      onClick={handleGetUser}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition duration-200 absolute top-[-.5px] right-[-.5px] bottom-[-.5px]"
                    >
                      <iconify-icon
                        icon="mdi:magnify"
                        width="20"
                        height="20"
                      ></iconify-icon>
                    </button>
                  </div>
                </form>

                {privateId && privateId !== "1" && (
                  <MenuItem className="mb-4" onClick={handlePrivate(privateId)}>
                    <Avatar className="mr-5" /> Qo'shish
                  </MenuItem>
                )}
                {privateId == 1 && (
                  <MenuItem className="mb-4">Foydalanuvchi topilmadi</MenuItem>
                )}
                {!privateId && (
                  <MenuItem className="mb-4">
                    Foydalanuvchini pochta maznilini kiriting
                  </MenuItem>
                )}
              </div>
            </div>
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
                        {activeTab === "shaxsiy" && <Avatar />}
                        {activeTab !== "shaxsiy" && (
                          <Avatar>
                            {activeTab === "guruh" ? (
                              <iconify-icon icon="material-symbols:groups" />
                            ) : (
                              <iconify-icon icon="ri:megaphone-fill" />
                            )}
                          </Avatar>
                        )}
                      </div>
                      <div className="info">
                        <h6 className="text-base mb-0">
                          {selected ? selected.name : " "}
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
                      <button
                        onClick={() => setShowLeft(!showLeft)}
                        type="button"
                        className="text-xl text-neutral-600 dark:text-neutral-200"
                      >
                        <iconify-icon icon="material-symbols:dock-to-left-outline" />
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
                    className="chat-message-list"
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="chat-message-list-bg"></div>

                    <div
                      ref={scrollContainerRef}
                      className="max-h-[70vh] min-h-[70vh] overflow-y-auto flex flex-col p-6 gap-6 z-[1] relative"
                      onScroll={handleChatScroll}
                    >
                      {messages.length === 0 && (
                        <p className="text-center pt-[30vh] text-bold">
                          Suhbatni davom ettirish uchun chatni tanlang.
                        </p>
                      )}
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`max-w-[700px] ${m.sender === "me" ? "ms-auto text-white" : "text-neutral-900 flex items-end gap-3"}`}
                        >
                          {m.type === "text" &&
                            (m.sender === "me" ? (
                              <>
                                <div className="bg-primary-600 rounded-2xl rounded-ee-none p-5 relative">
                                  <p className="mb-3">{m.text}</p>
                                  <p className="text-base text-white  mt-1 text-right absolute bottom-0 right-1">
                                    {m.read ? (
                                      <iconify-icon icon="tabler:checks"></iconify-icon>
                                    ) : (
                                      <iconify-icon icon="tabler:check"></iconify-icon>
                                    )}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  src={
                                    avatars[m.sender] ||
                                    "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png"
                                  }
                                  alt="image"
                                  className="avatar-lg object-fit-cover rounded-full w-[40px] h-[40px]"
                                />
                                <div className="bg-neutral-50 dark:bg-dark-3 rounded-2xl rounded-es-none p-5">
                                  <p className="mb-3">{m.text}</p>
                                  {/* <p className="chat-time mb-0 text-xs text-end text-neutral-500">
                                    <span>{m.time || ""}</span>
                                  </p> */}
                                </div>
                              </>
                            ))}

                          {m.type === "file" && (
                            <div
                              className={`flex items-center gap-3 ${m.sender === "me" ? "ms-auto" : ""}`}
                            >
                              {m.sender !== "me" && (
                                <img
                                  src={
                                    avatars[m.sender] ||
                                    "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png"
                                  }
                                  alt="image"
                                  className="avatar-lg object-fit-cover rounded-full w-[40px] h-[40px]"
                                />
                              )}

                              <div className="w-full">
                                <div
                                  onClick={() => openViewer(m)}
                                  role="button"
                                  tabIndex={0}
                                  className={`cursor-pointer ${
                                    m.sender === "me"
                                      ? "bg-blue-600"
                                      : "bg-neutral-50"
                                  }  rounded-2xl rounded-es-none p-4 w-full max-w-[520px] relative`}
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
                                          : ""}
                                      </div>
                                    </div>
                                  </div>
                                  {m.status === "done" && m.file && (
                                    <div className="mt-3">
                                      {m.file.name?.endsWith(".png") ||
                                      m.file.name?.endsWith(".jpg") ||
                                      m.file.name?.endsWith(".jpeg") ? (
                                        <img
                                          src={m.file.id}
                                          alt={m.file.name}
                                          className="max-w-full rounded"
                                        />
                                      ) : null}
                                    </div>
                                  )}
                                  {m.sender === "me" && (
                                    <p className="text-base text-white  mt-1 text-right absolute bottom-0 right-1">
                                      {m.read ? (
                                        <iconify-icon icon="tabler:checks"></iconify-icon>
                                      ) : (
                                        <iconify-icon icon="tabler:check"></iconify-icon>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={bottomRef} />
                    </div>
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
                      accept=".jpg,.png,.jpeg,.doc,.docx,.pdf,.zip"
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
                        type="submit"
                        className="btn btn-sm btn-primary-600 rounded-lg inline-flex items-center gap-1 mr-5"
                      >
                        Yuborish
                        <iconify-icon icon="f7:paperplane" width="20" />
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
                          : "K"}
                      </div>
                      <h2 className="mt-3 text-lg font-semibold dark:text-white">
                        {selected ? selected.name : "Title"}
                      </h2>
                      {activeTab !== "shaxsiy" && (
                        <p className="text-sm text-gray-400">
                          {sGroupUsers?.length} foydalanuvchi
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setShowLeft(false)}
                      className="absolute right-4 top-[40px] text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      <iconify-icon icon="ic:round-close" width="32" />
                    </button>
                  </div>

                  {/* Members */}
                  {activeTab !== "shaxsiy" && (
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
                          <div
                            key={user.id}
                            className="flex items-center gap-3"
                          >
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
                  )}
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
