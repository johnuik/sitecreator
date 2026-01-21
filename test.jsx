import React, { useEffect, useRef, useState } from "react";
import mammoth from "mammoth";
import { FaPen, FaSave } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import docxfile from "../../assets/mobil.docx";
import { expertEtaps, inExperts } from "../../api";
import { useParams } from "react-router-dom";
import ExpertizeModal from "../../components/expertize";
import { sendRpcRequest } from "../../api/webClient";
import { METHOD } from "../../api/zirhrpc";
import { useZirhStref } from "../../context/ZirhContext";
import toast from "react-hot-toast";

const A4_HEIGHT = 1123;
const PAGE_PADDING = 80;

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

const exploits = [
  {
    dagre: "Yuqori",
    title: "",
    vuln: "",
    result: "",
    recommendation: "",
    image: [],
  },
];

const Word = () => {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertize, setExpertize] = useState([]);
  const [appName, setAppName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [htmlContent, setHtmlContent] = useState([]);

  const pdfRef = useRef();
  const { stRef } = useZirhStref();

  const printRef = useRef(null);
  const { id } = useParams();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "abm-mobil",
  });

  useEffect(() => {
    load();
  }, []);

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
    console.log(exploits);
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

  const load = async () => {
    const res = await fetch(docxfile);
    const buffer = await res.arrayBuffer();
    const { value } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    paginateHtml(value);
  };

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
        // console.log("t: " + measure.scrollHeight);
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
        console.log(res.result[1]?.[8]);
        setHtmlContent(res.result[1]?.[8]);
        setAppName(res.result[1]?.[1][3]);
        setExpertize(res.result[1]?.[1]);
      } else if (res.status === METHOD.BAD_REQUEST) {
        toast.error("Ma'lumot topilmadi!");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      console.log("Xatolik yuz berdi!");
    }
  };

  useEffect(() => {
    getExpertById();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <ExpertizeModal
        open={modalOpen}
        onClose={closeModal}
        item={expertize}
        itemId={id}
      />
      <div className="word-container dark:text-[#333] relative" ref={printRef}>
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

          <div className="edit-btn-global" onClick={() => setEditing(!editing)}>
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
        {htmlContent?.map((item, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}

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
                  <div className="row-title large">
                    Ilova ma’lumotlarining zaxira nusxasini yaratish
                  </div>
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
                <div className="mundarija-row">
                  <div className="row-title large">
                    SQL buyruqlarini to‘g‘ridan-to‘g‘ri bajarilishi{" "}
                  </div>
                  <div className="row-num">18</div>
                </div>
                <div className="mundarija-row">
                  <div className="row-title large">
                    Zaif shifrlash algoritmlari{" "}
                  </div>
                  <div className="row-num">20</div>
                </div>
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
              {firstSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
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
              {secondSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
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
              {thirdSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
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
              {fourthSection.map((item, index) => (
                <tr key={index}>
                  <td className="depart-table-first">{item.title}</td>
                  <td className="depart-table-last">{item.desc}</td>
                </tr>
              ))}
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
              "Kiberxavfsizlik markazi" davlat unitar korxonasi va
              "AXBOROTLASHTIRISH BOSH MARKAZI" MCHJ oʻrtasida tuzilgan 2025-yil
              17 noyabrdagi <b className="text-b">"ABM mobile"</b> mobil
              ilovasini kiberxavfsizlik talablariga muvofiqligi yuzasidan
              ekspertizadan oʻtkazish to'g'risidagi{" "}
              <b className="text-b">"1016-M"</b> shartnoma.
            </div>

            <div className="title">1.3. Ekspertiza obyekti</div>
            <div className="text">
              <b>“ABM mobile” android/iOS </b> mobil ilovasining{" "}
              <b>“app-release.apk”</b> va <b>“Cbu.Mobile.ipa”</b> fayllari.
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
                  <td>Axborotlashtirish bosh markazi” MChJ</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td>Rasmiy veb sayt</td>
                  <td>https://mbabm.uz/</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td>Fayl nomi</td>
                  <td>app-release.apk</td>
                </tr>
                <tr>
                  <td>4.</td>
                  <td>Paket nomi</td>
                  <td>com.anjir.cbu.mobile</td>
                </tr>
                <tr>
                  <td>5.</td>
                  <td>Asosiy oyna</td>
                  <td>crc64779f1439ab3075cb.MainActivity</td>
                </tr>
                <tr>
                  <td>6.</td>
                  <td>Talqin</td>
                  <td>1.0.3</td>
                </tr>
                <tr>
                  <td>7.</td>
                  <td>Minimal API talqini</td>
                  <td>23</td>
                </tr>
                <tr>
                  <td>8.</td>
                  <td>Joriy API talqini</td>
                  <td>35</td>
                </tr>
                <tr>
                  <td>9.</td>
                  <td>Ilova kategoriyasi</td>
                  <td>Moliya</td>
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
                  <td>10000</td>
                </tr>
                <tr>
                  <td>14.</td>
                  <td>MD5</td>
                  <td>f7dbaba30e1392ad83157fbd8174df3f </td>
                </tr>
                <tr>
                  <td>15.</td>
                  <td>SHA1</td>
                  <td>ff7dbaba30e1392ad83157fbd8174df3f1439ab3075cb</td>
                </tr>
                <tr>
                  <td>16.</td>
                  <td>SHA256</td>
                  <td>
                    crc64779ff7dbaba30e1392ad83157fbd8174df3f1439ab3075cbfdfgdsgd
                  </td>
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
                  <td>Axborotlashtirish bosh markazi” MChJ</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td>Rasmiy veb sayt</td>
                  <td>https://mbabm.uz/</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td>Fayl nomi</td>
                  <td>app-release.apk</td>
                </tr>
                <tr>
                  <td>4.</td>
                  <td>Paket nomi</td>
                  <td>com.anjir.cbu.mobile</td>
                </tr>
                <tr>
                  <td>5.</td>
                  <td>Asosiy oyna</td>
                  <td>crc64779f1439ab3075cb.MainActivity</td>
                </tr>
                <tr>
                  <td>6.</td>
                  <td>Talqin</td>
                  <td>1.0.3</td>
                </tr>
                <tr>
                  <td>7.</td>
                  <td>Minimal API talqini</td>
                  <td>23</td>
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
                  <td>35</td>
                </tr>
                <tr>
                  <td>9.</td>
                  <td>Ilova kategoriyasi</td>
                  <td>Moliya</td>
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
                  <td>10000</td>
                </tr>
                <tr>
                  <td>14.</td>
                  <td>MD5</td>
                  <td>f7dbaba30e1392ad83157fbd8174df3f </td>
                </tr>
                <tr>
                  <td>15.</td>
                  <td>SHA1</td>
                  <td>ff7dbaba30e1392ad83157fbd8174df3f1439ab3075cb</td>
                </tr>
                <tr>
                  <td>16.</td>
                  <td>SHA256</td>
                  <td>
                    crc64779ff7dbaba30e1392ad83157fbd8174df3f1439ab3075cbfdfgdsgd
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="title mt-4">1.4. Ekspertiza o‘tkazish tartibi</div>
            <table className="depart-table">
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
            </table>
            <div className="title">
              1.5. Ekspertiza yuzasidan qo‘shimcha ma’lumotlar
            </div>
            <div className="text">
              “MONIX” android/iOS mobil ilovalari ekspertizasi buyurtmachi
              tomonidan taqdim qilingan ma’lumotlar, jumladan: <br />
              <b>- “base.apk”;</b> <br />
              <b>- “base.ipa”</b> fayllari, shuningdek 4-jadvaldagi
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
                  <th style={{ width: "200px", minWidth: "200px" }}>
                    Xavflilik darajasi{" "}
                  </th>
                  <th style={{ width: "300px", minWidth: "300px" }} colSpan={2}>
                    Aniqlangan zaifliklar nomi va soni
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Yuqori</b>
                  </td>
                  <td style={{ fontWeight: "normal" }}>
                    Ilovada o‘zining yaxlitligini tekshirish mexanizmi joriy
                    etilmaganligi
                  </td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>15</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              13 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 13 % 2 === 0 ? `end` : `start`,
              marginRight: 13 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <div className="title">
              2.2. Android mobil ilovasi ekspertizasi natijalari bo‘yicha
              batafsil izoh
            </div>
            <div className="exp-title">
              2.2.1. Ilovada o‘zining yaxlitligini tekshirish mexanizmi joriy
              etilmaganligi
            </div>
            <div className="exp-d">
              <b className="underline">Xavflilik darajasi: </b> Yuqori.
            </div>
            <div className="text">
              Ilova o‘z kodlari va imzo ma’lumotlarining yaxlitligini va
              haqiqiyligini tekshirmaydi. Bunday holatda ilova qayta yig‘ilgan,
              statik modifikatsiyaga uchragan yoki noto‘g‘ri/soxta sertifikat
              bilan imzolangan bo‘lsa, server yoki ilova buni aniqlay olmaydi.
              Mazkur turdagi zaiflik <b>“MASWE-0104”</b> (inglizcha.{" "}
              <b>App Integrity Not Verified </b> – Ilova yaxlitligi
              tasdiqlanmasligi) identifikator raqamiga ega kategoriyaga mansub.
            </div>
            <div className="exp-img">
              <img src="/assets/etp/p.jpg" alt="img" />
            </div>
            <div className="items-center text-[18.67px] w-full flex justify-center">
              <i> 1-rasm. Ilova kodi o‘zgartirilgandan keyingi holati.</i>
            </div>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>16</span>
          </div>
        </div>
        <div
          className="a4"
          style={{
            backgroundImage:
              14 % 2 === 0
                ? `url("/assets/word/2.png")`
                : `url("/assets/word/3.png")`,
          }}
        >
          <div
            className="page-title"
            style={{
              alignItems: 14 % 2 === 0 ? `end` : `start`,
              marginRight: 14 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <div className="text mb-[-10px]">
              <b>Ekspluatatsiya oqibatlari</b>
            </div>
            <div className="text">
              Ilovani kodiga o‘zgartirish kiritish va uni qayta yig‘ish, zararli
              kod qo‘shish yoki imzoni almashtirib, foydalanuvchilarga zarar
              yetkazuvchi soxta talqinlarni tarqatish holatlariga olib kelishi
              mumkin.{" "}
            </div>
            <div className="text">
              <b>Tavsiya</b>
            </div>
            <div className="text">
              Ilova ishga tushganida o‘zining imzosini, to‘liqligini tekshirish
              mexanizmini quyi darajadagi (Native C++) dasturlash tillaridan
              foydalangan holda joriy etish.
            </div>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>17</span>
          </div>
        </div>

        {/* {pages.map((page, i) => (
        <div className="a4" key={i} style={{
          backgroundImage: i % 2 === 0
            ? `url("/assets/word/2.png")`
            : `url("/assets/word/3.png")`
        }}
        >
          <div className="page-title" key={i} style={{
            alignItems: i % 2 === 0
              ? `end`
              : `start`,
            marginRight: i % 2 === 0
              ? `50px`
              : `0px`
          }}>
            <div>“Abm Mobil”</div>
            <div>mobil ilovasi</div>
          </div>
          <div
            ref={el => pageRefs.current[i] = el}
            className="page-content"
            suppressContentEditableWarning
            onBlur={saveAllPages}
            dangerouslySetInnerHTML={{ __html: page }}
            style={{
              outline: editing ? "1px dashed #4f46e5" : "none"
            }}>

          </div>

          <div className="page-number flex justify-center mt-auto">
            <span>{i + 14}</span>
          </div>
        </div>
      ))} */}

        <div className="a4 last-a4"></div>
      </div>
    </>
  );
};

export default Word;
