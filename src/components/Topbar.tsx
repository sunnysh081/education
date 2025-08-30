"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Topbar() {
    const { user, logout } = useAuth();
    if (!user) return null;

    return (
        <header className="h-14 bg-white border-b flex items-center justify-between px-6 w-full">
            {/* Search */}
            <div className="flex-1 max-w-lg">
                {/* <Input
                    placeholder="Search..."
                    className="w-full text-sm"
                /> */}
            </div>

            {/* User dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                            <AvatarFallback>
                                {user.email[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-sm font-medium">
                            {user.email}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
