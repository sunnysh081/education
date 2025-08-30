import { NextResponse } from "next/server";

interface Program {
    id: number;
    name: string;
    instructorId: number | null;
    studentIds: number[];
}

// --- Mock data store ---
let programs: Program[] = [
    {
        id: 1,
        name: "Mathematics 101",
        instructorId: 1,
        studentIds: [1, 2],
    },
    {
        id: 2,
        name: "Physics 201",
        instructorId: 2,
        studentIds: [2, 3],
    },
];

// --- GET all programs ---
export async function GET() {
    return NextResponse.json({ programs });
}

// --- POST create program ---
export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.name) {
            return NextResponse.json(
                { error: "Program name is required" },
                { status: 400 }
            );
        }

        const newProgram: Program = {
            id: programs.length ? programs[programs.length - 1].id + 1 : 1,
            name: body.name,
            instructorId: body.instructorId ?? null,
            studentIds: Array.isArray(body.studentIds) ? body.studentIds : [],
        };

        programs.push(newProgram);
        return NextResponse.json(newProgram, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to create program" },
            { status: 500 }
        );
    }
}

// --- PUT update program ---
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const program = programs.find((p) => p.id === body.id);
        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 });
        }

        program.name = body.name ?? program.name;
        program.instructorId =
            body.instructorId !== undefined
                ? body.instructorId
                : program.instructorId;
        program.studentIds = Array.isArray(body.studentIds)
            ? body.studentIds
            : program.studentIds;

        return NextResponse.json(program);
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to update program" },
            { status: 500 }
        );
    }
}

// --- DELETE program ---
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        programs = programs.filter((p) => p.id !== id);
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to delete program" },
            { status: 500 }
        );
    }
}
