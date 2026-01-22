import React, { useEffect, useRef, useState } from "react";
import mammoth from "mammoth";
import { FaPen, FaSave } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { expertEtaps, inExperts } from "../../api";
import ExpertizeModal from "../../components/expertize";
import { sendRpcRequest } from "../../api/webClient";
import { METHOD } from "../../api/zirhrpc";
import { useZirhStref } from "../../context/ZirhContext";
import toast from "react-hot-toast";
const A4_HEIGHT = 1120;
const A4_CONTENT_HEIGHT = 1120; // A4 content height px
const A4_WIDTH = 794;

const firstSection = [
  {
    title: "Mobil ilova",
    desc: "Maʼlum bir platforma (iOS, Android, Windows Phone va boshqalar) uchun ishlab chiqilgan smartfonlar, planshetlar va boshqa mobil qurilmalarda ishlashga moʻljallangan dastur. ",
  },
  {
    title: "iOS",
    desc: "“Apple”ning iPhone, iPod, iPad, Apple TV uskunalarida oʻrnatilgan mobil aloqa operatsion sistemasi. ",
  },
  {
    title: "Android OS",
    desc: "Smartfonlar, planshetlar, elektron kitoblar, raqamli pleyerlar, qoʻl soatlari, fitnes bilakuzuklar, oʻyin pristavkalari, noutbuklar, netbuklar, smartbuklar, Google Glass koʻzoynaklari, televizorlar, proyektorlar hamda boshqa qurilmalar (2015-yildan avtomobillar tizimlari va maishiy robotlarga ham oʻrnatiladi) uchun operatsion tizim hisoblanadi.",
  },
];

const secondSection = [
  {
    title: "App Store",
    desc: "iOS va iPadOS operatsion tizimlaridagi mobil ilovalar uchun Apple kompaniyasi tomonidan ishlab chiqilgan va qoʻllabquvvatlanadigan ilovalarning onlayn do‘koni.",
  },
  {
    title: "Google Play Store",
    desc: "Android operatsion tizimlaridagi mobil ilovalar uchun Google kompaniyasi tomonidan ishlab chiqilgan va qoʻllabquvvatlanadigan ilovalarning onlayn do‘koni. ",
  },
  {
    title: "Firebase",
    desc: "Google tomonidan Android, iOS tizimlari, JavaScript, Node.js, Java, Unity, PHP va C++ ilovalariga “backend” va maʼlumotlar bazasi bulutli xizmatlarini taqdim qiladigan servis bo‘lib, real vaqtdagi maʼlumotlar bazasi, autentifikatsiya, ilovalarni integrallash va analitika xizmatlarini taklif qiladi.",
  },
  {
    title: "“Man in the middle” hujumi",
    desc: "Tajovuzkor ikki mashina yoki ikkita foydalanuvchi o‘rtasidagi aloqani tinglashi, manipulyatsiya qilish yoki boshqarish imkoniyatining mavjudligi. Ushbu hujum ikki tomon o‘rtasidagi aloqada paydo “Uzenergo” mobil ilovasi bo‘lgan",
  },
];

const thirdSection = [
  {
    title: "",
    desc: "tajovuzkor tomonidan o‘zini proksi yoki router sifatida ko‘rsatish orqali amalga oshiriladi.",
  },
  {
    title: "Statik tahlil ",
    desc: "Mobil ilovani (dastur) amalda ishga tushirmasdan, uning xavfsizligini tekshirish usuli. Ushbu turdagi sinov ilova kodini tiklash, kodni tahlil qilish hamda yakunda koddagi zaiflik va kamchiliklarni aniqlashni o‘z ichiga oladi.",
  },
  {
    title: "Dinamik tahlil",
    desc: "Mobil ilovada (dastur) ishlayotgan vaqtda ekspertiza sinovlarini o‘tkazishni o‘z ichiga oladi. Sinovning bu turi ilova xattiharakatlarini tahlil qilish, zaiflik va kamchiliklarni aniqlashni o‘z ichiga oladi. Dinamik tahlilning afzalliklaridan biri shundaki, u statik tahlil yordamida aniqlash qiyin bo‘lgan zaifliklarni aniqlay oladi. Misol uchun, dinamik tahlil orqali foydalanuvchining tizimga kirishi va autentifikatsiyasi bilan bog‘liq zaifliklarni aniqlashi mumkin.",
  },
  {
    title: " ",
    desc: "Ochiq standart bo‘lib, hisoblash tizimlaridagi xavfsizlik zaifliklarining",
  },
];

