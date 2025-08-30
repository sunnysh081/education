"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { toast } from "sonner";
import AttendanceCalendar from "@/components/Attendence";

type Student = {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email?: string;
    mobile: string;
    dob: string;
    gender: string;
    bloodGroup: string;
    nationality: string;
    joiningDate: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    relation: {
        guardian: { name: string; relation: string; contact: string; email?: string };
        siblings: { id: string; name: string; relation: string; age: number }[];
    };
    programs: {
        id: string;
        name: string;
        instructor: { id: string; name: string };
        startDate: string;
        endDate: string;
    }[];
    attendance: { date: string; status: "Present" | "Absent" }[];
};

export default function StudentProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<Partial<Student>>({});

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setStudent(data);
                setForm(data);
            });
    }, [id]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const saveChanges = async () => {
        try {
            const res = await fetch(`/api/students/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to update student");

            const updated = await res.json();
            setStudent(updated);
            setEditMode(false);
            toast.success("Student updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Update failed");
        }
    };

    if (!student) return <div className="p-6">Loading...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {student.firstName} {student.middleName} {student.lastName}
                            </h1>
                            <p className="text-sm text-gray-500">ID: {student.id}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {editMode ? (
                            <>
                                <Button variant="outline" onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={saveChanges}>Save</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => router.back()}>
                                    Back
                                </Button>
                                <Button onClick={() => setEditMode(true)}>Edit</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Sections stacked one below the other */}
            <div className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full space-y-6 p-6">
                {/* Details */}
                <SectionCard title="Details">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <EditableInfo label="Email" value={form.email} editMode={editMode} onChange={(val) => handleChange("email", val)} />
                        <EditableInfo label="Mobile" value={form.mobile} editMode={editMode} onChange={(val) => handleChange("mobile", val)} />
                        <EditableInfo label="Date of Birth" value={form.dob} editMode={editMode} onChange={(val) => handleChange("dob", val)} />
                        <EditableInfo label="Gender" value={form.gender} editMode={editMode} onChange={(val) => handleChange("gender", val)} />
                    </div>
                </SectionCard>

                {/* Address */}
                <SectionCard title="Address">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <EditableInfo label="Line 1" value={form.address?.line1} editMode={editMode} onChange={(val) => handleChange("address.line1", val)} />
                        <EditableInfo label="City" value={form.address?.city} editMode={editMode} onChange={(val) => handleChange("address.city", val)} />
                    </div>
                </SectionCard>

                {/* Relation */}
                <SectionCard title="Guardian">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <EditableInfo label="Name" value={form.relation?.guardian?.name} editMode={editMode} onChange={(val) => handleChange("relation.guardian.name", val)} />
                        <EditableInfo label="Contact" value={form.relation?.guardian?.contact} editMode={editMode} onChange={(val) => handleChange("relation.guardian.contact", val)} />
                    </div>
                </SectionCard>

                {/* Programs */}
                <SectionCard title="Programs">
                    {student.programs.map((p) => (
                        <p key={p.id} className="text-sm text-gray-700">
                            {p.name} — {p.instructor.name}
                        </p>
                    ))}
                </SectionCard>

                {/* Attendance Section */}
                <SectionCard title="Attendance Overview">
                    <AttendanceCalendar attendance={student.attendance} />

                </SectionCard>
            </div>
        </div>
    );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                {children}
            </CardContent>
        </Card>
    );
}

function EditableInfo({
    label,
    value,
    editMode,
    onChange,
}: {
    label: string;
    value?: string;
    editMode: boolean;
    onChange: (val: string) => void;
}) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            {editMode ? (
                <Input value={value || ""} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <p className="font-medium text-gray-800">{value || "—"}</p>
            )}
        </div>
    );
}