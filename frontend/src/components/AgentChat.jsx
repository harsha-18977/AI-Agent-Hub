import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Bot,
  User,
  Paperclip,
  FileText,
  X,
  Sparkles,
  Zap,
  Loader2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import AGENTS from "../services/agents";
import { saveChatHistory } from "../services/chatHistory";

function AgentChat({
  agentId = "research",
  existingSessionId = null,
  existingMessages = [],
}) {
  const [sessionId] = useState(() => existingSessionId || crypto.randomUUID());

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => existingMessages || []);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const agentNames = {
    research: "Research Agent",
    career: "Career Agent",
    email: "Email Agent",
    dataAnalysis: "Data Analysis Agent",
  };

  const descriptions = {
    research: "Research topics and analyze documents with AI.",
    career: "Analyze resumes and discover your career opportunities.",
    email: "Create professional emails with AI assistance.",
    dataAnalysis: "Upload datasets and discover meaningful insights.",
  };

  const agentName = agentNames[agentId] || "AI Agent";

  const isFileAgent = agentId === "career" || agentId === "dataAnalysis";

  const acceptedFormats = agentId === "career" ? ".pdf" : ".csv,.xlsx,.xls";

  const uploadLabel =
    agentId === "career" ? "Upload Resume (PDF)" : "Upload CSV or Excel File";

  const defaultMessage =
    agentId === "career"
      ? "Please analyze my uploaded resume and provide career guidance."
      : "Please analyze this dataset.";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // Save conversation to MongoDB
  const updateHistory = async (updatedMessages) => {
    try {
      await saveChatHistory({
        sessionId,
        agentId,
        agentName,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "Unable to save conversation:",
        error.response?.data || error.message,
      );
    }
  };

  // Parse n8n responses
  const parseAgentResponse = (data) => {
    let result = data;

    if (typeof result === "string") {
      try {
        result = JSON.parse(result);
      } catch {
        const lines = result.split(/\n|\r?\n/);

        const contents = lines
          .map((line) => {
            try {
              const event = JSON.parse(line);
              return event.type === "item" ? event.content || "" : "";
            } catch {
              return "";
            }
          })
          .filter(Boolean);

        return contents.length ? contents.join("") : result;
      }
    }

    if (Array.isArray(result)) {
      return result
        .filter((item) => item.type === "item")
        .map((item) => item.content || "")
        .join("");
    }

    if (typeof result === "object" && result !== null) {
      return (
        result.output ||
        result.text ||
        result.message ||
        result.content ||
        JSON.stringify(result)
      );
    }

    return String(result);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if ((!message.trim() && !selectedFile) || loading) return;

    const userMessage = message.trim() || defaultMessage;

    const userEntry = {
      role: "user",
      text: selectedFile
        ? `${userMessage}\nFile: ${selectedFile.name}`
        : userMessage,
    };

    const updatedMessages = [...messages, userEntry];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    await updateHistory(updatedMessages);

    try {
      let response;

      if (isFileAgent && selectedFile) {
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("chatInput", userMessage);
        formData.append("sessionId", sessionId);

        response = await axios.post(AGENTS[agentId], formData);
      } else {
        response = await axios.post(
          AGENTS[agentId],
          {
            chatInput: userMessage,
            sessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      console.log("AGENT RESPONSE:", response.data);

      const reply = parseAgentResponse(response.data);

      const finalMessages = [
        ...updatedMessages,
        {
          role: "assistant",
          text: reply,
        },
      ];

      setMessages(finalMessages);
      await updateHistory(finalMessages);
    } catch (error) {
      console.error("Agent error:", error.response?.data || error.message);

      const errorMessages = [
        ...updatedMessages,
        {
          role: "assistant",
          text: "Unable to connect to the AI agent. Please check the workflow and try again.",
        },
      ];

      setMessages(errorMessages);
      await updateHistory(errorMessages);
    } finally {
      setLoading(false);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl
      border border-cyan-400/15 bg-[#0b1423]/75
      backdrop-blur-2xl text-white shadow-[0_10px_45px_rgba(0,0,0,0.2)]
      animate-fade-in"
    >
      {/* Background glow */}
      <div
        className="absolute -top-32 right-0 w-72 h-72
        rounded-full bg-cyan-400/[0.07] blur-[100px]
        pointer-events-none"
      />

      {/* Chat Header */}
      <div
        className="relative flex items-center justify-between gap-3
        px-5 md:px-7 py-5 border-b border-cyan-400/10
        bg-[#101a2b]/55 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className="relative w-12 h-12 rounded-2xl
            bg-gradient-to-br from-cyan-400/20 to-blue-500/10
            border border-cyan-400/25 flex items-center justify-center
            shadow-[0_0_20px_rgba(0,229,255,0.08)]"
          >
            <Bot size={24} className="text-cyan-300" />

            <span
              className="absolute -bottom-1 -right-1
              w-3.5 h-3.5 rounded-full bg-emerald-400
              border-[3px] border-[#101a2b]
              shadow-[0_0_10px_#34d399]"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">{agentName}</h2>

            <p className="text-xs text-slate-400 mt-1">
              {descriptions[agentId]}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2
          rounded-full bg-emerald-400/[0.07]
          border border-emerald-400/15"
        >
          <span className="relative flex w-2 h-2">
            <span
              className="absolute inline-flex h-full w-full
              rounded-full bg-emerald-400 opacity-60 animate-ping"
            />
            <span
              className="relative inline-flex rounded-full
              h-2 w-2 bg-emerald-400"
            />
          </span>

          <span className="text-[10px] text-emerald-300 font-medium">
            Online
          </span>
        </div>
      </div>

      {/* Conversation */}
      <div
        className="relative h-[420px] md:h-[500px]
        overflow-y-auto px-4 md:px-7 py-6 space-y-6"
      >
        {/* Empty State */}
        {messages.length === 0 && (
          <div
            className="h-full flex flex-col items-center
            justify-center text-center animate-fade-in"
          >
            <div className="relative mb-7">
              <div
                className="absolute inset-0 rounded-full
                bg-cyan-400/20 blur-3xl animate-pulse"
              />

              <div
                className="relative w-24 h-24 rounded-[28px]
                bg-gradient-to-br from-cyan-400/15 to-blue-500/10
                border border-cyan-400/25
                flex items-center justify-center
                shadow-[0_0_35px_rgba(0,229,255,0.10)]
                animate-float"
              >
                <Bot size={46} className="text-cyan-300" />
              </div>

              <div
                className="absolute -top-2 -right-2
                w-8 h-8 rounded-xl bg-violet-400/15
                border border-violet-400/20
                flex items-center justify-center"
              >
                <Sparkles size={16} className="text-violet-300" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-cyan-400" />

              <h2 className="text-xl font-bold text-white">
                Start a conversation
              </h2>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-7">
              {descriptions[agentId]} Ask a question and let your AI assistant
              help you.
            </p>

            <div
              className="mt-7 flex items-center gap-2
              px-4 py-2 rounded-full bg-white/[0.03]
              border border-white/[0.06]"
            >
              <Zap size={14} className="text-cyan-400" />

              <span className="text-xs text-slate-400">
                Powered by your AI workflow
              </span>
            </div>
          </div>
        )}

        {/* Message Bubbles */}
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={index}
              className={`flex gap-3 items-start animate-slide-up ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div
                  className="w-9 h-9 shrink-0 rounded-xl
                  bg-cyan-400/10 border border-cyan-400/20
                  flex items-center justify-center
                  shadow-[0_0_15px_rgba(0,229,255,0.06)]"
                >
                  <Bot size={19} className="text-cyan-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[78%]
                  p-4 rounded-2xl whitespace-pre-wrap
                  text-sm leading-7 break-words transition-all duration-300 ${
                    isUser
                      ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-[0_5px_25px_rgba(0,150,255,0.15)]"
                      : "bg-[#152237]/85 backdrop-blur-xl border border-cyan-400/10 text-slate-200 rounded-tl-sm shadow-[0_5px_20px_rgba(0,0,0,0.12)]"
                  }`}
              >
                {msg.text}
              </div>

              {isUser && (
                <div
                  className="w-9 h-9 shrink-0 rounded-xl
                  bg-violet-400/10 border border-violet-400/20
                  flex items-center justify-center"
                >
                  <User size={18} className="text-violet-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* AI Thinking Indicator */}
        {loading && (
          <div className="flex items-center gap-3 animate-slide-up">
            <div
              className="w-9 h-9 rounded-xl
              bg-cyan-400/10 border border-cyan-400/15
              flex items-center justify-center"
            >
              <Bot size={19} className="text-cyan-300" />
            </div>

            <div
              className="px-5 py-3.5 rounded-2xl
              bg-[#152237]/85 border border-cyan-400/15
              flex items-center gap-3"
            >
              <div className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full
                  bg-cyan-400 animate-bounce"
                />
                <span
                  className="w-1.5 h-1.5 rounded-full
                  bg-cyan-400 animate-bounce [animation-delay:150ms]"
                />
                <span
                  className="w-1.5 h-1.5 rounded-full
                  bg-cyan-400 animate-bounce [animation-delay:300ms]"
                />
              </div>

              <span className="text-xs text-slate-400">
                {agentName} is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="relative border-t border-cyan-400/10
        p-4 md:p-6 bg-[#0d1727]/65 backdrop-blur-xl"
      >
        {/* File Upload */}
        {isFileAgent && (
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats}
              disabled={loading}
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            {selectedFile ? (
              <div
                className="flex items-center justify-between gap-3
                p-3 rounded-xl bg-cyan-400/[0.07]
                border border-cyan-400/25
                animate-scale-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 shrink-0 rounded-xl
                    bg-cyan-400/10 flex items-center justify-center"
                  >
                    <FileText size={20} className="text-cyan-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-white truncate">
                      {selectedFile.name}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="p-2 rounded-lg text-slate-400
                    hover:text-red-400 hover:bg-red-400/10
                    transition-all"
                  aria-label="Remove selected file"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-3
                  rounded-xl text-xs text-slate-400
                  bg-white/[0.02] border border-dashed
                  border-white/10 hover:border-cyan-400/40
                  hover:text-cyan-300 hover:bg-cyan-400/[0.04]
                  transition-all duration-300"
              >
                <Paperclip size={16} />
                {uploadLabel}
              </button>
            )}
          </div>
        )}

        {/* Message Form */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-3 p-2
            rounded-2xl bg-[#152237]/90
            border border-white/[0.08]
            focus-within:border-cyan-400/40
            focus-within:shadow-[0_0_25px_rgba(0,229,255,0.09)]
            transition-all duration-300"
        >
          <MessageSquare
            size={19}
            className="ml-2 text-slate-500 shrink-0 hidden sm:block"
          />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            placeholder={`Message ${agentName}...`}
            className="flex-1 min-w-0 bg-transparent px-2 py-3
              text-sm text-white placeholder:text-slate-500
              outline-none"
          />

          <button
            type="submit"
            disabled={loading || (!message.trim() && !selectedFile)}
            className="shrink-0 w-11 h-11 rounded-xl
              flex items-center justify-center
              bg-gradient-to-br from-cyan-400 to-blue-500
              text-[#07111e]
              hover:shadow-[0_0_25px_rgba(0,229,255,0.35)]
              hover:scale-105
              active:scale-95
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-300"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Send size={19} />
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-4">
          <ShieldCheck size={12} className="text-slate-600" />

          <p className="text-center text-[10px] text-slate-500">
            AI-generated responses may need verification.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AgentChat;
