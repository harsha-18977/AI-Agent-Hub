import { useNavigate } from "react-router-dom";
import {
  Search,
  BriefcaseBusiness,
  Mail,
  ChartNoAxesCombined,
  ArrowUpRight,
  Sparkles,
  Bot,
  Zap,
  ShieldCheck,
  Activity,
  Clock3,
  ChevronRight,
} from "lucide-react";

import AgentCard from "../components/AgentCard";

const agents = [
  {
    id: "research",
    title: "Research Agent",
    description:
      "Research topics, summarize information and analyze documents.",
    icon: Search,
    color: "bg-cyan-400/10 text-cyan-300",
  },
  {
    id: "career",
    title: "Career Agent",
    description:
      "Analyze resumes, identify skill gaps and build career roadmaps.",
    icon: BriefcaseBusiness,
    color: "bg-violet-400/10 text-violet-300",
  },
  {
    id: "email",
    title: "Email Agent",
    description: "Draft professional emails and assist with email workflows.",
    icon: Mail,
    color: "bg-emerald-400/10 text-emerald-300",
  },
  {
    id: "dataAnalysis",
    title: "Data Analysis Agent",
    description: "Upload CSV or Excel files and explore your data.",
    icon: ChartNoAxesCombined,
    color: "bg-orange-400/10 text-orange-300",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userName = user.name || user.username || "there";

  const stats = [
    {
      label: "Available AI Agents",
      value: "04",
      description: "Ready to assist you",
      icon: Bot,
      color: "text-cyan-300",
      bg: "bg-cyan-400/10",
    },
    {
      label: "AI Workflows",
      value: "04",
      description: "Integrated with n8n",
      icon: Zap,
      color: "text-violet-300",
      bg: "bg-violet-400/10",
    },
    {
      label: "System Status",
      value: "Online",
      description: "Workspace operational",
      icon: Activity,
      color: "text-emerald-300",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Account Security",
      value: "Active",
      description: "Protected workspace",
      icon: ShieldCheck,
      color: "text-blue-300",
      bg: "bg-blue-400/10",
    },
  ];

  return (
    <div className="relative min-h-screen p-5 md:p-8 text-white">
      {/* Welcome Section */}
      <section className="mb-9">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-cyan-300 text-xs font-semibold tracking-[2px]">
            AI AGENT WORKSPACE
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            {userName}
          </span>{" "}
          👋
        </h1>

        <p className="text-slate-400 mt-3 text-sm md:text-base">
          Your intelligent workspace is ready. What would you like to accomplish
          today?
        </p>
      </section>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl p-6 md:p-9 mb-9 border border-cyan-400/20 bg-gradient-to-br from-[#10283a] via-[#101b32] to-[#17152e] shadow-[0_0_35px_rgba(0,229,255,0.06)]">
        <div className="absolute -top-24 -right-16 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-5">
            <Sparkles size={14} className="text-cyan-300" />
            <span className="text-xs text-cyan-200 font-medium">
              YOUR AI-POWERED WORKSPACE
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Think smarter.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              Work faster with AI.
            </span>
          </h2>

          <p className="text-slate-300 text-sm mt-4 max-w-lg leading-relaxed">
            Research ideas, improve your career, automate email workflows and
            analyze data — all from one intelligent platform.
          </p>

          <button
            onClick={() => navigate("/agents")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 text-[#07111e] font-semibold text-sm hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all duration-300"
          >
            Explore AI Agents
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-cyan-400/20 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border border-blue-400/20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_35px_rgba(0,229,255,0.15)]">
                <Bot size={55} className="text-cyan-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            Workspace Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your platform at a glance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group p-5 rounded-2xl bg-[#101a2b]/80 border border-white/[0.06] hover:border-cyan-400/25 hover:bg-[#142238] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon size={21} className={stat.color} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-600 group-hover:text-cyan-300 transition-colors"
                  />
                </div>

                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>

                <p className="text-sm text-slate-300 mt-1">{stat.label}</p>

                <p className="text-xs text-slate-500 mt-2">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Agents */}
      <section className="mb-10">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">
                Your AI Agents
              </h2>
              <Sparkles size={15} className="text-cyan-400" />
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Intelligent assistants for your everyday tasks
            </p>
          </div>

          <button
            onClick={() => navigate("/agents")}
            className="flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            View all
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              {...agent}
              onClick={() => navigate(`/agent/${agent.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Bottom Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#101a2b]/70 border border-white/[0.06]">
          <div className="p-3 rounded-xl bg-cyan-400/10">
            <Clock3 size={22} className="text-cyan-300" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              One Intelligent Platform
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Access all four AI assistants from one workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#101a2b]/70 border border-white/[0.06]">
          <div className="p-3 rounded-xl bg-emerald-400/10">
            <ShieldCheck size={22} className="text-emerald-300" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Secure AI Workspace
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your account is protected by authentication.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
