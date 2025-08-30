"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StudentListItem = {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    mobile: string;
};

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentListItem[]>([]);
    const [filtered, setFiltered] = useState<StudentListItem[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/students");
            const data = await res.json();
            setStudents(data.data);
            setFiltered(data.data);
        }
        load();
    }, []);

    useEffect(() => {
        const f = students.filter(
            (s) =>
                s.firstName.toLowerCase().includes(search.toLowerCase()) ||
                s.lastName.toLowerCase().includes(search.toLowerCase()) ||
                s.id.includes(search)
        );
        setFiltered(f);
        setPage(1);
    }, [search, students]);

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="p-4 md:p-6 space-y-4">
            {/* Search + Add button */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <Input
                    placeholder="Search by ID or Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-64"
                />
                <Button
                    className="w-full sm:w-auto"
                    onClick={() => alert("Open create student form")}
                >
                    + Add Student
                </Button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Mobile</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/dashboard/student/${s.id}`)}
                                >
                                    <td className="px-4 py-2 whitespace-nowrap">{s.id}</td>
                                    <td className="px-4 py-2 font-medium text-blue-600 whitespace-nowrap">
                                        {s.firstName} {s.lastName}
                                    </td>
                                    <td className="px-4 py-2">{s.email}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{s.mobile}</td>
                                    <td className="px-4 py-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/dashboard/student/${s.id}`);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card List */}
            <div className="grid gap-3 sm:hidden">
                {paginated.map((s) => (
                    <Card
                        key={s.id}
                        className="cursor-pointer hover:shadow-md transition"
                        onClick={() => router.push(`/dashboard/student/${s.id}`)}
                    >
                        <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-blue-600">
                                    {s.firstName} {s.lastName}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/dashboard/student/${s.id}`);
                                    }}
                                >
                                    View
                                </Button>
                            </div>
                            <div className="text-sm text-gray-700">
                                <p><span className="font-medium">ID:</span> {s.id}</p>
                                {s.email && <p><span className="font-medium">Email:</span> {s.email}</p>}
                                <p><span className="font-medium">Mobile:</span> {s.mobile}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-4">
                <div className="flex justify-center sm:justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Prev
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
                <span className="text-sm text-center sm:text-right">
                    Page {page} / {totalPages}
                </span>
            </div>
        </div>
    );
}
