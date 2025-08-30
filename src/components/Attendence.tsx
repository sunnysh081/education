"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
    subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AttendanceRecord = {
    date: string; // ISO date: "2025-08-20"
    status: "Present" | "Absent";
};

export default function AttendanceCalendar({
    attendance,
}: {
    attendance: AttendanceRecord[];
}) {
    const [month, setMonth] = useState(new Date());

    const presentDays = useMemo(
        () =>
            new Set(
                attendance.filter((a) => a.status === "Present").map((a) => a.date)
            ),
        [attendance]
    );
    const absentDays = useMemo(
        () =>
            new Set(
                attendance.filter((a) => a.status === "Absent").map((a) => a.date)
            ),
        [attendance]
    );

    const today = new Date();
    const monthDays = useMemo(
        () =>
            eachDayOfInterval({
                start: startOfMonth(month),
                end: endOfMonth(month),
            }),
        [month]
    );

    return (
        <div className="w-full flex flex-col items-center">
            {/* ✅ Calendar view (Desktop / Tablet) */}
            <div className="hidden sm:flex justify-center w-full">
                <div className="rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm bg-gray-50">
                    <DayPicker
                        month={month}
                        onMonthChange={setMonth}
                        mode="single"
                        showOutsideDays
                        className="text-sm"
                        modifiers={{
                            present: (day) => presentDays.has(format(day, "yyyy-MM-dd")),
                            absent: (day) => absentDays.has(format(day, "yyyy-MM-dd")),
                        }}
                        modifiersClassNames={{
                            present:
                                "bg-green-500 text-white font-bold rounded-full hover:bg-green-600",
                            absent:
                                "bg-red-500 text-white font-bold rounded-full hover:bg-red-600",
                        }}
                        modifiersStyles={{
                            today: {
                                border: "2px solid #2563eb",
                                borderRadius: "9999px",
                            },
                        }}
                        styles={{
                            caption: {
                                textAlign: "center",
                                fontWeight: "600",
                                marginBottom: "0.75rem",
                                fontSize: "0.875rem",
                            },
                            head_row: { fontSize: "0.75rem", color: "#6b7280" },
                            table: { margin: "0 auto" }, // ✅ Center grid
                            cell: { padding: "0.5rem" },
                        }}
                    />
                </div>
            </div>

            {/* ✅ Mobile vertical list view */}
            <div className="sm:hidden w-full max-w-md rounded-xl border border-gray-200 p-3 bg-white shadow-sm">
                {/* Month header with navigation */}
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={() => setMonth((m) => subMonths(m, 1))}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-center font-semibold text-gray-800">
                        {format(month, "MMMM yyyy")}
                    </h2>
                    <button
                        onClick={() => setMonth((m) => addMonths(m, 1))}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* List of days */}
                <div className="divide-y divide-gray-200">
                    {monthDays.map((day) => {
                        const iso = format(day, "yyyy-MM-dd");
                        const status = presentDays.has(iso)
                            ? "Present"
                            : absentDays.has(iso)
                                ? "Absent"
                                : "—";
                        return (
                            <div
                                key={iso}
                                className="flex items-center justify-between py-2 text-sm"
                            >
                                <span
                                    className={`${format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
                                            ? "font-bold text-blue-600"
                                            : "text-gray-700"
                                        }`}
                                >
                                    {format(day, "EEE d")}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${status === "Present"
                                            ? "bg-green-100 text-green-700"
                                            : status === "Absent"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    {status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ✅ Legend */}
            <div className="mt-4 flex justify-center flex-wrap gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-gray-700">Present</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="text-gray-700">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-blue-600"></span>
                    <span className="text-gray-700">Today</span>
                </div>
            </div>
        </div>
    );
}
