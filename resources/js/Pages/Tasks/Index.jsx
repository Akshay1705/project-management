import { useState, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import TaskDrawer from "@/Components/TaskDrawer";
import { usePage } from "@inertiajs/react";

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_STYLES = {
  draft: "border-blue-300 text-blue-500",
  todo: "border-gray-300 text-gray-500",
  "on process": "border-cyan-400 text-cyan-600",
  "in_progress": "border-cyan-400 text-cyan-600",
  urgent: "border-orange-400 text-orange-500",
  close: "border-gray-400 text-gray-500",
  closed: "border-gray-400 text-gray-500",
  completed: "border-green-400 text-green-600",
  "on-hold": "border-yellow-400 text-yellow-600",
};

function StatusBadge({ status }) {
  const s = status?.toLowerCase() ?? "todo";
  const style = STATUS_STYLES[s] ?? "border-gray-300 text-gray-500";
  return (
    <span className={`inline-block border rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white ${style}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

// ─── Attachment icon ──────────────────────────────────────────────────────────
const PaperclipIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656L5.757 10.757a6 6 0 008.486 8.486L20 13.485" />
  </svg>
);

// ─── Subtask icon ─────────────────────────────────────────────────────────────
const SubtaskIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h6" />
  </svg>
);

// ─── Edit icon ────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

// ─── Trash icon ───────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// ─── Format date ──────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const fmtTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

// ─── Single Task Row ──────────────────────────────────────────────────────────
function TaskRow({ task, checked, onCheck, onDelete, onOpen }) {
    const commentCount = task.comments_count ?? 0;
    const subtaskCount = 0;

    return (
        <div
            className={`flex items-center justify-between px-4 py-3.5 border-t border-gray-300 group ${checked ? "bg-blue-50/40" : ""}`}
        >
            {/* Left: checkbox + title + badge */}
            <div className="flex items-center gap-3 min-w-0">
                <div
                    onClick={() => onCheck(task.id)}
                    className={`h-4 w-4 rounded-md border-2 cursor-pointer shrink-0 flex items-center justify-center transition-colors
                    ${
                        checked
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 bg-white hover:border-blue-400"
                    }`}
                >
                    {checked && (
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
                    onClick={() => onOpen(task)}
                    className={`text-sm font-medium truncate cursor-pointer hover:underline
                    ${checked ? "line-through text-gray-400" : "text-gray-600"}`}
                >
                    {task.title}
                </span>
                {task.status && task.status !== "todo" && (
                    <StatusBadge status={task.status} />
                )}
            </div>

            {/* Right: meta + actions */}
            <div className="flex items-center gap-4 shrink-0 ml-4">
                {/* Attachments */}
                {commentCount > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                        <PaperclipIcon /> {commentCount}
                    </span>
                )}

                {/* Subtasks — orange if any */}
                {subtaskCount > 0 && (
                    <span
                        className={`flex items-center gap-1 text-xs ${subtaskCount > 0 ? "text-orange-400" : "text-gray-400"}`}
                    >
                        <SubtaskIcon /> {subtaskCount}
                    </span>
                )}

                {/* Due date */}
                {task.due_date && (
                    <>
                        <span className="text-xs text-gray-400">
                            {fmtDate(task.due_date)}
                        </span>
                        <span className="text-gray-200">|</span>
                        <span className="text-xs text-gray-500 font-medium">
                            {fmtTime(task.created_at)}
                        </span>
                    </>
                )}

                {/* Edit + Delete — show on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={route("tasks.edit", task.id)}
                        className="p-1.5 rounded-md text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                    >
                        <EditIcon />
                    </Link>
                    <button
                        onClick={() => onDelete(task.id, task.title)}
                        className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Task Index ──────────────────────────────────────────────────────────
export default function Index({ tasks = [] }) {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState({});
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedTask, setSelectedTask] = useState(null);
  const { auth } = usePage().props;
  const permissions = auth.user?.permissions ?? [];


  const handleDelete = (id, title) => {
    if (confirm(`Delete "${title}"?`)) {
      router.delete(`/tasks/${id}`, { preserveScroll: true });
    }
  };

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title?.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "due_date") return new Date(a.due_date ?? 0) - new Date(b.due_date ?? 0);
      if (sortBy === "priority") {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return list;
  }, [tasks, search, sortBy]);

  // console.log(tasks[0]);
  return (
      <DashboardLayout>
          <div className="min-h-screen bg-gray-100 px-8 py-6">
              {/* Title */}
              <h1 className="text-2xl font-black text-gray-900 mb-4">
                  Todo list
                  <span className="font-bold text-gray-700">
                      ({tasks.length})
                  </span>
              </h1>

              {/* Toolbar */}
              <div className="flex items-center gap-4 mb-6">
                  {/* Search */}
                  <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 w-64">
                      <svg
                          className="w-4 h-4 text-gray-400"
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
                          placeholder="Search tasks"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="flex-1 bg-transparent text-sm text-gray-700 !border-0 !outline-none !ring-0 !shadow-none placeholder-gray-400"
                      />
                  </div>

                  {/* Task count pill */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <svg
                          className="w-3.5 h-3.5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                      >
                          <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h8a1 1 0 100-2H3z"
                              clipRule="evenodd"
                          />
                      </svg>
                      <span className="font-medium">
                          {filtered.length} tasks
                      </span>
                  </div>

                  {/* Sorting dropdown */}
                  <div className="relative">
                      <button
                          onClick={() => setSortOpen(!sortOpen)}
                          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
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
                                  d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                              />
                          </svg>
                          Sorting
                      </button>
                      {sortOpen && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-40 overflow-hidden">
                              {[
                                  { value: "created_at", label: "Newest first" },
                                  { value: "title", label: "Title A–Z" },
                                  { value: "due_date", label: "Due date" },
                                  { value: "priority", label: "Priority" },
                              ].map((opt) => (
                                  <button
                                      key={opt.value}
                                      onClick={() => {
                                          setSortBy(opt.value);
                                          setSortOpen(false);
                                      }}
                                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                            ${sortBy === opt.value ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                                  >
                                      {opt.label}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>
              </div>

              {/* Task list */}
              <div>
                  {filtered.length === 0 ? (
                      <div className="py-16 text-center text-gray-400 text-sm">
                          No tasks found.
                      </div>
                  ) : (
                      filtered.map((task) => (
                          <TaskRow
                              key={task.id}
                              task={task}
                              checked={!!checked[task.id]}
                              onCheck={toggleCheck}
                              onDelete={handleDelete}
                              onOpen={setSelectedTask}
                          />
                      ))
                  )}

                  {/* Add new task */}
                  <div className="px-4 py-3">
                      <Link
                          href={route("tasks.create")}
                          className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
                      >
                          <span className="text-lg leading-none">+</span> Add
                          new task
                      </Link>
                  </div>
              </div>
              {selectedTask && (
                  <TaskDrawer
                      task={selectedTask}
                      onClose={() => setSelectedTask(null)}
                      permissions={permissions}
                  />
              )}
          </div>
      </DashboardLayout>
  );
}