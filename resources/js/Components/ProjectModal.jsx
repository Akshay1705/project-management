import { useEffect } from "react";

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_STYLES = {
    completed:  { bar: "bg-green-500",  badge: "border-green-400 text-green-600"   },
    active:     { bar: "bg-blue-500",   badge: "border-blue-400 text-blue-600"     },
    ongoing:    { bar: "bg-blue-500",   badge: "border-blue-400 text-blue-600"     },
    "on-hold":  { bar: "bg-orange-400", badge: "border-orange-400 text-orange-500" },
    inactive:   { bar: "bg-orange-400", badge: "border-orange-400 text-orange-500" },
    cancelled:  { bar: "bg-gray-400",   badge: "border-gray-400 text-gray-500"     },
    critical:   { bar: "bg-red-500",    badge: "border-red-400 text-red-500"       },
    postponed:  { bar: "bg-purple-400", badge: "border-purple-400 text-purple-500" },
    finished:   { bar: "bg-green-500",  badge: "border-green-400 text-green-600"   },
};

function getStatus(status) {
    return STATUS_STYLES[status?.toLowerCase()] ?? {
        bar: "bg-gray-300", badge: "border-gray-300 text-gray-500",
    };
}

// ─── Avatar stack ─────────────────────────────────────────────────────────────
const COLORS = ["bg-blue-400","bg-pink-400","bg-orange-400","bg-green-400","bg-purple-400","bg-cyan-400"];

function AvatarStack({ users = [], size = "md" }) {
    const sz = size === "lg" ? "h-9 w-9 text-xs" : "h-7 w-7 text-[10px]";
    const visible = users.slice(0, 4);
    const extra   = users.length - 4;
    return (
        <div className="flex items-center -space-x-2">
            {visible.map((u, i) => (
                <div key={u.id ?? i} title={u.name}
                    className={`${sz} rounded-full ${COLORS[i % COLORS.length]} border-2 border-white flex items-center justify-center text-white font-bold uppercase shrink-0`}>
                    {u.name?.charAt(0) ?? "?"}
                </div>
            ))}
            {extra > 0 && (
                <div className={`${sz} rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold shrink-0`}>
                    +{extra}
                </div>
            )}
            {/* Add button */}
            <button className="ml-2 h-7 w-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors text-sm">
                +
            </button>
        </div>
    );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, valueClass = "text-gray-800" }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 shrink-0">{icon}</span>
            <span className="text-gray-500 shrink-0">{label}</span>
            <span className={`font-medium ${valueClass}`}>{value ?? "—"}</span>
        </div>
    );
}

// ─── Right sidebar button ─────────────────────────────────────────────────────
function SideBtn({ icon, label }) {
    return (
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors text-left">
            <span className="text-gray-400">{icon}</span>
            {label}
        </button>
    );
}

// ─── Format date ──────────────────────────────────────────────────────────────
const fmt = (d) => d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function ProjectModal({ project, onClose }) {
    // Close on Escape
    useEffect(() => {
        const h = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [onClose]);

    if (!project) return null;

    const st    = getStatus(project.status);
    const total = project.tasks_count ?? 0;
    const done  = project.completed_tasks_count ?? 0;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                    {/* ── Cover banner ─────────────────────────────────── */}
                    <div className={`h-36 w-full relative shrink-0 ${st.bar} bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600`}>
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 text-lg transition-colors shadow"
                        >×</button>
                    </div>

                    {/* ── Scrollable body ───────────────────────────────── */}
                    <div className="flex flex-1 overflow-hidden">

                        {/* Left — main content */}
                        <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-5">

                            {/* Title + subtitle */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 leading-snug mb-1">
                                    {project.name}
                                </h2>
                                {project.team && (
                                    <p className="text-sm text-gray-500">
                                        In team <span className="text-blue-500 font-medium">{project.team.name}</span>
                                    </p>
                                )}
                            </div>

                            {/* Status badge */}
                            <div>
                                <span className={`inline-block border rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide bg-white ${st.badge}`}>
                                    {project.status}
                                </span>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-semibold text-gray-500">Progress</span>
                                    <span className="text-sm font-bold text-gray-800">{pct}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${st.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                </div>
                            </div>

                            {/* Due date */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Due date</p>
                                <div className="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {fmt(project.end_date)}
                                </div>
                            </div>

                            {/* Assignees */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Assignees</p>
                                <AvatarStack users={project.users ?? []} size="lg" />
                            </div>

                            {/* Tags / Labels */}
                            {project.tags?.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Labels</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag.id}
                                                className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-200 text-blue-600 bg-blue-50 uppercase tracking-wide">
                                                {tag.name}
                                            </span>
                                        ))}
                                        <button className="px-2.5 py-0.5 rounded-full text-xs text-gray-400 border border-dashed border-gray-300 hover:border-blue-300 hover:text-blue-400 transition-colors">
                                            + Add another
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    Description
                                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {project.description || <span className="italic text-gray-400">No description provided.</span>}
                                </p>
                            </div>

                            {/* Meta info */}
                            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                                <InfoRow
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                                    label="Client :"
                                    value={project.client?.name}
                                    valueClass="text-blue-500"
                                />
                                <InfoRow
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18" /></svg>}
                                    label="Budget :"
                                    value={project.budget ? `${Number(project.budget).toLocaleString()}$` : null}
                                />
                                <InfoRow
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                    label="Started :"
                                    value={fmt(project.start_date)}
                                />
                                <InfoRow
                                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                    label="Tasks :"
                                    value={`${done} / ${total} completed`}
                                />
                            </div>
                        </div>

                        {/* Right — sidebar */}
                        <div className="w-52 shrink-0 border-l border-gray-100 bg-gray-50/50 px-3 py-5 overflow-y-auto flex flex-col gap-6">

                            {/* Add to card */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">Add to card</p>
                                <div className="flex flex-col gap-0.5">
                                    <SideBtn label="Assignee"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                                    />
                                    <SideBtn label="Labels"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>}
                                    />
                                    <SideBtn label="Attachments"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656L5.757 10.757a6 6 0 008.486 8.486L20 13.485" /></svg>}
                                    />
                                    <SideBtn label="Checklist"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                                    />
                                    <SideBtn label="Dates"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">Actions</p>
                                <div className="flex flex-col gap-0.5">
                                    <SideBtn label="Move"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                    />
                                    <SideBtn label="Copy"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                                    />
                                    <SideBtn label="Remove"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                                    />
                                    <SideBtn label="Archive"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
                                    />
                                    <SideBtn label="Share"
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}