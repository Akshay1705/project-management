import { useState, useMemo } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { List, LayoutGrid } from "lucide-react";
import ProjectModal from "@/Components/ProjectModal";


// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    completed: { bar: "bg-green-500", badge: "border-green-400 text-green-600", label: "COMPLETED" },
    active: { bar: "bg-blue-500", badge: "border-blue-400 text-blue-600", label: "ACTIVE" },
    ongoing: { bar: "bg-blue-500", badge: "border-blue-400 text-blue-600", label: "ONGOING" },
    "on-hold": { bar: "bg-orange-400", badge: "border-orange-400 text-orange-500", label: "INACTIVE" },
    inactive: { bar: "bg-orange-400", badge: "border-orange-400 text-orange-500", label: "INACTIVE" },
    cancelled: { bar: "bg-gray-400", badge: "border-gray-400 text-gray-500", label: "CANCELLED" },
    critical: { bar: "bg-red-500", badge: "border-red-400 text-red-500", label: "CRITICAL" },
    postponed: { bar: "bg-purple-400", badge: "border-purple-400 text-purple-500", label: "POSTPONED" },
    finished: { bar: "bg-green-500", badge: "border-green-400 text-green-600", label: "FINISHED" },
};

function getStatus(status) {
    return STATUS_STYLES[status?.toLowerCase()] ?? {
        bar: "bg-gray-300", badge: "border-gray-300 text-gray-500", label: status ?? "—"
    };
}

// ─── Avatar stack ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["bg-blue-400", "bg-pink-400", "bg-orange-400", "bg-green-400", "bg-purple-400"];

