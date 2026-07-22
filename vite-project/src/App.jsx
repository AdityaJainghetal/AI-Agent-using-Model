// import { useState, useRef, useEffect } from "react";
// import { FiSend, FiPlus, FiMessageSquare, FiUser } from "react-icons/fi";

// const STORAGE_KEY = "akits-chat-messages";
// const DEFAULT_WELCOME_MESSAGE = {
//   id: 1,
//   text: "Hello! I'm AKITS Chatbot. How can I help you today?",
//   isUser: false,
// };

// function App() {
//   const [messages, setMessages] = useState(() => {
//     if (typeof window === "undefined") return [DEFAULT_WELCOME_MESSAGE];

//     try {
//       const saved = window.localStorage.getItem(STORAGE_KEY);
//       return saved ? JSON.parse(saved) : [DEFAULT_WELCOME_MESSAGE];
//     } catch (error) {
//       console.error("Failed to load saved chat:", error);
//       return [DEFAULT_WELCOME_MESSAGE];
//     }
//   });
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
//     }
//   }, [messages]);

//   const response = async (userMessage, history = []) => {
//     try {
//       const res = await fetch("http://localhost:5000/ai", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: userMessage,
//           history: history.slice(-8),
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await res.json();
//       return data.response || "Sorry, I couldn't process your request.";
//     } catch (error) {
//       console.error("Error fetching AKITS response:", error);
//       return "Sorry, I couldn't process your request.";
//     }
//   };

//   const sendMessage = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput || isSending) return;

//     const userMessage = {
//       id: Date.now(),
//       text: trimmedInput,
//       isUser: true,
//     };

//     const conversationHistory = [...messages, userMessage].slice(-8);

//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput("");
//     setIsTyping(true);
//     setIsSending(true);

//     try {
//       const botReply = await response(trimmedInput, conversationHistory);
//       const grokResponse = {
//         id: Date.now() + 1,
//         text: botReply,
//         isUser: false,
//       };

//       setMessages((prevMessages) => [...prevMessages, grokResponse]);
//     } finally {
//       setIsTyping(false);
//       setIsSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey && !isSending) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const newChat = () => {
//     setMessages([
//       {
//         id: 1,
//         text: "New chat started! What would you like to ask?",
//         isUser: false,
//       },
//     ]);
//     setInput("");
//     setIsTyping(false);
//     setIsSending(false);
//   };

//   return (
//     <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-72 bg-[#171717] border-r border-gray-800 flex flex-col">
//         <div className="p-4">
//           <button
//             onClick={newChat}
//             className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 py-3 px-4 rounded-2xl text-sm font-medium transition"
//           >
//             <FiPlus size={20} />
//             New Chat
//           </button>
//         </div>

//         <div className="px-3 flex-1 overflow-y-auto chat-scroll">
//           <div className="text-xs text-gray-500 px-4 py-3">Recent</div>
//           <div className="space-y-1 px-2">
//             {[
//               "React + Tailwind setup",
//               "Next.js authentication",
//               "AI project ideas",
//             ].map((chat, i) => (
//               <div
//                 key={i}
//                 className="px-4 py-3 hover:bg-white/10 rounded-2xl cursor-pointer flex items-center gap-3 text-sm"
//               >
//                 <FiMessageSquare />
//                 {chat}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-4 border-t border-gray-800 mt-auto">
//           <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-2xl cursor-pointer">
//             <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//               <FiUser size={20} />
//             </div>
//             <div>
//               <p className="font-medium">You</p>
//               <p className="text-xs text-emerald-400">Free</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         <div className="h-16 border-b border-gray-800 flex items-center px-6 justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-9 h-9 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl">
//               🚀
//             </div>
//             <div>
//               <h1 className="font-semibold text-lg">AKITS Chat</h1>
//               <p className="text-xs text-emerald-400">● Always ready</p>
//             </div>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8 chat-scroll">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[75%] px-6 py-4 rounded-3xl ${
//                   msg.isUser
//                     ? "bg-blue-600 rounded-br-none"
//                     : "bg-[#1F1F1F] rounded-bl-none"
//                 }`}
//               >
//                 <p className="text-[17px] leading-relaxed whitespace-pre-wrap">
//                   {msg.text}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="bg-[#1F1F1F] px-6 py-4 rounded-3xl rounded-bl-none">
//                 <div className="flex gap-1">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "150ms" }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "300ms" }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Box */}
//         <div className="p-6 bg-[#0A0A0A]">
//           <div className="max-w-3xl mx-auto">
//             <div className="relative">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 rows={1}
//                 disabled={isSending}
//                 className="w-full bg-[#1F1F1F] border border-gray-700 focus:border-gray-500 rounded-3xl py-6 px-7 pr-24 text-lg resize-y focus:outline-none min-h-[56px] disabled:opacity-70"
//                 placeholder={isSending ? "Thinking..." : "Message AKITS..."}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!input.trim() || isSending}
//                 className="absolute bottom-4 right-4 bg-white text-black p-3.5 rounded-2xl hover:bg-gray-200 disabled:opacity-40 transition"
//               >
//                 <FiSend size={22} />
//               </button>
//             </div>
//             <p className="text-center text-xs text-gray-500 mt-4">
//               Grok can make mistakes. Consider checking important information.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// import { useState, useRef, useEffect } from "react";
// import { FiSend, FiPlus, FiMessageSquare, FiUser } from "react-icons/fi";

