import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image"; // Rasmlar uchun
import mammoth from "mammoth/mammoth.browser.min.js"; // Browser versiyasi
import { Document, Packer, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, ImageRun } from "docx";
import { saveAs } from "file-saver";

const WordTwo = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TableKit.configure({ resizable: true }),
      Image.configure({ inline: true }), // Rasmlarni inline qilish
    ],
    content: "<p>Boshlang'ich matn...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[500px] p-4",
      },
    },
  });

  // DOCX yuklash – Mammoth bilan maksimal style va image
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".docx")) {
      alert("Iltimos, .docx fayl yuklang!");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Mammoth options – image va style ni saqlash
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          includeDefaultStyleMap: true,
          includeEmbeddedStyleMap: true,
          convertImage: mammoth.images.imgElement((image) => {
            return image.read("base64").then((buffer) => {
              return {
                src: `data:${image.contentType};base64,${buffer}`,
              };
            });
          }),
        }
      );

      if (result.messages.length > 0) {
        console.warn("Ogohlantirishlar:", result.messages);
      }

      editor?.commands.setContent(result.value);
    } catch (error) {
      console.error("Xato:", error);
      alert("Fayl yuklashda xatolik");
    }
  };

  // Export – docx kutubxonasi bilan yaxshi jadval va image
  const handleExport = async () => {
    if (!editor) return;

    const html = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const children = [];

    // Oddiy elementlarni qayta ishlash
    const processNode = async (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return new TextRun({ text: node.textContent || "" });
      }

      if (node.nodeName === "P" || node.nodeName === "H1" || node.nodeName === "H2" || node.nodeName === "H3") {
        const textRuns = [];
        for (const child of node.childNodes) {
          textRuns.push(await processNode(child));
        }
        return new Paragraph({
          children: textRuns,
          heading: node.nodeName === "H1" ? "Heading1" : node.nodeName === "H2" ? "Heading2" : node.nodeName === "H3" ? "Heading3" : undefined,
        });
      }

      if (node.nodeName === "IMG" && node.src) {
        // Rasmlarni base64 bilan qo'shish
        try {
          const response = await fetch(node.src);
          const blob = await response.blob();
          const buffer = await blob.arrayBuffer();
          return new Paragraph({
            children: [new ImageRun({
              data: buffer,
              transformation: { width: 300, height: 300 }, // O'lchamni sozlash mumkin
            })],
          });
        } catch (e) {
          return new TextRun({ text: "[Rasm yuklanmadi]" });
        }
      }

      // Jadval
      if (node.nodeName === "TABLE") {
        const rows = [];
        for (const tr of node.querySelectorAll("tr")) {
          const cells = [];
          for (const td of tr.querySelectorAll("td, th")) {
            const cellChildren = [];
            for (const child of td.childNodes) {
              cellChildren.push(await processNode(child));
            }
            cells.push(new DocxTableCell({ children: [new Paragraph({ children: cellChildren })] }));
          }
          rows.push(new DocxTableRow({ children: cells }));
        }
        return new DocxTable({ rows });
      }

      // Boshqa elementlar uchun oddiy text
      const textRuns = [];
      for (const child of node.childNodes) {
        textRuns.push(await processNode(child));
      }
      return new Paragraph({ children: textRuns });
    };

    for (const child of doc.body.childNodes) {
      const item = await processNode(child);
      if (item) children.push(item);
    }

    const docx = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(docx);
    saveAs(blob, "edited.docx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Online Word Editor (Bepul versiya – eng yaxshi fidelity)</h2>

      <div style={{ marginBottom: "20px" }}>
        <input type="file" accept=".docx" onChange={handleFileUpload} />
        <button onClick={handleExport} style={{ marginLeft: "10px", padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>
          Save as Word (.docx)
        </button>
      </div>

      <div style={{ border: "1px solid #ccc", borderRadius: "8px", minHeight: "600px", background: "#fff" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default WordTwo;