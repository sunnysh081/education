"use client";

import { useState, useEffect, useMemo } from "react";
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
    differenceInMinutes,
    isBefore,
    isAfter,
    isWithinInterval,
} from "date-fns";
import { cn } from "@/lib/utils";

type Schedule = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    time: string;
};

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: "1",
            title: "Morning Standup",
            startDate: new Date(new Date().setHours(9, 0, 0, 0)),
            endDate: new Date(new Date().setHours(9, 30, 0, 0)),
            time: "09:00",
        },
        {
            id: "2",
            title: "Project Review",
            startDate: new Date(new Date().setHours(14, 0, 0, 0)),
            endDate: new Date(new Date().setHours(15, 0, 0, 0)),
            time: "14:00",
        },
    ]);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewMode, setViewMode] = useState<"month" | "day">("month");
    const [newTitle, setNewTitle] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newTime, setNewTime] = useState("");

    const today = new Date();
    const days = getCalendarDays(selectedDate);
    const dailySchedules = schedulesForDay(selectedDate, schedules);

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const nextEvent = useMemo(() => {
        return dailySchedules
            .filter((s) => isAfter(s.startDate, now))
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
    }, [dailySchedules, now]);

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

    function schedulesForDay(day: Date, schedules: Schedule[]) {
        return schedules.filter((s) =>
            eachDayOfInterval({ start: s.startDate, end: s.endDate }).some((d) =>
                isSameDay(d, day)
            )
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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
                                    type="datetime-local"
                                    value={newStartDate}
                                    onChange={(e) => setNewStartDate(e.target.value)}
                                />
                                <Input
                                    type="datetime-local"
                                    value={newEndDate}
                                    onChange={(e) => setNewEndDate(e.target.value)}
                                />
                                <Button type="submit" className="w-full">
                                    Save
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Views */}
            {viewMode === "month" ? (
                <MonthView
                    days={days}
                    schedules={schedules}
                    selectedDate={selectedDate}
                    today={today}
                    setSelectedDate={setSelectedDate}
                    setViewMode={setViewMode}
                />
            ) : (
                <DayView
                    schedules={dailySchedules}
                    now={now}
                    selectedDate={selectedDate}
                    nextEvent={nextEvent}
                />
            )}
        </div>
    );
}

function MonthView({
    days,
    schedules,
    selectedDate,
    today,
    setSelectedDate,
    setViewMode,
}: any) {
    function schedulesForDay(day: Date) {
        return schedules.filter((s: Schedule) =>
            eachDayOfInterval({ start: s.startDate, end: s.endDate }).some((d) =>
                isSameDay(d, day)
            )
        );
    }

    return (
        <div className="grid grid-cols-7 gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="font-medium">
                    {d}
                </div>
            ))}
            {days.map((day: Date) => (
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
                        {schedulesForDay(day).map((s: Schedule) => (
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
    );
}

function DayView({
    schedules,
    now,
    selectedDate,
    nextEvent,
}: {
    schedules: Schedule[];
    now: Date;
    selectedDate: Date;
    nextEvent?: Schedule;
}) {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    function getEventStyle(event: Schedule) {
        const minutesFromStart = differenceInMinutes(event.startDate, startOfDay(event.startDate));
        const duration = differenceInMinutes(event.endDate, event.startDate);

        return {
            top: (minutesFromStart / 60) * 60,
            height: (duration / 60) * 60,
        };
    }

    function startOfDay(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }

    return (
        <div className="relative flex border rounded h-[1200px] overflow-y-scroll">
            {/* Time column */}
            <div className="w-16 border-r text-xs text-right pr-2">
                {hours.map((h) => (
                    <div key={h} className="h-16 relative">
                        <span className="absolute -top-2 right-0">{`${h
                            .toString()
                            .padStart(2, "0")}:00`}</span>
                    </div>
                ))}
            </div>

            {/* Events */}
            <div className="flex-1 relative">
                {schedules.map((event) => {
                    const style = getEventStyle(event);
                    const isOngoing = isWithinInterval(now, {
                        start: event.startDate,
                        end: event.endDate,
                    });
                    const isPast = isBefore(event.endDate, now);
                    const isUpcoming = nextEvent?.id === event.id;

                    return (
                        <div
                            key={event.id}
                            className={cn(
                                "absolute left-2 right-2 p-2 rounded border text-sm",
                                isOngoing && "bg-blue-100 border-blue-600",
                                isPast && "opacity-50",
                                isUpcoming && "bg-blue-50 border-blue-500"
                            )}
                            style={style}
                        >
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs">
                                {format(event.startDate, "HH:mm")} –{" "}
                                {format(event.endDate, "HH:mm")}
                            </p>
                        </div>
                    );
                })}

                {/* Current time line */}
                {isSameDay(now, selectedDate) && (
                    <div
                        className="absolute left-0 right-0 border-t-2 border-red-500"
                        style={{
                            top:
                                (differenceInMinutes(now, startOfDay(now)) / 60) *
                                60,
                        }}
                    >
                        <span className="absolute -top-2 left-0 bg-red-500 text-white text-xs px-1 rounded">
                            {format(now, "HH:mm")}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
