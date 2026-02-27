import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

<<<<<<< HEAD
const db = new Database("hiresync.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'admin' or 'user'
    full_name TEXT,
    qualification TEXT,
    communication_level INTEGER DEFAULT 5,
    resume_url TEXT
  );

  CREATE TABLE IF NOT EXISTS user_skills (
    user_id INTEGER,
    skill_name TEXT,
    level INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    languages TEXT,
    description TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT, -- 'Job', 'Internship', 'Project'
    role TEXT,
    vacancies INTEGER,
    deadline DATETIME,
    company_name TEXT,
    address TEXT,
    description TEXT,
    communication_required INTEGER DEFAULT 5,
    status TEXT DEFAULT 'active' -- 'active', 'archived'
  );

  CREATE TABLE IF NOT EXISTS post_skills (
    post_id INTEGER,
    skill_name TEXT,
    level INTEGER,
    FOREIGN KEY(post_id) REFERENCES posts(id)
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
<<<<<<< HEAD
    post_id INTEGER,
    user_id INTEGER,
    status TEXT DEFAULT 'applied', -- 'applied', 'under_review', 'shortlisted', 'rejected', 'selected'
    match_score REAL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

<<<<<<< HEAD
  // Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { username, password, role } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ? AND role = ?").get(username, password, role);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", (req, res) => {
    const { username, password, role, full_name } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)").run(username, password, role, full_name);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ success: false, message: "Username already exists" });
    }
  });

  // Post Routes
  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY deadline DESC").all();
    const postsWithSkills = posts.map(post => {
      const skills = db.prepare("SELECT * FROM post_skills WHERE post_id = ?").all(post.id);
      return { ...post, skills };
    });
    res.json(postsWithSkills);
  });

  app.post("/api/posts", (req, res) => {
    const { type, role, vacancies, deadline, company_name, address, description, communication_required, skills } = req.body;
    const transaction = db.transaction(() => {
      const info = db.prepare(`
        INSERT INTO posts (type, role, vacancies, deadline, company_name, address, description, communication_required)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(type, role, vacancies, deadline, company_name, address, description, communication_required);
      
      const postId = info.lastInsertRowid;
      const insertSkill = db.prepare("INSERT INTO post_skills (post_id, skill_name, level) VALUES (?, ?, ?)");
      for (const skill of skills) {
        insertSkill.run(postId, skill.name, skill.level);
      }
      return postId;
    });
    const postId = transaction();
    res.json({ success: true, postId });
  });

  // Application Routes
  app.post("/api/applications", (req, res) => {
    const { post_id, user_id, qualification, skills, projects, communication_level } = req.body;
    
    // Update user profile
    db.prepare("UPDATE users SET qualification = ?, communication_level = ? WHERE id = ?").run(qualification, communication_level, user_id);
    
    // Update skills
    db.prepare("DELETE FROM user_skills WHERE user_id = ?").run(user_id);
    const insertSkill = db.prepare("INSERT INTO user_skills (user_id, skill_name, level) VALUES (?, ?, ?)");
    for (const skill of skills) {
      insertSkill.run(user_id, skill.name, skill.level);
    }

    // Update projects
    db.prepare("DELETE FROM user_projects WHERE user_id = ?").run(user_id);
    const insertProject = db.prepare("INSERT INTO user_projects (user_id, title, languages, description) VALUES (?, ?, ?, ?)");
    for (const project of projects) {
      insertProject.run(user_id, project.title, project.languages, project.description);
    }

    // Calculate Match Score
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(post_id);
    const postSkills = db.prepare("SELECT * FROM post_skills WHERE post_id = ?").all(post_id);
    
    let score = 0;
    let totalWeight = 0;

    // Skill match (60%)
    postSkills.forEach(ps => {
      const us = skills.find(s => s.name.toLowerCase() === ps.skill_name.toLowerCase());
      if (us) {
        const skillMatch = Math.min(us.level / ps.level, 1);
        score += skillMatch * 60;
      }
      totalWeight += 60;
    });

    // Communication match (20%)
    const commMatch = Math.min(communication_level / post.communication_required, 1);
    score += commMatch * 20;

    // Project relevance (20%) - simple keyword match for now
    let projectMatch = 0;
    projects.forEach(p => {
      postSkills.forEach(ps => {
        if (p.languages.toLowerCase().includes(ps.skill_name.toLowerCase()) || 
            p.description.toLowerCase().includes(ps.skill_name.toLowerCase())) {
          projectMatch = 20;
        }
      });
    });
    score += projectMatch;

    const finalScore = Math.min(score, 100);

    const info = db.prepare("INSERT INTO applications (post_id, user_id, match_score) VALUES (?, ?, ?)").run(post_id, user_id, finalScore);
    res.json({ success: true, applicationId: info.lastInsertRowid, score: finalScore });
  });

  app.get("/api/applications/user/:userId", (req, res) => {
    const apps = db.prepare(`
      SELECT a.*, p.role, p.company_name, p.deadline, p.type
      FROM applications a
      JOIN posts p ON a.post_id = p.id
      WHERE a.user_id = ?
    `).all(req.params.userId);
    res.json(apps);
  });

  app.get("/api/applications/post/:postId", (req, res) => {
    const apps = db.prepare(`
      SELECT a.*, u.full_name, u.qualification, u.communication_level
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.post_id = ?
    `).all(req.params.postId);

    const appsWithDetails = apps.map(app => {
      const skills = db.prepare("SELECT * FROM user_skills WHERE user_id = ?").all(app.user_id);
      const projects = db.prepare("SELECT * FROM user_projects WHERE user_id = ?").all(app.user_id);
      return { ...app, skills, projects };
    });

    res.json(appsWithDetails);
  });

  app.patch("/api/applications/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/analytics/post/:postId", (req, res) => {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_applicants,
        AVG(match_score) as avg_score,
        MAX(match_score) as top_score
      FROM applications
      WHERE post_id = ?
    `).get(req.params.postId);
    res.json(stats);
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
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
