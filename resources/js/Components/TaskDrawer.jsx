import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const STATUS_STYLES = {
    draft: "bg-blue-50 text-blue-600 border-blue-200",
    todo: "bg-gray-100 text-gray-600 border-gray-200",
    "on process": "bg-cyan-50 text-cyan-600 border-cyan-200",
    in_progress: "bg-cyan-50 text-cyan-600 border-cyan-200",
    urgent: "bg-orange-50 text-orange-500 border-orange-200",
    completed: "bg-green-50 text-green-600 border-green-200",
    "on-hold": "bg-yellow-50 text-yellow-600 border-yellow-200",
    cancelled: "bg-red-50 text-red-500 border-red-200",
};

const PRIORITY_STYLES = {
    low: "bg-gray-100 text-gray-500 border-gray-200",
    medium: "bg-orange-50 text-orange-500 border-orange-200",
    high: "bg-red-50 text-red-500 border-red-200",
    urgent: "bg-red-100 text-red-700 border-red-300",
};

function Badge({ styleMap, value }) {
    const key = value?.toLowerCase() ?? "";
    const cls = styleMap[key] ?? "bg-gray-100 text-gray-500 border-gray-200";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${cls}`}
        >
            {value}
        </span>
    );
}

function InfoRow({ label, children }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <span className="w-28 shrink-0 text-[11px] font-semibold text-gray-400 uppercase tracking-wide pt-0.5">
                {label}
            </span>
            <div className="flex-1 text-sm text-gray-700">{children}</div>
        </div>
    );
}

function Avatar({ user }) {
    const initials =
        user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "?";
    return (
        <div
            title={user?.name}
            className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white select-none"
        >
            {initials}
        </div>
    );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const XIcon = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);
const EditIcon = () => (
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
    </svg>
);
const CalIcon = () => (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);
const FolderIcon = () => (
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
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
    </svg>
);
const TrashIcon = () => (
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    </svg>
);
const PlusIcon = () => (
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
            d="M12 5v14m-7-7h14"
        />
    </svg>
);

// ── Subtask checkbox row ───────────────────────────────────────────────────────
function SubtaskRow({
    subtask,
    taskId,
    onOptimisticToggle,
    onOptimisticDelete,
}) {
    const isTemp = String(subtask.id).startsWith("temp-");

    const toggle = () => {
        if (isTemp) return; // block until real ID arrives
        onOptimisticToggle(subtask.id);
        router.patch(
            route("subtasks.update", [taskId, subtask.id]),
            { is_done: !subtask.is_done },
            { preserveScroll: true, preserveState: true },
        );
    };

    const remove = () => {
        if (isTemp) return;
        if (!confirm(`Delete subtask "${subtask.title}"?`)) return;
        onOptimisticDelete(subtask.id);
        router.delete(route("subtasks.destroy", [taskId, subtask.id]), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div
            className={`flex items-center gap-3 py-2 group ${isTemp ? "opacity-50" : ""}`}
        >
            <div
                onClick={toggle}
                className={`h-4 w-4 rounded-md border-2 cursor-pointer shrink-0 flex items-center justify-center transition-colors
                    ${
                        subtask.is_done
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 bg-white hover:border-blue-400"
                    }`}
            >
                {subtask.is_done && (
                    <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </div>
            <span
                className={`flex-1 text-sm ${subtask.is_done ? "line-through text-gray-400" : "text-gray-700"}`}
            >
                {subtask.title}
            </span>
            <button
                onClick={remove}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
                <TrashIcon />
            </button>
        </div>
    );
}

// ── Add subtask inline form ────────────────────────────────────────────────────
function AddSubtaskForm({ taskId, onOptimisticAdd }) {
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const tempId = `temp-${Date.now()}`;
        onOptimisticAdd({ id: tempId, title, is_done: false });

        router.post(
            route("subtasks.store", taskId),
            { title },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    router.reload({
                        only: ["tasks"],
                        preserveScroll: true,
                        preserveState: true,
                    });
                },
            },
        );

        setTitle("");
        setAdding(false);
    };

    if (!adding) {
        return (
            <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors mt-2"
            >
                <PlusIcon /> Add subtask
            </button>
        );
    }

    return (
        <form onSubmit={submit} className="flex items-center gap-2 mt-2">
            <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                    if (!title.trim()) setAdding(false);
                }}
                placeholder="Subtask title..."
                className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
            <button
                type="submit"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
                Add
            </button>
        </form>
    );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
export default function TaskDrawer({ task, onClose, permissions = [] }) {
    const [visible, setVisible] = useState(false);
    const [subtasks, setSubtasks] = useState(task.subtasks ?? []);

    // Sync subtasks when task prop updates (after Inertia refetch)
    useEffect(() => {
        setSubtasks(task.subtasks ?? []);
    }, [task.subtasks]);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 250);
    };

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    // ── Optimistic update helpers ──────────────────────────────────────────────
    const optimisticToggle = (id) => {
        setSubtasks((prev) =>
            prev.map((s) => (s.id === id ? { ...s, is_done: !s.is_done } : s)),
        );
    };
    const optimisticDelete = (id) => {
        setSubtasks((prev) => prev.filter((s) => s.id !== id));
    };
    const optimisticAdd = (newSubtask) => {
        setSubtasks((prev) => [...prev, newSubtask]);
    };

    const doneCount = subtasks.filter((s) => s.is_done).length;

    return (
        <>
            {/* Invisible backdrop — click outside to close */}
            <div className="fixed inset-0 z-40" onClick={handleClose} />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-14 bottom-0 z-50 w-[440px] bg-white shadow-2xl flex flex-col
                transition-transform duration-[250ms] ease-in-out
                ${visible ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Badge value={task.status} styleMap={STATUS_STYLES} />
                        <Badge
                            value={task.priority}
                            styleMap={PRIORITY_STYLES}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {permissions.includes("edit tasks") && (
                            <Link
                                href={route("tasks.edit", task.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <EditIcon /> Edit
                            </Link>
                        )}
                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <XIcon />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-6 leading-snug">
                        {task.title}
                    </h2>

                    {/* Info rows */}
                    <div className="mb-6">
                        {task.project && (
                            <InfoRow label="Project">
                                <span className="flex items-center gap-1.5 text-blue-600">
                                    <FolderIcon />
                                    {task.project?.name ?? "—"}
                                </span>
                            </InfoRow>
                        )}

                        <InfoRow label="Assigned to">
                            {task.assignedUser ? (
                                <div className="flex items-center gap-1.5">
                                    <Avatar user={task.assignedUser} />
                                    <span className="text-sm text-gray-700">
                                        {task.assignedUser.name}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400">
                                    Unassigned
                                </span>
                            )}
                        </InfoRow>

                        <InfoRow label="Due date">
                            <span className="flex items-center gap-1.5 text-gray-700">
                                <CalIcon />
                                {fmtDate(task.due_date)}
                            </span>
                        </InfoRow>

                        <InfoRow label="Created">
                            <span className="flex items-center gap-1.5 text-gray-500">
                                <CalIcon />
                                {fmtDate(task.created_at)}
                            </span>
                        </InfoRow>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            Description
                        </p>
                        {task.description ? (
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {task.description}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic">
                                No description provided.
                            </p>
                        )}
                    </div>

                    {/* ── Subtasks ── */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                                Subtasks
                            </p>
                            {subtasks.length > 0 && (
                                <span className="text-xs text-gray-400">
                                    {doneCount} / {subtasks.length}
                                </span>
                            )}
                        </div>

                        {/* Progress bar */}
                        {subtasks.length > 0 && (
                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{
                                        width: `${(doneCount / subtasks.length) * 100}%`,
                                    }}
                                />
                            </div>
                        )}

                        <div className="divide-y divide-gray-50">
                            {subtasks.map((s) => (
                                <SubtaskRow
                                    key={s.id}
                                    subtask={s}
                                    taskId={task.id}
                                    onOptimisticToggle={optimisticToggle}
                                    onOptimisticDelete={optimisticDelete}
                                />
                            ))}
                        </div>

                        <AddSubtaskForm
                            taskId={task.id}
                            onOptimisticAdd={optimisticAdd}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        Task #{task.id}
                    </span>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
