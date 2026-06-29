import { useState, useRef, useEffect, useMemo } from "react";
import { useForm, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { ChevronDown } from "lucide-react";

// ─── Floating Label Input ─────────────────────────────────────────────────────
function FloatingInput({ label, value, onChange, type = "text", error }) {
    const [focused, setFocused] = useState(false);
    const raised = focused || value;
    return (
        <div>
            <div
                className={`relative h-11 pl-1 rounded-md border bg-white transition-colors
                ${focused ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}
            >
                <label
                    className={`absolute left-4 font-semibold tracking-tight uppercase pointer-events-none transition-all duration-150
                    ${raised ? "top-2 text-[10.24px]" : "top-1/2 -translate-y-1/2 text-[12px]"}
                    ${focused ? "text-blue-600" : "text-gray-500"}`}
                >
                    {label}
                </label>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`absolute left-4 bottom-3 right-4 bg-transparent border-none outline-none ring-0 shadow-none focus:border-none focus:outline-none focus:ring-0 text-sm text-gray-900
                        ${raised ? "top-6 opacity-100" : "top-1/2 -translate-y-1/2 opacity-0"}`}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ─── Floating Label Select ────────────────────────────────────────────────────
function FloatingSelect({label, value, onChange, options, error, disabled = false,}) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const selectedLabel =
        options.find((o) => String(o.value) === String(value))?.label || "";
    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => !disabled && setOpen(!open)}
                className={`relative border rounded-md bg-white px-3.5 pt-5 min-h-[46px] transition-colors
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${open ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}
            >
                <label
                    className={`absolute left-3.5 top-1.5 text-[10.24px] font-semibold tracking-tight uppercase pointer-events-none
                    ${open ? "text-blue-600" : "text-gray-400"}`}
                >
                    {label}
                </label>
                <span
                    className={`text-sm ${selectedLabel ? "text-gray-800" : "text-gray-400"}`}
                >
                    {selectedLabel || (disabled ? "Select project first" : "")}
                </span>
                <ChevronDown
                    size={16}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </div>
            {open && !disabled && (
                <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-md z-50 shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                    {options.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-400 italic">
                            No members in this project
                        </div>
                    ) : (
                        options.map((opt, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                                    ${String(opt.value) === String(value) ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-50"}`}
                            >
                                {opt.label}
                            </div>
                        ))
                    )}
                </div>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

// ─── Floating Textarea ────────────────────────────────────────────────────────
function FloatingTextarea({ label, value, onChange, error }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <div
                className={`relative border rounded-md bg-white px-3.5 pt-7 pb-2 transition-colors
                ${focused ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}
            >
                <label
                    className={`absolute left-3.5 top-1.5 text-[10.24px] font-semibold tracking-tight uppercase pointer-events-none
                    ${focused ? "text-blue-600" : "text-gray-400"}`}
                >
                    {label}
                </label>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    rows={4}
                    className="w-full bg-transparent border-none outline-none ring-0 shadow-none focus:border-none focus:outline-none focus:ring-0 text-sm text-gray-800 resize-y font-sans"
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ─── Main Edit Task ───────────────────────────────────────────────────────────
export default function EditTask({ task, projects = [], errors = {} }) {
    const { data, setData, put, processing } = useForm({
        title: task?.title ?? "",
        description: task?.description ?? "",
        status: task?.status ?? "todo",
        priority: task?.priority ?? "medium",
        project_id: task?.project_id ?? "",
        assigned_to: task?.assigned_to ?? "",
        due_date: task?.due_date ?? "",
    });

    const set = (key) => (val) => setData(key, val);

    // When project changes reset assigned_to
    const handleProjectChange = (val) => {
        setData((d) => ({ ...d, project_id: val, assigned_to: "" }));
    };

    // Filter assignees to selected project's members
    const assigneeOptions = useMemo(() => {
        if (!data.project_id) return [];
        const project = projects.find(
            (p) => String(p.id) === String(data.project_id),
        );
        const members = project?.users ?? [];
        return [
            { value: "", label: "Unassigned" },
            ...members.map((u) => ({ value: u.id, label: u.name })),
        ];
    }, [data.project_id, projects]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("tasks.update", task.id));
    };

    const projectOptions = [
        { value: "", label: "Select a project" },
        ...projects.map((p) => ({ value: p.id, label: p.name })),
    ];

    const statusOptions = [
        { value: "todo", label: "Todo" },
        { value: "draft", label: "Draft" },
        { value: "on process", label: "On Process" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "on-hold", label: "On Hold" },
        { value: "urgent", label: "Urgent" },
        { value: "close", label: "Close" },
    ];

    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
    ];

    return (
        <DashboardLayout>
            <div className="m-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm mb-3">
                    <Link
                        href={route("tasks.index")}
                        className="text-blue-600 hover:underline"
                    >
                        Tasks
                    </Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-500">Edit</span>
                </nav>

                <h1 className="text-3xl font-black tracking-wider text-gray-900 mb-6">
                    Edit Task
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Task Title */}
                    <FloatingInput
                        label="TASK TITLE"
                        value={data.title}
                        onChange={set("title")}
                        error={errors?.title}
                    />

                    {/* Status + Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <FloatingSelect
                            label="STATUS"
                            value={data.status}
                            onChange={set("status")}
                            options={statusOptions}
                            error={errors?.status}
                        />
                        <FloatingSelect
                            label="PRIORITY"
                            value={data.priority}
                            onChange={set("priority")}
                            options={priorityOptions}
                            error={errors?.priority}
                        />
                    </div>

                    {/* Project + Assign To */}
                    <div className="grid grid-cols-2 gap-4">
                        <FloatingSelect
                            label="PROJECT"
                            value={data.project_id}
                            onChange={handleProjectChange}
                            options={projectOptions}
                            error={errors?.project_id}
                        />
                        <FloatingSelect
                            label="ASSIGN TO"
                            value={data.assigned_to}
                            onChange={set("assigned_to")}
                            options={assigneeOptions}
                            error={errors?.assigned_to}
                            disabled={!data.project_id}
                        />
                    </div>

                    {/* Warning if project has no members */}
                    {data.project_id && assigneeOptions.length <= 1 && (
                        <p className="text-xs text-amber-600 -mt-2">
                            ⚠ This project has no members yet. Add people to the
                            project first.
                        </p>
                    )}

                    {/* Due Date */}
                    <FloatingInput
                        label="DUE DATE"
                        value={data.due_date}
                        onChange={set("due_date")}
                        type="date"
                        error={errors?.due_date}
                    />

                    {/* Description */}
                    <FloatingTextarea
                        label="DESCRIPTION"
                        value={data.description}
                        onChange={set("description")}
                        error={errors?.description}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-4">
                        <Link
                            href={route("tasks.index")}
                            className="px-8 py-3 rounded-md border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors disabled:opacity-50 min-w-[200px]"
                        >
                            {processing ? "Updating..." : "Update Task"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}