import React from "react";
import { Link } from "react-router-dom";
import mammoth from "mammoth";
import jsPDF from "jspdf";
import htmlToPdfmake from "html-to-pdfmake";

import { useZirhStref } from "../../context/ZirhContext";
import { downloadFileViaRpcNew } from "../../api/webClient";

const CellValue = ({
  text,
  badge,
  download,
  button,
  linkToWord,
  url,
  onOpen,
}) => {
  return (
    <>
      {url ? (
        <div
          className="flex items-center gap-2 font-bold text-gray-500"
          onClick={() => onOpen?.(url)}
        >
          {text}
          {badge && (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
              {badge}
            </span>
          )}

          {download && (
            <iconify-icon
              icon="mdi:download"
              width={18}
              className="cursor-pointer text-gray-500 hover:text-blue-600"
            />
          )}

          {button &&
            (linkToWord ? (
              <Link
                to={`/page/${linkToWord}`}
                className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 text-[15px]"
              >
                {button}
              </Link>
            ) : (
              <button className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 text-[15px]">
                {button}
              </button>
            ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 font-bold text-gray-500">
          {text}

          {badge && (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
              {badge}
            </span>
          )}

          {download && (
            <iconify-icon
              icon="mdi:download"
              width={18}
              className="cursor-pointer text-gray-500 hover:text-blue-600"
            />
          )}

          {button &&
            (linkToWord ? (
              <Link
                to={`/page/${linkToWord}`}
                className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 text-[15px]"
              >
                {button}
              </Link>
            ) : (
              <button className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 text-[15px]">
                {button}
              </button>
            ))}
        </div>
      )}
    </>
  );
};

const Row4 = ({ label1, value1, label2, value2 }) => (
  <div
    className={`grid grid-cols-4 border-b text-sm ${label1 === "Tashkilot nomi" ? "border-t" : ""}`}
  >
    <div className="px-4 py-6 text-gray-500 border-r border-l text-[15px]">
      {label1}
    </div>
    <div className="px-4 py-6 border-r text-gray-700 font-bold text-[15px] text-center">
      {value1}
    </div>
    <div className="px-4 py-6 text-gray-500 border-r text-[15px]">{label2}</div>
    <div className="px-4 py-6 border-r text-gray-700 font-bold text-[15px] text-center">
      {value2}
    </div>
  </div>
);

const ExpertizaTable = ({ expData, link='word' }) => {
  const { stRef } = useZirhStref();
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [wordUrl, setWordUrl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const openDoc = async (url) => {
    const blob = await downloadFileAll(url);
    const blobUrl = URL.createObjectURL(blob);


    if (blob.type === "application/pdf") {
      setPreviewUrl(blobUrl);
    } else if (blob.type === "application/octet-stream") {
      setWordUrl(blobUrl);
    } else {
      return alert("Fayl turi aniqlanmadi");
    }


    setOpen(true);
  };

  const downloadFileAll = async (id) => {
    const blob = await downloadFileViaRpcNew(
      stRef,
      id,
      expData?.files[0]?.[2],
      (p) => {
        console.log(p);
        setUploadProgress(p);
        setIsUploading(true);
        if (p === 100) setIsUploading(false);
      },
    );

    return blob;
  };

  const closeModal = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setOpen(false);
  };



  return (
    <>
      {open && (
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
            {wordUrl && (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(wordUrl)}`}
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe>
            )}
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow-sm">
        <Row4
          label1="Tashkilot nomi"
          value1={
            <CellValue text={`«${expData?.orgName}» ${expData?.orgType}`} />
          }
          label2="Axborot tizimining nomi"
          value2={<CellValue text={`${expData?.shortName}`} />}
        />

        <Row4
          label1="Nazoratchi"
          value1={
            <CellValue text={`${expData?.controllers["0"].a2}`} badge="0/10" />
          }
          label2="Bajaruvchi"
          value2={
            <CellValue text={`${expData?.workers["0"].a2}`} badge="0/15" />
          }
        />

        <Row4
          label1="Ajratilgan mutaxassislar soni"
          value1={
            <CellValue
              text={`${expData.controllers?.length + expData.workers?.length}`}
            />
          }
          label2="Kelib tushgan xat raqami"
          value2={<CellValue text={expData?.number} />}
        />

        <Row4
          label1="Markaz tomonidan yuborilgan xat"
          value1={
            <CellValue
              text={expData?.files[0]?.[2]}
              url={expData?.files[0]?.[1]}
              download
              onOpen={openDoc}
            />
          }
          label2="Shartnoma imzolangan sana"
          value2={<CellValue text={formatDate(expData?.contractDate)} />}
        />

        <Row4
          label1="Kelib tushgan mablag‘ sanasi"
          value1={<CellValue text={expData?.contractPriceDate} />}
          label2="Tizimga mas’ul shaxs"
          value2={<CellValue text={expData?.director} />}
        />

        <Row4
          label1="Ekspertiza uchun zaruriy chora-tadbirlar tashkil etilgan sana"
          value1={<CellValue text="" />}
          label2="Ekspertizaning boshlanish sanasi"
          value2={<CellValue text={formatDate(expData?.startDate)} />}
        />

        <Row4
          label1="Dasturlash firmasi"
          value1={<CellValue text="Test dasturlash firmasi" />}
          label2="Ekspertiza yakunlanish sanasi"
          value2={<CellValue text={formatDate(expData?.endDate)} />}
        />

        <Row4
          label1="Qaysi bosqichda"
          value1={<CellValue text="Hisobotga chiqarilgan" />}
          label2="Hisobot raqami"
          value2={<CellValue text="234-xdfu-son" />}
        />

        <Row4
          label1="Qayta ekspertizaga yuborilgan sana"
          value1={<CellValue text="" />}
          label2="Qayta ekspertiza natijasi sanasi"
          value2={<CellValue text="" />}
        />

        <Row4
          label1="Xat chiqarilgan"
          value1={<CellValue text="IM43476306.pdf" download />}
          label2="Mobil dastur"
          value2={<CellValue text="" />}
        />

        <Row4
          label1="Xat kelgan"
          value1={<CellValue text="496M.pdf" download />}
          label2="Desktop dastur"
          value2={<CellValue text="" />}
        />

        <Row4
          label1="Rozilik xati"
          value1={<CellValue text="" />}
          label2="Vaqtincha to'xtatilgan"
          value2={<CellValue download />}
        />

        <Row4
          label1="Qayta expertiza"
          value1={<CellValue text="" />}
          label2="To'liq yakunlangan"
          value2={<CellValue text="" />}
        />

        <Row4
          label1="Hisob raqami"
          value1={<CellValue text="" />}
          label2="Summa"
          value2={<CellValue text={expData?.inn.toLocaleString()} />}
        />

        <Row4
          label1="Hisobot yuklab olish"
          value1={<CellValue button="Hisobot" linkToWord={`${link}/${expData?.id}`} />}
          label2="Qayta expertiza ijobiy xat yuklab olish (.docx)"
          value2={<CellValue button="Qayta ijobiy xat" />}
        />

        <Row4
          label1="Qayta expertiza kamchilik xat yuklab olish (.docx)"
          value1={<CellValue button="Qayta kamchilik xat" />}
          label2="Ruxsat xat yuklab olish (.docx)"
          value2={<CellValue button="Ruxsat xat" />}
        />

        <Row4
          label1="To‘liq hisobot"
          value1={<CellValue text="Test(iOS).pdf" download />}
          label2="Dastlabki hash"
          value2={<CellValue text="342-M.rar" download />}
        />

        <Row4
          label1="Yakuniy hash"
          value1={<CellValue button="" />}
          label2=""
          value2={<CellValue button="" />}
        />
      </div>
    </>
  );
};

export default ExpertizaTable;
