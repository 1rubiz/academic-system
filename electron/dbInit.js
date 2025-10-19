import fs from "fs";
import Database from "better-sqlite3";
import { dbPath } from "./main.js";

export let db;

export function initDatabase(db) {
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
        code TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        department_id INTEGER,
        lecturer_id INTEGER,
        description TEXT,
        FOREIGN KEY(department_id) REFERENCES departments(id)
      );

      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        matric_no TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        department_id INTEGER,
        level INTEGER DEFAULT 100,
        status TEXT DEFAULT 'active',
        FOREIGN KEY(department_id) REFERENCES departments(id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL, -- e.g., 2024/2025
        start_year INTEGER NOT NULL,
        end_year INTEGER NOT NULL,
        current INTEGER DEFAULT 0 -- marks the active session
      );

      CREATE TABLE IF NOT EXISTS semesters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
        name TEXT NOT NULL, -- 'First' or 'Second'
        UNIQUE(session_id, name)
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
        score REAL NOT NULL,
        grade TEXT NOT NULL,
        grade_point REAL NOT NULL,
        gpa REAL,
        senate_rating TEXT,
        remarks TEXT,
        created_by TEXT,
        updated_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (semester_id) REFERENCES semesters(id)
      );

      CREATE TABLE IF NOT EXISTS session_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        session_id INTEGER NOT NULL,
        semester_id INTEGER NOT NULL,
        score REAL,
        status TEXT DEFAULT 'NA', -- NA, AB, NR, or NORMAL
        grade TEXT DEFAULT 'NA',
        grade_point REAL DEFAULT 0,
        gpa REAL DEFAULT 0,
        senate_rating TEXT DEFAULT 'NA',
        remarks TEXT,
        created_by TEXT,
        updated_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (semester_id) REFERENCES semesters(id)
      );
    `);

    console.log("✅ Database initialized with departments, courses, and students.");
  } catch (error) {
    console.log(error)
  }
}