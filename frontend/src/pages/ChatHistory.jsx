import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Trash2, Clock, Bot, ExternalLink } from "lucide-react";

import { getChatHistory, deleteChatHistory } from "../services/chatHistory";

function ChatHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getChatHistory();
      setHistory(data);
    } catch (error) {
      console.error("Unable to load chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Delete this conversation?")) return;

    try {
      await deleteChatHistory(sessionId);

      setHistory((previous) =>
        previous.filter((chat) => chat.sessionId !== sessionId),
      );
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Unable to delete conversation.");
    }
  };

  const handleOpen = (chat) => {
    navigate(`/agent/${chat.agentId}`, {
      state: {
        sessionId: chat.sessionId,
        messages: chat.messages || [],
      },
    });
  };

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare size={28} className="text-blue-400" />
          <h1 className="text-3xl font-bold">Chat History</h1>
        </div>

        <p className="text-gray-400 mt-2">
          View and manage your previous AI conversations.
        </p>
      </div>

      {loading ? (
        <div className="bg-[#151d30] border border-white/10 rounded-2xl p-12 text-center text-gray-400">
          Loading conversations...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-[#151d30] border border-white/10 rounded-2xl p-12 text-center">
          <MessageSquare size={40} className="mx-auto text-gray-500 mb-4" />

          <h2 className="text-xl font-semibold">No conversations yet</h2>

          <p className="text-gray-400 mt-2">
            Your conversations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((chat) => (
            <div
              key={chat.sessionId}
              className="bg-[#151d30] border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Bot size={23} className="text-blue-400" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold">
                    {chat.agentName || "AI Agent"}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {chat.messages?.[0]?.text || "Conversation"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Clock size={13} />
                    {chat.updatedAt
                      ? new Date(chat.updatedAt).toLocaleString()
                      : "Date unavailable"}
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {chat.messages?.length || 0} messages
                  </p>

                  <button
                    onClick={() => handleOpen(chat)}
                    className="mt-3 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    <ExternalLink size={15} />
                    Open Conversation
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleDelete(chat.sessionId)}
                className="p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition shrink-0"
                title="Delete conversation"
              >
                <Trash2 size={19} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatHistory;
