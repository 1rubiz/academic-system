

// // app/departments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// import { DepartmentRepo } from "@/lib/db";

// type Department = {
//   id: number;
//   name: string;
//   code: string;
// };

export default function DepartmentPage({id}) {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // Mock local DB fetch (replace with IPC in Electron)
  const fetchDepartments = async () => {
    const res = await window.api.departments.getDepartments();
    console.log(res)
    setDepartments(res);
  };

  const handleAdd = async () => {
    console.log(id)
    if(!id){
      alert("Select a faculty");
    }
    await window.api.departments.addDepartment(name, code, id);
    setName("");
    setCode("");
    fetchDepartments();
  };

  // const handleDelete = async (id) => {
  //   await window.api.departments.deleteDepartment(id);
  //   fetchDepartments();
  // };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="w-full bg-white p-4 space-y-6 scrollbar h-full">
      <h1 className="text-2xl font-bold">Departments</h1>

      {/* Add form */}
      <div className="flex gap-2">
        <Input
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={handleAdd} className={undefined} variant={undefined} size={undefined}>Add</Button>
      </div>

      {/* List */}
      <Card className="p-4 flex flex-col items-center justify-center">
        <ul className="space-y-2 h-14 w-14 text-xl animate-pulse bg-green-700 rounded-full flex items-center justify-center text-white">
            {
              departments.length
            }
          {/* {departments.map((dept) => (
            <li
              key={dept.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>
                {dept.name} ({dept.code})
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(dept.id)}
              >
                Delete
              </Button>
            </li>
          ))} */}
        </ul>
      </Card>
    </div>
  );
}
