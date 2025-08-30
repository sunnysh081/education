import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    // ⚠️ Replace with real backend call
    // if (email === "admin@test.com") {
    return NextResponse.json({ access_token: "mock-token", role: "admin" });
    // }
    // if (email === "user@test.com" && password === "123456") {
    //     return NextResponse.json({ access_token: "mock-token", role: "user" });
    // }

    // return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
