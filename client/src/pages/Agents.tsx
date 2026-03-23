/*
 * Agents — "Glass Horizon" Design
 * Agent card grid with status badges, create agent dialog, agent detail view
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Plus,
  Play,
  Pause,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Zap,
  Globe,
  Code2,
  FileText,
  Database,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AGENTS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663083178937/BswsvvE8gzMytEWPKpnfeT/echomen-agents-visual-7p6LFjBnK5teh5VtMT59ag.webp";

type AgentStatus = "running" | "idle" | "error" | "stopped";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  icon: typeof Bot;
  tasks: number;
  lastActive: string;
  model: string;
}

const MOCK_AGENTS: Agent[] = [
  { id: "1", name: "Researcher", description: "Web scraping, data collection, and information synthesis", status: "running", icon: Globe, tasks: 342, lastActive: "2 min ago", model: "GPT-4o" },
  { id: "2", name: "Coder", description: "Code generation, review, and refactoring assistant", status: "running", icon: Code2, tasks: 891, lastActive: "5 min ago", model: "Claude 3.5" },
  { id: "3", name: "Writer", description: "Content creation, editing, and summarization", status: "idle", icon: FileText, tasks: 156, lastActive: "1 hr ago", model: "GPT-4o" },
  { id: "4", name: "DataAnalyst", description: "Data processing, visualization, and insights generation", status: "running", icon: Database, tasks: 234, lastActive: "8 min ago", model: "Gemini Pro" },
  { id: "5", name: "SecurityAuditor", description: "Code security scanning and vulnerability detection", status: "idle", icon: Shield, tasks: 67, lastActive: "3 hrs ago", model: "Claude 3.5" },
  { id: "6", name: "Orchestrator", description: "Multi-agent coordination and task delegation", status: "running", icon: Zap, tasks: 1203, lastActive: "Just now", model: "GPT-4o" },
];

const STATUS_CONFIG: Record<AgentStatus, { label: string; dotClass: string; bgClass: string }> = {
  running: { label: "Running", dotClass: "bg-[oklch(0.7_0.17_165)]", bgClass: "bg-[oklch(0.7_0.17_165/10%)] text-[oklch(0.7_0.17_165)]" },
  idle: { label: "Idle", dotClass: "bg-muted-foreground", bgClass: "bg-muted text-muted-foreground" },
  error: { label: "Error", dotClass: "bg-[oklch(0.6_0.2_15)]", bgClass: "bg-[oklch(0.6_0.2_15/10%)] text-[oklch(0.6_0.2_15)]" },
  stopped: { label: "Stopped", dotClass: "bg-muted-foreground/50", bgClass: "bg-muted text-muted-foreground/70" },
};

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Agents() {
  const [agents] = useState<Agent[]>(MOCK_AGENTS);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Page Header with Background */}
      <motion.div variants={fadeUp} className="relative rounded-xl overflow-hidden h-36">
        <img src={AGENTS_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
        <div className="relative z-10 flex items-end justify-between h-full px-6 pb-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Agent Orchestration</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage, deploy, and monitor your AI agents</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0 shadow-lg shadow-[oklch(0.55_0.2_270/20%)]">
                <Plus className="w-4 h-4 mr-2" />
                New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-glass-border bg-card text-card-foreground">
              <DialogHeader>
                <DialogTitle className="font-display">Create New Agent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Agent Name</label>
                  <input className="mt-1.5 w-full h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="e.g., DataProcessor" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea className="mt-1.5 w-full h-20 rounded-lg bg-glass border border-glass-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" placeholder="What does this agent do?" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Model</label>
                  <select className="mt-1.5 w-full h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="gpt4o">GPT-4o</option>
                    <option value="claude">Claude 3.5 Sonnet</option>
                    <option value="gemini">Gemini Pro</option>
                  </select>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0"
                  onClick={() => toast.success("Agent created successfully!")}
                >
                  Create Agent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-lg bg-glass border border-glass-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <Button variant="outline" className="border-glass-border bg-glass hover:bg-glass-hover text-foreground">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </motion.div>

      {/* Agent Cards Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((agent) => {
          const Icon = agent.icon;
          const statusCfg = STATUS_CONFIG[agent.status];
          return (
            <motion.div
              key={agent.id}
              whileHover={{ y: -2 }}
              className="glass-panel rounded-xl p-5 group relative"
            >
              {/* Gradient accent line at top */}
              {agent.status === "running" && (
                <div className="absolute top-0 left-4 right-4 accent-line" />
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-[oklch(0.55_0.2_270/15%)] transition-colors">
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-[oklch(0.55_0.2_270)] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{agent.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusCfg.bgClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass} ${agent.status === "running" ? "pulse-dot" : ""}`} />
                      {statusCfg.label}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-panel border-glass-border bg-card text-card-foreground">
                    <DropdownMenuItem onClick={() => toast.info("Feature coming soon")}>
                      <Play className="w-4 h-4 mr-2" /> Start
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Feature coming soon")}>
                      <Pause className="w-4 h-4 mr-2" /> Pause
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => toast.info("Feature coming soon")}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{agent.description}</p>

              <div className="mt-4 pt-4 border-t border-glass-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="font-mono">{agent.tasks} tasks</span>
                  <span>·</span>
                  <span>{agent.model}</span>
                </div>
                <span className="font-mono">{agent.lastActive}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
