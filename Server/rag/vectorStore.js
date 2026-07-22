


const Document = require('../models/Document');
const { extractText, chunkText } = require('./loader');
const { embed, chat } = require('../ai/openrouter');

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

async function ingestFile({ userId, courseId, filename, filePath, fileUrl, mimeType, title }) {
  const text = await extractText(filePath, mimeType);
  const pieces = chunkText(text);
  const vectors = pieces.length ? await embed(pieces) : [];
  const doc = await Document.create({
    user: userId,
    course: courseId,
    title: title || filename,
    filename,
    fileUrl,
    mimeType,
    chunks: pieces.map((t, i) => ({ text: t, embedding: vectors[i] || [], index: i })),
  });
  return doc;
}

async function retrieve({ userId, docId, query, k = 4 }) {
  const filter = docId ? { _id: docId } : { user: userId };
  const docs = await Document.find(filter).limit(20);
  const [qVec] = await embed([query]);
  const scored = [];
  for (const d of docs) {
    for (const c of d.chunks) {
      if (!c.embedding?.length) continue;
      scored.push({ score: cosine(qVec, c.embedding), text: c.text, doc: d.title });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

async function askWithContext({ userId, docId, query }) {
  const ctx = await retrieve({ userId, docId, query });
  const contextBlock = ctx.map((c, i) => `[${i + 1}] (${c.doc}) ${c.text}`).join('\n\n');
  const messages = [
    {
      role: 'system',
      content:
        'You answer questions using the provided context. Cite sources as [1], [2]. If unsure, say so.',
    },
    { role: 'user', content: `Context:\n${contextBlock}\n\nQuestion: ${query}` },
  ];
  const answer = await chat(messages);
  return { answer, sources: ctx };
}

module.exports = { ingestFile, retrieve, askWithContext };