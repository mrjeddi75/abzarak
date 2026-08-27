"use client";

import { useAppStore } from "@/lib/store";
import { toolCategories } from "@/lib/tools-config";
import { Button } from "@/components/ui/button";
import { Search, X, Sun, Moon, Home, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const iconCache: Record<string, React.ComponentType<any>> = {};

function ToolIcon({ name, className }: { name: string; className?: string }) {
  if (!iconCache[name]) {
    iconCache[name] = (LucideIcons as any)[name];
  }
  const Icon = iconCache[name];
  return Icon ? <Icon className={className} /> : null;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const {
    activeTool,
    setActiveTool,
    theme,
    toggleTheme,
    expandedCategories,
    toggleCategory,
    sidebarSearch,
    setSidebarSearch,
  } = useAppStore();

  const filteredCategories = toolCategories.map((cat) => {
    if (cat.id === "home") return cat;
    const q = sidebarSearch.trim().toLowerCase();
    if (!q) return cat;
    const filtered = cat.tools.filter(
      (t) =>
        t.name.includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.description.includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.component.toLowerCase().includes(q)
    );
    return { ...cat, tools: filtered };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg font-extrabold gradient-text">ابزارک</h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-accent"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-yellow-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="جستجوی ابزار... (فارسی/انگلیسی)"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pr-9 pl-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
          />
          {sidebarSearch && (
            <button
              onClick={() => setSidebarSearch("")}
              className="absolute left-2 top-1/2 -translate-y-1/2"
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {/* Home button */}
        <button
          onClick={() => {
            setActiveTool("home");
            onClose?.();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeTool === "home"
              ? "bg-gradient-to-l from-primary/20 to-primary/10 text-primary border border-primary/20"
              : "hover:bg-accent text-foreground"
          )}
        >
          <Home className="h-4 w-4" />
          <span>خانه</span>
        </button>

        {/* Categories */}
        {filteredCategories.map((category) => {
          if (category.id === "home") return null;
          if (category.tools.length === 0 && sidebarSearch) return null;

          const isExpanded =
            sidebarSearch.length > 0 || expandedCategories.includes(category.id);
          const isActiveCategory = category.tools.some(
            (t) => t.id === activeTool
          );

          return (
            <div key={category.id} className="mt-0.5">
              <button
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                  isActiveCategory
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ToolIcon
                  name={category.icon}
                  className="h-3.5 w-3.5 shrink-0"
                />
                <span className="flex-1 text-right">{category.name}</span>
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full text-muted-foreground font-normal">
                  {category.tools.length}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="mr-2 mt-0.5 space-y-0.5 border-r border-border/50 pr-2">
                  {category.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool.id);
                        onClose?.();
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-200",
                        activeTool === tool.id
                          ? "bg-primary/15 text-primary font-medium"
                          : "text-foreground/70 hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <ToolIcon
                        name={tool.icon}
                        className="h-3.5 w-3.5 shrink-0"
                      />
                      <span className="truncate">{tool.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground text-center">
          ابزارک v5 — بیش از ۶۰ ابزار رایگان
        </p>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 glass-sidebar">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  if (!sidebarOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-72 glass-sidebar shadow-2xl animate-slide-in">
        <div className="absolute left-2 top-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
}
