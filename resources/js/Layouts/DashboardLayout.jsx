import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import Logo from "@/assets/logo_pm.png";
import { usePage } from "@inertiajs/react";

// ─── Icons (inline SVG to avoid any icon lib dependency) ──────────────────────
const Icon = {
    Folder: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
    ),
    Task: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    ),
    ChevronDown: () => (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    ),
    ChevronRight: () => (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    ),
    Search: () => (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
    ),
    Bell: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    ),
    Grid: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 12h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
        </svg>
    ),
    Collapse: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
        </svg>
    ),
};

// ─── Single nav item ──────────────────────────────────────────────────────────
function NavItem({ item, currentPath }) {
    const hasChildren = item.children?.length > 0;
    const isChildActive = hasChildren && item.children.some(c => currentPath.startsWith(c.href));
    const [open, setOpen] = useState(isChildActive);

    if (!hasChildren) {
        const isActive = currentPath === item.href;
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
            >
                <span className={isActive ? "text-blue-500" : "text-gray-400"}>{item.icon}</span>
                {item.label}
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isChildActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
            >
                <span className={isChildActive ? "text-blue-500" : "text-gray-400"}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""} text-gray-400`}>
                    <Icon.ChevronDown />
                </span>
            </button>

            {open && (
                <div className="ml-7 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-3">
                    {item.children.map(child => {
                        const isActive = currentPath === child.href;
                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                className={`block px-2 py-1.5 rounded-md text-sm transition-colors
                                    ${isActive
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
                            >
                                {child.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const currentPath = window.location.pathname;
    const [collapsed, setCollapsed] = useState(false);
    const [search, setSearch] = useState("");

    // ─── Sidebar nav data ─────────────────────────────────────────────────────────
    const permissions = auth.user?.permissions || [];

    const NAV = [
        {
            label: "Project Management",
            icon: <Icon.Folder />,
            children: [
                ...(permissions.includes("create projects")
                    ? [{ label: "Create new", href: "/projects/create" }]
                    : []),

                { label: "Project list view", href: "/projects" },
                { label: "Project card view", href: "/projects/card" },
                // { label: "Project board view", href: "/projects?view=board" },
                // { label: "Project details", href: "/projects/details" },
            ],
        },

        {
            label: "Tasks",
            icon: <Icon.Task />,
            children: [
                { label: "All Tasks", href: "/tasks" },
                { label: "My Tasks", href: "/tasks/mine" },

                ...(permissions.includes("create tasks")
                    ? [{ label: "Create Task", href: "/tasks/create" }]
                    : []),
            ],
        },
    ];

    const handleLogout = () => {
        router.post(route("logout"));
    };

    // Avatar initials fallback
    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <div className="flex min-h-screen bg-gray-100 text-gray-800">
            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside
                className={`fixed left-0 top-[60px] bottom-0 z-30
                flex flex-col border-r border-gray-200 bg-white
                ${collapsed ? "w-16" : "w-66"}`}
            >
                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-2  py-4 space-y-.5">
                    {!collapsed &&
                        NAV.map((item, i) => (
                            <NavItem
                                key={i}
                                item={item}
                                currentPath={currentPath}
                            />
                        ))}
                    {collapsed &&
                        NAV.map((item, i) => (
                            <Link
                                key={i}
                                href={
                                    item.href || item.children?.[0]?.href || "#"
                                }
                                title={item.label}
                                className="flex items-center justify-center p-2.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            >
                                {item.icon}
                            </Link>
                        ))}
                </nav>

                {/* Collapse toggle */}
                <div className="border-t border-gray-100 p-3">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors
                            ${collapsed ? "justify-center" : ""}`}
                    >
                        <span
                            className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
                        >
                            <Icon.Collapse />
                        </span>
                        {!collapsed && "Collapsed View"}
                    </button>
                </div>
            </aside>

            {/* ── Main area ───────────────────────────────────────────────── */}
            <div
                className={`flex flex-1 flex-col pt-[60px] transition-all duration-200
                    ${collapsed ? "ml-16" : "ml-56"}`}
            >
                {/* ── Top Nav ─────────────────────────────────────────────── */}
                <header className="fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between border-b border-gray-200 bg-white px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src={Logo}
                            alt="phoenix"
                            className="w-[30px] h-[30px] object-contain"
                        />

                        <span className="text-[22px] font-semibold text-slate-500">
                            phoenix
                        </span>
                    </div>
                    {/* Search */}
                    <div className="flex items-center gap-2 w-[400px] rounded-full border border-gray-200 bg-white px-4">
                        <Icon.Search />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent !border-0 focus:!border-0 outline-none ring-0 focus:ring-0 shadow-none text-sm text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Notification bell */}
                        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <Icon.Bell />
                            {/* Dot */}
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
                        </button>

                        {/* Grid / apps */}
                        {/* <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <Icon.Grid />
                        </button> */}

                        {/* Profile dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 rounded-lg hover:bg-gray-100 p-1.5 transition-colors">
                                        {/* Avatar circle with initials */}
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold select-none">
                                            {initials}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* ── Page content ─────────────────────────────────────────── */}
                <main className="max-auto max-w-7xl">{children}</main>
            </div>
        </div>
    );
}