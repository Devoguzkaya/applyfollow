import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AlarmSystem from "@/components/AlarmSystem";
import { NotificationProvider } from "@/context/NotificationContext";
import FloatingAddButton from "@/components/applications/FloatingAddButton";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <NotificationProvider>
                <div className="flex h-screen overflow-hidden bg-background-dark text-slate-200 font-display">
                    <AlarmSystem />
                    <Sidebar />
                    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {/* Background Decor - Global for Dashboard */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

                        <Header />

                        {/* Page Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 relative z-0">
                            {children}
                        </div>

                        <FloatingAddButton />
                    </main>
                </div>
            </NotificationProvider>
        </ProtectedRoute>
    );
}
