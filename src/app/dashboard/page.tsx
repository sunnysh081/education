"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser, GraduationCap, UserMinus, Users } from "lucide-react";
// Mock Data
const mockData = {
    totalStudents: 120,
    totalInstructors: 15,
    totalPrograms: 10,
    totalSchedules: 10,
    mostAbsentStudents: [
        { id: "S101", name: "Ravi Kumar", absences: 12 },
        { id: "S102", name: "Meena Patel", absences: 12 },
        { id: "S103", name: "Amit Joshi", absences: 11 },
    ],
    mostAbsentInstructors: [
        { id: "I55", name: "Dr. Sharma", absences: 8 },
        { id: "I56", name: "Prof. Singh", absences: 7 },
    ],
    recentStudents: [
        { id: "S122", name: "Anita Sharma", joined: "2025-08-25" },
        { id: "S121", name: "Aman Gupta", joined: "2025-08-22" },
    ],
    recentInstructors: [
        { id: "I60", name: "Prof. Mehta", joined: "2025-08-20" },
        { id: "I59", name: "Dr. Ramesh", joined: "2025-08-19" },
    ],
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const [data] = useState(mockData);
    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6">
                    {/* {children} */}
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card className="shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                                <Users className="text-blue-600" />
                                <CardTitle>Total Students</CardTitle>
                            </CardHeader>
                            <CardContent className="text-2xl font-bold">
                                {data.totalStudents}
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                                <GraduationCap className="text-green-600" />
                                <CardTitle>Total Instructors</CardTitle>
                            </CardHeader>
                            <CardContent className="text-2xl font-bold">
                                {data.totalInstructors}
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                                <GraduationCap className="text-green-600" />
                                <CardTitle>Total Programs</CardTitle>
                            </CardHeader>
                            <CardContent className="text-2xl font-bold">
                                {data?.totalPrograms || 10}
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                                <GraduationCap className="text-green-600" />
                                <CardTitle>Total Schedule</CardTitle>
                            </CardHeader>
                            <CardContent className="text-2xl font-bold">
                                {data.totalSchedules || 10}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Absence Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card className="shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                                <UserMinus className="text-red-600" />
                                <CardTitle>Most Absent Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y">
                                    {data.mostAbsentStudents.map((s) => (
                                        <li
                                            key={s.id}
                                            className="py-2 flex justify-between text-sm"
                                        >
                                            <span className="font-medium">{s.name}</span>
                                            <span className="text-gray-500">
                                                {s.absences} days
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                                <BookUser className="text-orange-600" />
                                <CardTitle>Most Absent Instructors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y">
                                    {data.mostAbsentInstructors.map((i) => (
                                        <li
                                            key={i.id}
                                            className="py-2 flex justify-between text-sm"
                                        >
                                            <span className="font-medium">{i.name}</span>
                                            <span className="text-gray-500">
                                                {i.absences} days
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Tables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Recently Added Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y">
                                    {data.recentStudents.map((s) => (
                                        <li
                                            key={s.id}
                                            className="py-2 flex justify-between text-sm"
                                        >
                                            <span>{s.name}</span>
                                            <span className="text-gray-500">{s.joined}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Recently Added Instructors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y">
                                    {data.recentInstructors.map((i) => (
                                        <li
                                            key={i.id}
                                            className="py-2 flex justify-between text-sm"
                                        >
                                            <span>{i.name}</span>
                                            <span className="text-gray-500">{i.joined}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