// const STORAGE_KEY = "akits-chat-messages";
// const SESSION_KEY = "akits-session-id";
// const DEFAULT_WELCOME_MESSAGE = {
//   id: 1,
//   text: "Hello! I'm AKITS Chatbot. How can I help you today?",
//   isUser: false,
// };

// const generateSessionId = () =>
//   `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// function App() {
//   const [messages, setMessages] = useState(() => {
//     if (typeof window === "undefined") return [DEFAULT_WELCOME_MESSAGE];
//     try {
//       const saved = window.localStorage.getItem(STORAGE_KEY);
//       return saved ? JSON.parse(saved) : [DEFAULT_WELCOME_MESSAGE];
//     } catch (error) {
//       console.error("Failed to load saved chat:", error);
//       return [DEFAULT_WELCOME_MESSAGE];
//     }
//   });

//   const [sessionId, setSessionId] = useState(() => {
//     if (typeof window === "undefined") return generateSessionId();
//     try {
//       const saved = window.localStorage.getItem(SESSION_KEY);
//       if (saved) return saved;
//       const fresh = generateSessionId();
//       window.localStorage.setItem(SESSION_KEY, fresh);
//       return fresh;
//     } catch (error) {
//       console.error("Failed to load session id:", error);
//       return generateSessionId();
//     }
//   });

//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem(SESSION_KEY, sessionId);
//     }
//   }, [sessionId]);

//   const response = async (userMessage) => {
//     try {
//       const res = await fetch("http://localhost:5000/ai", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: userMessage,
//           sessionId,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await res.json();
//       return data.response || "Sorry, I couldn't process your request.";
//     } catch (error) {
//       console.error("Error fetching AKITS response:", error);
//       return "Sorry, I couldn't process your request.";
//     }
//   };

//   const sendMessage = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput || isSending) return;

//     const userMessage = {
//       id: Date.now(),
//       text: trimmedInput,
//       isUser: true,
//     };

//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput("");
//     setIsTyping(true);
//     setIsSending(true);

//     try {
//       const botReply = await response(trimmedInput);
//       const grokResponse = {
//         id: Date.now() + 1,
//         text: botReply,
//         isUser: false,
//       };

//       setMessages((prevMessages) => [...prevMessages, grokResponse]);
//     } finally {
//       setIsTyping(false);
//       setIsSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey && !isSending) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const newChat = () => {
//     const fresh = generateSessionId();
//     setSessionId(fresh);
//     setMessages([
//       {
//         id: 1,
//         text: "New chat started! What would you like to ask?",
//         isUser: false,
//       },
//     ]);
//     setInput("");
//     setIsTyping(false);
//     setIsSending(false);
//   };

//   return (
//     <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-72 bg-[#171717] border-r border-gray-800 flex flex-col">
//         <div className="p-4">
//           <button
//             onClick={newChat}
//             className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 py-3 px-4 rounded-2xl text-sm font-medium transition"
//           >
//             <FiPlus size={20} />
//             New Chat
//           </button>
//         </div>

