import React, { useEffect, useState, useRef } from "react";
import mammoth from "mammoth";
import { FaPen, FaSave } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import docxfile from "../../assets/mobil.docx"; // Fayl manzili
import PaginatedDocument from "../../components/PaginatedDocument";
import { sendRpcRequest } from "../../api/webClient";
import { useZirhStref } from "../../context/ZirhContext";
import { METHOD } from "../../api/zirhrpc";


const WordTwo = () => {
  const [fullHtml, setFullHtml] = useState("");
  const [editing, setEditing] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const printRef = useRef(null);
  const { stRef } = useZirhStref()

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Hujjat",
  });

  useEffect(() => {
    const loadDocx = async () => {
      try {
        const res = await fetch(docxfile);
        const buffer = await res.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer: buffer });
        setFullHtml(value);
      } catch (err) {
        console.error("Faylni yuklashda xato:", err);
      }
    };
    loadDocx();
  }, []);



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tugmalar */}
      <div className="fixed right-10 top-10 z-50 flex flex-col gap-4 print:hidden">
        <button
          onClick={() => setEditing(!editing)}
          className={`p-4 rounded-full text-white shadow-lg ${
            editing ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {editing ? <FaSave size={20} /> : <FaPen size={20} />}
        </button>
        <button
          onClick={handlePrint}
          className="p-4 rounded-full bg-gray-800 text-white shadow-lg"
        >
          <iconify-icon icon="pepicons-print:printer" width="20"></iconify-icon>
        </button>
      </div>

      {/* Chop etish va Ko'rish qismi */}
      <div ref={printRef}>
        <PaginatedDocument
          initialHtml={fullHtml}
          isEditing={editing}
          onUpdate={(newHtml) => setFullHtml(newHtml)}
        />
      </div>
    </div>
  );
};

export default WordTwo;