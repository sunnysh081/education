import { NextResponse } from "next/server";
const students = [
    {
        id: "S001",
        firstName: "Rahul",
        middleName: "",
        lastName: "Sharma",
        email: "rahul.sharma@example.com",
        mobile: "+91-9876543210",
        dob: "2005-03-12",
        gender: "Male",
        bloodGroup: "B+",
        nationality: "Indian",
        createdBy: "U001",
        joiningDate: "2021-06-15",

        address: {
            line1: "123 MG Road",
            line2: "Near Metro Station",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560001",
            country: "India",
        },

        relation: {
            guardian: {
                name: "Suresh Sharma",
                relation: "Father",
                contact: "+91-9998887777",
                email: "suresh.sharma@example.com",
            },
            siblings: [
                {
                    id: "S002",
                    name: "Priya Sharma",
                    relation: "Sister",
                    age: 12,
                },
            ],
        },

        programs: [
            {
                id: "P001",
                name: "Mathematics - Class 10",
                instructor: { id: "I001", name: "Anita Verma" },
                startDate: "2024-07-01",
                endDate: "2025-03-31",
            },
            {
                id: "P002",
                name: "Science - Class 10",
                instructor: { id: "I002", name: "Rajesh Kumar" },
                startDate: "2024-07-01",
                endDate: "2025-03-31",
            },
        ],

        attendance: [
            { date: "2025-08-01", status: "Present" },
            { date: "2025-08-02", status: "Absent" },
            { date: "2025-08-03", status: "Present" },
        ],
    },
    {
        id: "S003",
        firstName: "Aditi",
        middleName: "K.",
        lastName: "Patel",
        email: "aditi.patel@example.com",
        mobile: "+91-9123456789",
        dob: "2006-07-20",
        gender: "Female",
        bloodGroup: "O+",
        nationality: "Indian",
        createdBy: "U002",
        joiningDate: "2022-04-10",

        address: {
            line1: "45 Ring Road",
            line2: "Sector 14",
            city: "Ahmedabad",
            state: "Gujarat",
            pincode: "380001",
            country: "India",
        },

        relation: {
            guardian: {
                name: "Nitin Patel",
                relation: "Father",
                contact: "+91-9887766554",
                email: "nitin.patel@example.com",
            },
            siblings: [],
        },

        programs: [
            {
                id: "P003",
                name: "English - Class 9",
                instructor: { id: "I003", name: "Meera Joshi" },
                startDate: "2024-07-01",
                endDate: "2025-03-31",
            },
        ],

        attendance: [
            { date: "2025-08-01", status: "Present" },
            { date: "2025-08-02", status: "Present" },
            { date: "2025-08-03", status: "Present" },
        ],
    },
];

// GET /api/students/:id
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const student = students.find((s) => s.id === id);

    if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
}