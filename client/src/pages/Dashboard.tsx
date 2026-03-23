/*
 * Dashboard — "Glass Horizon" Design
 * Hero banner, live KPI stats from DB, recent activity timeline, quick action grid
 */
import { motion } from "framer-motion";
import {
  Bot,
  Cpu,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MessageSquare,
  Code2,
  Settings,
  Zap,
  Activity,
  TrendingUp,
  Terminal,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663083178937/BswsvvE8gzMytEWPKpnfeT/echomen-hero-bg-7ujoqQK6AicdcX4hFTFkGy.webp";

const QUICK_ACTIONS = [
  { label: "New Agent", icon: Bot, href: "/agents", desc: "Create and deploy" },
  { label: "Start Chat", icon: MessageSquare, href: "/chat", desc: "Talk to AI" },
  { label: "Summarize Code", icon: Code2, href: "/code-summarizer", desc: "Analyze codebase" },
  { label: "View Logs", icon: Activity, href: "/settings", desc: "System activity" },
  { label: "Integrations", icon: Zap, href: "/settings", desc: "Connect services" },
  { label: "Configuration", icon: Settings, href: "/settings", desc: "Platform settings" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: activity, isLoading: activityLoading } = trpc.dashboard.activity.useQuery();

  const statCards = [
    {
      label: "Active Agents",
      value: statsLoading ? "—" : String(stats?.activeAgents ?? 0),
      change: `/${stats?.totalAgents ?? 0} total`,
      icon: Bot,
      color: "from-[oklch(0.55_0.2_270)] to-[oklch(0.5_0.22_280)]",
    },
    {
      label: "Tasks Completed",
      value: statsLoading ? "—" : String(stats?.totalTasks ?? 0),
      change: "all time",
      icon: CheckCircle2,
      color: "from-[oklch(0.7_0.17_165)] to-[oklch(0.6_0.15_180)]",
    },
    {
      label: "Messages",
      value: statsLoading ? "—" : String(stats?.totalMessages ?? 0),
      change: "total",
      icon: Clock,
      color: "from-[oklch(0.6_0.18_250)] to-[oklch(0.55_0.2_270)]",
    },
    {
      label: "System Status",
      value: "Online",
      change: "healthy",
      icon: Cpu,
      color: "from-[oklch(0.75_0.15_80)] to-[oklch(0.65_0.17_60)]",
    },
  ];

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Hero Banner */}
      <motion.div variants={fadeUp} className="relative rounded-xl overflow-hidden h-48">
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center h-full px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Welcome back, K
          </h1>
          <p className="mt-2 text-muted-foreground max-w-md">
            Your AI orchestration platform is running smoothly.{" "}
            {stats ? `${stats.activeAgents} agent${stats.activeAgents !== 1 ? "s" : ""} active.` : "Loading..."}
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0 shadow-lg shadow-[oklch(0.55_0.2_270/20%)]">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Conversation
              </Button>
            </Link>
            <Link href="/agents">
              <Button variant="outline" className="border-glass-border bg-glass hover:bg-glass-hover text-foreground">
                <Bot className="w-4 h-4 mr-2" />
                Manage Agents
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-panel rounded-xl p-5 group">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs font-mono font-medium text-[oklch(0.7_0.17_165)]">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-display font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Echoctl CLI Connection Status */}
      <motion.div variants={fadeUp} className="glass-panel rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.45_0.25_300)] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">Echoctl CLI Bridge</h3>
              <p className="text-xs text-muted-foreground">Connect your terminal to ECHOMEN via <code className="font-mono text-[oklch(0.55_0.2_270)]">echoctl connect</code></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">Disconnected</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> BDI Engine</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 14+ Providers</span>
          <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Multi-layer Memory</span>
          <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> Code Summarizer</span>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-glass border border-glass-border">
          <p className="text-xs font-mono text-muted-foreground">$ echoctl connect --url ws://localhost:3000/ws/echo</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs">
              View All <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {activityLoading ? (
              <p className="text-sm text-muted-foreground">Loading activity...</p>
            ) : activity && activity.length > 0 ? (
              activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="mt-1.5">
                    <div
                      className={`w-2 h-2 rounded-full pulse-dot ${
                        item.status === "success"
                          ? "bg-[oklch(0.7_0.17_165)] text-[oklch(0.7_0.17_165)]"
                          : item.status === "error"
                          ? "bg-[oklch(0.65_0.22_15)] text-[oklch(0.65_0.22_15)]"
                          : "bg-muted-foreground text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground/90">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No activity yet. Create an agent to get started!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="glass-panel rounded-xl p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-glass border border-glass-border hover:border-[oklch(0.55_0.2_270/30%)] hover:bg-glass-hover transition-all text-center group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-[oklch(0.55_0.2_270/15%)] transition-colors">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-[oklch(0.55_0.2_270)] transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{action.label}</p>
                      <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
