// // app/courses/page.tsx
"use client";
import React from 'react'

function Course() {
  return (
    <div>Course</div>
  )
}

export default Course

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// // type Department = {
// //   id: number;
// //   name: string;
// // };

// // type Course = {
// //   id: number;
// //   name: string;
// //   code: string;
// //   unit: number;
// //   department_id: number;
// //   department_name: string;
// // };

// export default function CoursePage() {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [unit, setUnit] = useState(3);
//   const [departmentId, setDepartmentId] = useState(null);

//   // const fetchData = async () => {
//   //   const [depts, crs] = await Promise.all([
//   //     window.api.getDepartments(),
//   //     window.api.getCourses(),
//   //   ]);
//   //   setDepartments(depts);
//   //   setCourses(crs);
//   // };

//   // const handleAdd = async () => {
//   //   if (!departmentId) return alert("Select a department first!");
//   //   await window.api.addCourse(name, code, unit, departmentId);
//   //   setName("");
//   //   setCode("");
//   //   setUnit(3);
//   //   fetchData();
//   // };

//   // const handleDelete = async (id) => {
//   //   await window.api.removeCourse(id);
//   //   fetchData();
//   // };

//   // useEffect(() => {
//   //   fetchData();
//   // }, []);

//   return (
//     <div className="max-w-2xl mx-auto p-4 space-y-6">
//       <h1 className="text-2xl font-bold">Courses</h1>

//       {/* Add form */}
//       <div className="grid grid-cols-5 gap-2 items-center">
//         <Input
//           placeholder="Course Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="col-span-2"
//         />
//         <Input
//           placeholder="Code"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//         />
//         <Input
//           type="number"
//           placeholder="Unit"
//           value={unit}
//           onChange={(e) => setUnit(parseInt(e.target.value))}
//           className="w-16"
//         />
//         <Select onValueChange={(val) => setDepartmentId(Number(val))}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select Dept" />
//           </SelectTrigger>
//           <SelectContent>
//             {departments.map((d) => (
//               <SelectItem key={d.id} value={String(d.id)}>
//                 {d.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {/* <Button onClick={handleAdd}>Add</Button> */}
//       </div>

//       {/* List */}
//       <ul className="space-y-2">
//         {courses.map((c) => (
//           <li
//             key={c.id}
//             className="flex justify-between items-center p-2 border rounded"
//           >
//             <span>
//               {c.code} – {c.name} ({c.unit} units) [{c.department_name}]
//             </span>
//             <Button
//               variant="destructive"
//               size="sm"
//               // onClick={() => handleDelete(c.id)}
//             >
//               Delete
//             </Button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
