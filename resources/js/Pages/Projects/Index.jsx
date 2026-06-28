import { useState, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { List, LayoutGrid } from "lucide-react";


// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_STYLES = {
    completed: "border border-green-400 text-green-600 bg-white",
    active: "border border-blue-400 text-blue-600 bg-white",
    ongoing: "border border-blue-400 text-blue-600 bg-white",
    "on-hold": "border border-orange-400 text-orange-500 bg-white",
    inactive: "border border-orange-400 text-orange-500 bg-white",
    cancelled: "border border-gray-400 text-gray-500 bg-white",
    critical: "border border-red-400 text-red-500 bg-white",
    postponed: "border border-purple-400 text-purple-500 bg-white",
    finished: "border border-green-400 text-green-600 bg-white",
};

function StatusBadge({ status }) {
    const s = status?.toLowerCase() || "active";
    return (
        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[s] || "border border-gray-300 text-gray-500 bg-white"}`}>
            {status}
        </span>
    );
}

// ─── Avatar stack ─────────────────────────────────────────────────────────────
function AvatarStack({ users = [] }) {
    const visible = users.slice(0, 3);
    const extra = users.length - 3;
    const colors = ["bg-blue-400", "bg-pink-400", "bg-orange-400", "bg-green-400", "bg-purple-400"];
    return (
        <div className="flex items-center -space-x-2">
            {visible.map((u, i) => (
                <div
                    key={u.id ?? i}
                    title={u.name}
                    className={`h-7 w-7 rounded-full ${colors[i % colors.length]} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold uppercase`}
                >
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

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ done, total }) {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const color = pct === 100 ? "bg-green-500" : pct > 50 ? "bg-green-400" : "bg-green-300";
    return (
        <div>
            <span className="text-xs text-gray-500">{done} / {total}</span>
            <div className="mt-1 h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDir }) {
    return (
        <span className="ml-1 inline-flex flex-col leading-none text-gray-400">
            <span className={`text-[9px] ${sortField === field && sortDir === "asc" ? "text-blue-600" : ""}`}>▲</span>
            <span className={`text-[9px] ${sortField === field && sortDir === "desc" ? "text-blue-600" : ""}`}>▼</span>
        </span>
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

// ─── Main Index ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;


export default function Index({ projects = [] }) {
    const [tab, setTab] = useState("All");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);
    const currentPath = window.location.pathname;

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/projects/${id}`, { preserveScroll: true });
        }
    };

    const handleSort = (field) => {
        if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("asc"); }
        setPage(1);
    };

    // Tab counts
    const counts = useMemo(() => ({
        All: projects.length,
        Ongoing: projects.filter(TAB_MATCH.ongoing).length,
        Cancelled: projects.filter(TAB_MATCH.cancelled).length,
        Finished: projects.filter(TAB_MATCH.finished).length,
        Postponed: projects.filter(TAB_MATCH.postponed).length,
    }), [projects]);

    // Filter → search → sort → paginate
    const filtered = useMemo(() => {
        let list = [...projects];

        // Tab filter
        if (tab !== "All") {
            const fn = TAB_MATCH[tab.toLowerCase()];
            if (fn) list = list.filter(fn);
        }

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p => p.name?.toLowerCase().includes(q));
        }

        // Sort
        if (sortField) {
            list.sort((a, b) => {
                let av = a[sortField] ?? "", bv = b[sortField] ?? "";
                if (typeof av === "string") av = av.toLowerCase();
                if (typeof bv === "string") bv = bv.toLowerCase();
                if (av < bv) return sortDir === "asc" ? -1 : 1;
                if (av > bv) return sortDir === "asc" ? 1 : -1;
                return 0;
            });
        }

        return list;
    }, [projects, tab, search, sortField, sortDir]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const ThCol = ({ field, label }) => (
        <th
            className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-gray-700"
            onClick={() => handleSort(field)}
        >
            {label}
            <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
        </th>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 px-8 py-6">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm mb-3">
                    <Link href="#" className="text-blue-600 hover:underline">Page 1</Link>
                    <span className="text-gray-400">›</span>
                    <Link href="#" className="text-blue-600 hover:underline">Page 2</Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-500">Default</span>
                </nav>

                {/* Title row */}
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Projects
                        <span className="ml-2 text-2xl font-bold text-gray-500">({projects.length})</span>
                    </h1>
                    <Link
                        href="/projects/create"
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        <span className="text-lg leading-none">+</span> Add new project
                    </Link>
                </div>

                {/* Toolbar: tabs + search */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 flex-wrap">
                        {TABS.map(t => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setPage(1); }}
                                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors
                                    ${tab === t
                                        ? "text-blue-600 font-bold"
                                        : "text-gray-500 hover:text-gray-800"}`}
                            >
                                {t}
                                <span className={`ml-1 text-xs ${tab === t ? "text-blue-500" : "text-gray-400"}`}>
                                    ({counts[t]})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search + view toggles */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-52">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search projects"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-3 py-2 border-gray-200 border rounded-lg bg-white !ring-0 !shadow-none"
                            />
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center gap-1">
                            {/* List view */}
                            <Link href={route('projects.index')}>
                                <button className={`p-2 rounded-lg border transition-colors ${currentPath === "/projects"
                                        ? "bg-gray-800 text-white border-gray-800"
                                        : "bg-white text-gray-500 border-gray-200"
                                    }`}>
                                    <List size={16} />
                                </button>
                            </Link>

                            <Link href={route('projects.card')}>
                                <button className={`p-2 rounded-lg border transition-colors ${currentPath === "/projects/card"
                                        ? "bg-gray-800 text-white border-gray-800"
                                        : "bg-white text-gray-500 border-gray-200"
                                    }`}>
                                    <LayoutGrid size={16} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {paginated.length === 0 ? (
                        <div className="py-20 text-center text-gray-400 text-sm">
                            No projects found.{" "}
                            <Link href="/projects/create" className="text-blue-500 hover:underline">Create one</Link>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <ThCol field="name" label="Project Name" />
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Assignees</th>
                                    <ThCol field="start_date" label="Start Date" />
                                    <ThCol field="end_date" label="Deadline" />
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Task</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                                    <ThCol field="status" label="Status" />
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginated.map(project => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Project Name */}
                                        <td className="px-4 py-4">
                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="text-blue-600 hover:underline font-medium text-sm"
                                            >
                                                {project.name}
                                            </Link>
                                        </td>

                                        {/* Assignees */}
                                        <td className="px-4 py-4">
                                            <AvatarStack users={project.users ?? []} />
                                        </td>

                                        {/* Start Date */}
                                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {project.start_date
                                                ? new Date(project.start_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                                                : "—"}
                                        </td>

                                        {/* Deadline */}
                                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {project.end_date
                                                ? new Date(project.end_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                                                : "—"}
                                        </td>

                                        {/* Task count */}
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {project.tasks_count ?? project.tasks?.length ?? 0}
                                        </td>

                                        {/* Progress */}
                                        <td className="px-4 py-4">
                                            <ProgressBar
                                                done={project.completed_tasks_count ?? 0}
                                                total={project.tasks_count ?? project.tasks?.length ?? 0}
                                            />
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <StatusBadge status={project.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link
                                                    href={`/projects/${project.id}/edit`}
                                                    className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id, project.name)}
                                                    className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {filtered.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} Items of {filtered.length}
                                {" "}
                                <button onClick={() => setPage(1)} className="text-blue-500 hover:underline text-sm ml-1">
                                    View all &rsaquo;
                                </button>
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                >‹</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setPage(n)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                                            ${n === page
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                >›</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}