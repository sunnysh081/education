import { NextResponse } from "next/server";

const instructors = [
    { id: 1, name: "Dr. Smith", email: "smith@example.com", subject: "Math" },
    { id: 2, name: "Prof. Johnson", email: "johnson@example.com", subject: "Physics" },
    { id: 3, name: "Dr. Brown", email: "brown@example.com", subject: "Chemistry" },
    { id: 4, name: "Dr. Lee", email: "lee@example.com", subject: "Biology" },
    { id: 5, name: "Prof. Davis", email: "davis@example.com", subject: "History" },
    { id: 6, name: "Dr. Miller", email: "miller@example.com", subject: "English" },
];

export async function GET() {
    return NextResponse.json(instructors);
}
