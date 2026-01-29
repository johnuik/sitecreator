import React, { useEffect, useMemo, useRef, useState } from "react";
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

const parseVulnByLevel = (payloads) => {
  const high = [],
    medium = [],
    low = [];
  (payloads || []).forEach((p) => {
    const arr = p[13] || p[12] || p[11];
    const list = Array.isArray(arr) ? arr : arr ? [arr] : [];
    list.forEach((v) => {
      if (!v || v.a1 == null) return;
      const item = { a1: v.a1, a2: v.a2, a3: v.a3 };
      const lev = Number(v.a1) || v.a1;
      if (lev === 1) high.push(item);
      else if (lev === 2) medium.push(item);
      else if (lev === 3) low.push(item);
    });
  });
  return { high, medium, low };
};

const SystemWord = () => {
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
  const [tableData, setTableData] = useState({});
  const [rows, setRows] = useState([]);
  const [apkFileName, setApkFileName] = useState("");
  const [ipaFileName, setIpaFileName] = useState("");
  const [vulnAndroid, setVulnAndroid] = useState([]);
  const [vulnIOS, setVulnIOS] = useState([]);
  const [vulnUm, setVulnUm] = useState([]);
  const [platform, setPlatform] = useState("");
  const [pages2, setPages2] = useState([]);
  const [pages3, setPages3] = useState([]);

  const pdfRef = useRef();
  const { stRef } = useZirhStref();

  const printRef = useRef(null);
  const { id } = useParams();

  const androidVulns = useMemo(
    () => parseVulnByLevel(vulnAndroid),
    [vulnAndroid],
  );
  const iosVulns = useMemo(() => parseVulnByLevel(vulnIOS), [vulnIOS]);
  const umVulns = useMemo(() => parseVulnByLevel(vulnUm), [vulnUm]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "abm-mobil",
  });

  const startIndex = htmlContent.findIndex((p) =>
    p.includes(
      "2.2. Android mobil ilovasi ekspertizasi natijalari bo‘yicha batafsil izoh",
    ),
  );

  const createNewA4Page = () => {
    // Get the container where pages are stored
    const wordContainer = document.querySelector(".word-container");
    if (!wordContainer) return;

    // Get last page to copy styling
    const lastPage = wordContainer.querySelector(".a4:last-child");
    const pageNumber = wordContainer.querySelectorAll(".a4").length;

    // Create new A4 page
    const newPage = document.createElement("div");
    newPage.className = "a4";
    newPage.style.backgroundImage =
      pageNumber % 2 === 0
        ? `url("/assets/word/2.png")`
        : `url("/assets/word/3.png")`;

    // Add page title
    const pageTitle = document.createElement("div");
    pageTitle.className = "page-title";
    pageTitle.innerHTML = `<div>"${appName}"</div><div>mobil ilovasi</div>`;
    newPage.appendChild(pageTitle);

    // Add page content
    const pageContent = document.createElement("div");
    pageContent.className = "page-content editable";
    newPage.appendChild(pageContent);

    // Add page number
    const pageNumber_div = document.createElement("div");
    pageNumber_div.className = "page-number flex justify-center mt-auto";
    pageNumber_div.innerHTML = `<span>${pageNumber}</span>`;
    newPage.appendChild(pageNumber_div);

    // Add to container
    wordContainer.appendChild(newPage);

    // Re-attach event listeners to new page
    const editables = document.querySelectorAll(".editable");
    editables.forEach((el) => {
      el.contentEditable = editing;
      el.style.outline = editing ? "1px dashed #4f46e5" : "none";
    });

    return newPage;
  };
  const handlePageOverflow = () => {
    let a4Pages = document.querySelectorAll(".a4");
    const MAX_HEIGHT = 850;

    // Multiple iterations to ensure all overflow is handled and empty spaces are filled
    for (let iteration = 0; iteration < 10; iteration++) {
      a4Pages = document.querySelectorAll(".a4"); // Refresh pages list
      let hasChanges = false;

      // Step 1: Handle overflow - move content to next page if too much
      for (let pageIndex = 0; pageIndex < a4Pages.length; pageIndex++) {
        const pageEl = a4Pages[pageIndex];
        const pageContent = pageEl.querySelector(".page-content");
        if (!pageContent) continue;

        const actualHeight = pageContent.scrollHeight;

        if (actualHeight > MAX_HEIGHT) {
          const children = Array.from(pageContent.children);
          let currentHeight = 0;
          let splitAtIndex = -1;

          // Smart height-based split with minimum content check
          for (let i = 0; i < children.length; i++) {
            const childHeight = children[i].offsetHeight || 0;
            if (currentHeight + childHeight > MAX_HEIGHT) {
              splitAtIndex = i;
              break;
            }
            currentHeight += childHeight;
          }

          // If we found a split point, move content
          if (splitAtIndex > 0 && splitAtIndex < children.length) {
            hasChanges = true;
            // Create a copy of elements to move (to avoid array mutation issues)
            const toMove = Array.from(children).slice(splitAtIndex);

            // Get or create next page
            let nextPageEl = a4Pages[pageIndex + 1];
            if (!nextPageEl) {
              nextPageEl = createNewA4Page();
              // Refresh pages list after creating new page
              a4Pages = document.querySelectorAll(".a4");
            }

            const nextPageContent = nextPageEl.querySelector(".page-content");
            if (nextPageContent) {
              // Move elements to next page (in reverse order to avoid index issues)
              for (let i = toMove.length - 1; i >= 0; i--) {
                const el = toMove[i];
                // Check if element is still in DOM before removing
                if (el && el.parentNode === pageContent) {
                  nextPageContent.insertBefore(
                    el.cloneNode(true),
                    nextPageContent.firstChild,
                  );
                  // Remove from current page only if it's still a child
                  if (el.parentNode === pageContent) {
                    el.remove();
                  }
                }
              }
            }
          }
        }
      }

      a4Pages = document.querySelectorAll(".a4");
      for (let pageIndex = 0; pageIndex < a4Pages.length - 1; pageIndex++) {
        const currentPageEl = a4Pages[pageIndex];
        const currentPageContent = currentPageEl.querySelector(".page-content");
        if (!currentPageContent) continue;

        const currentHeight = currentPageContent.scrollHeight;
        const availableSpace = MAX_HEIGHT - currentHeight;

        if (availableSpace > 20) {
          const nextPageEl = a4Pages[pageIndex + 1];
          const nextPageContent = nextPageEl.querySelector(".page-content");
          if (!nextPageContent) continue;

          const nextPageChildren = Array.from(nextPageContent.children);
          if (nextPageChildren.length === 0) continue;

          let contentToMove = [];
          let contentHeight = 0;

          for (let i = 0; i < nextPageChildren.length; i++) {
            const child = nextPageChildren[i];
            if (!child || !child.parentNode) continue;

            const childHeight = child.offsetHeight || 0;
            if (childHeight === 0) continue;
            const spaceWithMargin = availableSpace - 10;
            if (contentHeight + childHeight <= spaceWithMargin) {
              contentToMove.push(child);
              contentHeight += childHeight;
            } else {
              if (i === 0) {
                break;
              }
              break;
            }
          }

          if (contentToMove.length > 0) {
            hasChanges = true;
            for (let i = contentToMove.length - 1; i >= 0; i--) {
              const el = contentToMove[i];
              if (el && el.parentNode === nextPageContent) {
                const cloned = el.cloneNode(true);
                currentPageContent.appendChild(cloned);
                if (el.parentNode === nextPageContent) {
                  el.remove();
                }
              }
            }

            void currentPageContent.offsetHeight;
            void nextPageContent.offsetHeight;
          }
        }
      }

      if (!hasChanges) {
        break;
      }
    }
  };

  const handleImageResize = () => {
    const images = document.querySelectorAll(".page-content img");
    images.forEach((img) => {
      const pageContent = img.closest(".page-content");
      if (pageContent) {
        const maxWidth = 500;
        if (img.width > maxWidth) {
          const aspectRatio = img.height / img.width;
          img.style.width = maxWidth + "px";
          img.style.height = maxWidth * aspectRatio + "px";
        }
      }
    });
  };

  useEffect(() => {
    const editables = document.querySelectorAll(".editable");

    const attachImageResizeHandler = () => {
      const images = document.querySelectorAll(
        ".page-content img:not([data-resize-attached])",
      );

      images.forEach((img) => {
        img.dataset.resizeAttached = "true";

        let startX, startY, startWidth, startHeight;

        const onPointerMove = (e) => {
          if (!editing) return;
          e.preventDefault();
          e.stopPropagation();

          const deltaX = e.clientX - startX;
          const newWidth = Math.max(100, Math.min(800, startWidth + deltaX));
          const aspectRatio = startHeight / startWidth;
          const newHeight = newWidth * aspectRatio;

          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
          img.style.maxWidth = "none";
        };

        const onPointerUp = (e) => {
          document.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("pointerup", onPointerUp);
          handlePageOverflow?.(); // agar funksiya mavjud bo‘lsa
        };

        const onPointerDown = (e) => {
          if (!editing || e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();

          // HAR DOIM HOZIRGI O‘LCHAMNI OLAMIZ
          startX = e.clientX;
          startY = e.clientY;
          const rect = img.getBoundingClientRect();
          startWidth = rect.width;
          startHeight = rect.height;

          document.addEventListener("pointermove", onPointerMove, {
            passive: false,
          });
          document.addEventListener("pointerup", onPointerUp, {
            passive: false,
          });
        };

        // Eski handler bo‘lsa – olib tashlaymiz (xavfsizlik)
        img.removeEventListener("pointerdown", img._resizeHandler);
        img._resizeHandler = onPointerDown;
        img.addEventListener("pointerdown", onPointerDown, { passive: false });

        // Vizual holatni yangilash
        img.style.cursor = editing ? "ew-resize" : "default";
        img.style.border = editing ? "1px dashed #aaa" : "none";
        img.style.userSelect = "none";
      });
    };

    const updateAllImagesVisual = () => {
      document
        .querySelectorAll(".page-content img[data-resize-handler]")
        .forEach((img) => {
          img._updateVisual?.();
        });
    };

    attachImageResizeHandler();
    updateAllImagesVisual();
    if (editing) {
      attachImageResizeHandler();
      updateAllImagesVisual();
    } else {
      updateAllImagesVisual();
    }
    const handleInput = (e) => {
      // Just handle images on input, don't trigger page overflow
      handleImageResize();
      attachImageResizeHandler();

      // Immediately check if content overflows and trim it
      const editables = document.querySelectorAll(".page-content");
      editables.forEach((pageContent) => {
        const MAX_HEIGHT = 900;
        if (pageContent.scrollHeight > MAX_HEIGHT) {
          // Find and remove excess content
          const children = Array.from(pageContent.children);
          let currentHeight = 0;

          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            currentHeight += child.offsetHeight;

            if (currentHeight > MAX_HEIGHT) {
              // Remove this and all subsequent elements
              for (let j = children.length - 1; j >= i; j--) {
                children[j].remove();
              }
              break;
            }
          }
        }
      });
    };

    const handlePaste = (e) => {
      // Handle images in clipboard
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      let hasImage = false;

      for (let item of items) {
        if (item.kind === "file" && item.type.indexOf("image") !== -1) {
          hasImage = true;
          // Prevent default paste behavior only for images to insert custom HTML
          e.preventDefault();

          const blob = item.getAsFile();
          const reader = new FileReader();

          reader.onload = (event) => {
            const imgElement = document.createElement("img");
            imgElement.src = event.target.result;

            imgElement.onload = () => {
              // Image loaded, resize it
              const maxWidth = 500;
              if (imgElement.width > maxWidth) {
                const aspectRatio = imgElement.height / imgElement.width;
                imgElement.style.width = maxWidth + "px";
                imgElement.style.height = maxWidth * aspectRatio + "px";
              } else {
                imgElement.style.width = imgElement.width + "px";
                imgElement.style.height = imgElement.height + "px";
              }

              // Set styles for resize
              imgElement.style.cursor = "ew-resize";
              imgElement.style.display = "inline-block";
              imgElement.style.border = "1px solid #ddd";
              imgElement.style.margin = "10px auto";
              imgElement.style.userSelect = "none";
              imgElement.className = "resizable-image";

              // Insert image after a slight delay to allow paste to complete
              setTimeout(() => {
                // Get current selection and insert image
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const wrapper = document.createElement("p");
                  wrapper.style.textAlign = "center";
                  wrapper.appendChild(imgElement);
                  range.insertNode(wrapper);

                  // Move cursor after image
                  range.setStartAfter(wrapper);
                  range.collapse(true);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }

                // Trigger reflow and handle overflow
                editables.forEach((el) => {
                  void el.offsetHeight;
                });

                // Attach resize handler to the new image with a small delay
                setTimeout(() => {
                  // Ensure image is in DOM before attaching handler
                  if (imgElement && imgElement.parentNode) {
                    // Use the same approach as makeImagesResizable for consistency
                    if (imgElement.dataset.resizable) {
                      // Already has handler, just update styles
                      imgElement.style.cursor = editing
                        ? "ew-resize"
                        : "default";
                      imgElement.style.border = editing
                        ? "1px solid #ddd"
                        : "none";
                    } else {
                      // Mark as resizable
                      imgElement.dataset.resizable = "true";
                      imgElement.style.cursor = editing
                        ? "ew-resize"
                        : "default";
                      imgElement.style.display = "inline-block";
                      imgElement.style.userSelect = "none";
                      imgElement.style.border = editing
                        ? "1px solid #ddd"
                        : "none";
                      imgElement.style.margin = "10px auto";

                      // Use pointer events for better compatibility (same as makeImagesResizable)
                      let startX, startY, startWidth, startHeight;

                      const onPointerMove = (e) => {
                        if (!editing) return;
                        e.preventDefault();
                        e.stopPropagation();

                        const deltaX = e.clientX - startX;
                        const newWidth = Math.max(
                          100,
                          Math.min(800, startWidth + deltaX),
                        );
                        const aspectRatio = startHeight / startWidth;
                        const newHeight = newWidth * aspectRatio;

                        imgElement.style.width = `${newWidth}px`;
                        imgElement.style.height = `${newHeight}px`;
                        imgElement.style.display = "inline-block";
                        imgElement.style.maxWidth = "100%";
                      };

                      const onPointerUp = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        document.removeEventListener(
                          "pointermove",
                          onPointerMove,
                        );
                        document.removeEventListener("pointerup", onPointerUp);

                        // Trigger reflow after resize
                        editables.forEach((el) => {
                          void el.offsetHeight;
                        });

                        // Handle page overflow after resize
                        handlePageOverflow();
                      };

                      imgElement.addEventListener(
                        "pointerdown",
                        (e) => {
                          if (!editing) return;

                          e.preventDefault();
                          e.stopPropagation();

                          startX = e.clientX;
                          startY = e.clientY;
                          startWidth =
                            imgElement.offsetWidth ||
                            parseInt(imgElement.style.width) ||
                            imgElement.width;
                          startHeight =
                            imgElement.offsetHeight ||
                            parseInt(imgElement.style.height) ||
                            imgElement.height;

                          document.addEventListener(
                            "pointermove",
                            onPointerMove,
                          );
                          document.addEventListener("pointerup", onPointerUp);
                        },
                        { once: false, passive: false },
                      );
                    }
                  }

                  // Also call attachImageResizeHandler to ensure all images have handlers
                  attachImageResizeHandler();

                  handlePageOverflow();
                }, 300);
              }, 50);
            };
          };

          reader.readAsDataURL(blob);
        }
      }

      // If it's not an image, allow default paste behavior for text
      if (!hasImage) {
        // Allow default paste for text content
        setTimeout(() => {
          handlePageOverflow();
        }, 50);
      }
    };

    editables.forEach((el) => {
      el.contentEditable = editing;
      el.style.outline = editing ? "1px dashed #4f46e5" : "none";

      if (editing) {
        el.addEventListener("input", handleInput);
        el.addEventListener("paste", handlePaste);
        attachImageResizeHandler();
      } else {
        el.removeEventListener("input", handleInput);
        el.removeEventListener("paste", handlePaste);
      }
    });

    // Table cell'larini ham contentEditable qilish
    const tableCells = document.querySelectorAll(".editable-table td");
    tableCells.forEach((cell) => {
      cell.contentEditable = editing;
      if (editing) {
        cell.style.outline = "1px dashed #4f46e5";

        // Table cells'ga paste handler qo'shish
        const handleTableCellPaste = (e) => {
          const items = (e.clipboardData || e.originalEvent.clipboardData)
            .items;
          let hasImage = false;

          for (let item of items) {
            if (item.kind === "file" && item.type.indexOf("image") !== -1) {
              hasImage = true;
              e.preventDefault();

              const blob = item.getAsFile();
              const reader = new FileReader();

              reader.onload = (event) => {
                const imgElement = document.createElement("img");
                imgElement.src = event.target.result; // Base64 sifatida saqlangan
                imgElement.style.maxWidth = "100%";
                imgElement.style.height = "auto";
                imgElement.style.display = "block";
                imgElement.style.margin = "5px 0";

                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  range.insertNode(imgElement);
                  range.setStartAfter(imgElement);
                  range.collapse(true);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              };

              reader.readAsDataURL(blob);
            }
          }

          if (!hasImage) {
            setTimeout(() => {
              handlePageOverflow();
            }, 50);
          }
        };

        cell.addEventListener("paste", handleTableCellPaste);
      } else {
        cell.style.outline = "none";
        // Paste listeners'ni olib tashlash
        const allCells = document.querySelectorAll(".editable-table td");
        allCells.forEach((c) => {
          c.removeEventListener("paste", c._pasteHandler);
        });
      }
    });

    return () => {
      editables.forEach((el) => {
        el.removeEventListener("input", handleInput);
        el.removeEventListener("paste", handlePaste);
      });
    };
  }, [editing, pages1]);

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
        text.includes("[android:usesCleartextTraffic=false]") ||
        text.includes("CWE") ||
        text.includes("MASWE")
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
            // Apply justify alignment using both execCommand and CSS for better compatibility
            document.execCommand("justifyFull");
            // Also apply CSS text-align for better cross-browser support
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const container = range.commonAncestorContainer;
              const block =
                container.nodeType === Node.TEXT_NODE
                  ? container.parentElement?.closest(
                      "p, div, li, h1, h2, h3, h4, h5, h6",
                    )
                  : container.closest("p, div, li, h1, h2, h3, h4, h5, h6");

              if (block) {
                block.style.textAlign = "justify";
              }
            }
            break;
        }
      }

      // Handle Shift+Backspace key - move content back to previous page
      if (e.shiftKey && e.key === "Backspace") {
        e.preventDefault();

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const currentPageContent =
            range.commonAncestorContainer.nodeType === Node.TEXT_NODE
              ? range.commonAncestorContainer.parentElement.closest(
                  ".page-content",
                )
              : range.commonAncestorContainer.closest(".page-content");

          if (currentPageContent) {
            // Find current and previous page
            const currentPage = currentPageContent.closest(".a4");
            const allPages = Array.from(document.querySelectorAll(".a4"));
            const currentPageIndex = allPages.indexOf(currentPage);

            if (currentPageIndex > 0) {
              const prevPage = allPages[currentPageIndex - 1];
              const prevPageContent = prevPage.querySelector(".page-content");

              if (prevPageContent && currentPageContent.children.length > 0) {
                // Get first child from current page
                const firstChild = currentPageContent.firstChild;
                if (firstChild) {
                  // Move it to previous page's end
                  const clonedChild = firstChild.cloneNode(true);
                  prevPageContent.appendChild(clonedChild);

                  // Remove from current page
                  firstChild.remove();
                }
              }
            }
          }
        }
      }

      // Handle Enter key for page overflow
      if (e.key === "Enter") {
        e.preventDefault();
        // Insert line break manually
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const br = document.createElement("br");
          range.insertNode(br);
          range.setStartAfter(br);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        // Check for overflow after Enter
        setTimeout(() => {
          handlePageOverflow();
        }, 10);
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

        const apkName = res.result[1]?.[8][0];
        const match = apkName.match(/[a-zA-Z0-9\.\-_]+\.apk/i);
        const apkName1 = match ? match[0] : null;
        setApkFileName(apkName1);

        const ipaMatch = apkName.match(/[a-zA-Z0-9\.\-_]+\.ipa/i);
        const ipaFile = ipaMatch ? ipaMatch[0] : null;
        setIpaFileName(ipaFile);

        // console.log("Topilgan fayl:", apkName1);

        // Field 8 ning 0-indexidan table ma'lumotlarini va qolganini paged sifatida olish
        const field8Data = res.result[1]?.[8] || [];
        let vulnData = field8Data;

        // Agar field 8 array bo'lsa va 0-index string bo'lsa, bu table ma'lumotlari
        if (
          Array.isArray(field8Data) &&
          field8Data.length > 0 &&
          typeof field8Data[0] === "string"
        ) {
          try {
            const tablesFromField8 = JSON.parse(field8Data[0]);
            setTableData(tablesFromField8);
            vulnData = field8Data.slice(1); // Table ma'lumotlaridan keyingi qolganlarni ol
          } catch (err) {
            vulnData = field8Data; // Agar parse qilsa xatolik bo'lsa, dastlabkisini ishla
          }
        }

        // Res'dan kelayotgan HTML stringlarini flatten qilish, raqamlarni tartiblab va page-number olib tashlash
        let expTitleIndex = 1;
        const flatVulnData = Array.isArray(vulnData)
          ? vulnData
              .flat()
              .filter((item) => !item.includes("page-number"))
              .map((item) => {
                // exp-title ichidagi raqamni dinamik o'zgartirish
                if (item.includes("exp-title")) {
                  return item.replace(/2\.2\.\d+/g, `2.2.${expTitleIndex++}`);
                }
                return item;
              })
          : [];
        setNewVuln(flatVulnData);

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
        setAllVuln([...highVuln1, ...mV, ...lV]);

        // Table ma'lumotlari field 8 ning 0-indexidan olingan
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

  // Table ma'lumotlarini DOM'ga qayta yuklash (rasmlar bilan)
  useEffect(() => {
    if (Object.keys(tableData).length > 0) {
      const tables = document.querySelectorAll("table.editable-table");

      tables.forEach((table, idx) => {
        const key = `table_${idx}`;
        if (tableData[key] && tableData[key].length > 0) {
          const tbody = table.querySelector("tbody");
          if (tbody) {
            // Faqat agar data bo'lsa barcha qatorlarni o'chirish va yangilash
            tbody.innerHTML = "";

            // Yangi rows'larni qo'shish
            tableData[key].forEach((rowData) => {
              const row = document.createElement("tr");
              rowData.forEach((cellData) => {
                const cell = document.createElement("td");

                // Agar cellData HTML bo'lsa (rasmlar bilan), innerHTML sifatida qo'shamiz
                if (cellData.includes("<img") || cellData.includes("<IMG")) {
                  cell.innerHTML = cellData;
                } else {
                  cell.innerText = cellData;
                }

                cell.contentEditable = editing;
                row.appendChild(cell);
              });
              tbody.appendChild(row);
            });
          }
        }
      });
    }
  }, [tableData, editing]);

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
    generateVulnHtml(docVuln.vuln);
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
    <div class="title">2.2. “${appName}” android mobil ilovasi ekspertizasi natijalari bo‘yicha batafsil izoh</div>
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
        lines.forEach((line) => blocks.push(`<pre class="text">${line}</pre>`));
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
      console.log(docVuln);
      const level = docVuln?.vuln?.[1]?.[0];
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
            a2: docVuln?.vulnCount,
            a3: docVuln?.vuln?.[1]?.[1],
          },
        ],
      };

      // console.log(docVuln);
      setPlatform(docVuln.platform);

      if (docVuln.platform === "android") {
        setVulnAndroid((prev) => [...prev, payload]);
      } else if (docVuln.platform === "ios") {
        setVulnIOS((prev) => [...prev, payload]);
      } else if (docVuln.platform === "umumiy") {
        setVulnUm((prev) => [...prev, payload]);
      }

      return;
      const res = await sendRpcRequest(stRef, METHOD.ORDER_UPDATE, payload);

      if (res.status == METHOD.OK) {
        if (field === 11) {
        }
      }

      // console.log("Yuborilgan payload:", payload);
      // console.log("Response:", res);
    } catch (error) {
      console.error(error);
    }
  };

  const paginateContent = (items) => {
    // Agar items array bo'lmasa, string bo'lsa uni array ga o'gir
    const itemsArray = Array.isArray(items)
      ? items
      : typeof items === "string"
        ? [items]
        : [];

    if (!itemsArray.length) return [];

    const pages = [];
    let currentPage = [];

    const tempDiv = document.createElement("div");
    tempDiv.style.width = "794px";
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    document.body.appendChild(tempDiv);

    itemsArray.forEach((item) => {
      if (!item) return;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = item;
      tempDiv.appendChild(wrapper);

      if (tempDiv.scrollHeight > 580) {
        if (currentPage.length) pages.push(currentPage);
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
      if (platform == "android") {
        setPages1(result);
      } else if (platform == "ios") {
        setPages2(result);
      } else if (platform == "umumiy") {
        setPages3(result);
      } else {
        console.log(result);
        setPages1(result);
      }
    }
  }, [newVuln]);

  const handleInput = (pageContent) => {
    if (!pageContent || !pageContent.children) return;

    const blocks = Array.from(pageContent.children).map(
      (child) => child.outerHTML,
    );

    const paged = paginateContent(blocks);
    // console.log("hello")
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
    const allPages = document.querySelectorAll(".new-content");

    let allBlocks = [];

    allPages.forEach((page) => {
      Array.from(page.children).forEach((child) => {
        // Agar child o'zi div bo'lsa va uning ichida yana div'lar bo'lsa,
        // faqat ichki kontentni olish - bu div'lar takrorlanib qolmasligi uchun
        if (child.tagName === "DIV") {
          // Child'ning ichida yana div'lar borligini tekshirish
          const hasNestedDivs = child.querySelector("div") !== null;

          // Muhim class'larni tekshirish (text, exp-title, exp-d, va hokazo)
          const hasImportantClass =
            child.classList.contains("text") ||
            child.classList.contains("exp-title") ||
            child.classList.contains("exp-d") ||
            child.classList.contains("title");

          if (hasNestedDivs && !hasImportantClass) {
            // Agar ichida div'lar bo'lsa va muhim class bo'lmasa, faqat innerHTML olish
            // Bu wrapper div'ni olib tashlaydi (React tomonidan qo'shilgan wrapper div)
            allBlocks.push(child.innerHTML);
          } else {
            // Agar ichida div'lar bo'lmasa yoki muhim class bo'lsa, outerHTML ishlatish
            allBlocks.push(child.outerHTML);
          }
        } else {
          // Boshqa elementlar uchun outerHTML ishlatish
          allBlocks.push(child.outerHTML);
        }
      });
    });

    console.log(allBlocks);

    // pagination qayta hisoblanadi
    const paged = paginateContent(allBlocks);

    // Table ma'lumotlarini o'qish (rasmlar bilan base64 da)
    const extractTableData = () => {
      // Ikkala jadvalni ham topish uchun umumiy klassni ishlatamiz
      const tables = document.querySelectorAll("table.expert-table");
      const data = {};

      console.log("Jami topilgan jadvallar:", tables.length);

      tables.forEach((table, idx) => {
        // Agar jadvalda tbody bo'lsa, uning qatorlarini olamiz
        const rows = table.querySelectorAll("tbody tr");
        const tableContent = [];

        rows.forEach((row, rowIdx) => {
          const cells = row.querySelectorAll("td");
          // td ichidagi matnni va rasmlarni saqlaymiz
          const rowData = Array.from(cells).map((cell) => {
            const cellText = cell.innerText.trim();
            const images = cell.querySelectorAll("img");

            // Agar katakda rasm bo'lsa, HTML sifatida saqlaymiz (base64 bilan)
            if (images.length > 0) {
              return cell.innerHTML;
            }

            return cellText;
          });
          tableContent.push(rowData);
        });

        if (tableContent.length > 0) {
          // Har bir jadvalni o'z indeksi bilan saqlaymiz
          data[`table_${idx}`] = tableContent;
        }
      });

      return data;
    };

    const tables = extractTableData();

    const tablesJson = JSON.stringify(tables);

    const apkName = tablesJson;
    const match = apkName.match(/[a-zA-Z0-9\.\-_]+\.apk/i);
    const apkName1 = match ? match[0] : null;
    setApkFileName(apkName1);

    const ipaMatch = apkName.match(/[a-zA-Z0-9\.\-_]+\.ipa/i);
    const ipaFile = ipaMatch ? ipaMatch[0] : null;
    setIpaFileName(ipaFile);

    const field8Data = [tablesJson, ...paged];

    console.log("Saving field8Data:", field8Data);

    const res = await sendRpcRequest(stRef, METHOD.ORDER_UPDATE, {
      19: id,
      8: field8Data,
    });
    // console.log(res);

    setPages1(paged);
    setTableData(tables);
    setEditing(false); // edit rejimdan chiqadi

    toast.success("Barcha o‘zgarishlar saqlandi");
  };

  const addNewTr = () => {
    setRows((prev) => [
      ...prev,
      { id: Date.now(), role: "", login: "", password: "" },
    ]);
  };

  const currentPages =
    platform === "android"
      ? pages1
      : platform === "ios"
        ? pages2
        : platform === "umumiy"
          ? pages3
          : pages1;
  return (
    <>
      <ExpertizeModal
        open={modalOpen}
        onClose={closeModal}
        item={expertize}
        itemId={id}
        onSaveDoc={handleSaveDocFromModal}
      />

      <button
        onClick={saveAllChanges}
        className="fixed bottom-10 z-50 right-10 shadow-lg flex justify-center items-center w-[60px] h-[60px] bg-blue-500 text-white text-3xl  rounded-full cursor-pointer hover:bg-blue-600"
      >
        <iconify-icon icon="material-symbols:save"></iconify-icon>
      </button>

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

        <div className="a4 first-a4 system system-first">
          <div className="page-content">
            <h2
              className={`application-name system ${appName.length > 20 ? "mb-[50px]" : "mt-[50px]"}`}
            >
              “{appName}” axborot tizimi{" "}
            </h2>
          </div>
        </div>
        <div className="a4 mundarija1 system-m1">
          <div className="page-content top editable">
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
        <div className="a4 mundarija2 system-m2">
          <div className="page-content editable">
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
        <div className="a4 system-c">
          {0 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 0 % 2 === 0 ? `end` : `start`,
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
        <div className="a4 system-c">
          {1 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 1 % 2 === 0 ? `end` : `start`,
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
        <div className="a4 system-c">
          {2 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 2 % 2 === 0 ? `end` : `start`,
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
        <div className="a4 system-c">
          {3 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 3 % 2 === 0 ? `end` : `start`,
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
        <div className="a4 system-c">
          {4 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 4 % 2 === 0 ? `end` : `start`,
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
              <b>“{apkFileName}”</b> va <b>“{ipaFileName}”</b> fayllari.
            </div>
            <div className="text-i">
              1-jadval. Mobil ilovaning <br />
              “Android” OT uchun versiyasi
            </div>

            <table className="expert-table editable-table">
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

        <div className="a4 system-c">
          {5 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 5 % 2 === 0 ? `end` : `start`,
              marginRight: 5 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="expert-table editable-table mt-6">
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

            <table className="expert-table editable-table">
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
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>8</span>
          </div>
        </div>
        <div className="a4 system-c">
          {6 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 6 % 2 === 0 ? `end` : `start`,
              marginRight: 6 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <table className="expert-table editable-table mt-6">
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
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>9</span>
          </div>
        </div>
        <div className="a4 system-c">
          {7 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 7 % 2 === 0 ? `end` : `start`,
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
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>10</span>
          </div>
        </div>
        <div className="a4 system-c">
          {8 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 8 % 2 === 0 ? `end` : `start`,
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
        <div className="a4 system-c">
          {9 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 9 % 2 === 0 ? `end` : `start`,
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
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>12</span>
          </div>
        </div>
        <div className="a4 system-c">
          {10 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 10 % 2 === 0 ? `end` : `start`,
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
              <b>- “{apkFileName}”;</b> <br />
              <b>- “{ipaFileName}”</b> fayllari, shuningdek 4-jadvaldagi
              foydalanuvchi qayd yozuvlari asosida olib borildi.
            </div>
            <div className="relative">
              <table className="expert-table editable-table mt-6">
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
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 2}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => addNewTr()}
                className="opacity-0 hover:opacity-100 text-bold w-[15px] h-[20px] rounded-full text-center text-green-500 bg-gray-700 flex justify-center items-center absolute right-[0px] bottom-[-5px]"
              >
                <span>+</span>
              </button>
            </div>
          </div>
          <div className="page-number flex justify-center mt-auto">
            <span>13</span>
          </div>
        </div>
        <div className="a4 system-c">
          {11 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 11 % 2 === 0 ? `end` : `start`,
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
        <div className="a4 system-c">
          {12 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 12 % 2 === 0 ? `end` : `start`,
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
              5-jadval. “{appName}” android mobil ilovasida <br />
              aniqlangan zaifliklar.
            </div>
            <table class="expert-table editable-table">
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
                {androidVulns.high?.map((item, index) => (
                  <tr key={`android-high-${index}`}>
                    {index === 0 && (
                      <td rowSpan={androidVulns.high.length}>
                        <b>Yuqori</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td style={{ fontWeight: "normal" }}>{item.a2}</td>
                  </tr>
                ))}
                {androidVulns.medium?.map((item, index) => (
                  <tr key={`android-medium-${index}`}>
                    {index === 0 && (
                      <td rowSpan={androidVulns.medium.length}>
                        <b>O'rta</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td>{item.a2}</td>
                  </tr>
                ))}
                {androidVulns.low?.map((item, index) => (
                  <tr key={`android-low-${index}`}>
                    {index === 0 && (
                      <td rowSpan={androidVulns.low.length}>
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
        <div className="a4 system-c">
          {12 % 2 === 0 ? (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-tops.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottoms.jpg"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="system-top-img w-full min-w-full"
                src="/assets/system/ax-top.png"
                alt=""
              />
              <img
                className="system-bottom-img w-full min-w-full"
                src="/assets/system/ax-bottom.jpg"
                alt=""
              />
            </>
          )}
          <div
            className="page-title"
            style={{
              textAlign: 12 % 2 === 0 ? `end` : `start`,
              marginRight: 12 % 2 === 0 ? `50px` : `0px`,
            }}
          >
            <div>“{appName}”</div>
            <div>mobil ilovasi</div>
          </div>
          <div className="page-content editable">
            <div className="text-i my-3 underline">
              6-jadval. “{appName}” iOS mobil ilovasida <br />
              aniqlangan zaifliklar.
            </div>
            <table class="expert-table editable-table">
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
                {iosVulns.high?.map((item, index) => (
                  <tr key={`ios-high-${index}`}>
                    {index === 0 && (
                      <td rowSpan={iosVulns.high.length}>
                        <b>Yuqori</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td style={{ fontWeight: "normal" }}>{item.a2}</td>
                  </tr>
                ))}
                {iosVulns.medium?.map((item, index) => (
                  <tr key={`ios-medium-${index}`}>
                    {index === 0 && (
                      <td rowSpan={iosVulns.medium.length}>
                        <b>O'rta</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td>{item.a2}</td>
                  </tr>
                ))}
                {iosVulns.low?.map((item, index) => (
                  <tr key={`ios-low-${index}`}>
                    {index === 0 && (
                      <td rowSpan={iosVulns.low.length}>
                        <b>Past</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td>{item.a2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-i my-3 underline">
              7-jadval. “{appName}” mobil ilova va server o‘rtasidagi
              so‘rovlarni o‘rganish jarayonida aniqlangan zaifliklar
            </div>
            <table class="expert-table editable-table">
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
                {umVulns.high?.map((item, index) => (
                  <tr key={`um-high-${index}`}>
                    {index === 0 && (
                      <td rowSpan={umVulns.high.length}>
                        <b>Yuqori</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td style={{ fontWeight: "normal" }}>{item.a2}</td>
                  </tr>
                ))}
                {umVulns.medium?.map((item, index) => (
                  <tr key={`um-medium-${index}`}>
                    {index === 0 && (
                      <td rowSpan={umVulns.medium.length}>
                        <b>O'rta</b>
                      </td>
                    )}
                    <td style={{ fontWeight: "normal" }}>{item.a3}</td>
                    <td>{item.a2}</td>
                  </tr>
                ))}
                {umVulns.low?.map((item, index) => (
                  <tr key={`um-low-${index}`}>
                    {index === 0 && (
                      <td rowSpan={umVulns.low.length}>
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
            <span>16</span>
          </div>
        </div>

        {currentPages &&
          currentPages.map((pageItems, pageIndex) => (
            <div key={pageIndex} className="a4 system-c">
              {pageIndex % 2 === 0 ? (
                <>
                  <img
                    className="system-top-img w-full min-w-full"
                    src="/assets/system/ax-tops.png"
                    alt=""
                  />
                  <img
                    className="system-bottom-img w-full min-w-full"
                    src="/assets/system/ax-bottoms.jpg"
                    alt=""
                  />
                </>
              ) : (
                <>
                  <img
                    className="system-top-img w-full min-w-full"
                    src="/assets/system/ax-top.png"
                    alt=""
                  />
                  <img
                    className="system-bottom-img w-full min-w-full"
                    src="/assets/system/ax-bottom.jpg"
                    alt=""
                  />
                </>
              )}
              <div
                className="page-title"
                style={{
                  width: "85%",
                  textAlign: pageIndex % 2 === 0 ? "end" : "start",
                  marginRight: pageIndex % 2 === 0 ? "50px" : "0px",
                }}
              >
                <div>“{appName}”</div>
                <div>mobil ilovasi</div>
              </div>

              <div className="page-content editable new-content">
                {pageItems.map((item, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </div>

              <div className="page-number flex justify-center mt-auto exp-page-num">
                <span>{pageIndex + 17}</span>
              </div>
            </div>
          ))}

        <div className="a4 system-b"></div>
      </div>
    </>
  );
};

export default SystemWord;