function AvatarStack({ users = [] }) {
    const visible = users.slice(0, 3);
    const extra = users.length - 3;
    return (
        <div className="flex items-center -space-x-2">
            {visible.map((u, i) => (
                <div key={u.id ?? i} title={u.name}
                    className={`h-7 w-7 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold uppercase`}>
                    {u.name?.charAt(0) ?? "?"}
                </div>
            ))}
            {extra > 0 && (
                <div className="h-7 w-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 text-[10px] font-bold">
                    +{extra}
                </div>
            )}
        </div>
    );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const TABS = ["All", "Ongoing", "Cancelled", "Finished", "Postponed"];
const TAB_MATCH = {
    ongoing: p => ["active", "ongoing"].includes(p.status?.toLowerCase()),
    cancelled: p => p.status?.toLowerCase() === "cancelled",
    finished: p => ["completed", "finished"].includes(p.status?.toLowerCase()),
    postponed: p => ["on-hold", "postponed"].includes(p.status?.toLowerCase()),
};

// ─── Single Project Card ──────────────────────────────────────────────────────
function ProjectCard({ project, onDelete, onOpen }) {
    const st = getStatus(project.status);
    const total = project.tasks_count ?? 0;
    const done = project.completed_tasks_count ?? 0;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const fmt = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
              })
            : "—";

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col p-5 gap-3">
            {/* Title */}
            {/* Title row + > button */}
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                    {project.name}
                </h3>
                <button
                    onClick={() => onOpen(project)}
                    className="shrink-0 h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm"
                    title="View details"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>

            {/* Status badge */}
            <div>
                <span
                    className={`inline-block border rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${st.badge}`}
                >
                    {st.label}
                </span>
            </div>

            {/* Client + Budget */}
            <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                    {/* person icon */}
                    <svg
                        className="w-3.5 h-3.5 text-gray-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <span>Client :</span>
                    <span className="text-blue-500 font-medium truncate">
                        {project.client?.name ?? "—"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    {/* budget icon */}
                    <svg
                        className="w-3.5 h-3.5 text-gray-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h18M3 6h18M3 14h18M3 18h18"
                        />
                    </svg>
                    <span>Budget :</span>
                    <span className="font-medium text-gray-800">
                        {project.budget
                            ? `${Number(project.budget).toLocaleString()}$`
                            : "—"}
                    </span>
                </div>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-gray-700">
                        {pct}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${st.bar} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* Dates */}
            <div className="text-xs text-gray-500 flex flex-col gap-0.5">
                <span>
                    <span className="font-medium text-gray-600">Started :</span>{" "}
                    {fmt(project.start_date)}
                </span>
                <span>
                    <span className="font-medium text-gray-600">
                        Deadline :
                    </span>{" "}
                    {fmt(project.end_date)}
                </span>
            </div>

            {/* Footer: avatars + task count + actions */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                <AvatarStack users={project.users ?? []} />

                <div className="flex items-center gap-3">
                    {/* Task count */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 10h16M4 14h8"
                            />
                        </svg>
                        {total} Task
                    </div>

                    {/* Edit / Delete */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/projects/${project.id}/edit`}
                            className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete(project.id, project.name)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main CardView Page ───────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8;


export default function CardView({ projects = [] }) {
    const [tab, setTab] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const currentPath = window.location.pathname;
    const { auth } = usePage().props;
    const permissions = auth.user.permissions || [];
    const [selectedProject, setSelectedProject] = useState(null);


    const handleDelete = (id, name) => {
        if (confirm(`Delete "${name}"?`)) {
            router.delete(`/projects/${id}`, { preserveScroll: true });
        }
    };

    const counts = useMemo(() => ({
        All: projects.length,
        Ongoing: projects.filter(TAB_MATCH.ongoing).length,
        Cancelled: projects.filter(TAB_MATCH.cancelled).length,
        Finished: projects.filter(TAB_MATCH.finished).length,
        Postponed: projects.filter(TAB_MATCH.postponed).length,
    }), [projects]);

    const filtered = useMemo(() => {
        let list = [...projects];
        if (tab !== "All") {
            const fn = TAB_MATCH[tab.toLowerCase()];
            if (fn) list = list.filter(fn);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p => p.name?.toLowerCase().includes(q));
        }
        return list;
    }, [projects, tab, search]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 px-8 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm mb-3">
                    <Link href="#" className="text-blue-600 hover:underline">
                        Page 1
                    </Link>
                    <span className="text-gray-400">›</span>
                    <Link href="#" className="text-blue-600 hover:underline">
                        Page 2
                    </Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-500">Default</span>
                </nav>

                {/* Title row */}
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Projects
                        <span className="ml-2 text-2xl font-bold text-gray-500">
                            ({projects.length})
                        </span>
                    </h1>
                    <Link
                        href="/projects/create"
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        <span className="text-lg leading-none">+</span> Add new
                        project
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 flex-wrap">
                        {TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => {
                                    setTab(t);
                                    setPage(1);
                                }}
                                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors
                                    ${tab === t ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-800"}`}
                            >
                                {t}
                                <span
                                    className={`ml-1 text-xs ${tab === t ? "text-blue-500" : "text-gray-400"}`}
                                >
                                    ({counts[t]})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search + view toggles */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-52">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search projects"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-3 py-2 border-gray-200 rounded-lg bg-white border !ring-0 !shadow-none"
                            />
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center p-0.5 gap-0.5">
                            <Link
                                href="/projects"
                                className={`p-2 rounded-md transition-colors tooltip-group relative
            ${
                currentPath === "/projects"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
                            >
                                {/* List icon */}
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                    />
                                </svg>
                            </Link>

                            <Link
                                href="/projects/card"
                                className={`p-2 rounded-md transition-colors relative
            ${
                currentPath === "/projects/card"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
                            >
                                {/* Grid icon */}
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 5h6v6H4zm10 0h6v6h-6zM4 15h6v6H4zm10 0h6v6h-6z"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Cards grid */}
                {paginated.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm">
                        No projects found.{" "}
                        {permissions.includes("create projects") && (
                            <Link
                                href="/projects/create"
                                className="text-blue-500 hover:underline"
                            >
                                Create one
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {paginated.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onDelete={handleDelete}
                                onOpen={setSelectedProject}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {filtered.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between mt-6 bg-white rounded-xl px-4 py-3 shadow-sm">
                        <p className="text-sm text-gray-500">
                            {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                            {Math.min(page * ITEMS_PER_PAGE, filtered.length)}{" "}
                            Items of {filtered.length}
                            <button
                                onClick={() => setPage(1)}
                                className="text-blue-500 hover:underline text-sm ml-2"
                            >
                                View all &rsaquo;
                            </button>
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                                ‹
                            </button>
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium
                                        ${n === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </DashboardLayout>
    );
}