const fourthSection = [
  {
    title: "Umumiy zaifliklarni baholash tizimi (CVSS)",
    desc: "miqdoriy ballarini “Uzenergo” mobil ilovasi hisoblash uchun ishlatiladi. Ballar bir nechta ko‘rsatkichlarga asoslangan maxsus formulalar yordamida hisoblanadi va ekspluatatsiyani amalga oshirish qulayligini va uning hisoblash tizimiga ta’sirini taxminiy baholaydi.",
  },
  {
    title: "Ma’lumotlar bazasi",
    desc: "Amaliy dasturlarga bog‘liq bo‘lmagan holda, maʼlumotlarni tavsiflash, saqlash va boshqarishning umumiy prinsiplarini ko‘zda tutadigan muayyan qoidalar bo‘yicha tashkil qilingan maʼlumotlar jamlanmasi.",
  },
  {
    title: "SQL-inyeksiya",
    desc: "So‘rovlar tanasiga maxsus SQLkodlarni kiritishga asoslangan, maʼlumotlar bazasi bilan ishlovchi veb-sayt va dasturlarga amalga oshiriladigan hujumlardan biri.",
  },
  {
    title: "Sintaksis va mantiqiy nuqsonlar ",
    desc: "Buferning to‘lib ketishi yoki boshqa turdagi nosozliklarga olib keladi. Ularni aniqlash uzoq vaqt va mashina kodi qismlarida nuqsonlarni bartaraf etish bo‘yicha ishlarni olib borishni talab etadi.",
  },
];

const vulnerabilityTemplates = {
  integrity: `
    <div class="a4">
      <div class="page-content">
        <div class="exp-title">
          Ilovada o‘zining yaxlitligini tekshirish mexanizmi joriy etilmaganligi
        </div>
        <div class="exp-d">
          <b>Xavflilik darajasi:</b> Yuqori
        </div>
        <div class="text">
          Ilova o‘z kodlari yaxlitligini tekshirmaydi...
        </div>
      </div>
    </div>
  `,
  sql: `
    <div class="a4">
      <div class="page-content">
        <div class="exp-title">SQL Injection</div>
        <div class="exp-d"><b>Xavflilik darajasi:</b> O‘rta</div>
      </div>
    </div>
  `,
};

