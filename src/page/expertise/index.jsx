import React, { use, useEffect, useRef, useState } from "react";
import "../dashboard/dashboard.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Select from "react-select";

import ExpertizaTable from "../../components/table";
import {
  downloadFileViaRpc,
  sendRpcRequest,
  uploadFileViaRpc,
} from "../../api/webClient";
import { METHOD } from "../../api/zirhrpc";
import { useZirhStref } from "../../context/ZirhContext";
import toast from "react-hot-toast";

const Card = ({ label, value, icon, accent = "teal" }) => {
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return (
    <div
      className="bg-white dark:bg-[#2b2c40] bg-gradient-to-r from-cyan-600/10 to-bg-white stat-card stat-card"
      data-accent={accent}
    >
      <div className="stat-card__top">
        <div className="stat-card__label text-[#718193] dark:text-gray-200 text-lg">
          {label}
        </div>
        <div
          className="stat-card__icon"
          style={{
            color: accent == "muted" ? "#8592a3" : accent,
            background: hexToRgba(accent, 0.1),
          }}
          aria-hidden
        >
          <i
            className={`${icon} text-4xl`}
            style={{ width: 36, height: 36 }}
          ></i>
        </div>
      </div>
      <div className="stat-card__value text-[#566a7f] dark:text-gray-300">
        {value}
      </div>
    </div>
  );
};

const Section = ({ title, items }) => (
  <section className="stats-section">
    <h3 className="stats-section__title">{title}</h3>
    <div className="stats-grid">
      {items.map((it, i) => (
        <Card
          key={i}
          label={it.label}
          value={it.value}
          icon={it.icon}
          accent={it.accent}
        />
      ))}
    </div>
  </section>
);

const orgTypes = ["DUK", "MCHJ", "AJ", "ATB", "AITB", "DM"];

const STATUS_STEPS = [
  { id: 1, label: "Shartnoma kelgan" },
  { id: 2, label: "Tizimga qo'shilgan" },
  { id: 3, label: "Xat chiqarilgan" },
  { id: 4, label: "Xat kelgan" },
  { id: 5, label: "Jarayonda" },
  { id: 6, label: "Hisobotga chiqarilgan" },
  { id: 7, label: "Qisman yakunlangan" },
  { id: 8, label: "Qayta expertiza" },
  { id: 9, label: "To'liq yakunlangan" },
  { id: 10, label: "Vaqtincha to'xtatilgan" },
];

const ITEMS_PER_PAGE = 10;

