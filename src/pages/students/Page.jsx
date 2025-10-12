// app/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// type Department = {
//   id: number;
//   name: string;
// };

// type Student = {
//   id: number;
//   matric_no: string;
//   first_name: string;
//   last_name: string;
//   level: number;
//   department_name: string;
//   is_suspended: boolean;
// };

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [matricNo, setMatricNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [level, setLevel] = useState(100);
  const [departmentId, setDepartmentId] = useState(null);

  const fetchData = async () => {
    const [depts, studs] = await Promise.all([
      window.api.getDepartments(),
      window.api.getStudents(),
    ]);
    setDepartments(depts);
    setStudents(studs);
  };

  const handleAdd = async () => {
    if (!departmentId) return alert("Select a department first!");
    await window.api.addStudent(matricNo, firstName, lastName, level, departmentId);
    setMatricNo("");
    setFirstName("");
    setLastName("");
    setLevel(100);
    fetchData();
  };

  const handleSuspend = async (id, suspended) => {
    if (suspended) {
      await window.api.unsuspendStudent(id);
    } else {
      await window.api.suspendStudent(id);
    }
    fetchData();
  };

  const handleDelete = async (id) => {
    await window.api.removeStudent(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Students</h1>

      {/* Add form */}
      <div className="grid grid-cols-6 gap-2 items-center">
        <Input
          placeholder="Matric No"
          value={matricNo}
          onChange={(e) => setMatricNo(e.target.value)}
        />
        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Level"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
        />
        <Select onValueChange={(val) => setDepartmentId(Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Select Dept" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAdd}>Register</Button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {students.map((s) => (
          <li
            key={s.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>
              {s.matric_no} – {s.first_name} {s.last_name} (Lvl {s.level}) [{s.department_name}]
              {s.is_suspended && (
                <span className="ml-2 text-red-500 text-sm">(Suspended)</span>
              )}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={s.is_suspended ? "default" : "secondary"}
                onClick={() => handleSuspend(s.id, s.is_suspended)}
              >
                {s.is_suspended ? "Unsuspend" : "Suspend"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(s.id)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
