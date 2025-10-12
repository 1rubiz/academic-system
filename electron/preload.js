// Preload for secure bridging if needed
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getDepartments: () => ipcRenderer.invoke("get-departments"),
  addDepartment: (name, code) =>
    ipcRenderer.invoke("add-department", { name, code }),
  removeDepartment: (id) =>
    ipcRenderer.invoke("remove-department", { id }),
});
