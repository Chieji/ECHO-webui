/*
 * Code Summarizer — "Glass Horizon" Design
 * Paste code or enter file path, AI-powered analysis via tRPC backend
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Play,
  FileCode,
  Layers,
  Clock,
  Sparkles,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const CODE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663083178937/BswsvvE8gzMytEWPKpnfeT/echomen-code-pattern-HpjWsftLHnUmm3HEbodAmm.webp";

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface AnalysisResult {
  overview: string;
  language: string;
  complexity: string;
  functions: Array<{ name: string; description: string; lineCount: number }>;
  dependencies: string[];
  suggestions: string[];
  securityIssues: string[];
  linesOfCode: number;
}

export default function CodeSummarizer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeMutation = trpc.summarizer.analyze.useMutation({
    onSuccess: (data) => {
      setResult(data as AnalysisResult);
      toast.success("Analysis complete!");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast.error("Please paste some code to analyze");
      return;
    }
    setResult(null);
    analyzeMutation.mutate({
      code: code.trim(),
      language,
      fileName: fileName.trim() || undefined,
    });
  };

  const complexityColor = (c: string) => {
    if (c === "low") return "text-[oklch(0.7_0.17_165)]";
    if (c === "medium") return "text-[oklch(0.75_0.15_80)]";
    return "text-[oklch(0.6_0.2_15)]";
  };

  // Build a markdown summary from the structured result
  const buildMarkdown = (r: AnalysisResult) => {
    let md = `## Analysis Summary\n\n**${r.overview}**\n\n`;
    md += `| Metric | Value |\n|--------|-------|\n`;
    md += `| Language | ${r.language} |\n`;
    md += `| Complexity | ${r.complexity} |\n`;
    md += `| Lines of Code | ~${r.linesOfCode} |\n`;
    md += `| Functions | ${r.functions.length} |\n`;
    md += `| Dependencies | ${r.dependencies.length} |\n\n`;

    if (r.functions.length > 0) {
      md += `### Functions\n\n`;
      md += `| Name | Description | Lines |\n|------|-------------|-------|\n`;
      for (const fn of r.functions) {
        md += `| \`${fn.name}\` | ${fn.description} | ${fn.lineCount} |\n`;
      }
      md += `\n`;
    }

    if (r.dependencies.length > 0) {
      md += `### Dependencies\n\n`;
      md += r.dependencies.map((d) => `- \`${d}\``).join("\n") + "\n\n";
    }

    if (r.suggestions.length > 0) {
      md += `### Suggestions\n\n`;
      md += r.suggestions.map((s) => `- ${s}`).join("\n") + "\n\n";
    }

    if (r.securityIssues.length > 0) {
      md += `### Security Issues\n\n`;
      md += r.securityIssues.map((s) => `- ${s}`).join("\n") + "\n";
    }

    return md;
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
            Paste any code snippet and get a structured AI-generated analysis with architecture insights, patterns, and security review.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Also available via CLI: <code className="font-mono text-[oklch(0.55_0.2_270)] bg-glass px-1.5 py-0.5 rounded">echoctl summarize &lt;path&gt;</code>
          </p>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div variants={fadeUp} className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="font-display text-base font-semibold text-foreground">Analyze Code</h2>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">File Name (optional)</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., engine.ts"
              className="w-full h-9 rounded-lg bg-glass border border-glass-border px-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="w-40">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-9 rounded-lg bg-glass border border-glass-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option>TypeScript</option>
              <option>JavaScript</option>
              <option>Python</option>
              <option>Rust</option>
              <option>Go</option>
              <option>Java</option>
              <option>C++</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={10}
            className="w-full rounded-lg bg-glass border border-glass-border px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={analyzeMutation.isPending || !code.trim()}
          className="bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] hover:opacity-90 text-white border-0 shadow-lg shadow-[oklch(0.55_0.2_270/20%)] h-11 px-6"
        >
          {analyzeMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Analyze Code
            </>
          )}
        </Button>
      </motion.div>

      {/* Loading State */}
      {analyzeMutation.isPending && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-glass-border" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[oklch(0.55_0.2_270)] animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[oklch(0.6_0.15_180)] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <Code2 className="absolute inset-0 m-auto w-6 h-6 text-[oklch(0.55_0.2_270)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Analyzing code...</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Parsing · Identifying patterns · Generating summary</p>
            </div>
            <div className="w-64 h-1.5 rounded-full bg-glass overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)]"
                initial={{ width: "0%" }}
                animate={{ width: "85%" }}
                transition={{ duration: 4, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel rounded-xl p-4 text-center">
              <FileCode className="w-5 h-5 text-[oklch(0.55_0.2_270)] mx-auto mb-1" />
              <p className="text-lg font-display font-bold text-foreground">{result.language}</p>
              <p className="text-[10px] text-muted-foreground">Language</p>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center">
              <Layers className="w-5 h-5 text-[oklch(0.6_0.15_180)] mx-auto mb-1" />
              <p className="text-lg font-display font-bold text-foreground">~{result.linesOfCode}</p>
              <p className="text-[10px] text-muted-foreground">Lines of Code</p>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 text-[oklch(0.75_0.15_80)] mx-auto mb-1" />
              <p className={`text-lg font-display font-bold ${complexityColor(result.complexity)}`}>{result.complexity}</p>
              <p className="text-[10px] text-muted-foreground">Complexity</p>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center">
              {result.securityIssues.length > 0 ? (
                <ShieldAlert className="w-5 h-5 text-[oklch(0.6_0.2_15)] mx-auto mb-1" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[oklch(0.7_0.17_165)] mx-auto mb-1" />
              )}
              <p className="text-lg font-display font-bold text-foreground">{result.securityIssues.length}</p>
              <p className="text-[10px] text-muted-foreground">Security Issues</p>
            </div>
          </div>

          {/* Full analysis */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] flex items-center justify-center">
                  <FileCode className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">Full Analysis</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">{fileName || "untitled"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-glass-hover text-xs"
                  onClick={() => { navigator.clipboard.writeText(buildMarkdown(result)); toast.success("Copied!"); }}
                >
                  <Copy className="w-3 h-3 mr-1.5" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-glass-hover text-xs"
                  onClick={() => toast.info("Export feature coming soon")}
                >
                  <Download className="w-3 h-3 mr-1.5" />
                  Export
                </Button>
              </div>
            </div>

            {/* Suggestions highlight */}
            {result.suggestions.length > 0 && (
              <div className="px-6 py-3 border-b border-glass-border bg-[oklch(0.75_0.15_80/5%)]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[oklch(0.75_0.15_80)]" />
                  <span className="text-xs font-medium text-[oklch(0.75_0.15_80)]">Suggestions</span>
                </div>
                <ul className="space-y-1">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-xs text-foreground/80 pl-6">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="px-6 py-6 prose prose-invert prose-sm max-w-none
              prose-headings:font-display prose-headings:text-foreground
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-code:text-[oklch(0.6_0.15_180)] prose-code:bg-glass prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-strong:text-foreground
              prose-th:text-foreground prose-th:font-display prose-th:border-glass-border
              prose-td:text-foreground/80 prose-td:border-glass-border
            ">
              <Streamdown>{buildMarkdown(result)}</Streamdown>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
