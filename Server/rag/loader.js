const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractText(filePath, mimeType = '') {
  const ext = path.extname(filePath).toLowerCase();
  const buf = fs.readFileSync(filePath);
  if (ext === '.pdf' || mimeType.includes('pdf')) {
    const data = await pdfParse(buf);
    return data.text || '';
  }
  if (ext === '.docx' || mimeType.includes('word')) {
    const res = await mammoth.extractRawText({ buffer: buf });
    return res.value || '';
  }
  // txt / md / fallback
  return buf.toString('utf8');
}

function chunkText(text, chunkSize = 800, overlap = 120) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const chunks = [];
  let i = 0;
  while (i < clean.length) {
    chunks.push(clean.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

module.exports = { extractText, chunkText };
