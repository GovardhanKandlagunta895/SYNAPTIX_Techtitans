<<<<<<< HEAD
export type Role = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  role: Role;
  full_name: string;
  qualification?: string;
  communication_level?: number;
}

export interface Skill {
  name: string;
  level: number;
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
}

export interface Project {
  title: string;
<<<<<<< HEAD
  languages: string;
  description: string;
}

export interface Post {
  id: number;
  type: 'Job' | 'Internship' | 'Project';
  role: string;
  vacancies: number;
  deadline: string;
  company_name: string;
  address: string;
  description: string;
  communication_required: number;
  status: 'active' | 'archived';
  skills: Skill[];
=======
  skills: string[];
  proofLink?: string;
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
}

export interface Application {
  id: number;
<<<<<<< HEAD
  post_id: number;
  user_id: number;
  status: 'applied' | 'under_review' | 'shortlisted' | 'rejected' | 'selected';
  match_score: number;
  applied_at: string;
  // Joined fields
  role?: string;
  company_name?: string;
  deadline?: string;
  type?: string;
  full_name?: string;
  qualification?: string;
  communication_level?: number;
  skills?: Skill[];
  projects?: Project[];
}
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
