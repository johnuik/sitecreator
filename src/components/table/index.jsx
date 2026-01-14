import React from 'react';

const CellValue = ({ text, badge, download, button }) => (
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

    {button && (
      <button className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 text-[15px]">
        {button}
      </button>
    )}
  </div>
);

const Row4 = ({
  label1,
  value1,
  label2,
  value2,
}) => (
  <div className={`grid grid-cols-4 border-b text-sm ${label1 === 'Tashkilot nomi' ? 'border-t' : ''}`}>
    <div className="px-4 py-6 text-gray-500 border-r border-l text-[15px]">
      {label1}
    </div>
    <div className="px-4 py-6 border-r text-gray-700 font-bold text-[15px] text-center">
      {value1}
    </div>
    <div className="px-4 py-6 text-gray-500 border-r text-[15px]">
      {label2}
    </div>
    <div className="px-4 py-6 border-r text-gray-700 font-bold text-[15px] text-center">
      {value2}
    </div>
  </div>
);


const ExpertizaTable = () => {
   return (
    <div className="overflow-hidden bg-white shadow-sm">
      <Row4
        label1="Tashkilot nomi"
        value1={<CellValue text="«Test» AJ" />}
        label2="Axborot tizimining nomi"
        value2={<CellValue text="Ilovanomi(Finance)" />}
      />

      <Row4
        label1="Nazoratchi"
        value1={<CellValue text="Saidvaliyev Isroiljon" badge="0/10" />}
        label2="Bajaruvchi"
        value2={<CellValue text="Yo'ldoshov Umrzoq" badge="0/15" />}
      />

      <Row4
        label1="Ajratilgan mutaxassislar soni"
        value1={<CellValue text="2" />}
        label2="Kelib tushgan xat raqami"
        value2={<CellValue text="460-M" />}
      />

      <Row4
        label1="Markaz tomonidan yuborilgan xat"
        value1={<CellValue text="460-M_06.11.2025.pdf" download />}
        label2="Shartnoma imzolangan sana"
        value2={<CellValue text="2025-06-11" />}
      />

      <Row4
        label1="Kelib tushgan mablag‘ sanasi"
        value1={<CellValue text="2025-06-16" />}
        label2="Tizimga mas’ul shaxs"
        value2={<CellValue text="+998 99 123 45 67, Sadi" />}
      />

       <Row4
        label1="Ekspertiza uchun zaruriy chora-tadbirlar tashkil etilgan sana"
        value1={<CellValue text="" />}
        label2="Ekspertizaning boshlanish sanasi"
        value2={<CellValue text="2025-06-18" />}
      />

      <Row4
        label1="Dasturlash firmasi"
        value1={<CellValue text="Test dasturlash firmasi" />}
        label2="Ekspertiza yakunlanish sanasi"
        value2={<CellValue text="2025-06-23" />}
      />

      <Row4
        label1="Qaysi bosqichda"
        value1={<CellValue text="Hisobotga chiqarilgan"/>}
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
        value1={<CellValue text="IM43476306.pdf" download/>}
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
        value2={<CellValue text="68 005 360" />}
      />

      <Row4
        label1="Hisobot yuklab olish"
        value1={<CellValue button="Hisobot" />}
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
  );
}


export default ExpertizaTable;