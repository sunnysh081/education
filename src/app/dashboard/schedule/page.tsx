"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    format,
    addMonths,
    subMonths,
    addDays,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
} from "date-fns";
import { cn } from "@/lib/utils";

type Schedule = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    time: string; // e.g. "10:00"
};

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: "1",
            title: "Morning Standup",
            startDate: new Date(),
            endDate: addDays(new Date(), 4),
            time: "10:00",
        },
        {
            id: "2",
            title: "Project Review",
            startDate: addDays(new Date(), 2),
            endDate: addDays(new Date(), 6),
            time: "15:00",
        },
    ]);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewMode, setViewMode] = useState<"month" | "day">("month");

    const [newTitle, setNewTitle] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newTime, setNewTime] = useState("");

    function getCalendarDays(date: Date) {
        const start = startOfWeek(startOfMonth(date));
        const end = endOfWeek(endOfMonth(date));
        const days: Date[] = [];
        let current = start;
        while (current <= end) {
            days.push(current);
            current = addDays(current, 1);
        }
        return days;
    }

    function handleCreateSchedule(e: React.FormEvent) {
        e.preventDefault();
        setSchedules([
            ...schedules,
            {
                id: Date.now().toString(),
                title: newTitle,
                startDate: new Date(newStartDate),
                endDate: new Date(newEndDate),
                time: newTime,
            },
        ]);
        setNewTitle("");
        setNewStartDate("");
        setNewEndDate("");
        setNewTime("");
    }

    function schedulesForDay(day: Date) {
        return schedules.filter((s) =>
            eachDayOfInterval({ start: s.startDate, end: s.endDate }).some((d) =>
                isSameDay(d, day)
            )
        );
    }

    const days = getCalendarDays(selectedDate);
    const today = new Date();

    const dailySchedules = schedulesForDay(selectedDate);

    return (
        <div className="space-y-6">
            {/* Header with month/year and actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                    >
                        Prev
                    </Button>
                    <h1 className="text-2xl font-semibold">
                        {format(selectedDate, "MMMM yyyy")}
                    </h1>
                    <Button
                        variant="outline"
                        onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                    >
                        Next
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === "month" ? "default" : "outline"}
                        onClick={() => setViewMode("month")}
                    >
                        Month View
                    </Button>
                    <Button
                        variant={viewMode === "day" ? "default" : "outline"}
                        onClick={() => setViewMode("day")}
                    >
                        Day View
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Create Schedule</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Schedule</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateSchedule} className="space-y-4">
                                <Input
                                    placeholder="Schedule title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                                <Input
                                    type="date"
                                    value={newStartDate}
                                    onChange={(e) => setNewStartDate(e.target.value)}
                                />
                                <Input
                                    type="date"
                                    value={newEndDate}
                                    onChange={(e) => setNewEndDate(e.target.value)}
                                />
                                <Input
                                    type="time"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                />
                                <Button type="submit" className="w-full">
                                    Save
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Calendar Modes */}
            {viewMode === "month" ? (
                // Month View
                <div className="grid grid-cols-7 gap-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="font-medium">
                            {d}
                        </div>
                    ))}
                    {days.map((day) => (
                        <div
                            key={day.toString()}
                            onClick={() => {
                                setSelectedDate(day);
                                setViewMode("day");
                            }}
                            className={cn(
                                "h-24 border rounded p-1 text-left cursor-pointer overflow-hidden",
                                !isSameMonth(day, selectedDate) && "bg-slate-100 text-slate-400",
                                isSameDay(day, today) && "border-blue-500",
                                isSameDay(day, selectedDate) && "bg-blue-50 border-blue-500"
                            )}
                        >
                            <div className="text-sm font-medium">{format(day, "d")}</div>
                            <div className="space-y-1">
                                {schedulesForDay(day).map((s) => (
                                    <div
                                        key={s.id}
                                        className="truncate text-xs rounded bg-blue-100 text-blue-800 px-1"
                                    >
                                        {s.title} ({s.time})
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Day View
                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        {format(selectedDate, "PPP")} – Daily Schedule
                    </h2>
                    <div className="divide-y border rounded">
                        {dailySchedules.length === 0 ? (
                            <p className="p-3 text-sm text-slate-500">
                                No schedules for this day
                            </p>
                        ) : (
                            dailySchedules.map((s) => (
                                <div key={s.id} className="p-3">
                                    <p className="font-medium">{s.title}</p>
                                    <p className="text-sm text-slate-600">🕒 {s.time}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
