"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Instructor {
    id: number;
    name: string;
    email: string;
    subject: string;
}

export default function InstructorsPage() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [filtered, setFiltered] = useState<Instructor[]>([]);
    const [selected, setSelected] = useState<Instructor | null>(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // mock fetch
    useEffect(() => {
        fetch("/api/instructors")
            .then((res) => res.json())
            .then((data) => {
                setInstructors(data);
                setFiltered(data);
            });
    }, []);

    // search + sort
    useEffect(() => {
        let data = [...instructors];
        if (search) {
            data = data.filter(
                (i) =>
                    i.name.toLowerCase().includes(search.toLowerCase()) ||
                    i.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        data.sort((a, b) => (a[sort as keyof Instructor] > b[sort as keyof Instructor] ? 1 : -1));
        setFiltered(data);
        setPage(1);
    }, [search, sort, instructors]);

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="flex h-full gap-6">
            {/* List */}
            <div className="flex-1">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Instructors</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm">+ New</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Instructor</DialogTitle>
                                </DialogHeader>
                                <form
                                    className="space-y-3"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const formData = new FormData(form);
                                        const newInstructor: Instructor = {
                                            id: instructors.length + 1,
                                            name: formData.get("name") as string,
                                            email: formData.get("email") as string,
                                            subject: formData.get("subject") as string,
                                        };
                                        setInstructors([...instructors, newInstructor]);
                                        form.reset();
                                    }}
                                >
                                    <Input name="name" placeholder="Name" required />
                                    <Input name="email" placeholder="Email" type="email" required />
                                    <Input name="subject" placeholder="Subject" required />
                                    <Button type="submit" className="w-full">Create</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 mb-4">
                            <Input
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-1/2"
                            />
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="subject">Subject</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="border rounded-md divide-y">
                            {paginated.map((i) => (
                                <div
                                    key={i.id}
                                    className={cn(
                                        "p-3 cursor-pointer hover:bg-slate-50",
                                        selected?.id === i.id && "bg-slate-100"
                                    )}
                                    onClick={() => setSelected(i)}
                                >
                                    <div className="font-medium">{i.name}</div>
                                    <div className="text-sm text-muted-foreground">{i.email}</div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4 text-sm">
                            <span>
                                Page {page} of {Math.ceil(filtered.length / pageSize)}
                            </span>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page * pageSize >= filtered.length}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details */}
            <div className="w-96">
                {selected ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{selected.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Input
                                defaultValue={selected.name}
                                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                            />
                            <Input
                                defaultValue={selected.email}
                                onChange={(e) => setSelected({ ...selected, email: e.target.value })}
                            />
                            <Input
                                defaultValue={selected.subject}
                                onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
                            />
                            <Button
                                className="w-full"
                                onClick={() => {
                                    setInstructors(
                                        instructors.map((i) => (i.id === selected.id ? selected : i))
                                    );
                                }}
                            >
                                Update
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="flex items-center justify-center h-full">
                        <CardContent>Select an instructor</CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
