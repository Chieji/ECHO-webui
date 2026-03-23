/*
 * Settings — "Glass Horizon" Design
 * Tabbed settings interface: General, API Keys, Integrations, Advanced
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Key,
  Plug,
  Sliders,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const TABS = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "advanced", label: "Advanced", icon: Sliders },
];

const API_KEYS = [
  { name: "OpenAI", key: "sk-proj-****...****Xm9a", status: "active" },
  { name: "Anthropic", key: "sk-ant-****...****7bQ2", status: "active" },
  { name: "Google Gemini", key: "AIza****...****pK4", status: "active" },
  { name: "GitHub", key: "ghp_****...****9xR", status: "inactive" },
];

const INTEGRATIONS = [
  { name: "GitHub", description: "Code repositories and PR management", connected: true, icon: "🐙" },
  { name: "Slack", description: "Team notifications and alerts", connected: true, icon: "💬" },
  { name: "Jira", description: "Issue tracking and project management", connected: false, icon: "📋" },
  { name: "Notion", description: "Documentation and knowledge base", connected: false, icon: "📝" },
  { name: "Linear", description: "Issue tracking for engineering teams", connected: true, icon: "🔷" },
];

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (name: string) => {
    setShowKeys((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your ECHOMEN platform</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={fadeUp} className="flex gap-1 p-1 glass-panel rounded-xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute inset-0 rounded-lg bg-glass-hover border border-glass-border"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={fadeUp}>
        {activeTab === "general" && (
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground mb-4">General Settings</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground">Platform Name</label>
                  <input
                    defaultValue="ECHOMEN"
                    className="mt-1.5 w-full max-w-md h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Default Model</label>
                  <select className="mt-1.5 w-full max-w-md h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="gpt4o">GPT-4o</option>
                    <option value="claude">Claude 3.5 Sonnet</option>
                    <option value="gemini">Gemini Pro</option>
                  </select>
                </div>
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Use dark theme across the platform</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <p className="text-sm font-medium text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive alerts for agent events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-glass-border">
              <Button
                className="bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0"
                onClick={() => toast.success("Settings saved!")}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {activeTab === "api-keys" && (
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-foreground">API Keys</h3>
              <Button
                variant="outline"
                size="sm"
                className="border-glass-border bg-glass hover:bg-glass-hover text-foreground"
                onClick={() => toast.info("Feature coming soon")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Key
              </Button>
            </div>
            <div className="space-y-3">
              {API_KEYS.map((apiKey) => (
                <div key={apiKey.name} className="flex items-center justify-between p-4 rounded-lg bg-glass border border-glass-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${apiKey.status === "active" ? "bg-[oklch(0.7_0.17_165)]" : "bg-muted-foreground/50"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        {showKeys[apiKey.name] ? "sk-proj-abc123def456ghi789jkl0" : apiKey.key}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleKeyVisibility(apiKey.name)}
                    >
                      {showKeys[apiKey.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => toast.info("Feature coming soon")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <h3 className="font-display text-base font-semibold text-foreground">Integrations</h3>
            <div className="space-y-3">
              {INTEGRATIONS.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg bg-glass border border-glass-border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{integration.name}</p>
                        {integration.connected ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-[oklch(0.7_0.17_165)] bg-[oklch(0.7_0.17_165/10%)] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Connected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" /> Not connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-glass-border bg-glass hover:bg-glass-hover text-foreground"
                    onClick={() => toast.info("Feature coming soon")}
                  >
                    {integration.connected ? "Configure" : "Connect"}
                    <ExternalLink className="w-3 h-3 ml-1.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <h3 className="font-display text-base font-semibold text-foreground">Advanced Settings</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground">Max Concurrent Agents</label>
                <input
                  type="number"
                  defaultValue={10}
                  className="mt-1.5 w-full max-w-md h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Request Timeout (seconds)</label>
                <input
                  type="number"
                  defaultValue={30}
                  className="mt-1.5 w-full max-w-md h-10 rounded-lg bg-glass border border-glass-border px-3 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm font-medium text-foreground">Debug Mode</p>
                  <p className="text-xs text-muted-foreground">Enable verbose logging for troubleshooting</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Cleanup</p>
                  <p className="text-xs text-muted-foreground">Automatically clean up completed tasks after 24h</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="pt-4 border-t border-glass-border">
              <Button
                className="bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0"
                onClick={() => toast.success("Settings saved!")}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
