/*
 * DashboardLayout — "Glass Horizon" Design
 * Frosted glass sidebar + ambient background orbs + gradient accent lines
 * Mobile: hamburger overlay sidebar | Desktop: collapsible sidebar
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Code2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agents", label: "Agents", icon: Bot },
  { path: "/chat", label: "Chat", icon: MessageSquare },
  { path: "/code-summarizer", label: "Code Summarizer", icon: Code2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const sidebarContent = (
    <>
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-glass-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="overflow-hidden">
            <h1 className="font-display text-base font-bold tracking-tight text-foreground whitespace-nowrap">
              ECHOMEN
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">
              AI Platform
            </p>
          </div>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Tooltip key={item.path} delayDuration={collapsed && !isMobile ? 0 : 1000}>
              <TooltipTrigger asChild>
                <Link href={item.path}>
                  <motion.div
                    className={`
                      relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                      ${isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-glass-hover"
                      }
                    `}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-[oklch(0.55_0.2_270/15%)] to-[oklch(0.6_0.15_180/10%)] border border-[oklch(0.55_0.2_270/20%)]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className="w-5 h-5 shrink-0 relative z-10" />
                    {(!collapsed || isMobile) && (
                      <span className="relative z-10 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)]" />
                    )}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              {collapsed && !isMobile && (
                <TooltipContent side="right" className="glass-panel text-foreground border-glass-border">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      {!isMobile && (
        <div className="p-2 border-t border-glass-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-muted-foreground hover:text-foreground hover:bg-glass-hover"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-orb ambient-orb-violet w-[500px] h-[500px] -top-40 -left-40" />
        <div className="ambient-orb ambient-orb-blue w-[400px] h-[400px] top-1/3 right-[-100px]" style={{ animationDelay: "-7s" }} />
        <div className="ambient-orb ambient-orb-teal w-[350px] h-[350px] bottom-[-80px] left-1/3" style={{ animationDelay: "-14s" }} />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.aside
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as const }}
            className="relative flex flex-col h-full glass-panel border-r border-glass-border shrink-0 hidden md:flex"
          >
            {sidebarContent}
          </motion.aside>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as const }}
                className="fixed left-0 top-0 bottom-0 w-[260px] flex flex-col glass-panel border-r border-glass-border z-50"
                style={{ background: "oklch(0.12 0.02 260 / 95%)" }}
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header bar */}
          <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-glass-border glass-panel shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(true)}
                  className="text-muted-foreground hover:text-foreground hover:bg-glass-hover md:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="h-8 w-48 md:w-64 rounded-lg bg-glass border border-glass-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
                />
              </div>
              {/* Mobile: small search icon */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-glass-hover"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-glass-hover relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[oklch(0.6_0.2_15)]" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.2_270)] to-[oklch(0.6_0.15_180)] flex items-center justify-center text-xs font-bold text-white">
                K
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
