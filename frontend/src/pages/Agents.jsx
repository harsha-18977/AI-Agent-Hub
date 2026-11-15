import { useNavigate } from "react-router-dom";
import {
  Search,
  BriefcaseBusiness,
  Mail,
  ChartNoAxesCombined,
  ArrowUpRight,
  Bot,
} from "lucide-react";

const agents = [
  {
    id: "research",
    title: "Research Agent",
    description:
      "Research topics, summarize documents and find useful information.",
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    status: "Active",
  },
  {
    id: "career",
    title: "Career Agent",
    description:
      "Analyze resumes, identify skill gaps and prepare career roadmaps.",
    icon: BriefcaseBusiness,
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    status: "Active",
  },
  {
    id: "email",
    title: "Email Agent",
    description:
      "Draft professional emails and assist with email communication.",
    icon: Mail,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    status: "Active",
  },
  {
    id: "dataAnalysis",
    title: "Data Analysis Agent",
    description:
      "Analyze datasets and extract insights from CSV and Excel files.",
    icon: ChartNoAxesCombined,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    status: "Active",
  },
];

function Agents() {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Bot size={28} className="text-blue-400" />
          <h1 className="text-3xl font-bold">AI Agents</h1>
        </div>

        <p className="text-gray-400">
          Explore your intelligent agents and choose one to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div
              key={agent.id}
              className="bg-[#151d30] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${agent.bg} ${agent.color}`}
                >
                  <Icon size={24} />
                </div>

                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  {agent.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold mt-6">{agent.title}</h2>

              <p className="text-gray-400 text-sm leading-6 mt-2 min-h-12">
                {agent.description}
              </p>

              <button
                onClick={() => navigate(`/agent/${agent.id}`)}
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium"
              >
                Open Agent <ArrowUpRight className="inline ml-1" size={17} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Agents;
