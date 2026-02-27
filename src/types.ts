export interface SkillRequirement {
  skill: string;
  level: number; // 1-5
  weight: number; // 1-5
}

export interface Job {
  id: number;
  type: 'Job' | 'Internship';
  role: string;
  deadline: string;
  requirements: SkillRequirement[];
  description: string;
  created_at: string;
}

export interface StudentSkill {
  skill: string;
  level: number; // 1-5
}

export interface Project {
  title: string;
  skills: string[];
  proofLink?: string;
}

export interface Application {
  id: number;
  job_id: number;
  student_name: string;
  student_id: string;
  qualification: string;
  skills: StudentSkill[];
  projects: Project[];
  match_score: number;
  ai_feedback: AIFeedback;
  status: string;
  created_at: string;
  role?: string; // Joined from jobs
  type?: string; // Joined from jobs
}

export interface AIFeedback {
  percentage: number;
  explanation: string;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  isShortlisted: boolean;
}

export type UserRole = 'admin' | 'student' | null;
