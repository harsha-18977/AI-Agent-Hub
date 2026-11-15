import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles, Bot, ShieldCheck, Activity } from "lucide-react";

import AgentChat from "../components/AgentChat";

const agentDetails = {
  research: {
    name: "Research Agent",
    description: "Explore topics, research information and analyze documents.",
    category: "INTELLIGENCE",
    color: "text-cyan-300",
  },
  career: {
    name: "Career Agent",
    description: "Analyze resumes and build personalized career roadmaps.",
    category: "CAREER ASSISTANCE",
    color: "text-violet-300",
  },
  email: {
    name: "Email Agent",
    description: "Create professional emails and automate email workflows.",
    category: "COMMUNICATION",
    color: "text-emerald-300",
  },
  dataAnalysis: {
    name: "Data Analysis Agent",
    description: "Analyze datasets and discover meaningful insights.",
    category: "DATA INTELLIGENCE",
    color: "text-orange-300",
  },
};

function AgentWorkspace() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const validAgents = ["research", "career", "email", "dataAnalysis"];

  const sessionId = location.state?.sessionId || null;
  const previousMessages = location.state?.messages || [];

  if (!validAgents.includes(agentId)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="text-center bg-[#101a2b] border border-white/10 rounded-2xl p-8">
          <Bot size={40} className="text-cyan-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Agent Not Found</h1>
          <p className="text-slate-400 text-sm mt-2">
            The requested AI agent does not exist.
          </p>
          <button
            onClick={() => navigate("/agents")}
            className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-400 text-[#07111e] font-semibold hover:bg-cyan-300 transition"
          >
            Back to Agents
          </button>
        </div>
      </div>
    );
  }

  const agent = agentDetails[agentId];

  return (
    <div className="relative min-h-screen px-4 md:px-8 pb-8">
      {/* Navigation */}
      <div className="pt-5 mb-5">
        <button
          onClick={() => navigate("/history")}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft
            size={17}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Chat History
        </button>
      </div>

      {/* Agent Header */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-[#10283a] via-[#101b32] to-[#17152e] p-5 md:p-6 mb-5">
        <div className="absolute -right-10 -top-20 w-56 h-56 rounded-full bg-cyan-400/[0.08] blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.08)]">
              <Bot size={30} className={agent.color} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={13} className="text-cyan-400" />
                <span
                  className={`text-[10px] tracking-[2px] font-bold ${agent.color}`}
                >
                  {agent.category}
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-white">
                {agent.name}
              </h1>

              <p className="text-xs md:text-sm text-slate-400 mt-1">
                {agent.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/[0.07] border border-emerald-400/15">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-xs text-emerald-300">Workspace Ready</span>
            </div>

            <div className="hidden md:flex p-2 rounded-xl bg-white/[0.04] border border-white/10">
              <ShieldCheck size={19} className="text-cyan-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Workspace */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-400/10 bg-[#0c1524]/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
        <AgentChat
          key={sessionId || agentId}
          agentId={agentId}
          existingSessionId={sessionId}
          existingMessages={previousMessages}
        />
      </div>
    </div>
  );
}

export default AgentWorkspace;
