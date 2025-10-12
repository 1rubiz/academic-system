

// // app/departments/page.tsx
"use client";

import React from 'react'

function Department() {
  return (
    <div>Department</div>
  )
}

export default Department

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DepartmentRepo } from "@/lib/db";

// // type Department = {
// //   id: number;
// //   name: string;
// //   code: string;
// // };

// export default function DepartmentPage() {
//   const [departments, setDepartments] = useState([]);
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");

//   // Mock local DB fetch (replace with IPC in Electron)
//   // const fetchDepartments = async () => {
//   //   const res = await DepartmentRepo.getDepartments();
//   //   setDepartments(res);
//   // };

//   // const handleAdd = async () => {
//   //   await DepartmentRepo.addDepartment(name, code);
//   //   setName("");
//   //   setCode("");
//   //   fetchDepartments();
//   // };

//   // const handleDelete = async (id) => {
//   //   await window.api.removeDepartment(id);
//   //   fetchDepartments();
//   // };

//   // useEffect(() => {
//   //   fetchDepartments();
//   // }, []);

//   return (
//     <div className="w-full bg-white p-4 space-y-6 scrollbar h-full">
//       <h1 className="text-2xl font-bold">Departments</h1>

//       {/* Add form */}
//       <div className="flex gap-2">
//         <Input
//           placeholder="Department Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <Input
//           placeholder="Code"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//         />
//         <Button onClick={handleAdd} className={undefined} variant={undefined} size={undefined}>Add</Button>
//       </div>

//       {/* List */}
//       <ul className="space-y-2">
//         {departments.map((dept) => (
//           <li
//             key={dept.id}
//             className="flex justify-between items-center p-2 border rounded"
//           >
//             <span>
//               {dept.name} ({dept.code})
//             </span>
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => handleDelete(dept.id)}
//             >
//               Delete
//             </Button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
