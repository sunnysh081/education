import { NextResponse } from "next/server";

type Student = {
    id: string;
    name: string;
    email: string;
};

const mockStudents: Student[] = [
    { id: "S001", name: "Alice Johnson", email: "alice@example.com" },
    { id: "S002", name: "Bob Smith", email: "bob@example.com" },
    { id: "S003", name: "Charlie Brown", email: "charlie@example.com" },
    { id: "S004", name: "Diana Prince", email: "diana@example.com" },
    { id: "S005", name: "Ethan Hunt", email: "ethan@example.com" },
    { id: "S006", name: "Fiona Gallagher", email: "fiona@example.com" },
    { id: "S007", name: "George Lucas", email: "george@example.com" },
    { id: "S008", name: "Hannah Baker", email: "hannah@example.com" },
    { id: "S009", name: "Ian Curtis", email: "ian@example.com" },
    { id: "S010", name: "Jane Doe", email: "jane@example.com" },
];

// GET /api/students?search=&sort=&page=&pageSize=
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "id-asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);

    // Filter
    let result = mockStudents.filter(
        (s) =>
            s.id.toLowerCase().includes(search.toLowerCase()) ||
            s.name.toLowerCase().includes(search.toLowerCase())
    );

    // Sort
    if (sort === "id-asc") result = result.sort((a, b) => a.id.localeCompare(b.id));
    if (sort === "id-desc") result = result.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "name-asc") result = result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") result = result.sort((a, b) => b.name.localeCompare(a.name));

    // Pagination
    const total = result.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = result.slice(start, end);

    return NextResponse.json({ data, total, page, pageSize });
}
