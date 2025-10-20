/* eslint-disable no-undef */
import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import os from 'os'
import fs from "fs";
import { autoUpdater } from 'electron-updater'
// import sqlite3 from 'sqlite3'
import Database from "better-sqlite3";
// import { DepartmentRepo } from './utils/db';
import { registerDepartmentHandlers } from './utils/handlers/departments.js';
import { registerCourseHandlers } from './utils/handlers/courses.js';
import { registerStudentHandlers } from './utils/handlers/students.js';
import { registerFacultyHandlers } from './utils/handlers/faculties.js';
import { registerSessionHandlers } from './utils/handlers/sessions.js';
import { registerResultsHandlers } from './utils/handlers/results.js';
import { registerCarryoversHandlers } from './utils/handlers/carryovers.js';
 registerDepartmentHandlers();
  registerCourseHandlers();
  registerStudentHandlers();
  registerFacultyHandlers();
  registerSessionHandlers();
  registerResultsHandlers();
  registerCarryoversHandlers();
// Initialize local SQLite DB

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const isDev = !app.isPackaged
let loadingWindow;
let mainWindow;
export let db;
const dbPath = path.join(process.cwd(), "db/academic_records.db");
export const excelPath = path.join(process.cwd(), `Result.xlsx`)
export const markSheetpath = (str = '') => {
  let documentsDir;
  
  // Handle different platforms if needed
  if (process.platform === 'win32') {
    documentsDir = path.join(os.homedir(), 'Documents');
  } else if (process.platform === 'darwin') {
    documentsDir = path.join(os.homedir(), 'Documents');
  } else {
    // Linux and other Unix-like systems
    documentsDir = path.join(os.homedir(), 'Documents');
  }
  
  return str ? path.join(documentsDir, str) : documentsDir;
};

function initDatabase() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, "");
    }
    db = new Database(dbPath);
    // --- Migrations ---
    db.exec(`
      CREATE TABLE IF NOT EXISTS faculties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        faculty_id INTEGER NOT NULL,
        FOREIGN KEY(faculty_id) REFERENCES faculties(id)
      );

      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        unit INTEGER NOT NULL,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        lecturer_id INTEGER,
        description TEXT,
        FOREIGN KEY(department_id) REFERENCES departments(id)
      );

      CREATE TABLE IF NOT EXISTS carryover (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courses TEXT,
        student_id INTEGER NOT NULL,
        FOREIGN KEY(student_id) REFERENCES students(id)
      );

      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        matric_no TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        middle_name TEXT,
        gender TEXT,
        department_id INTEGER,
        mode_of_entry TEXT DEFAULT u,
        faculty_id INTEGER NOT NULL,
        is_100_active BOOLEAN DEFAULT 0,
        is_100_complete BOOLEAN DEFAULT 0,
        is_200_active BOOLEAN DEFAULT 0,
        is_200_complete BOOLEAN DEFAULT 0,
        is_300_active BOOLEAN DEFAULT 0,
        is_300_complete BOOLEAN DEFAULT 0,
        is_400_active BOOLEAN DEFAULT 0,
        is_400_complete BOOLEAN DEFAULT 0,
        is_500_active BOOLEAN DEFAULT 0,
        is_500_complete BOOLEAN DEFAULT 0,
        is_600_active BOOLEAN DEFAULT 0,
        is_600_complete BOOLEAN DEFAULT 0,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (faculty_id) REFERENCES faculties(id)
      );
      


      CREATE TABLE IF NOT EXISTS student_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          session_id INTEGER NOT NULL,
          department_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, session_id),
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (session_id) REFERENCES sessions(id),
          FOREIGN KEY (department_id) REFERENCES departments(id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL, -- e.g., 2024/2025
        start_year INTEGER NOT NULL,
        end_year INTEGER NOT NULL,
        current INTEGER DEFAULT 0, -- marks the active session
        faculty_id INTEGER REFERENCES faculties(id) ON DELETE CASCADE,
        FOREIGN KEY (faculty_id) REFERENCES faculties(id)
      );

      CREATE TABLE IF NOT EXISTS semesters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
        name TEXT NOT NULL, -- 'First' or 'Second'
        UNIQUE(session_id, name),
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS session_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        semester_id INTEGER REFERENCES semesters(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        lecturer_id INTEGER,
        department_id INTEGER REFERENCES departments(id),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS session_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          course_id INTEGER NOT NULL,
          session_id INTEGER NOT NULL,
          semester_id INTEGER NOT NULL,
          score REAL CHECK (score >= 0 AND score <= 100),
          status TEXT DEFAULT 'valid',
          grade TEXT,
          grade_point REAL,
          updated_by TEXT,
          ca INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (course_id) REFERENCES courses(id)
          FOREIGN KEY (session_id) REFERENCES sessions(id)
          FOREIGN KEY (semester_id) REFERENCES semesters(id)
      );
    `);
// his200id1-
// ALTER TABLE students ADD COLUMN mode_of_entry TEXT DEFAULT U;
    console.log("✅ Database initialized with departments, courses, and students.");
  } catch (error) {
    console.log(error)
  }
}

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
  console.log('preload path: ', path.join(__dirname, "preload.cjs"))
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
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
    initDatabase();
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createLoadingWindow()
  createMainWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoadingWindow()
      createMainWindow()
    }
  })
  if (!isDev) {
    try {
      console.log('🟢 Checking for updates...')
      autoUpdater.checkForUpdates()

      autoUpdater.on('update-available', () => {
        console.log('🟡 Update available. Downloading silently...')
      })

      autoUpdater.on('update-downloaded', () => {
        console.log('🟢 Update downloaded. Installing silently...')
        autoUpdater.quitAndInstall(false, true)
      })

      autoUpdater.on('error', (err) => {
        console.error('🔴 Auto update error:', err)
      })
    } catch (err) {
      console.error('Update check failed:', err)
    }
  }
})

app.on('before-quit', () => db.close());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
