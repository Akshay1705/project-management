import { useState } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";

const DashboardLayout = ({ children }) => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const navItems = [
        { name: "Projects", href: "/projects" },
        { name: "Tasks", href: "/tasks" },
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex min-h-screen bg-slate-50 text-slate-800">
                <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-sm">
                    <div className="mb-8 px-2">
                        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
                    </div>
                    
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setCurrentPath(item.href)}
                                    className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? "bg-yellow-100 text-yellow-500"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    {item.name}
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                <main className="ml-64 flex-1 p-8 transition-all duration-200">
                    <div className="max-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default DashboardLayout;