const Expertise = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedVuln, setSelectedVuln] = useState("");
  const [zaiflikText, setZaiflikText] = useState("");
  const [oqibatlarText, setOqibatlarText] = useState("");
  const [tavsiyaText, setTavsiyaText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [fileName, setFileName] = React.useState(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const { stRef } = useZirhStref();
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expertize, setExpertize] = useState([]);
  const [isPage, setIsPage] = useState(1);
  const [justPage, setJustPage] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [signleExp, setSingleExp] = useState(null);

  const [formData, setFormData] = useState({
    orgName: "",
    orgId: "",
    orgTypeId: "",
    controllers: "",
    workers: "",
    ordName: "",
    ordPrice: "",
    contract: null,
    contractNumber: "",
    contractDate: "",
    contractPriceDate: "",
    resPer: "",
    orgType: "",
    ordEndDate: "",
    system: 1,
  });
  const [editItemOld, setEditItemOld] = useState({
    orgName: "",
    orgId: "",
    orgTypeId: "",
    controllers: "",
    workers: "",
    ordName: "",
    ordPrice: "",
    contract: null,
    contractNumber: "",
    contractDate: "",
    contractPriceDate: "",
    resPer: "",
    orgType: "",
    ordEndDate: "",
  });

  const system = [
    { label: "Jami:", value: 0, accent: "blue", icon: "bx bxs-circle" },
    {
      label: "To'liq yakunlangan:",
      value: 0,
      accent: "green",
      icon: "bx bxs-circle-half",
    },
    {
      label: "Qisman yakunlangan:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Xat chiqarilgan:",
      value: 0,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Xat kelgan:",
      value: 0,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Jarayonda:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-half",
    },
    {
      label: "O'tib ketgan:",
      value: 0,
      accent: "red",
      icon: "bx bxs-circle-half",
    },
    {
      label: "Hisobotga chiqarilgan:",
      value: 0,
      accent: "blue",
      icon: "bx bxs-circle-three-quarter",
    },
    {
      label: "Qayta ekspertizada:",
      value: 0,
      accent: "aqua",
      icon: "bx bxs-circle-quarter",
    },
    {
      label: "Vaqtincha to'xtatilgan:",
      value: 0,
      accent: "red",
      icon: "bx bxs-circle-three-quarter",
    },
    {
      label: "Tizimga qo'shilgan:",
      value: 0,
      accent: "muted",
      icon: "bx bxs-circle-quarter",
    },
  ];

  const handlePdf = () => {
    navigate("/page/viewer");
  };

  const handleModal = (id) => {
    console.log(id);
    const exp = expertize.find((item) => item.id === id);
    setSingleExp(exp);
    console.log(exp);
    handleNewCreate(exp);
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setSelectedVuln("");
      setZaiflikText("");
      setOqibatlarText("");
      setTavsiyaText("");
    }
  };

  const openDrawer = () => {
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const getUserFullNameById = (userId) => {
    const user = items.find((item) => item.id === userId);

    if (user) {
      return `${user.surname} ${user.name}`;
    }

    return "Foydalanuvchi topilmadi";
  };

  const handleCreate = async () => {
    console.log(formData);
    // return
    if (
      !formData.orgName ||
      !formData.ordName ||
      !formData.contract ||
      !formData.contractNumber ||
      !formData.contractDate ||
      !formData.contractPriceDate ||
      !formData.ordEndDate ||
      !formData.orgType ||
      !formData.orgTypeId ||
      !formData.controllers ||
      !formData.workers ||
      !formData.resPer ||
      !formData.ordPrice
    ) {
      toast.error("Tashkilot nomi, Tizim nomi va Shartnoma fayli majburiy!");
      return;
    }
    setUploadProgress(0);
    setIsUploading(true);

    const file = formData.contract;

    const doneRes = await uploadFileViaRpc(
      stRef,
      file,
      null,

      (p) => {
        // console.log(p);
        setUploadProgress(p);
      },
    );
    // console.log(formData);

    formData.contract = doneRes.result["fileId"];
    // console.log(doneRes);
    const payload = {
      1: formData.orgName,
      2: formData.orgId,
      3: formData.orgTypeId,
      4: [...formData.controllers, ...formData.workers],
      6: formData.ordName,
      7: formData.ordPrice,
      8: formData.contractNumber,
      9: {
        1: formData.contract,
        2: fileName,
      },
      10: formData.contractDate,
      11: formData.contractPriceDate,
      12: formData.resPer,
      13: formData.ordEndDate,
      14: formData.orgType,
      15: formData.system,
    };

    // console.log(payload);
    const res = await sendRpcRequest(stRef, METHOD.ORDER_CREATE, payload);

    if (res.status == METHOD.OK) {
      toast.success("Muvaffaqiyatli qo'shildi!");
      getAllExpertize();
    } else {
      toast.error("Xatolik yuz berdi!");
    }

    // console.log(res);
    // return;

    // setItems([
    //   ...items,
    //   {
    //     id: Date.now(),
    //     ...formData,
    //   },
    // ]);

    setFormData({
      surname: "",
      name: "",
      partName: "",
      email: "",
      role: "",
      department: "",
      phone: "",
      image: "",
    });
    closeDrawer();
  };

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

  const getAllExpertize = async (id = null, nextPage = true) => {
    // console.log("id", id);
    try {
      const res = await sendRpcRequest(stRef, METHOD.ORDER_GET_PAGE, {
        1: id,
        2: nextPage,
        3: 1,
      });
      if (res.status == METHOD.OK) {
        const page = formatBufferToId(res.result[1].cursorId);
        if (page != null) {
          setIsPage(page);
        }
        setNextPage(page);

        // if()

        const list = res?.result[1]?.docs;

        console.log(res.result[1]);

        if (!Array.isArray(list)) {
          console.error("docs kelmadi yoki array emas", res);
          return;
        }

        const formattedData = list.map((item) => {
          const base = item["1"] || [];
          const dates = item["2"] || {};
          return {
            id: bufferToObjectId(item._id?.buffer),
            orgName: base[0] || "",
            orgUuid: base[1] || "",
            shortName: base[3] || "",
            inn: base[4] || "",
            director: base[5] || "",
            orgType: base[6] || "",
            contractDate: dates["1"] || null,
            startDate: dates["2"] || null,
            endDate: dates["3"] || null,
            status: item["3"],
            number: item["10"],
            files: (item["6"] || []).filter(Boolean),
            controllers: (item["7"] || []).filter((p) => p.a3 === 1),
            workers: (item["7"] || []).filter((p) => p.a3 === 2),
            active: item["18"],
          };
        });

        return formattedData;
      }
      // console.log(res);
      // return;
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

              let imageFileId = info[5] || "";
              if (
                imageFileId == "6968e7a2e3b6146a0601b78f" ||
                imageFileId.length < 30
              ) {
                imageFileId = "9276c76090ee854fbea8670b32975676";
              }
              const checkFileId = localStorage.getItem(imageFileId);
              if (imageFileId && !checkFileId) {
                await downloadFileAll(
                  imageFileId || "9276c76090ee854fbea8670b32975676",
                );
              }

              return {
                id: bufferToObjectId(user._id?.buffer),
                email: user["1"] || "",
                role: user["3"] || "",
                department: info[0] || "",
                surname: info[1] || "",
                name: info[2] || "",
                partName: info[3] || "",
                phone: info[4] || "",
                image: imageFileId,
              };
            }),
          );

          const expr = await getAllExpertize();
          setExpertize(expr);
          // console.log(expertize);
          setItems(mappedItems);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllUser();

    console.log(expertize);
  }, []);

  const totalItems = expertize?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = expertize?.slice(startIndex, endIndex) || [];

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [expertize?.length, totalPages, currentPage]);

  const downloadFileAll = async (id) => {
    await downloadFileViaRpc(stRef, id, id, (p) => {
      // console.log(p);
      setUploadProgress(p);
      setIsUploading(true);
      if (p === 100) setIsUploading(false);
    });
  };

  const handleVulnChange = (e) => {
    const value = e.target.value;
    setSelectedVuln(value);

    if (value === "Ilova kodini yaxlitligi joriy etilmaganligi") {
      setZaiflikText(
        `Ilova o‘z kodlari va imzo ma’lumotlarining yaxlitligini va haqiqiyligini tekshirmaydi. Bunday holatda ilova qayta yig’ilgan, statik modifikatsiyaga uchragan yoki noto‘g‘ri/soxta sertifikat bilan imzolangan bo‘lsa, server yoki ilova buni aniqlay olmaydi. Mazkur turdagi zaiflik “MASWE-0104” (inglizcha. App Integrity Not Verified – Ilova yaxlitligi tasdiqlanmasligi) identifikator raqamiga ega kategoriyaga mansub.`,
      );
      setOqibatlarText(
        `Ilovani kodiga o’zgartirish kiritish va uni qayta yig‘ish, zararli kod qo‘shish yoki imzoni almashtirib, foydalanuvchilarga zarar yetkazuvchi soxta talqinlarni tarqatish.`,
      );
      setTavsiyaText(
        `Ilova ishga tushganida o‘zining imzosini, to’liqligini tekshirish mexanizmini quyi darajadagi (Native C++) dasturlash tillaridan foydalangan holda joriy etish.`,
      );
    } else if (value === "Malumotlarni oshkor etilishi") {
      setZaiflikText(`Ekspertiza davrida axborot tizimiga tegishli ichki ma’lumotlar, xususan muhim qismlarga kirish oynalari, turli xil kengaytmadagi fayllar Internet tarmog‘ining barcha foydalanuvchilari uchun ochiq holatdaligi, ya’ni ichki resurslarga bo‘ladigan murojaatlarni boshqarish hamda nazorat qilish mexanizmlari qo‘llanmaganlik holati aniqlandi.

Mazkur turdagi zaiflik CWE (Common Weaknes Enumeration) dasturiy va apparat ta’minotlarning zaifliklarini kategoriyalash tizimida “CWE-200” (inglizcha. Exposure of Sensitive Information to an Unauthorized Actor – Ishonchsiz foydalanuvchiga ma’lumotlarni ochiqlanishi) identifikator raqamiga ega kategoriyaga mansub.

Bundan tashqari, “Open Web Application Security Project” (Veb-ilovalarning xavfsizligini ta’minlash ochiq loyihasi) OWASP Top 2021 reytingida: 1-o‘rindagi (inglizcha. Broken Access Control – Ruxsatlar nazoratini buzilishi) zaiflik turiga kiritilgan.

Quyidagi misolda aniqlangan zaiflik ekspluatatsiyasi holati taqdim etilgan.`);
      setOqibatlarText(
        `Mazkur holat, ixtiyoriy Internet tarmog‘i foydalanuvchisiga resurslarga murojaat qilish orqali ulardan foydalanish imkoniyatini taqdim etadi.`,
      );
      setTavsiyaText(
        `Ushbu qism bilan bog‘liq dasturiy kodni qayta ko‘rib chiqish hamda takomillashtirish.`,
      );
    } else if (value === "Himoyalanmagan havolalar") {
      setZaiflikText(`Ilovadagi URL manzillar teskari muhandislik usulini ishlatgan holda oxirgi nuqtalar va/yoki kutubxonalar haqida maʼlumotlarni olish imkoniyatini beradi. Ushbu ma’lumotlardan uchinchi tomon ruxsatsiz ilovalar yoki skriptlar yozish uchun foydalanishi mumkin.

Bundan tashqari, agar shifrlash to‘g‘ri sozlanmagan bo‘lsa, tarmoqdagi tajovuzkor barcha aloqalarni ko‘rishi va tarkibni o‘zboshimchalik bilan o‘zgartirishi mumkin. Agar ma’lumotlar ilovaning nozik joylarida ishlatilsa yoki ma’lumotlar ijroga ta’sir qilsa, bu ilovada jiddiy oqibatlarga olib kelishi mumkin.

Mazkur turdagi zaiflik “MASWE-0058” (inglizcha. Insecure Deep Links – Xavfsiz bo‘lmagan havolalar) identifikator raqamiga ega kategoriyaga mansub. Shuningdek, OWASP Mobile Top 10 2024 reytingida 8-o‘rinda (inglizcha. Security Misconfiguration – Noto‘g‘ri xavfsizlik konfiguratsiyasi) zaiflik turiga kiritilgan.`);
      setOqibatlarText(
        `Ochiq havolalar to‘g‘risida ma’lumotlarni qo‘lga kiritish holatiga olib kelishi mumkin.`,
      );
      setTavsiyaText(
        `Ilovada foydalanilayotgan tashqi va ichki resurs havolalarini ochiq matn shaklida saqlamaslik.`,
      );
    } else {
      setZaiflikText("");
      setOqibatlarText("");
      setTavsiyaText("");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!isUpdate) return;

    const map = {
      orgName: 4.1,
      orgId: 4.2,
      orgTypeId: 4.3,
      ordName: 4.4,
      ordPrice: 4.5,
      contractNumber: 4.6,
      contractDate: 4.7,
      contractPriceDate: 4.8,
      contract: 4.9,
      resPer: 5,
      controllers: 5.1,
      orgType: 5.2,
      workers: 5.3,
      ordEndDate: 5.4,
      permLetter: 5.5,
      consentLetter: 5.6,
    };

    const code = map[name];
    if (!code) return;

    if (value === editItemOld[name]) {
      setChangedFields((prev) => prev.filter((c) => c !== code));
    } else {
      setChangedFields((prev) =>
        prev.includes(code) ? prev : [...prev, code],
      );
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    setFormData((prev) => ({
      ...prev,
      contract: file,
    }));

    if (isUpdate) {
      const isChanged = true;
      setChangedFields((prev) => {
        if (isChanged && !prev.includes(4.9)) {
          return [...prev, 4.9];
        }
        return prev;
      });
    }
  };
  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    setFormData((prev) => ({
      ...prev,
      permLetter: file,
    }));

    if (isUpdate) {
      const isChanged = true;
      setChangedFields((prev) => {
        if (isChanged && !prev.includes(4.9)) {
          return [...prev, 4.9];
        }
        return prev;
      });
    }
  };
  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    setFormData((prev) => ({
      ...prev,
      consentLetter: file,
    }));

    if (isUpdate) {
      const isChanged = true;
      setChangedFields((prev) => {
        if (isChanged && !prev.includes(4.9)) {
          return [...prev, 4.9];
        }
        return prev;
      });
    }
  };

  const handleEdit = async (item) => {
    console.log(item);
    try {
      if (item) {
        setFormData({
          ...formData,
          id: item.id,
          orgName: item.orgName,
          orgId: item.orgUuid,
          orgTypeId: item.orgUuid,
          ordName: item.shortName,
          ordPrice: item.inn,
          contractNumber: item.number,
          contractDate: item.contractDate,
          contractPriceDate: item.startDate,
          resPer: item.director,
          contract: item.files[0]?.["2"],
          controllers: item.controllers,
          orgType: item.orgType,
          workers: item.workers,
          ordEndDate: item.endDate,
        });
        setEditItemOld({
          ...formData,
          id: item.id,
          orgName: item.orgName,
          orgId: item.orgUuid,
          orgTypeId: item.orgUuid,
          ordName: item.shortName,
          ordPrice: item.inn,
          contractNumber: item.number,
          contractDate: item.contractDate,
          contractPriceDate: item.startDate,
          resPer: item.director,
          contract: item.files[0]?.["2"],
          controllers: item.controllers,
          orgType: item.orgType,
          workers: item.workers,
          ordEndDate: item.endDate,
        });
        setEditId(item.id);
        setIsUpdate(true);
        setDrawerOpen(true);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const payload = { 19: formData.id };

      if (formData.contract && formData.contract instanceof File) {
        setUploadProgress(0);
        setIsUploading(true);

        const uploadRes = await uploadFileViaRpc(
          stRef,
          formData.contract,
          null,
          (p) => {
            setUploadProgress(p);
            if (p === 100) setIsUploading(false);
          },
        );

        formData.contract = uploadRes.result["fileId"];
      }
      if (formData.permLetter && formData.permLetter instanceof File) {
        setUploadProgress(0);
        setIsUploading(true);

        const uploadRes = await uploadFileViaRpc(
          stRef,
          formData.permLetter,
          null,
          (p) => {
            setUploadProgress(p);
            if (p === 100) setIsUploading(false);
          },
        );

        formData.permLetter = uploadRes.result["fileId"];
      }
      if (formData.consentLetter && formData.consentLetter instanceof File) {
        setUploadProgress(0);
        setIsUploading(true);

        const uploadRes = await uploadFileViaRpc(
          stRef,
          formData.consentLetter,
          null,
          (p) => {
            setUploadProgress(p);
            if (p === 100) setIsUploading(false);
          },
        );

        formData.consentLetter = uploadRes.result["fileId"];
      }

      // console.log(formData)
      // return

      const fieldMap = {
        orgName: 1.1,
        orgId: 1.2,
        orgTypeId: 1.3,
        ordName: 1.4,
        ordPrice: 1.9,
        contractNumber: 1.7,
        contractDate: 2.2,
        contractPriceDate: 2.3,
        resPer: 1.6,
        contract: 2.5,
        controllers: 2.6,
        orgType: 1.7,
        workers: 2.8,
        ordEndDate: 2.4,
        permLetter: 6.3,
        consentLetter: 6.1,
      };

      const updatedFieldCodes = [];

      Object.keys(fieldMap).forEach((key) => {
        if (formData[key] !== editItemOld[key]) {
          const code = fieldMap[key];
          console.log(code);
          if (code == 6.3 || code == 6.1) {
            payload[code] = {
              1: formData[key],
              2: fileName,
            };
            // console.log(payload)
          } else if (key === "department" || key === "role") {
            payload[code] = parseInt(formData[key]);
          } else {
            payload[code] = formData[key];
          }

          updatedFieldCodes.push(code);
        }
      });

      // console.log(payload)
      // return

      if (updatedFieldCodes.length === 0) {
        toast.error("Hech qanday o'zgarish qilinmadi");
        return;
      }

      console.log("Payload:", payload);
      const res = await sendRpcRequest(stRef, METHOD.ORDER_UPDATE, payload);
      console.log(res);

      if (res.status === METHOD.OK) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === formData.id ? { ...item, ...formData } : item,
          ),
        );

        setChangedFields((prev) =>
          prev.filter((code) => !updatedFieldCodes.includes(code)),
        );

        setEditItemOld({ ...formData });

        toast.success("Foydalanuvchi muvaffaqiyatli yangilandi");
      } else {
        toast.error("Xatolik: Server ma'lumotni qabul qilmadi");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Foydalanuvchi yangilanmadi, tizim xatosi");
    }
  };

  const handleNewCreate = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
    } catch (error) {
      console.log("");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const handleNextPage = async (id) => {
    try {
      const newData = await getAllExpertize(id, true);

      if (newData) {
        setExpertize(newData);
        setJustPage(justPage + 1);
      }
    } catch (error) {
      console.error("Next Page Error:", error);
    }
  };

  const handleBackPage = async (id) => {
    try {
      const newData = await getAllExpertize(id, false);

      if (newData) {
        setExpertize(newData);
        setJustPage(justPage - 1);
      }
    } catch (error) {
      console.error("Back Page Error:", error);
    }
  };

  const getUser = (item) => {
    if (!item || !Array.isArray(item)) return [];

    return item.map((user) => ({
      value: user.id,
      label: `${user.surname} ${user.name}`,
    }));
  };

  const handleControllerChange = (selectedOptions) => {
    const formattedControllers = selectedOptions
      ? selectedOptions.map((option) => ({
          a1: option.value,
          a2: option.label,
          a3: 1,
        }))
      : [];
    setFormData((prev) => ({
      ...prev,
      controllers: formattedControllers,
    }));
    console.log(formattedControllers);
  };

  const handleWorkersChange = (selectedOptions) => {
    const formattedControllers = selectedOptions
      ? selectedOptions.map((option) => ({
          a1: option.value,
          a2: option.label,
          a3: 2,
        }))
      : [];
    setFormData((prev) => ({
      ...prev,
      workers: formattedControllers,
    }));
  };

  return (
    <>
      {drawerOpen && (
        <div onClick={closeDrawer} className="fixed inset-0 bg-black/40 z-40" />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[700px] pr-[30px] bg-white dark:bg-[#2b2c40] z-50 transform transition-transform duration-300
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-500">
            Tizim qo'shish
          </h2>
          <button onClick={closeDrawer} className="text-xl">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-[48%]">
              <label className="text-sm text-gray-500 uppercase">
                Tashkilot nomi
              </label>
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="Tashkilotni kiriting"
              />
              {changedFields.includes(4.1) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
            <div className="relative w-[48%] ml-[20px]">
              <label className="text-sm text-gray-500 uppercase">
                Tashkilot idis
              </label>
              <input
                type="text"
                name="orgId"
                value={formData.orgId}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="Tashkilot"
              />
              {changedFields.includes(4.2) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-[48%]">
              <label className="text-sm text-gray-500 uppercase">
                OrgTpeId
              </label>
              <input
                type="text"
                name="orgTypeId"
                value={formData.orgTypeId}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="Tashkilot turini kiriting"
              />
              {changedFields.includes(4.3) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>{" "}
            <div className="relative w-[48%] ml-[20px]">
              <label className="text-sm text-gray-500 uppercase">
                Tizim nomi
              </label>
              <input
                type="text"
                name="ordName"
                value={formData.ordName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="Tizim nomini kiriting"
              />
              {changedFields.includes(4.4) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-[48%]">
              <label className="text-sm text-gray-500 uppercase">
                Buyurtma narxi
              </label>
              <input
                type="text"
                name="ordPrice"
                value={formData.ordPrice}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="Buyurtma narxi"
              />
              {changedFields.includes(4.5) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
            <div className="relative w-[48%] ml-[20px]">
              <label className="text-sm text-gray-500 uppercase">
                Shartnoma raqami
              </label>
              <input
                type="text"
                name="contractNumber"
                value={formData.contractNumber}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="Shartnoma raqami"
              />
              {changedFields.includes(4.6) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-[48%] flex flex-col justify-end">
              <label className="text-sm text-gray-500 uppercase mb-1">
                Shartnoma
              </label>

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  height: "42px",
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  color: "#566a7f",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#696cff",
                  },
                }}
              >
                {fileName || "Faylni tanlang"}
                <input
                  type="file"
                  hidden
                  name="contract"
                  onChange={(e) => {
                    handleFileChange(e);
                  }}
                />
              </Button>
              {changedFields.includes(4.9) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
            <div className="relative w-[48%] ml-[20px]">
              <label className="text-sm text-gray-500 uppercase">
                Shartnoma sanasi
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={
                    formData.contractDate ? dayjs(formData.contractDate) : null
                  }
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      contractDate:
                        newValue && newValue.isValid()
                          ? newValue.toISOString()
                          : "",
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      className: "mt-1 border rounded-md bg-transparent",
                    },
                  }}
                />
              </LocalizationProvider>
              {/* {changedFields.includes(4.7) && ( */}
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
              {/* )} */}
            </div>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-[48%]">
              <label className="text-sm text-gray-500 uppercase">
                To'lov sanasi
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={
                    formData.contractPriceDate
                      ? dayjs(formData.contractPriceDate)
                      : null
                  }
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      contractPriceDate:
                        newValue && newValue.isValid()
                          ? newValue.toISOString()
                          : "",
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      className: "mt-1 border rounded-md bg-transparent",
                    },
                  }}
                />
              </LocalizationProvider>
              {/* {changedFields.includes(4.8) && ( */}
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
              {/* )} */}
            </div>
            <div className="relative w-[48%] ml-[20px]">
              <label className="text-sm text-gray-500 uppercase">
                Biriktirilgan shaxs
              </label>
              <input
                type="text"
                name="resPer"
                value={formData.resPer}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
                placeholder="F.I.SH"
              />
              {changedFields.includes(5) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-[48%]">
              <label className="text-sm text-gray-500 uppercase">
                Nazoratchini tanlang
              </label>

              <Select
                isMulti
                name="controllers"
                options={getUser(items)}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Nazoratchini tanlang..."
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
              {changedFields.includes(5.1) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>

            <div className="relative w-[48%] ml-[20px]">
              <label className="text-sm text-gray-500 uppercase">
                Bajaruvchini tanlang
              </label>
              <Select
                isMulti
                name="workers"
                options={getUser(items)}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Bajaruvchini tanlang..."
                onChange={handleWorkersChange}
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
              {changedFields.includes(5.3) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-[48%]">
              <label className="text-sm text-gray-500 uppercase">
                Tashkilot turi
              </label>
              <select
                name="orgType"
                value={formData.orgType}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-transparent"
              >
                <option value="">Tanlang</option>
                {orgTypes.map((item, index) => {
                  return (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
              {changedFields.includes(5.2) && (
                <button
                  onClick={handleUpdate}
                  type="button"
                  className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                >
                  <iconify-icon
                    icon="ri:information-2-line"
                    className="text-blue-500"
                  />
                </button>
              )}
            </div>

            <div className="relative w-[48%] ml-[20px]">
              <label className="text-sm text-gray-500 uppercase">
                Tugash sanasi
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={
                    formData.ordEndDate ? dayjs(formData.ordEndDate) : null
                  }
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      ordEndDate:
                        newValue && newValue.isValid()
                          ? newValue.toISOString()
                          : "",
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      className: "mt-1 border rounded-md bg-transparent",
                    },
                  }}
                />
              </LocalizationProvider>{" "}
              {/* {changedFields.includes(5.4) && ( */}
              <button
                onClick={handleUpdate}
                type="button"
                className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
              >
                <iconify-icon
                  icon="ri:information-2-line"
                  className="text-blue-500"
                />
              </button>
              {/* )} */}
            </div>
          </div>

          {isUpdate && (
            <div className="flex justify-between gap-4 items-center">
              <div className="relative w-[48%] flex flex-col justify-end">
                <label className="text-sm text-gray-500 uppercase mb-1">
                  Ruhsat xati
                </label>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    height: "42px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    color: "#566a7f",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#696cff",
                    },
                  }}
                >
                  {fileName || "Faylni tanlang"}
                  <input
                    type="file"
                    hidden
                    name="permLetter"
                    onChange={(e) => {
                      handleFileChange1(e);
                    }}
                  />
                </Button>
                {changedFields.includes(5.5) && (
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                  >
                    <iconify-icon
                      icon="ri:information-2-line"
                      className="text-blue-500"
                    />
                  </button>
                )}
              </div>
              <div className="relative w-[48%] flex flex-col justify-end">
                <label className="text-sm text-gray-500 uppercase mb-1">
                  Rozilik xati
                </label>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    height: "42px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    color: "#566a7f",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#696cff",
                    },
                  }}
                >
                  {fileName || "Faylni tanlang"}
                  <input
                    type="file"
                    hidden
                    name="consentLetter"
                    onChange={(e) => {
                      handleFileChange2(e);
                    }}
                  />
                </Button>
                {changedFields.includes(5.6) && (
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className=" absolute top-[27px] right-[-13px] w-3 h-12 cursor-pointer text-2xl"
                  >
                    <iconify-icon
                      icon="ri:information-2-line"
                      className="text-blue-500"
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          {!isUpdate && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreate}
                className="bg-[#696cff] text-white px-4 py-2 rounded-md"
              >
                Yaratish
              </button>
              <button
                onClick={closeDrawer}
                className="bg-gray-200 dark:bg-gray-400 px-4 py-2 rounded-md"
              >
                Bekor qilish
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className="dashboard-page bg-[#f5f5f9] dark:bg-[#1e1e2f] "
        style={{ margin: "-20px" }}
      >
        <Section title="Tizim ekspertizalar" items={system} />
        <div className="mt-10">
          <div className="bg-white rounded-md shadow-sm pb-20 dark:bg-[#2b2c40]">
            <div className="mb-6 px-6 pt-6">
              <h4 className="text-sm text-slate-400 font-medium">
                Qidiruv filter
              </h4>
              <div className="mt-3 flex items-center gap-4">
                <select className="border rounded-md px-3 py-2 text-sm text-slate-500 w-64 bg-transparent">
                  <option>Foydalanuvchini tanlang ...</option>
                </select>
                <div className="ml-auto flex items-center">
                  <div className="relative">
                    <input
                      className="border rounded-md px-3 py-2 text-sm text-slate-500 outline-none bg-transparent"
                      placeholder="Qidirish..."
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                      <iconify-icon
                        icon="mdi:magnify"
                        width="18"
                        height="18"
                      ></iconify-icon>
                    </span>
                  </div>
                  <button
                    className="bg-[#696cff] text-white font-bold py-2 px-4 rounded-md ml-4 hover:bg-[#565edc] transition-colors"
                    onClick={openDrawer}
                  >
                    + Tizim qo'shish
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 text-xs border-t border-b">
                    <th className="px-4 py-3 text-[14px] font-normal border-r">
                      N
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">
                      TASHKILOT NOMI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r text-wrap">
                      AXBOROT TIZIMINING NOMI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">
                      SHARTNOMA RAQAMI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">
                      NAZORATCHI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">
                      BAJARUVCHI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r text-wrap">
                      EKSPERTIZANING BOSHLANISH SANASI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r text-wrap">
                      EKSPERTIZANING YAKUNLANISH SANASI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r text-wrap">
                      HISOB MA'LUMOTI
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r text-wrap">
                      BALL
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal border-r">
                      QAYSI BOSQICHDA
                    </th>
                    <th className="px-4 py-3 text-[14px] font-normal">
                      HOLATLAR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b align-middle py-6 hover:bg-gray-50 dark:hover:bg-[#2b2c40]"
                    >
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">
                        {i + 1}
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r text-center">
                        {r.orgName}
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r text-center">
                        {r.shortName}
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r text-center">
                        {r.number}
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">
                        {r?.controllers?.map((b, idx) => (
                          <span className="block mb-1" key={idx}>
                            {b.a2}
                          </span>
                        ))}
                      </td>
                      <td className="px-4 py-4 align-middle whitespace-pre-line text-[15px] text-[#8895a4] border-r">
                        {r?.workers?.map((b, idx) => (
                          <span className="block mb-1" key={idx}>
                            {b.a2}
                          </span>
                        ))}
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r">
                        {r.start}
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-[#8895a4] border-r text-center">
                        {formatDate(r.endDate)}
                      </td>
                      <td className="px-4 py-4 align-middle border-r text-center">
                        <span className="inline-block px-2 py-1 text-xs rounded-md bg-red-100 dark:bg-red-400 text-red-600 dark:text-red-50 text-[13px] uppercase">
                          {r.hisobot || "Chiqarilmagan"}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle text-[15px] text-center text-[#8895a4] border-r">
                        {r.ball || "0/15"}
                      </td>
                      <td className="px-4 py-4 align-middle border-r">
                        <div className="h-full flex relative">
                          {STATUS_STEPS.map((step, index) => {
                            const isActive = r.status >= step.id;

                            return (
                              <div
                                key={step.id}
                                className="relative group"
                                style={{
                                  marginLeft: index === 0 ? 0 : -14,
                                  zIndex: index,
                                }}
                              >
                                <span
                                  className={`w-7 h-7 cursor-pointer rounded-full border border-white dark:border-[#2b2c40] ${
                                    isActive ? "bg-blue-700" : "bg-gray-400"
                                  } flex items-center justify-center`}
                                >
                                  <span className="text-[10px] text-white font-bold">
                                    {step.id}
                                  </span>
                                </span>

                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 text-sm text-white bg-black rounded opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-[100]">
                                  {step.label}
                                  <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-black rotate-45 -translate-x-1/2"></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-md bg-sky-50 text-sky-400 font-bold"
                            onClick={() => handleEdit(r)}
                          >
                            <iconify-icon
                              icon="tabler:edit"
                              width="20"
                              height="20"
                            ></iconify-icon>
                          </button>
                          <button
                            className="p-2 rounded-md bg-violet-50 text-violet-600"
                            onClick={() => handleModal(r.id)}
                          >
                            <iconify-icon
                              icon="mdi:dots-vertical"
                              width="20"
                              height="20"
                            ></iconify-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalItems > 0 && (
                <div className="px-6 py-4 flex items-center justify-between border-t dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {totalItems > 0
                      ? `${startIndex + 1}–${Math.min(endIndex, totalItems)} / ${totalItems}`
                      : "Ma'lumot yo'q"}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={justPage == 0}
                      onClick={
                        () => handleBackPage(isPage)
                        // setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      // disabled={currentPage === 1}
                      className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Oldingi
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium">
                      {justPage + 1}
                    </span>
                    <button
                      onClick={
                        () => handleNextPage(isPage)
                        // setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={nextPage == null}
                      className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Keyingi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <button
            className="mt-4 px-[10px] pt-[10px] bg-gray-50 text-gray-700 rounded absolute top-[30px] right-[13px] shadow-md"
            onClick={handleModal}
          >
            <iconify-icon
              icon="mdi:close"
              width="28"
              height="28"
            ></iconify-icon>
          </button>
          <div className="bg-white dark:bg-[#2b2c40] rounded-lg shadow-lg p-6 w-[55%] relative overflow-y-scroll max-h-[100vh]">
            <h2 className="text-lg font-semibold mb-4 text-gray-500 dark:text-gray-200">
              Batafsil
            </h2>
            <ExpertizaTable expData={signleExp} link="/system-doc" />
          </div>
        </div>
      )}
    </>
  );
};

export default Expertise;
