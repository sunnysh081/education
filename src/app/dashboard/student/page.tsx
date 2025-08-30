"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type Student = {
    id: string;
    name: string;
    email: string;
};

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filtered, setFiltered] = useState<Student[]>([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("id-asc");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [selected, setSelected] = useState<Student | null>(null);

    // Fetch mock API
    useEffect(() => {
        async function fetchStudents() {
            const res = await fetch("/api/students");
            const responseJson = await res.json();
            const data: Student[] = responseJson["data"]
            setStudents(data);
            setFiltered(data);
        }
        fetchStudents();
    }, []);

    // Filter + sort
    useEffect(() => {
        let list = students.filter(
            (s) =>
                s.id.toLowerCase().includes(search.toLowerCase()) ||
                s.name.toLowerCase().includes(search.toLowerCase())
        );

        if (sort === "id-asc") list.sort((a, b) => a.id.localeCompare(b.id));
        if (sort === "id-desc") list.sort((a, b) => b.id.localeCompare(a.id));
        if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
        if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));

        setFiltered(list);
        setPage(1);
    }, [search, sort, students]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

    function updateStudent(updated: Student) {
        setStudents((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
        );
        setSelected(updated);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Students</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Input
                    placeholder="Search by ID or Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="id-asc">ID ↑</SelectItem>
                        <SelectItem value="id-desc">ID ↓</SelectItem>
                        <SelectItem value="name-asc">Name ↑</SelectItem>
                        <SelectItem value="name-desc">Name ↓</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pageData.map((student) => (
                        <TableRow
                            key={student.id}
                            className="cursor-pointer hover:bg-slate-100"
                            onClick={() => setSelected(student)}
                        >
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            />
                        </PaginationItem>
                        <span className="px-2 text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            {/* Details + Edit Dialog */}
            {selected && (
                <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Student Details</DialogTitle>
                        </DialogHeader>

                        <StudentForm student={selected} onSave={updateStudent} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

function StudentForm({
    student,
    onSave,
}: {
    student: Student;
    onSave: (s: Student) => void;
}) {
    const [id] = useState(student.id);
    const [name, setName] = useState(student.name);
    const [email, setEmail] = useState(student.email);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave({ id, name, email });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input value={id} disabled />
            <Input value={name} onChange={(e) => setName(e.target.value)}
                autoFocus={false}
            />
            <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={false}
            />
            <Button type="submit" className="w-full">
                Save
            </Button>
        </form>
    );
}