let vulnCounter = 1;
const Word = () => {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageRefs = useRef([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertize, setExpertize] = useState([]);
  const [appName, setAppName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgTypeName, setOrgTypeName] = useState("");
  const [contractName, setContractName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [htmlContent, setHtmlContent] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [highVuln, setHighVuln] = useState([]);
  const [mediumVuln, setMediumVuln] = useState([]);
  const [lowVuln, setLowVuln] = useState([]);
  const [vuln, setVuln] = useState([]);
  const [contractDate, setContractDate] = useState("");
  const [allVuln, setAllVuln] = useState([]);
  const [newVuln, setNewVuln] = useState([]);
  const [pages1, setPages1] = useState([]);

  const pdfRef = useRef();
  const { stRef } = useZirhStref();

  const printRef = useRef(null);
  const { id } = useParams();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "abm-mobil",
  });

  const startIndex = htmlContent.findIndex((p) =>
    p.includes(
      "2.2. Android mobil ilovasi ekspertizasi natijalari bo‘yicha batafsil izoh",
    ),
  );

  useEffect(() => {
    const editables = document.querySelectorAll(".editable");

    editables.forEach((el) => {
      el.contentEditable = editing;
      el.style.outline = editing ? "1px dashed #4f46e5" : "none";
    });
  }, [editing]);

  useEffect(() => {
    const allPageContent = document.querySelectorAll(".page-content");
    const strongElements = document.querySelectorAll(".page-content strong");

    strongElements.forEach((el) => {
      const text = el.textContent?.trim() || "";
      if (
        text === "Yuqori" ||
        text === "Past" ||
        text === "O‘rta" ||
        text === "Ma’lumot uchun" ||
        text === "Xavflilik darajasi:" ||
        text.includes(".apk") ||
        text.includes(".ipa") ||
        text.includes("[android:usesCleartextTraffic=false]")
      ) {
        const tdParent = el.closest("td");
        if (!tdParent) {
          el.classList.add("strongstyle");
        }
      } else if (
        text === "Ekspluatatsiya oqibatlari" ||
        text === "Tavsiyalar"
      ) {
        if (!el.closest("td")) {
          el.classList.add("teststrong");
        }
      }
    });

    allPageContent.forEach((page) => {
      // console.log(page.offsetHeight);
    });
  }, [pages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!editing) return;

      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (["e", "l", "r", "j"].includes(key)) e.preventDefault();

        switch (key) {
          case "e":
            document.execCommand("justifyCenter");
            break;
          case "l":
            document.execCommand("justifyLeft");
            break;
          case "r":
            document.execCommand("justifyRight");
            break;
          case "j":
            document.execCommand("justifyFull");
            break;
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        const tabNode = document.createTextNode(
          "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0",
        );
        range.insertNode(tabNode);
        range.setStartAfter(tabNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editing]);

  const paginateHtml = (html) => {
    const measure = document.createElement("div");
    measure.style.width = "794px";
    measure.style.padding = "40px";
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.fontSize = "14px";
    measure.style.lineHeight = "1.6";
    document.body.appendChild(measure);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const blocks = Array.from(wrapper.childNodes);
    const pagesResult = [];
    let currentPage = document.createElement("div");

    blocks.forEach((block) => {
      currentPage.appendChild(block.cloneNode(true));
      measure.innerHTML = currentPage.innerHTML;

      if (measure.scrollHeight > 950) {
        const lastChild = currentPage.lastChild;
        if (lastChild) {
          currentPage.removeChild(lastChild);

          pagesResult.push(currentPage.innerHTML);

          currentPage = document.createElement("div");
          currentPage.appendChild(lastChild.cloneNode(true));
        }
      }
    });

    if (currentPage.innerHTML.trim()) {
      pagesResult.push(currentPage.innerHTML);
    }

    document.body.removeChild(measure);
    setPages(pagesResult);
  };

  const saveAllPages = () => {
    const updated = pageRefs.current.map((el) => el?.innerHTML || "");
    setPages(updated);
    setEditing(false);
  };

  const handleModal = (id) => {
    console.log(id);
  };

  const getExpertById = async () => {
    // console.log(id);
    try {
      const res = await sendRpcRequest(stRef, METHOD.ORDER_GET_ID, { 1: id });
      if (res.status === METHOD.OK) {
        setContractDate(formatDate(res.result[1]?.[2][0]));
        setHtmlContent(res.result[1]?.[8]);
        setContractName(res.result[1]?.[10]);
        setOrgTypeName(res.result[1]?.[1][6]);
        setOrgName(res.result[1]?.[1][0]);
        setAppName(res.result[1]?.[1][3]);
        setExpertize(res.result[1]?.[1]);
        const raw = res.result[1]?.[13];
        // console.log(res);

        const highVuln1 = Array.isArray(raw)
          ? raw.flat().map(({ a1, a2, a3 }) => ({ a1, a2, a3 }))
          : [{ a1: raw.a1, a2: raw.a2, a3: raw.a3 }];

        setHighVuln(highVuln1);

        const raw1 = res.result[1]?.[12];

        const mV = Array.isArray(raw1)
          ? raw1.flat().map(({ a1, a2, a3 }) => ({ a1, a2, a3 }))
          : [{ a1: raw1.a1, a2: raw1.a2, a3: raw1.a3 }];
        setMediumVuln(mV);

        const raw2 = res.result[1]?.[11];

        const lV = Array.isArray(raw2)
          ? raw2.flat().map(({ a1, a2, a3 }) => ({ a1, a2, a3 }))
          : [{ a1: raw2.a1, a2: raw2.a2, a3: raw2.a3 }];
        setLowVuln(lV);

        // console.log(res.result[1]?.[13]);
        setAllVuln([
          ...highVuln1,
          ...mV,
          ...lV,
        ]);
      } else if (res.status === METHOD.BAD_REQUEST) {
        toast.error("Ma'lumot topilmadi!");
      }
      // console.log(res);
    } catch (error) {
      console.log(error);
      console.log("Xatolik yuz berdi!");
    }
  };

  useEffect(() => {
    getExpertById();
    // console.log(highVuln);
  }, []);

  const renderPage = (html, index) => (
    <div
      key={index}
      className="page-container editable"
      contentEditable={editing}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: html }}
      ref={(el) => (pageRefs.current[index] = el)}
    />
  );

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    const day = date.getUTCDate();
    const monthNumber = date.getMonth() + 1;
    const year = date.getFullYear();

    let monthName = "";

    switch (monthNumber) {
      case 1:
        monthName = "yanvardagi";
        break;
      case 2:
        monthName = "fevraldagi";
        break;
      case 3:
        monthName = "martdagi";
        break;
      case 4:
        monthName = "apreldagi";
        break;
      case 5:
        monthName = "maydagi";
        break;
      case 6:
        monthName = "iyundagi";
        break;
      case 7:
        monthName = "iyuldagi";
        break;
      case 8:
        monthName = "avgustdagi";
        break;
      case 9:
        monthName = "sentabrdagi";
        break;
      case 10:
        monthName = "oktabrdagi";
        break;
      case 11:
        monthName = "noyabrdagi";
        break;
      case 12:
        monthName = "dekabrdagi";
        break;
      default:
        monthName = "";
    }

    return ` ${year}-yil ${day} ${monthName}`;
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const addVulnerabilityToPages = (docVulnHtml) => {
    setVulnerabilities((prev) => [...prev, docVulnHtml]);
  };

  const handleSaveDocFromModal = (docVuln) => {
    // console.log("Childdan keldi:", docVuln);
    generateVulnHtml(docVuln);
    const html = vulnerabilityTemplates[docVuln.type];
    // console.log("HTML:", html);

    addVulnerabilityToPages(html);
    handleSubmit(docVuln);
  };

  const insertAfterIndex = (array, index, newItem) => {
    if (index < 0 || index >= array.length) {
      return [...array, newItem];
    }

    return [...array.slice(0, index + 1), newItem, ...array.slice(index + 1)];
  };

  const stripHtml = (html = "") => {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const generateVulnHtml = (vulnData) => {
    const level = vulnData?.[1]?.[0];
    const title = stripHtml(vulnData?.[1]?.[1]);
    const result = stripHtml(vulnData?.[1]?.[2]);
    const desc = stripHtml(vulnData?.[1]?.[3]);
    const recommendation = stripHtml(vulnData?.[1]?.[4]);

    const levelText = level === 1 ? "Yuqori" : level === 2 ? "O‘rta" : "Past";

    let newInnerHtml = "";
    if (newVuln.length == 0) {
      newInnerHtml = `
    <div class="title">2.2. “${appName}” android mobil ilovasi ekspertizasi natijalari bo‘yicha batafsil izoh></div>
    <div class="exp-title">2.2.${vulnCounter} ${title}</div>
    <div class="exp-d"><b>Xavflilik darajasi:</b> ${levelText}</div>
    <div class="text">${result}</div>
    <div class="text"><b>Ekspluatatsiya oqibatlari:</b> ${desc}</div>
    <div class="text"><b>Tavsiyalar:</b> ${recommendation}</div>
  `;
    } else {
      newInnerHtml = `
    <div class="exp-title">2.2.${vulnCounter} ${title}</div>
    <div class="exp-d"><b>Xavflilik darajasi:</b> ${levelText}</div>
    <div class="text">${result}</div>
    <div class="text"><b>Ekspluatatsiya oqibatlari:</b> ${desc}</div>
    <div class="text"><b>Tavsiyalar:</b> ${recommendation}</div>
  `;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(newInnerHtml, "text/html");

    let blocks = [];

    // Har bir divni tekshiramiz
    doc.body.querySelectorAll("div").forEach((div) => {
      if (div.classList.contains("text")) {
        // text divni satrlarga bo‘lish
        const lines = div.innerHTML
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);
        lines.forEach((line) => blocks.push(`<div class="text">${line}</div>`));
      } else {
        blocks.push(div.outerHTML);
      }
    });

    setNewVuln((prev) => [...prev, ...blocks]);
    vulnCounter += 1;

    // console.log(newVuln);
    setHtmlContent((prev) => {
      const updated = [...prev];

      const parser = new DOMParser();
      const doc = parser.parseFromString(updated[startIndex], "text/html");

      const pageContent = doc.querySelector(".page-content");
      if (pageContent) {
        pageContent.insertAdjacentHTML("beforeend", newInnerHtml);
        updated[startIndex] = doc.body.innerHTML;
      }

      // console.log(updated);
      const a4 = document.querySelectorAll(".page-content");
      const a4Array = Array.from(updated).map((el) => el.innerHTML);
      // console.log(a4Array);

      // setHtmlContent(updated);

      return updated;
    });
  };

  const handleSubmit = async (docVuln) => {
    try {
      const level = docVuln?.[1]?.[0];
      if (!level) return;

      const fieldMap = {
        1: 13,
        2: 12,
        3: 11,
      };

      const field = fieldMap[level];
      if (!field) return;

      const payload = {
        19: id,
        [field]: [
          {
            a1: level,
            a2: docVuln?.[2],
            a3: docVuln?.[1]?.[1],
          },
        ],
      };

      return;
      const res = await sendRpcRequest(stRef, METHOD.ORDER_UPDATE, payload);

      // console.log("Yuborilgan payload:", payload);
      // console.log("Response:", res);
    } catch (error) {
      console.error(error);
    }
  };

  const paginateContent = (items) => {
    const pages = [];
    let currentPage = [];

    const tempDiv = document.createElement("div");
    tempDiv.style.width = "794px";
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    document.body.appendChild(tempDiv);

    items.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = item;
      tempDiv.appendChild(wrapper);

      if (tempDiv.scrollHeight > 580) {
        pages.push(currentPage);
        currentPage = [item];
        tempDiv.innerHTML = item;
      } else {
        currentPage.push(item);
      }
    });

    if (currentPage.length) pages.push(currentPage);
    document.body.removeChild(tempDiv);
    return pages;
  };

  useEffect(() => {
    if (newVuln?.length) {
      const result = paginateContent(newVuln);
      setPages1(result);
    }
  }, [newVuln]);

  const handleInput = (pageContent) => {
    if (!pageContent || !pageContent.children) return;

    const blocks = Array.from(pageContent.children).map(
      (child) => child.outerHTML,
    );

    const paged = paginateContent(blocks);
    setPages1(paged);
  };

  const makeImagesResizable = (container) => {
    const imgs = container.querySelectorAll(".text img");

    imgs.forEach((img) => {
      // agar allaqachon event qo‘shilgan bo‘lsa, qaytadan qo‘shmaslik
      if (img.dataset.resizable) return;
      img.dataset.resizable = "true";

      img.style.userSelect = "none";
      img.style.cursor = "nwse-resize";

      let startX, startY, startWidth, startHeight;

      const onPointerMove = (e) => {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        img.style.width = `${Math.max(50, newWidth)}px`;
        img.style.height = `${Math.max(50, newHeight)}px`;
      };

      const onPointerUp = () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);

        // resize qilinganidan keyin pagination yangilash
        const pageContent = img.closest(".page-content");
        if (pageContent) handleInput({ currentTarget: pageContent });
      };

      img.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = img.offsetWidth;
        startHeight = img.offsetHeight;

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
      });
    });
  };

  useEffect(() => {
    const editables = document.querySelectorAll(".page-content");

    editables.forEach((container) => {
      // dastlabki rasm eventlari
      makeImagesResizable(container);

      const observer = new MutationObserver(() => {
        makeImagesResizable(container); // yangi rasm qo‘shilganda ham event qo‘shiladi
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    });
  }, [pages1, editing, newVuln, htmlContent]);

  const saveAllChanges = async () => {
    const allPages = document.querySelectorAll(".page-content");

    let allBlocks = [];

    allPages.forEach((page) => {
      Array.from(page.children).forEach((child) => {
        allBlocks.push(child.outerHTML);
      });
    });

    // pagination qayta hisoblanadi
    const paged = paginateContent(allBlocks);

      // console.log(paged);
          const res = await sendRpcRequest(stRef, METHOD.ORDER_UPDATE, {
            19: id,
            8: paged,
          });
          // console.log(res);
    setPages1(paged);
    setEditing(false); // edit rejimdan chiqadi

    toast.success("Barcha o‘zgarishlar saqlandi");
  };

  return (
    <>
      <ExpertizeModal
        open={modalOpen}
        onClose={closeModal}
        item={expertize}
        itemId={id}
        onSaveDoc={handleSaveDocFromModal}
      />

      <div className="word-container dark:text-[#333] relative " ref={printRef}>
        <div className="flex justify-end mb-4 gap-2 print-btns sticky right-9 top-[80px]">
          <button
            className="bg-blue-600 hvoer:bg-blue-700 text-white px-4 py-2 rounded mt-4"
            onClick={() => openModal(expertize)}
          >
            Zaiflik qo'shish
          </button>
          <button
            onClick={handlePrint}
            className={`mt-4 px-4 py-2 rounded text-white  items-end flex gap-2 
    ${loading ? "" : "bg-blue-600 hover:bg-blue-700"}
  `}
          >
            <iconify-icon
              icon="pepicons-print:printer"
              width="1.2em"
              height="1.2em"
            ></iconify-icon>
            <span> Hisobot </span>
          </button>

          <div
            className="edit-btn-global"
            onClick={() => {
              if (editing) {
                saveAllChanges();
              } else {
                setEditing(true);
              }
            }}
          >
            {editing ? (
              <div className="cursor-pointer change-btn">
                <div className="bg-green-500 hover:bg-green-600">
                  <FaSave />
                  <span>Saqlash </span>
                </div>
              </div>
            ) : (
              <div className="change-btn flex gap-2 cursor-pointer">
                <div className="bg-blue-600 hover:bg-blue-700">
                  <FaPen /> <span>Tahrirlash</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="a4 first-a4">
          <div className="page-content">
            <h2 className="application-name">“{appName}”</h2>
          </div>
        </div>
        <div className="a4 mundarija1">
          <div className="page-content top editable">
            <h2 className="mundarija first-m">Mundarija</h2>
            <div className="mundarija-content first">
              <div className="content-title">
                <span>3</span>
              </div>
              <div className="mundarija-section">birinchi bo‘lim.</div>
              <div className="mundarija-head">UMUMIY MA’LUMOTLAR</div>
              <div className="mundarija-body">
                <div className="mundarija-row">
                  <div className="row-title">Atamalar va ta’riflar</div>
                  <div className="row-num">3</div>
                </div>
                <div className="mundarija-row">
                  <div className="row-title">
                    Ekspertiza o‘tkazish uchun asos
                  </div>
                  <div className="row-num">7</div>
                </div>
                <div className="mundarija-row">
                  <div className="row-title">Ekspertiza obyekti</div>
                  <div className="row-num">7</div>
                </div>
                <div className="mundarija-row">
                  <div className="row-title">Ekspertiza o‘tkazish tartibi</div>
                  <div className="row-num">9</div>
                </div>
                <div className="mundarija-row">
                  <div className="row-title">
                    Ekspertiza yuzasidan qo‘shimcha ma’lumotlar
                  </div>
                  <div className="row-num">12</div>
                </div>
              </div>
            </div>
            <div className="mundarija-content">
              <div className="content-title">
                <span>14</span>
              </div>
              <div className="mundarija-section">IKKINCHI BO‘LIM.</div>
              <div className="mundarija-head">EKSPERTIZA NATIJALARI</div>
              <div className="mundarija-body">
                <div className="mundarija-row">
                  <div className="row-title large">
                    Ekspertiza natijalari to‘g‘risida umumlashtirilgan <br />
                    ma’lumot
                  </div>
                  <div className="row-num">14</div>
                </div>
                <div className="mundarija-row">
                  <div className="row-title large">
                    Android mobil ilovasi ekspertizasi natijalari bo‘yicha
                    batafsil izoh
                  </div>
                  <div className="row-num">16</div>
                </div>
                <div className="mundarija-row">
                  <div className="row-title large">{allVuln?.[0]?.a3}</div>
                  <div className="row-num">16</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="a4 mundarija2">
          <div className="page-content editable">
            <div className="mundarija second-m">Mundarija</div>
            <div className="mundarija-content">
              <div className="mundarija-body">
                {allVuln.slice(1).map((item, index) => (
                  <div className="mundarija-row" key={index}>
                    <div className="row-title large">{item.a3}</div>
                    <div className="row-num">18</div>
                  </div>
                ))}
              </div>

              <div className="content-title">
                <span>33</span>
              </div>
              <div className="mundarija-section">UCHINCHI BO‘LIM.</div>
              <div className="mundarija-head" style={{ marginBottom: "40px" }}>
                UMUMIY XULOSA
              </div>
            </div>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              0 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 0 % 2 === 0 ? `end` : `start`,
              marginRight: 0 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <h1 className="depart-title mundarija-section">Birinchi bo'lim</h1>
            <h2 className="depart-subtitle">UMUMIY MA’LUMOTLAR</h2>
            <table className="depart-table">
              <tbody>
              {firstSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>3</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              1 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 1 % 2 === 0 ? `end` : `start`,
              marginRight: 1 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content top editable">
            <table className="depart-table">
              <tbody>
              {secondSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>4</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              2 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 2 % 2 === 0 ? `end` : `start`,
              marginRight: 2 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content top editable">
            
            <table className="depart-table">
              <tbody>
              {thirdSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>5</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              3 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 3 % 2 === 0 ? `end` : `start`,
              marginRight: 3 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content top editable">
            <table className="depart-table">
              <tbody>
              {fourthSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>6</span>
          </div>
        </div>
        <div className="a4">
          <div
            className="page-title"
            style={{
              alignItems: 4 % 2 === 0 ? `end` : `start`,
              marginRight: 4 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <div className="title">1.2. Ekspertiza o‘tkazish uchun asos</div>
            <div className="text">
              "Kiberxavfsizlik markazi" davlat unitar korxonasi va "{orgName}"{" "}
              {orgTypeName} oʻrtasida tuzilgan {contractDate}{" "}
              <b className="text-b">"{appName}"</b> mobil ilovasini
              kiberxavfsizlik talablariga muvofiqligi yuzasidan ekspertizadan
              oʻtkazish to'g'risidagi <b className="text-b">"{contractName}"</b>{" "}
              shartnoma.
            </div>

            <div className="title">1.3. Ekspertiza obyekti</div>
            <div className="text">
              <b>“{appName}” android/iOS </b> mobil ilovasining{" "}
              <b>“{appName}.apk”</b> va <b>“{appName}.ipa”</b> fayllari.
            </div>
            <div className="text-i">
              1-jadval. Mobil ilovaning <br />
              “Android” OT uchun versiyasi
            </div>

            <table className="expert-table">
              <thead>
                <tr>
                  <th style={{ width: "60px", minWidth: "60px" }}>T/r.</th>
                  <th style={{ width: "200px", minWidth: "200px" }}>
                    Texnik ma’lumot nomlanishi
                  </th>
                  <th style={{ width: "240px", minWidth: "240px" }}>Izoh</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td>Dasturchi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td>Rasmiy veb sayt</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td>Fayl nomi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>4.</td>
                  <td>Paket nomi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>5.</td>
                  <td>Asosiy oyna</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>6.</td>
                  <td>Talqin</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>7.</td>
                  <td>Minimal API talqini</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>8.</td>
                  <td>Joriy API talqini</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>9.</td>
                  <td>Ilova kategoriyasi</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>7</span>
          </div>
        </div>

        <div
          className="a4"
          style={{
            backgroundImage:
              5 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 5 % 2 === 0 ? `end` : `start`,
              marginRight: 5 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="expert-table mt-6">
              <tbody>
                <tr>
                  <td>10.</td>
                  <td>Ilova logotipi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>11.</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>12.</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>13.</td>
                  <td>O‘rnatilishlar soni </td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>14.</td>
                  <td>MD5</td>
                  <td>- </td>
                </tr>
                <tr>
                  <td>15.</td>
                  <td>SHA1</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>16.</td>
                  <td>SHA256</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            <div className="text-i my-3">
              1-jadval. Mobil ilovaning <br />
              “iOS” OT uchun versiyasi
            </div>

            <table className="expert-table">
              <thead>
                <tr>
                  <th style={{ width: "60px", minWidth: "60px" }}>T/r.</th>
                  <th style={{ width: "200px", minWidth: "200px" }}>
                    Texnik ma’lumot nomlanishi
                  </th>
                  <th style={{ width: "240px", minWidth: "240px" }}>Izoh</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td>Dasturchi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td>Rasmiy veb sayt</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td>Fayl nomi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>4.</td>
                  <td>Paket nomi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>5.</td>
                  <td>Asosiy oyna</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>6.</td>
                  <td>Talqin</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>7.</td>
                  <td>Minimal API talqini</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            <div className="page-number flex justify-center mt-auto">
              <span>8</span>
            </div>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              6 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 6 % 2 === 0 ? `end` : `start`,
              marginRight: 6 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="expert-table mt-6">
              <tbody>
                <tr>
                  <td>8.</td>
                  <td>Joriy API talqini</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>9.</td>
                  <td>Ilova kategoriyasi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>10.</td>
                  <td>Ilova logotipi </td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>11.</td>
                  <td>Play Market havolasi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>12.</td>
                  <td>Play Market reytingi</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>13.</td>
                  <td>O‘rnatilishlar soni </td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>14.</td>
                  <td>MD5</td>
                  <td>- </td>
                </tr>
                <tr>
                  <td>15.</td>
                  <td>SHA1</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>16.</td>
                  <td>SHA256</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>

            <div className="title mt-4">1.4. Ekspertiza o‘tkazish tartibi</div>
            <table className="depart-table">
              <tbody>
              {expertEtaps.slice(0, 1).map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first etp">
                    <img src={`${item.img}`} alt={`${item.title}`} />
                    <div>{item.title}</div>
                    <img src={`${item.dv}`} alt={`${item.dv}`} />
                  </td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className="page-number flex justify-center mt-auto">
              <span>9</span>
            </div>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              7 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 7 % 2 === 0 ? `end` : `start`,
              marginRight: 7 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="depart-table">
              <tbody>
              {expertEtaps.slice(1, 4).map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first etp">
                    <img src={`${item.img}`} alt={`${item.title}`} />
                    <div>{item.title}</div>
                    <img src={`${item.dv}`} alt={`${item.dv}`} />
                  </td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className="page-number flex justify-center mt-auto">
              <span>10</span>
            </div>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              8 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 8 % 2 === 0 ? `end` : `start`,
              marginRight: 8 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="depart-table">
              <tbody>
              {expertEtaps.slice(4, 7).map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first etp">
                    <img src={`${item.img}`} alt={`${item.title}`} />
                    <div>{item.title}</div>
                    {item.dv !== null && (
                      <img src={`${item.dv}`} alt={`${item.dv}`} />
                    )}
                  </td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className="text">
              Ekspertiza o‘tkazish tartibi asosida amalga oshiriladigan ishlar
              jarayoni quyidagi tadbirlarni ham o‘z ichiga oladi:
            </div>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>11</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              9 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 9 % 2 === 0 ? `end` : `start`,
              marginRight: 9 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="depart-table">
              <tbody>
              {inExperts.slice(0, 5).map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first exp">
                    <div>
                      {item.id}. {item.title}
                    </div>
                  </td>
                  <td className="depart-table-last exp">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className="page-number flex justify-center mt-auto">
              <span>12</span>
            </div>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              10 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 10 % 2 === 0 ? `end` : `start`,
              marginRight: 10 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="depart-table">
              <tbody>
              {inExperts.slice(6, 9).map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first exp">
                    <div>
                      {item.id}. {item.title}
                    </div>
                  </td>
                  <td className="depart-table-last exp">{item.desc}</td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className="title">
              1.5. Ekspertiza yuzasidan qo‘shimcha ma’lumotlar
            </div>
            <div className="text">
              “{appName}” android/iOS mobil ilovalari ekspertizasi buyurtmachi
              tomonidan taqdim qilingan ma’lumotlar, jumladan: <br />
              <b>- “{appName}.apk”;</b> <br />
              <b>- “{appName}.ipa”</b> fayllari, shuningdek 4-jadvaldagi
              foydalanuvchi qayd yozuvlari asosida olib borildi.
            </div>
            <table className="expert-table mt-6">
              <thead>
                <tr>
                  <th>T/r</th>
                  <th>Rol</th>
                  <th>Kirish</th>
                  <th>Parol</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td>Foydalanuvchi</td>
                  <td>+998938623880</td>
                  <td>sms</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>13</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              11 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 11 % 2 === 0 ? `end` : `start`,
              marginRight: 11 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <h1 class="depart-title mundarija-section">IKKINCHI BO‘LIM.</h1>
            <h2 class="depart-subtitle">UMUMIY MA’LUMOTLAR</h2>
            <div className="title">
              2.1. Ekspertiza natijalari to‘g‘risida umumlashtirilgan ma’lumot
            </div>
            <div className="text">
              Ekspertiza natijalari asosida 3 xil xavflilik darajasiga ega,
              ya’ni <b>yuqori, o‘rta</b> va <b>past</b> xavflilik darajasidagi
              axborot xavfsizligi zaifliklari va tizimda ma’lumot uchun holatlar
              aniqlanishi mumkin.
            </div>
            <div className="text">
              Axborot xavfsizligi zaifliklari xavflilik darjasidan kelib chiqqan
              holda mobil ilovaga quyidagi risklar xavf soladi.
            </div>
            <div className="text">
              <b>Yuqori</b> - ushbu turdagi axborot xavfsizligi zaifliklari
              ilovaga eng yuqori xavf ko‘rsatadi. Ulardan foydalanish ilovaga
              ruxsatsiz kirish, uning ma’lumotlaridan foydalanish bilan bir
              qatorda muhim, konfidensial ma’lumotlarni sizib chiqish
              holatlarini yuzaga kelishiga sabab bo‘lishi mumkin.
            </div>
            <div className="text">
              <b>O‘rta</b> - ushbu turdagi axborot xavfsizligi zaifliklari ko‘p
              holatlarda boshqa turdagi xavflilik darajasi yuqori bo‘lgan
              harakatlarni amalga oshirishga, ilova bilan bog‘liq ma’lumotlarni
              to‘plashga xizmat qiladi.
            </div>
            <div className="text">
              <b>Past</b> - ushbu turdagi axborot xavfsizligi zaifliklari
              ilovada umumiy ma’lumotlarga ega bo‘lish imkoniyatini taqdim
              etadi.
            </div>
            <div className="text">
              <b>Ma’lumot uchun </b> – ilovaga xavf solmaydigan, ekspertiza
              davrida aniqlangan axborot xavfsizligiga zid holatlar.
            </div>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>14</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              12 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 12 % 2 === 0 ? `end` : `start`,
              marginRight: 12 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <div className="text">
              Olib borilgan ekspertiza natijalari asosida aniqlangan axborot
              xavfsizligi zaifliklari to‘g‘risida umumlashtirilgan ma’lumotlar
              5-jadvalda taqdim qilingan.
            </div>
            <div className="text-i my-3 underline">
              5-jadval. Android mobil ilovasida <br />
              aniqlangan zaifliklar.
            </div>
            <table class="expert-table">
              <thead>
                <tr>
                  <th style={{ width: "100px", minWidth: "100px" }}>
                    Xavflilik darajasi{" "}
                  </th>
                  <th style={{ width: "300px", minWidth: "300px" }} colSpan={2}>
                    Aniqlangan zaifliklar nomi va soni
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Yuqori */}
                {highVuln?.map((item, index) => (
                  <tr key={`high-${index}`}>
                    {index === 0 && (
                      <td rowSpan={highVuln.length}>
                        <b>Yuqori</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td style={{fontWeight: "normal"}}>{item.a2}</td>
                  </tr>
                ))}

                {/* O'rta */}
                {mediumVuln?.map((item, index) => (
                  <tr key={`medium-${index}`}>
                    {index === 0 && (
                      <td rowSpan={mediumVuln.length}>
                        <b>O'rta</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td>{item.a2}</td>
                  </tr>
                ))}

                {/* Past */}
                {lowVuln?.map((item, index) => (
                  <tr key={`low-${index}`}>
                    {index === 0 && (
                      <td rowSpan={lowVuln.length}>
                        <b>Past</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td>{item.a2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>15</span>
          </div>
        </div>

        {pages1.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            className="a4"
            style={{
              backgroundImage:
                pageIndex % 2 === 0
                  ? `url("/assets/word/2.png")`
                  : `url("/assets/word/3.png")`,
            }}
          >
            <div
              className="page-title"
              style={{
                alignItems: pageIndex % 2 === 0 ? "end" : "start",
                marginRight: pageIndex % 2 === 0 ? "50px" : "0px",
              }}
            >
              <div>“{appName}”</div>
              <div>mobil ilovasi</div>
            </div>

            <div className="page-content editable">
              {pageItems.map((item, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </div>

            <div className="page-number flex justify-center mt-auto">
              <span>{pageIndex + 16}</span>
            </div>
          </div>
        ))}

        {/* {htmlContent.slice(0, startIndex + 1).map(renderPage)} */}

        {/* {vuln && <div key={1} dangerouslySetInnerHTML={{ __html: vuln }} />} */}
        {/* 
        {vulnerabilities.map((html, i) => (
          <div key={`vuln-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
        ))} */}

        {/* {htmlContent.slice(startIndex + 1).map(renderPage)} */}
        {/* {htmlContent?.map((item, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))} */}
      </div>
    </>
  );
};

export default Word;
