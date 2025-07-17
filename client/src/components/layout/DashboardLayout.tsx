import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}