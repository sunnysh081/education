"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Student {
  id: number;
  name: string;
  email: string;
}
interface Instructor {
  id: number;
  name: string;
  email: string;
}
interface Program {
  id: number;
  name: string;
  instructorId: number | null;
  studentIds: number[];
}

export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [newProgram, setNewProgram] = useState<Program>({
    id: 0,
    name: "",
    instructorId: null,
    studentIds: [],
  });

  const [selected, setSelected] = useState<Program | null>(null);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((d) => setStudents(Array.isArray(d.data) ? d.data : []));

    fetch("/api/instructors")
      .then((r) => r.json())
      .then((d) => setInstructors(Array.isArray(d) ? d : []));

    fetch("/api/programs")
      .then((r) => r.json())
      .then((d) => setPrograms(Array.isArray(d) ? d : []));
  }, []);

  const createProgram = () => {
    const prog: Program = {
      ...newProgram,
      id: programs.length + 1,
    };
    setPrograms((prev) => [...prev, prog]);
    setNewProgram({ id: 0, name: "", instructorId: null, studentIds: [] });
  };

  const toggleStudent = (studentId: number) => {
    setNewProgram((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter((id) => id !== studentId)
        : [...prev.studentIds, studentId],
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Programs</h1>

        {/* Create Program Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Program</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Program Name"
                value={newProgram.name}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, name: e.target.value })
                }
              />

              {/* Select Instructor */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Instructor
                </label>
                <select
                  value={newProgram.instructorId ?? ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      instructorId: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded p-2 text-sm"
                >
                  <option value="">-- Select Instructor --</option>
                  {instructors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Students */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Students
                </label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                  {students.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={newProgram.studentIds.includes(s.id)}
                        onCheckedChange={() => toggleStudent(s.id)}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={createProgram} className="w-full">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Programs List */}
      <table className="w-full border text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Instructor</th>
            <th className="border px-3 py-2 text-left">Students</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((p) => (
            <tr
              key={p.id}
              onClick={() => setSelected(p)}
              className={cn(
                "hover:bg-slate-50 cursor-pointer",
                selected?.id === p.id && "bg-slate-200 font-semibold"
              )}
            >
              <td className="border px-3 py-2">{p.id}</td>
              <td className="border px-3 py-2">{p.name}</td>
              <td className="border px-3 py-2">
                {instructors.find((i) => i.id === p.instructorId)?.name || "-"}
              </td>
              <td className="border px-3 py-2">
                {p.studentIds
                  .map((id) => students.find((s) => s.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Program Detail (when selected) */}
      {selected && (
        <div className="border rounded-lg p-4 bg-slate-50">
          <h2 className="text-lg font-semibold mb-3">
            Program Details – {selected.name}
          </h2>
          <p>
            <strong>Instructor: </strong>
            {instructors.find((i) => i.id === selected.instructorId)?.name || "-"}
          </p>
          <p>
            <strong>Students: </strong>
            {selected.studentIds
              .map((id) => students.find((s) => s.id === id)?.name)
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
