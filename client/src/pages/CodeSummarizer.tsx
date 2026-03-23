/*
 * Code Summarizer — "Glass Horizon" Design
 * File/repo input, AI-powered analysis, structured summary output
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  FolderOpen,
  Play,
  FileCode,
  GitBranch,
  Layers,
  Clock,
  Sparkles,
  Copy,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const CODE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663083178937/BswsvvE8gzMytEWPKpnfeT/echomen-code-pattern-HpjWsftLHnUmm3HEbodAmm.webp";

const DEMO_SUMMARY = `## Project Summary: Echoctl

### Overview
**Echoctl** is a TypeScript-based CLI tool for AI-powered agent orchestration. It provides a command-line interface for managing AI providers, executing tasks, and synchronizing configurations.

### Architecture
The project follows a modular architecture with clear separation of concerns:

| Layer | Purpose | Key Files |
|-------|---------|-----------|
| **Commands** | CLI entry points | \`chat.ts\`, \`auth.ts\`, \`connect.ts\` |
| **Core** | BDI engine & orchestration | \`bdi-engine.ts\`, \`engine.ts\` |
| **Providers** | AI model integrations | \`openai.ts\`, \`base.ts\`, \`chain.ts\` |
| **Tools** | Tool execution framework | \`executor.ts\` |
| **Utils** | Configuration & helpers | \`config.ts\` |

### Key Patterns
- **Provider Chain**: Failover pattern across multiple AI providers
- **BDI Engine**: Belief-Desire-Intention architecture for agent reasoning
- **Tool Executor**: Extensible tool execution with sandboxed environments

### Dependencies
- \`commander\` for CLI parsing
- \`conf\` for persistent configuration
- \`chalk\` for terminal styling
- Custom AI provider integrations (OpenAI, Anthropic, Google)

### Metrics
- **Files**: 24 TypeScript files
- **Lines of Code**: ~3,200
- **Test Coverage**: Auth module tested, summarize module in progress
`;

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CodeSummarizer() {
  const [path, setPath] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!path.trim()) {
      toast.error("Please enter a file or directory path");
      return;
    }
    setIsAnalyzing(true);
    setSummary(null);

    // Simulate analysis
    setTimeout(() => {
      setSummary(DEMO_SUMMARY);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 2500);
  };

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={fadeUp} className="relative rounded-xl overflow-hidden h-40">
        <img src={CODE_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/50" />
        <div className="relative z-10 flex flex-col justify-center h-full px-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[oklch(0.55_0.2_270)]" />
            <span className="text-xs font-mono text-[oklch(0.55_0.2_270)] uppercase tracking-wider">AI-Powered</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Code Summarizer</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Analyze any codebase or file and get a structured, AI-generated summary with architecture insights, patterns, and metrics.
          </p>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div variants={fadeUp} className="glass-panel rounded-xl p-6">
        <h2 className="font-display text-base font-semibold text-foreground mb-4">Analyze a Codebase</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="Enter file or directory path (e.g., /src/core/engine.ts)"
              className="w-full h-11 rounded-lg bg-glass border border-glass-border pl-10 pr-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0 shadow-lg shadow-[oklch(0.55_0.2_270/20%)] h-11 px-6"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">Quick:</span>
          {["/src", "/src/core/engine.ts", "/tests"].map((preset) => (
            <button
              key={preset}
              onClick={() => setPath(preset)}
              className="text-xs font-mono px-2.5 py-1 rounded-md bg-glass border border-glass-border text-muted-foreground hover:text-foreground hover:border-[oklch(0.55_0.2_270/30%)] transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-xl p-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-glass-border" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[oklch(0.55_0.2_270)] animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[oklch(0.6_0.15_180)] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <Code2 className="absolute inset-0 m-auto w-6 h-6 text-[oklch(0.55_0.2_270)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Analyzing codebase...</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Reading files · Parsing AST · Generating summary</p>
            </div>
            <div className="w-64 h-1.5 rounded-full bg-glass overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)]"
                initial={{ width: "0%" }}
                animate={{ width: "85%" }}
                transition={{ duration: 2.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel rounded-xl overflow-hidden"
        >
          {/* Results header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] flex items-center justify-center">
                <FileCode className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">Analysis Results</h3>
                <p className="text-[11px] text-muted-foreground font-mono">{path || "/src"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-glass-hover text-xs"
                onClick={() => { navigator.clipboard.writeText(summary); toast.success("Copied to clipboard!"); }}
              >
                <Copy className="w-3 h-3 mr-1.5" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-glass-hover text-xs"
                onClick={() => toast.info("Feature coming soon")}
              >
                <Download className="w-3 h-3 mr-1.5" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 px-6 py-3 border-b border-glass-border bg-glass">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileCode className="w-3.5 h-3.5" />
              <span className="font-mono">24 files</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-mono">~3,200 LOC</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GitBranch className="w-3.5 h-3.5" />
              <span className="font-mono">5 modules</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">2.3s</span>
            </div>
          </div>

          {/* Summary content */}
          <div className="px-6 py-6 prose prose-invert prose-sm max-w-none
            prose-headings:font-display prose-headings:text-foreground
            prose-p:text-foreground/80 prose-p:leading-relaxed
            prose-a:text-[oklch(0.55_0.2_270)] prose-a:no-underline hover:prose-a:underline
            prose-code:text-[oklch(0.6_0.15_180)] prose-code:bg-glass prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-strong:text-foreground
            prose-th:text-foreground prose-th:font-display prose-th:border-glass-border
            prose-td:text-foreground/80 prose-td:border-glass-border
            prose-table:border-glass-border
          ">
            <Streamdown>{summary}</Streamdown>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
