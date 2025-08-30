"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    UserCircle,
    User,
    Calendar1

} from "lucide-react";

const navConfig = {
    admin: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
        { href: "/dashboard/student", label: "Student", icon: User },
        { href: "/dashboard/instructor", label: "Instructor", icon: User },
        { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
        { href: "/dashboard/program", label: "Program", icon: Calendar },
        { href: "/settings", label: "Settings", icon: Settings },
    ],
    user: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile", label: "Profile", icon: UserCircle },
    ],
};

export default function Sidebar() {
    const { user } = useAuth();
    const pathname = usePathname();
    if (!user) return null;

    return (
        <aside className="flex flex-col w-64 h-screen border-r bg-white shadow-sm">
            {/* Brand / App Name */}
            <div className="h-14 flex items-center px-6 border-b">
                <h1 className="text-lg font-semibold text-gray-800">EduPortal</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navConfig[user.role].map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-slate-100 text-slate-900 border-l-4 border-blue-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4 shrink-0",
                                    active ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                                )}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