//         <div className="px-3 flex-1 overflow-y-auto chat-scroll">
//           <div className="text-xs text-gray-500 px-4 py-3">Recent</div>
//           <div className="space-y-1 px-2">
//             {[
//               "React + Tailwind setup",
//               "Next.js authentication",
//               "AI project ideas",
//             ].map((chat, i) => (
//               <div
//                 key={i}
//                 className="px-4 py-3 hover:bg-white/10 rounded-2xl cursor-pointer flex items-center gap-3 text-sm"
//               >
//                 <FiMessageSquare />
//                 {chat}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-4 border-t border-gray-800 mt-auto">
//           <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-2xl cursor-pointer">
//             <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//               <FiUser size={20} />
//             </div>
//             <div>
//               <p className="font-medium">You</p>
//               <p className="text-xs text-emerald-400">Free</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         <div className="h-16 border-b border-gray-800 flex items-center px-6 justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-9 h-9 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl">
//               🚀
//             </div>
//             <div>
//               <h1 className="font-semibold text-lg">AKITS Chat</h1>
//               <p className="text-xs text-emerald-400">● Always ready</p>
//             </div>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8 chat-scroll">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[75%] px-6 py-4 rounded-3xl ${
//                   msg.isUser
//                     ? "bg-blue-600 rounded-br-none"
//                     : "bg-[#1F1F1F] rounded-bl-none"
//                 }`}
//               >
//                 <p className="text-[17px] leading-relaxed whitespace-pre-wrap">
//                   {msg.text}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="bg-[#1F1F1F] px-6 py-4 rounded-3xl rounded-bl-none">
//                 <div className="flex gap-1">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "150ms" }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "300ms" }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Box */}
//         <div className="p-6 bg-[#0A0A0A]">
//           <div className="max-w-3xl mx-auto">
//             <div className="relative">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 rows={1}
//                 disabled={isSending}
//                 className="w-full bg-[#1F1F1F] border border-gray-700 focus:border-gray-500 rounded-3xl py-6 px-7 pr-24 text-lg resize-y focus:outline-none min-h-[56px] disabled:opacity-70"
//                 placeholder={isSending ? "Thinking..." : "Message AKITS..."}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!input.trim() || isSending}
//                 className="absolute bottom-4 right-4 bg-white text-black p-3.5 rounded-2xl hover:bg-gray-200 disabled:opacity-40 transition"
//               >
//                 <FiSend size={22} />
//               </button>
//             </div>
//             <p className="text-center text-xs text-gray-500 mt-4">
//               Grok can make mistakes. Consider checking important information.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import { useEffect, useRef, useState } from "react";
import { FiSend, FiPlus, FiMessageSquare, FiUser } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";

const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/ai`
  : "/ai";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hello! I'm your AKITS AI Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("akits-session");
    if (existing) return existing;

    const id = crypto.randomUUID();
    localStorage.setItem("akits-session", id);
    return id;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Unable to connect to the server.",
        },
      ]);
    }

    setLoading(false);
  };

  const newChat = () => {
    localStorage.removeItem("akits-session");
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-[#0F172A]">
      {/* Sidebar */}

      <div className="hidden w-72 border-r border-gray-800 bg-[#111827] p-5 md:flex md:flex-col">
        <h1 className="mb-8 text-2xl font-bold text-white">AKITS AI</h1>

        <button
          onClick={newChat}
          className="mb-8 flex items-center gap-3 rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700"
        >
          <FiPlus />
          New Chat
        </button>

        <div className="space-y-3">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#1F2937] p-3 text-gray-300 hover:bg-[#374151]">
            <FiMessageSquare />
            Current Conversation
          </div>
        </div>
      </div>

      {/* Main */}

      <div className="flex flex-1 flex-col">
        {/* Header */}

        <div className="border-b border-gray-800 bg-[#111827] px-6 py-5">
          <h2 className="text-xl font-semibold text-white">AI Assistant</h2>

          <p className="text-sm text-gray-400">
            Powered by LangGraph + Groq + Qdrant
          </p>
        </div>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-6 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-3xl gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    msg.role === "user" ? "bg-blue-600" : "bg-emerald-600"
                  } text-white`}
                >
                  {msg.role === "user" ? <FiUser /> : <BsRobot />}
                </div>

                <div
                  className={`rounded-2xl px-5 py-4 leading-7 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-[#1F2937] text-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600"></div>

              <div className="rounded-xl bg-[#1F2937] px-5 py-4 text-gray-300">
                Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}

        <div className="border-t border-gray-800 bg-[#111827] p-5">
          <div className="mx-auto flex max-w-5xl gap-4">
            <input
              value={input}
              placeholder="Ask anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 rounded-xl border border-gray-700 bg-[#1F2937] px-5 py-4 text-white outline-none focus:border-blue-500"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <FiSend size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
