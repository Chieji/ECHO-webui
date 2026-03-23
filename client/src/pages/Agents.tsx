/*
 * Agents — "Glass Horizon" Design
 * Live agent card grid with CRUD, status badges, SSE real-time updates
 */
import { useState, useEffect, useRef } from "react";
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
  Square,
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
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";

const AGENTS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663083178937/BswsvvE8gzMytEWPKpnfeT/echomen-agents-visual-7p6LFjBnK5teh5VtMT59ag.webp";

type AgentStatus = "running" | "idle" | "error" | "stopped";

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

// SSE hook for real-time agent status
function useAgentStream() {
  const [liveStatuses, setLiveStatuses] = useState<Record<number, AgentStatus>>({});
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/agents/stream");
    eventSourceRef.current = es;
    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "agents" && Array.isArray(parsed.data)) {
          const map: Record<number, AgentStatus> = {};
          for (const a of parsed.data) {
            map[a.id] = a.status;
          }
          setLiveStatuses(map);
        }
      } catch {
        // ignore parse errors
      }
    };
    return () => { es.close(); };
  }, []);

  return liveStatuses;
}

export default function Agents() {
  const utils = trpc.useUtils();
  const { data: agents, isLoading } = trpc.agents.list.useQuery();
  const liveStatuses = useAgentStream();

  const createMutation = trpc.agents.create.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
      utils.dashboard.stats.invalidate();
      toast.success("Agent created successfully!");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.agents.update.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.agents.delete.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
      utils.dashboard.stats.invalidate();
      utils.dashboard.activity.invalidate();
      toast.success("Agent deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newModel, setNewModel] = useState("GPT-4o");

  const filtered = (agents ?? []).filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) { toast.error("Agent name is required"); return; }
    createMutation.mutate({ name: newName.trim(), description: newDesc.trim() || undefined, model: newModel });
    setDialogOpen(false);
    setNewName("");
    setNewDesc("");
    setNewModel("GPT-4o");
  };

  const handleStatusChange = (id: number, status: AgentStatus) => {
    updateMutation.mutate({ id, status });
    toast.info(`Agent status changed to ${status}`);
  };

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeUp} className="relative rounded-xl overflow-hidden h-36">
        <img src={AGENTS_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
        <div className="relative z-10 flex items-end justify-between h-full px-6 pb-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Agent Orchestration</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {agents ? `${agents.length} agent${agents.length !== 1 ? "s" : ""} deployed` : "Loading..."}
              {" "}<span className="text-[oklch(0.55_0.2_270)]">Powered by Echoctl</span>
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-1.5 w-full h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="e.g., DataProcessor"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="mt-1.5 w-full h-20 rounded-lg bg-glass border border-glass-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                    placeholder="What does this agent do?"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Model</label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="mt-1.5 w-full h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Gemini Pro">Gemini Pro</option>
                    <option value="Echoctl BDI">Echoctl BDI Engine</option>
                    <option value="Echoctl Chain">Echoctl Provider Chain (14+)</option>
                  </select>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0"
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Agent"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search & Filter */}
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
        <Button variant="outline" className="border-glass-border bg-glass hover:bg-glass-hover text-foreground" onClick={() => toast.info("Filter feature coming soon")}>
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </motion.div>

      {/* Agent Cards Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-secondary rounded w-24" />
                  <div className="h-3 bg-secondary rounded w-16" />
                </div>
              </div>
              <div className="mt-3 h-8 bg-secondary rounded" />
              <div className="mt-4 pt-4 border-t border-glass-border h-4 bg-secondary rounded w-32" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchQuery ? "No agents match your search." : "No agents yet. Create your first agent!"}
            </p>
          </div>
        ) : (
          filtered.map((agent) => {
            const realStatus = (liveStatuses[agent.id] ?? agent.status) as AgentStatus;
            const statusCfg = STATUS_CONFIG[realStatus];
            return (
              <motion.div
                key={agent.id}
                whileHover={{ y: -2 }}
                className="glass-panel rounded-xl p-5 group relative"
              >
                {realStatus === "running" && (
                  <div className="absolute top-0 left-4 right-4 accent-line" />
                )}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-[oklch(0.55_0.2_270/15%)] transition-colors">
                      <Bot className="w-5 h-5 text-muted-foreground group-hover:text-[oklch(0.55_0.2_270)] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{agent.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusCfg.bgClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass} ${realStatus === "running" ? "pulse-dot" : ""}`} />
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
                      <DropdownMenuItem onClick={() => handleStatusChange(agent.id, "running")}>
                        <Play className="w-4 h-4 mr-2" /> Start
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(agent.id, "idle")}>
                        <Pause className="w-4 h-4 mr-2" /> Pause
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(agent.id, "stopped")}>
                        <Square className="w-4 h-4 mr-2" /> Stop
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate({ id: agent.id })}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{agent.description ?? "No description"}</p>
                <div className="mt-4 pt-4 border-t border-glass-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="font-mono">{agent.tasksCompleted} tasks</span>
                    <span>·</span>
                    <span>{agent.model}</span>
                  </div>
                  <span className="font-mono">
                    {agent.lastActive
                      ? formatDistanceToNow(new Date(agent.lastActive), { addSuffix: true })
                      : "Never active"}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
