import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("skillmatch.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    role TEXT,
    deadline TEXT,
    requirements TEXT, -- JSON string
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    student_name TEXT,
    student_id TEXT,
    qualification TEXT,
    skills TEXT, -- JSON string
    projects TEXT, -- JSON string
    match_score INTEGER,
    ai_feedback TEXT, -- JSON string
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare("SELECT * FROM jobs ORDER BY created_at DESC").all();
    res.json(jobs.map(j => ({ ...j, requirements: JSON.parse(j.requirements as string) })));
  });

  app.post("/api/jobs", (req, res) => {
    const { type, role, deadline, requirements, description } = req.body;
    const info = db.prepare(
      "INSERT INTO jobs (type, role, deadline, requirements, description) VALUES (?, ?, ?, ?, ?)"
    ).run(type, role, deadline, JSON.stringify(requirements), description);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/jobs/:id", (req, res) => {
    const job = db.prepare("SELECT * FROM jobs WHERE id = ?").get(req.params.id);
    if (job) {
       // @ts-ignore
      job.requirements = JSON.parse(job.requirements);
      res.json(job);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  });

  app.post("/api/applications", (req, res) => {
    const { jobId, studentName, studentId, qualification, skills, projects, matchScore, aiFeedback } = req.body;
    const info = db.prepare(
      "INSERT INTO applications (job_id, student_name, student_id, qualification, skills, projects, match_score, ai_feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(jobId, studentName, studentId, qualification, JSON.stringify(skills), JSON.stringify(projects), matchScore, JSON.stringify(aiFeedback));
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/applications/job/:jobId", (req, res) => {
    const apps = db.prepare("SELECT * FROM applications WHERE job_id = ? ORDER BY match_score DESC").all(req.params.jobId);
    res.json(apps.map(a => ({
      ...a,
      skills: JSON.parse(a.skills as string),
      projects: JSON.parse(a.projects as string),
      ai_feedback: JSON.parse(a.ai_feedback as string)
    })));
  });

  app.get("/api/applications/student/:studentId", (req, res) => {
    const apps = db.prepare(`
      SELECT a.*, j.role, j.type 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.student_id = ? 
      ORDER BY a.created_at DESC
    `).all(req.params.studentId);
    res.json(apps.map(a => ({
      ...a,
      skills: JSON.parse(a.skills as string),
      projects: JSON.parse(a.projects as string),
      ai_feedback: JSON.parse(a.ai_feedback as string)
    })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
