import { useState, useRef, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Calendar, ChevronDown } from "lucide-react";

// ─── Calendar Picker ──────────────────────────────────────────────────────────
function CalendarPicker({ value, onChange, onClose }) {
    const today = new Date();
    const [viewDate, setViewDate] = useState(value ? new Date(value) : today);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++)
        cells.push({ day: daysInPrev - startOffset + 1 + i, current: false });
    for (let d = 1; d <= daysInMonth; d++)
        cells.push({ day: d, current: true });
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++)
        cells.push({ day: d, current: false });

    const isToday = (day, current) => {
        if (!current) return false;
        const t = new Date();
        return day === t.getDate() && month === t.getMonth() && year === t.getFullYear();
    };
    const isSelected = (day, current) => {
        if (!current || !value) return false;
        const sel = new Date(value);
        return day === sel.getDate() && month === sel.getMonth() && year === sel.getFullYear();
    };
    const isWeekend = (index) => { const dow = index % 7; return dow === 5 || dow === 6; };
    const handleSelect = (day, current) => {
        if (!current) return;
        onChange(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
        onClose();
    };

    return (
        <div className="absolute top-[110%] left-0 z-50 bg-white rounded-lg shadow-xl p-4 w-72 select-none border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setViewDate(new Date(year, month - 1, 1))}
                    className="text-2xl text-gray-500 hover:text-gray-800 px-2 leading-none bg-transparent border-none cursor-pointer"
                >‹</button>
                <span className="font-bold text-base text-gray-800">
                    {monthNames[month]} {year}
                </span>
                <button
                    type="button"
                    onClick={() => setViewDate(new Date(year, month + 1, 1))}
                    className="text-2xl text-gray-500 hover:text-gray-800 px-2 leading-none bg-transparent border-none cursor-pointer"
                >›</button>
            </div>
            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 font-semibold py-1">{d}</div>
                ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-0.5">
                {cells.map((cell, i) => {
                    const todayCell = isToday(cell.day, cell.current);
                    const selectedCell = isSelected(cell.day, cell.current);
                    const weekend = isWeekend(i);
                    return (
                        <div
                            key={i}
                            onClick={() => handleSelect(cell.day, cell.current)}
                            className={[
                                "text-center py-1.5 rounded-full text-sm cursor-pointer transition-colors",
                                selectedCell ? "bg-blue-600 text-white font-bold" :
                                    todayCell ? "bg-blue-600 text-white font-bold" :
                                        !cell.current ? "text-gray-300 cursor-default" :
                                            weekend ? "text-orange-400 hover:bg-gray-100" :
                                                "text-gray-700 hover:bg-gray-100",
                            ].join(" ")}
                        >
                            {cell.day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Floating Label Input ─────────────────────────────────────────────────────
function FloatingInput({ label, value, onChange, type = "text", error }) {
    const [focused, setFocused] = useState(false);
    const raised = focused || value;

    return (
        <div>
            <div
                className={`relative h-11 pl-1 rounded-md border bg-white transition-colors 
                    ${focused 
                        ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" 
                        : "border-gray-300"
                    }`
                }
            >
                <label
                    className={`absolute left-4 font-semibold tracking-tight uppercase pointer-events-none transition-all duration-150
                        ${raised
                            ? "top-1 text-[10.24px]"
                            : "top-1/2 -translate-y-1/2 text-[12px]"
                        }
                        ${focused ? "text-blue-600" : "text-gray-500"}
                    `}
                >
                    {label}
                </label>

                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`absolute left-4 bottom-3 right-4 bg-transparent border-none outline-none ring-0 shadow-none focus:border-none focus:outline-none focus:ring-0 text-sm text-gray-900
                        ${raised
                            ? "top-5 opacity-100"
                            : "top-1/2 opacity-0"
                        }
                    `}
                />
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

// ─── Floating Label Select ────────────────────────────────────────────────────
function FloatingSelect({ label, value, onChange, options, error }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const selectedLabel = options.find(o => String(o.value) === String(value))?.label || "";
    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className={`relative border rounded-md bg-white px-3.5 pt-5 cursor-pointer min-h-[46px] transition-colors
                    ${open ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}
            >
                <label
                    className={`absolute left-3.5 top-1.5 text-[10.24px] font-semibold tracking-tight uppercase pointer-events-none
                        ${open ? "text-blue-600" : "text-gray-400"}`}
                >
                    {label}
                </label>
                <span className={`text-sm ${selectedLabel ? "text-gray-800" : "text-gray-400"}`}>
                    {selectedLabel}
                </span>
                <ChevronDown
                    size={16}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </div>
            {open && (
                <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-md z-50 shadow-lg overflow-hidden">
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                                ${String(opt.value) === String(value)
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-800 hover:bg-gray-50"}`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

// ─── Date Field ───────────────────────────────────────────────────────────────
function DateField({ label, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const display = value
        ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "";
    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className={`relative border rounded-md bg-white pl-10 pr-3.5 py-3 cursor-pointer min-h-[46px] flex flex-col justify-center transition-colors
                    ${open ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}
            >
                {/* Calendar icon */}
                <Calendar
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                />                
                <div className={`text-[10.24px] font-semibold tracking-tight uppercase ${open ? "text-blue-600" : "text-gray-400"}`}>
                    {label}
                </div>
                {display && <div className="text-sm text-gray-800 mt-0.5">{display}</div>}
            </div>
            {open && (
                <CalendarPicker value={value} onChange={onChange} onClose={() => setOpen(false)} />
            )}
        </div>
    );
}

// ─── Multi Select (People) ────────────────────────────────────────────────────
function MultiSelect({ label, selected, onChange, options, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const toggle = (val) => {
        if (selected.includes(val)) onChange(selected.filter(v => v !== val));
        else onChange([...selected, val]);
    };
    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className={`relative border rounded-md bg-white px-3.5 pt-5 cursor-pointer min-h-[46px] transition-colors
                    ${open ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}
            >
                <label className={`absolute left-3.5 transition-all duration-150 font-semibold tracking-tight uppercase pointer-events-none top-1.5 text-[10.24px]
                    ${open ? "text-blue-600" : "text-gray-400"}`}>
                    {label}
                </label>
                <div className="flex flex-wrap gap-1 pr-6">
                    {selected.length === 0 ? (
                        <span className="text-sm text-gray-800">{placeholder}</span>
                    ) : (
                        selected.map(val => {
                            const item = options.find(o => o.value === val);
                            return item && (
                                <span
                                    key={val}
                                    className="inline-flex items-center gap-1 px-2 mt-1 rounded bg-blue-50 border border-blue-200 text-xs text-blue-700"
                                >
                                    {item.label}
                                    <span
                                        onClick={e => {
                                            e.stopPropagation();
                                            onChange(selected.filter(v => v !== val));
                                        }}
                                        className="cursor-pointer text-gray-400 hover:text-gray-700"
                                    >
                                        ×
                                    </span>
                                </span>
                            );
                        })
                    )}
                </div>
            <ChevronDown
                size={16}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${
                    open ? "rotate-180" : ""
                }`}
            />
            </div>
            {open && (
                <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-md z-50 shadow-lg overflow-hidden">
                    {options
                        .filter(opt => !selected.includes(opt.value))
                        .map((opt, i) => {
                            const isSel = selected.includes(opt.value);
                            return (
                                <div
                                    key={i}
                                    onClick={() => toggle(opt.value)}
                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                                    ${isSel ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-50"}`}
                                >
                                    {opt.label}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────
function TagInput({ allTags, selected, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const toggle = (id) => {
        if (selected.includes(id)) onChange(selected.filter(v => v !== id));
        else {
            onChange([...selected, id]);
            // setOpen(false);
        }
    };

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className={`border rounded-md bg-white px-3.5 pt-2 pb-2 cursor-pointer min-h-[46px] flex flex-wrap gap-2 items-center transition-colors
                    ${open ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}
            >
                <div className={`text-[10.24px] font-semibold tracking-tight uppercase w-full ${open ? "text-blue-600" : "text-gray-400"}`}>
                    ADD TAGS
                </div>
                {selected.map(id => {
                    const tag = allTags.find(t => t.id === id);
                    return tag ? (
                        <span key={id} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded px-2 py-0.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                            {tag.name}
                            <span
                                onClick={e => { e.stopPropagation(); onChange(selected.filter(v => v !== id)); }}
                                className="text-gray-400 hover:text-gray-700 text-sm leading-none cursor-pointer"
                            >×</span>
                        </span>
                    ) : null;
                })}
            </div>
            {open && (
                <div className="absolute top-[105%] left-0 right-0 bg-gray-50 border border-gray-200 rounded-md z-50 shadow-lg overflow-hidden">
                    {allTags
                        .filter(tag => !selected.includes(tag.id))
                        .map(tag => (
                            <div
                                key={tag.id}
                                onClick={() => toggle(tag.id)}
                                className="px-4 py-2.5 text-sm cursor-pointer text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                {tag.name}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

// ─── Floating Textarea ────────────────────────────────────────────────────────
function FloatingTextarea({ label, value, onChange }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className={`relative border rounded-md bg-white px-3 pt-7 pb-2 my-7 transition-colors ${focused ? "border-blue-600 shadow-[0_0_0_5px_rgba(38,132,255,.2)]" : "border-gray-300"}`}>
            <label
                className={`absolute left-3.5 transition-all duration-150 font-semibold tracking-tight uppercase pointer-events-none
                    ${focused || value
                        ? "top-1 text-[10.24px]"
                        : "top-2 text-[11px]"}
                    ${focused ? "text-blue-600 " : "text-gray-400"}`}
            >
                {label}
            </label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={2}
                className="w-full bg-transparent border-none outline-none ring-0 shadow-none focus:border-none focus:outline-none focus:ring-0 text-sm text-gray-800 resize-y font-sans" />
        </div>
    );
}

// ─── Main Create Page ─────────────────────────────────────────────────────────
export default function Create({ teams, clients, tags, users, admins, taskViews, privacyOptions, errors }) {
    const { data, setData, post, processing } = useForm({
        name: "",
        default_task_view: "",
        privacy: "",
        team_id: "",
        people: [],
        project_lead_id: "",
        start_date: "",
        end_date: "",
        description: "",
        client_id: "",
        budget: "",
        tags: tags?.length ? [tags[0].id] : [],
        status: "active",
    });

    const set = (key) => (val) => setData(key, val);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("projects.store"));
    };

    // Option arrays
    const teamOptions = [{ value: "", label: "Select team" }, ...(teams || []).map(t => ({ value: t.id, label: t.name }))];
    const clientOptions = [{ value: "", label: "Select client" }, ...(clients || []).map(c => ({ value: c.id, label: c.name }))];
    const adminOptions = [{ value: "", label: "Select admin" }, ...(admins || []).map(u => ({ value: u.id, label: u.name }))];
    const taskViewOptions = [{ value: "", label: "Select task view" }, ...(taskViews || []).map(v => ({ value: v, label: v }))];
    const privacyOpts = [{ value: "", label: "Select privacy" }, ...(privacyOptions || []).map(p => ({ value: p, label: p }))];
    const peopleOptions = (users || []).map(u => ({ value: u.id, label: u.name }));

    return (
        <DashboardLayout>
            <div className="m-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm mb-3">
                    <Link href="/projects" className="text-blue-600 hover:underline">Projects</Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-500">Create</span>
                </nav>

                {/* Page Title */}
                <h1 className="text-3xl font-black tracking-wider text-gray-900 mb-6 [paint-order:stroke_fill] [-webkit-text-stroke:0.75px_#111827]">Create a project</h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Row 1 — Title + Default Task View */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <FloatingInput
                                label="PROJECT TITLE"
                                value={data.name}
                                onChange={set("name")}
                                error={errors?.name}
                            />
                        </div>
                        <FloatingSelect
                            label="DEFAULT TASK VIEW"
                            value={data.default_task_view}
                            onChange={set("default_task_view")}
                            options={taskViewOptions}
                        />
                    </div>

                    {/* Row 2 — Privacy + Team + People */}
                    <div className="grid grid-cols-3 gap-4">
                        <FloatingSelect
                            label="PROJECT PRIVACY"
                            value={data.privacy}
                            onChange={set("privacy")}
                            options={privacyOpts}
                        />
                        <FloatingSelect
                            label="TEAM"
                            value={data.team_id}
                            onChange={set("team_id")}
                            options={teamOptions}
                        />
                        <MultiSelect
                            label="PEOPLE"
                            selected={data.people}
                            onChange={set("people")}
                            options={peopleOptions}
                            placeholder="Select assignees"
                        />
                    </div>

                    {/* Row 3 — Project Lead + Start Date + Deadline */}
                    <div className="grid grid-cols-3 gap-4">
                        <FloatingSelect
                            label="PROJECT LEAD"
                            value={data.project_lead_id}
                            onChange={set("project_lead_id")}
                            options={adminOptions}
                        />
                        <DateField
                            label="START DATE"
                            value={data.start_date}
                            onChange={set("start_date")}
                        />
                        <DateField
                            label="DEADLINE"
                            value={data.end_date}
                            onChange={set("end_date")}
                        />
                    </div>

                    {/* Row 4 — Project Overview */}
                    <FloatingTextarea
                        label="PROJECT OVERVIEW"
                        value={data.description}
                        onChange={set("description")}
                    />

                    {/* Row 5 — Client + Budget */}
                    <div className="grid grid-cols-2 gap-4">
                        <FloatingSelect
                            label="CLIENT"
                            value={data.client_id}
                            onChange={set("client_id")}
                            options={clientOptions}
                        />
                        <FloatingInput
                            label="BUDGET"
                            value={data.budget}
                            onChange={set("budget")}
                            type="number"
                        />
                    </div>

                    {/* Row 6 — Tags */}
                    <TagInput
                        allTags={tags || []}
                        selected={data.tags}
                        onChange={set("tags")}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-4">
                        <Link
                            href={route("projects.index")}
                            className="px-8 py-3 rounded-md border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-30 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors disabled:opacity-50 min-w-[280px]"
                        >
                            {processing ? "Creating..." : "Create Project"}
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}