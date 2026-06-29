import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";

// ── Static demo notifications ─────────────────────────────────────────────────
const NOTIFICATIONS = [
    {
        id: 1,
        user: "Jessie Samson",
        avatar: null,
        initials: "JS",
        color: "bg-gray-400",
        online: true,
        action: "Mentioned you in a comment.",
        emoji: "💬",
        time: "10m",
        timestamp: "10:41 AM August 7, 2021",
        read: false,
    },
    {
        id: 2,
        user: "Jane Foster",
        avatar: null,
        initials: "JF",
        color: "bg-blue-500",
        online: true,
        action: "Created an event.",
        emoji: "📅",
        time: "20m",
        timestamp: "10:20 AM August 7, 2021",
        read: false,
    },
    {
        id: 3,
        user: "Jessie Samson",
        avatar: null,
        initials: "JS",
        color: "bg-gray-400",
        online: false,
        action: "Liked your comment.",
        emoji: "🔥",
        time: "1h",
        timestamp: "9:30 AM August 7, 2021",
        read: true,
    },
    {
        id: 4,
        user: "Kiera Anderson",
        avatar: null,
        initials: "KA",
        color: "bg-purple-500",
        online: true,
        action: "Mentioned you in a comment.",
        emoji: "💬",
        time: "2h",
        timestamp: "9:11 AM August 7, 2021",
        read: true,
    },
];

export default function NotificationModal({ isOpen, onClose, anchorRef }) {
    const modalRef = useRef(null);
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                anchorRef?.current &&
                !anchorRef.current.contains(e.target)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose]);

    const markAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-[340px] rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
            {/* Arrow */}
            <div className="absolute -top-2 right-5 w-4 h-4 rotate-45 bg-white border-l border-t border-gray-200" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm">
                        Notifications
                    </span>
                    {unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`flex gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer relative
                            ${!n.read ? "bg-blue-50/40" : ""}`}
                    >
                        {/* Unread dot */}
                        {!n.read && (
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                className={`w-9 h-9 rounded-full ${n.color} flex items-center justify-center text-white text-xs font-bold select-none`}
                            >
                                {n.initials}
                            </div>
                            {n.online && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                                <span className="text-sm font-semibold text-gray-800 truncate">
                                    {n.user}
                                </span>
                                <span className="text-[11px] text-gray-400 shrink-0">
                                    {n.time}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                <span>{n.emoji}</span>
                                {n.action}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {n.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 text-center">
                <Link
                    href="/notifications"
                    className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                    Notification history
                </Link>
            </div>
        </div>
    );
}