"use client";

import { useAppStore } from "@/lib/store";
import { DesktopSidebar, MobileSidebar } from "@/components/sidebar";
import ToolContent from "@/components/tool-content";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toggleSidebar, activeTool } = useAppStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DesktopSidebar />
      <MobileSidebar />

      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 glass-sidebar">
          <div className="flex items-center justify-between p-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-extrabold gradient-text">ابزارک</h1>
            <div className="w-9" />
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <ToolContent toolId={activeTool} />
        </div>
      </main>
    </div>
  );
}
