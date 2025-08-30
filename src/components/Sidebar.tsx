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
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navConfig = {
    admin: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
        { href: "/dashboard/student", label: "Student", icon: User },
        // { href: "/dashboard/instructor", label: "Instructor", icon: User },
        { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
        { href: "/dashboard/program", label: "Program", icon: Calendar },
        { href: "/settings", label: "Settings", icon: Settings },
    ],
    user: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/profile", label: "Profile", icon: UserCircle },
    ],
};

function SidebarNav({ role, pathname, onNavigate }: { role: "admin" | "user"; pathname: string; onNavigate?: () => void }) {
    return (
        <nav className="flex-1 px-3 py-4 space-y-1">
            {navConfig[role].map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
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
    );
}

export default function Sidebar() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-white shadow-sm">
                <div className="h-14 flex items-center px-6 border-b">
                    <h1 className="text-lg font-semibold text-gray-800">Institution Name</h1>
                </div>
                <SidebarNav role={user.role} pathname={pathname} />
            </aside>

            {/* Mobile Sidebar (Sheet Drawer) */}
            <header className="flex md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
                <div className="flex items-center justify-between h-14 px-4 w-full">
                    <h1 className="text-lg font-semibold text-gray-800">Institution Name</h1>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(true)}
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <div className="h-14 flex items-center px-6 border-b">
                                <h1 className="text-lg font-semibold text-gray-800">Institution Name</h1>
                            </div>
                            <SidebarNav
                                role={user.role}
                                pathname={pathname}
                                onNavigate={() => setOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </>
    );
}
