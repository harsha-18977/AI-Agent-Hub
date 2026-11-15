import { useEffect, useState } from "react";
import {
  MessageSquare,
  MessagesSquare,
  Bot,
  TrendingUp,
  Activity,
} from "lucide-react";
import { getChatHistory } from "../services/chatHistory";

function Analytics() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getChatHistory();

        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Analytics loading error:", err);
        setError("Unable to load analytics. Please try again.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const totalConversations = history.length;

  const totalMessages = history.reduce(
    (total, chat) =>
      total + (Array.isArray(chat.messages) ? chat.messages.length : 0),
    0,
  );

  const agentCounts = history.reduce((counts, chat) => {
    const name = chat.agentName || "Unknown Agent";
    counts[name] = (counts[name] || 0) + 1;
    return counts;
  }, {});

  const mostUsedAgent =
    Object.entries(agentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No activity";

  const maxCount = Math.max(1, ...Object.values(agentCounts));

  const stats = [
    {
      title: "Total Conversations",
      value: totalConversations,
      icon: MessageSquare,
      color: "text-blue-400",
      bg: "bg-blue-500/15",
    },
    {
      title: "Total Messages",
      value: totalMessages,
      icon: MessagesSquare,
      color: "text-purple-400",
      bg: "bg-purple-500/15",
    },
    {
      title: "Agents Used",
      value: Object.keys(agentCounts).length,
      icon: Bot,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
    },
    {
      title: "Most Used Agent",
      value: mostUsedAgent,
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "bg-orange-500/15",
    },
  ];

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Activity size={28} className="text-blue-400" />
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>

        <p className="text-gray-400 mt-2">
          Monitor your AI AgentHub usage and activity.
        </p>
      </div>

      {loading ? (
        <p className="text-blue-400 animate-pulse">Loading analytics...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="bg-[#151d30] border border-white/10 rounded-2xl p-6"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}
                  >
                    <Icon size={22} className={stat.color} />
                  </div>

                  <p className="text-gray-400 text-sm mt-5">{stat.title}</p>

                  <h2 className="text-2xl font-bold mt-2 break-words">
                    {stat.value}
                  </h2>
                </div>
              );
            })}
          </div>

          <div className="bg-[#151d30] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">
              Agent Usage Statistics
            </h2>

            {Object.keys(agentCounts).length === 0 ? (
              <p className="text-gray-400">
                No activity yet. Start chatting with your AI agents to see
                analytics.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(agentCounts).map(([name, count]) => (
                  <div key={name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">{name}</span>
                      <span className="text-sm text-gray-400">
                        {count} conversations
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-[#26334a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Analytics are calculated from conversations saved in MongoDB.
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
