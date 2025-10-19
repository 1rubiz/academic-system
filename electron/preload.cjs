// Preload for secure bridging if needed
const { contextBridge } = require("electron");
const departmentApis = require("./utils/preloadsInvoke/departments.js");
const courseApis = require("./utils/preloadsInvoke/courses.js");
const studentApis = require("./utils/preloadsInvoke/student.js");
const facultyApis = require("./utils/preloadsInvoke/faculties.js");
const sessionApis = require("./utils/preloadsInvoke/sessions.js")
const resultApis = require("./utils/preloadsInvoke/result.js")
const carryoverApis = require("./utils/preloadsInvoke/carryovers.js")

const { departmentAPI } = departmentApis;
const { courseAPI } = courseApis;
const { studentAPI } = studentApis;
const { facultyAPI } = facultyApis
const { sessionAPI } = sessionApis
const { resultAPI } = resultApis;
const { carryoverAPI } = carryoverApis;
console.log('preload success!')
contextBridge.exposeInMainWorld("api", {
  departments: departmentAPI,
  courses: courseAPI,
  students: studentAPI,
  faculties: facultyAPI,
  sessions: sessionAPI,
  result: resultAPI,
  carryovers: carryoverAPI
});