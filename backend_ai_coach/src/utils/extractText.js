


import { createRequire } from "module";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

const require = createRequire(import.meta.url);

export const extractTextFromFile = async (file) => {
  const { buffer: rawBuffer, mimetype } = file;
  const buffer = Buffer.isBuffer(rawBuffer) ? rawBuffer : Buffer.from(rawBuffer);

  // PDF
  if (mimetype === "application/pdf") {
    try {
      console.log("PDF buffer length:", buffer.length, "isBuffer:", Buffer.isBuffer(buffer), "type:", typeof buffer, "constructor:", buffer?.constructor?.name);
      // Use pdfjs-dist for reliable PDF text extraction
      const pdfjsLib = require("pdfjs-dist");
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      console.log("Extracted text length:", text.length);
      if (text.trim()) {
        return text;
      } else {
        return "The PDF appears to be image-based or contains no extractable text. Please provide a text-based PDF.";
      }
    } catch (error) {
      console.error("PDF processing error:", error);
      return "Unable to extract text from PDF. Please check if the file is a valid PDF.";
    }
  }

  // DOCX
  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // IMAGE (OCR)
  if (mimetype === "image/jpeg" || mimetype === "image/png") {
    const {
      data: { text }
    } = await Tesseract.recognize(buffer, "eng");
    return text;
  }

  throw new Error("Unsupported file type");
};






