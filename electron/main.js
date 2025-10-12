/* eslint-disable no-undef */
import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
// import { ipcMain } from 'electron';
// import { DepartmentRepo } from './utils/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const isDev = !app.isPackaged
let loadingWindow;
let mainWindow;

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    transparent: true,
    resizable: false,
    show: false,
  });

  loadingWindow.loadFile(path.join(__dirname, "loading.html"));
  loadingWindow.once("ready-to-show", () => {
    loadingWindow.show();
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const devUrl = "http://localhost:5174"; // your Vite URL
  if (isDev) {
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }
  

  mainWindow.once("ready-to-show", () => {
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
    // ipcMain.handle("get-departments", () => DepartmentRepo.all());
    // ipcMain.handle("add-department", (_, { name, code }) =>
    //   DepartmentRepo.add(name, code)
    // );
    // ipcMain.handle("remove-department", (_, { id }) =>
    //   DepartmentRepo.remove(id)
    // );
  });
}

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1800,
//     height: 900,
//     webPreferences: {
//       preload: join(__dirname, 'preload.js'),
//     },
//   })

//   if (isDev) {
//     win.loadURL('http://localhost:5174')
//     win.webContents.openDevTools()
//   } else {
//     win.loadFile(join(__dirname, '../dist/index.html'))
//   }
// }

app.whenReady().then(() => {
  // createWindow()
  createLoadingWindow()
  createMainWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoadingWindow()
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
