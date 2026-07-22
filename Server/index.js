import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import morgan from "morgan";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  END,
  START,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

const memory = new MemorySaver();

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
  maxTokens: 180,
  maxRetries: 2,
});

const conversationGraph = new StateGraph(MessagesAnnotation)
  .addNode("assistant", async (state) => {
    const conversationHistory =
      state.messages
        .map((message) => {
          const type = message.getType?.() || "";
          const text = extractText(message.content);

          if (!text) return "";
          if (type === "human") return `User: ${text}`;
          if (type === "ai") return `Assistant: ${text}`;
          return "";
        })
        .filter(Boolean)
        .join("\n") || "No previous messages.";

    const systemPrompt = `You are a helpful AI assistant for AKITS.
Keep answers concise, clear, and practical.
Use the conversation history to keep the flow natural.

Conversation history:
${conversationHistory}`;

    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      ...state.messages,
    ]);

    return { messages: [response] };
  })
  .addEdge(START, "assistant")
  .addEdge("assistant", END)
  .compile({ checkpointer: memory });

const knowledgeReady = false;

const extractText = (content) => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("");
  }

  return String(content ?? "");
};

app.post("/ai", async (req, res) => {
  const sessionId =
    typeof req.body?.sessionId === "string" && req.body.sessionId.trim()
      ? req.body.sessionId.trim()
      : "default-session";
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await conversationGraph.invoke(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: sessionId } },
    );

    const latestMessage = result.messages?.[result.messages.length - 1];
    const answer = extractText(latestMessage?.content).trim();

    return res.status(200).json({
      response: answer || "Sorry, I couldn't process your request.",
      meta: {
        contextUsed: Boolean(
          result.messages?.some((msg) => extractText(msg.content).length > 0),
        ),
        knowledgeReady,
      },
    });
  } catch (error) {
    console.error("AI request failed:", error);
    return res.status(500).json({
      response: "Sorry, I couldn't process your request right now.",
      meta: { contextUsed: false, knowledgeReady },
    });
  }
});

app.get("/", (req, res) => {
  return res.json({ message: "AKITS chatbot backend is running" });
});

app.get("/health", (req, res) => {
  return res.json({ status: "ok", knowledgeReady });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
