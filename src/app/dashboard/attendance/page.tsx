"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Student {
    id: number;
    name: string;
    email: string;
}

type AttendanceStatus = "present" | "absent" | "late";

interface AttendanceRecord {
    studentId: number;
    status: AttendanceStatus;
}

export default function AttendancePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

    useEffect(() => {
        fetch("/api/students")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data.data) ? data.data : [];
                setStudents(list);
                setAttendance(
                    list.map((s: Student) => ({
                        studentId: s.id,
                        status: "present",
                    }))
                );
            });
    }, []);

    const updateStatus = (studentId: number, status: AttendanceStatus) => {
        setAttendance((prev) =>
            prev.map((a) =>
                a.studentId === studentId ? { ...a, status } : a
            )
        );
    };

    const bulkUpdate = (status: AttendanceStatus) => {
        setAttendance((prev) =>
            prev.map((a) => ({ ...a, status }))
        );
    };

    const submitAttendance = () => {
        console.log("Submitting attendance:", attendance);
        // POST -> /api/attendance { date, records: attendance }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Bulk actions */}
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => bulkUpdate("present")}>
                    Mark All Present
                </Button>
                <Button variant="outline" onClick={() => bulkUpdate("absent")}>
                    Mark All Absent
                </Button>
                <Button variant="outline" onClick={() => bulkUpdate("late")}>
                    Mark All Late
                </Button>
            </div>

            {/* Student table */}
            <table className="w-full border text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="border px-3 py-2 text-left">ID</th>
                        <th className="border px-3 py-2 text-left">Name</th>
                        <th className="border px-3 py-2 text-left">Email</th>
                        <th className="border px-3 py-2 text-left">Present</th>
                        <th className="border px-3 py-2 text-left">Absent</th>
                        <th className="border px-3 py-2 text-left">Late</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s) => {
                        const record = attendance.find((a) => a.studentId === s.id);
                        return (
                            <tr key={s.id} className="hover:bg-slate-50">
                                <td className="border px-3 py-2">{s.id}</td>
                                <td className="border px-3 py-2">{s.name}</td>
                                <td className="border px-3 py-2">{s.email}</td>
                                {["present", "absent", "late"].map((status) => (
                                    <td key={status} className="border px-3 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={record?.status === status}
                                            onChange={() => updateStatus(s.id, status as AttendanceStatus)}
                                            className="h-4 w-4"
                                        />
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex justify-end">
                <Button onClick={submitAttendance}>Submit Attendance</Button>
            </div>
        </div>
    );
}
