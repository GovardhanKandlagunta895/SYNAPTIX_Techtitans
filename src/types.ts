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
}

export interface Project {
  title: string;
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
}

export interface Application {
  id: number;
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
