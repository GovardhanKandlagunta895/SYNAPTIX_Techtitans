import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Plus, 
  Send, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Bell, 
  LogOut,
  Award,
  Code,
  BookOpen,
  ArrowRight,
  Target,
  Zap,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, Application, UserRole, SkillRequirement, StudentSkill, Project, AIFeedback } from './types';
import { calculateMatch } from './services/geminiService';

// --- Components ---

const Login = ({ onLogin }: { onLogin: (role: UserRole) => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-12 rounded-[24px] shadow-xl max-w-md w-full border border-slate-200"
    >
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Target size={32} />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">Skill-Based Internship</h1>
      <p className="text-center text-slate-500 mb-8">Precision matching for professional growth</p>
      
      <div className="space-y-4">
        <button 
          onClick={() => onLogin('admin')}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <User size={20} /> Login as Admin
        </button>
        <button 
          onClick={() => onLogin('student')}
          className="w-full py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <BookOpen size={20} /> Login as Student
        </button>
      </div>
    </motion.div>
  </div>
);

const AdminDashboard = ({ jobs, onNewPost, onViewApplications }: { 
  jobs: Job[], 
  onNewPost: () => void,
  onViewApplications: (job: Job) => void 
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'role'>('newest');

  const filteredJobs = jobs
    .filter(job => 
      job.role.toLowerCase().includes(search.toLowerCase()) || 
      job.type.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      return 0;
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 mt-2">Manage opportunities and evaluate candidate alignment.</p>
        </div>
        <button 
          onClick={onNewPost}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Post Opportunity
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by role or type (Job/Internship)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="text-slate-400" size={18} />
          <select 
            className="flex-1 md:w-48 p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="newest">Newest First</option>
            <option value="deadline">Deadline (Soonest)</option>
            <option value="role">Role Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <motion.div 
            key={job.id}
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onViewApplications(job)}
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                job.type === 'Job' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {job.type}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">#{job.id}</span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{job.role}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-6">{job.description}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Bell size={14} />
                <span>Due: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
          </motion.div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 italic">No opportunities found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StudentDashboard = ({ jobs, appliedJobs, onApply }: { 
  jobs: Job[], 
  appliedJobs: Application[],
  onApply: (job: Job) => void 
}) => (
  <div className="space-y-12">
    <section>
      <h2 className="text-4xl font-bold text-slate-900 mb-8">Available Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {jobs.filter(j => !appliedJobs.find(a => a.job_id === j.id)).map((job) => (
          <motion.div 
            key={job.id}
            className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {job.type}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Deadline: {job.deadline}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{job.role}</h3>
              <p className="text-slate-500 mb-6 text-sm">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.requirements.slice(0, 3).map((req, i) => (
                  <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-3 py-1 rounded-md border border-slate-100">
                    {req.skill}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onApply(job)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all whitespace-nowrap shadow-md shadow-indigo-50"
            >
              Apply <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>

    {appliedJobs.length > 0 && (
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Your Applications</h2>
        <div className="space-y-4">
          {appliedJobs.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  app.match_score >= 70 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                }`}>
                  <span className="text-lg font-bold">{app.match_score}%</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">{app.role}</h4>
                  <p className="text-xs text-slate-400">{app.type} • Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {app.match_score >= 70 ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-4 py-2 rounded-lg text-xs">
                    <CheckCircle size={14} /> Shortlisted
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-semibold bg-slate-50 px-4 py-2 rounded-lg text-xs">
                    <Zap size={14} /> Under Review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
);

const JobPostForm = ({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (job: Partial<Job>) => void, key?: string }) => {
  const [formData, setFormData] = useState({
    type: 'Job' as 'Job' | 'Internship',
    role: '',
    deadline: '',
    description: '',
    requirements: [] as SkillRequirement[]
  });

  const [newSkill, setNewSkill] = useState({ skill: '', level: 3, weight: 3 });

  const addSkill = () => {
    if (newSkill.skill) {
      setFormData({ ...formData, requirements: [...formData.requirements, newSkill] });
      setNewSkill({ skill: '', level: 3, weight: 3 });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto bg-white p-12 rounded-[40px] shadow-2xl border border-black/5"
    >
      <h2 className="text-4xl font-serif mb-8">Post Opportunity</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Type</label>
            <select 
              className="w-full p-4 rounded-2xl bg-[#f5f5f0] border-none focus:ring-2 focus:ring-[#5A5A40]"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as any})}
            >
              <option>Job</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Deadline</label>
            <input 
              type="date" 
              className="w-full p-4 rounded-2xl bg-[#f5f5f0] border-none focus:ring-2 focus:ring-[#5A5A40]"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Role Title</label>
          <input 
            type="text" 
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full p-4 rounded-2xl bg-[#f5f5f0] border-none focus:ring-2 focus:ring-[#5A5A40]"
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
          <textarea 
            rows={4}
            placeholder="Tell us about the role..."
            className="w-full p-4 rounded-2xl bg-[#f5f5f0] border-none focus:ring-2 focus:ring-[#5A5A40]"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="p-6 bg-[#f5f5f0] rounded-[24px]">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4">Skill Requirements</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.requirements.map((req, i) => (
              <span key={i} className="bg-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-sm">
                {req.skill} <span className="text-xs text-gray-400">L{req.level} W{req.weight}</span>
                <button onClick={() => setFormData({...formData, requirements: formData.requirements.filter((_, idx) => idx !== i)})} className="text-red-400">×</button>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Skill"
              className="md:col-span-2 p-3 rounded-xl bg-white border-none text-sm"
              value={newSkill.skill}
              onChange={e => setNewSkill({...newSkill, skill: e.target.value})}
            />
            <select 
              className="p-3 rounded-xl bg-white border-none text-sm"
              value={newSkill.level}
              onChange={e => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5].map(v => <option key={v} value={v}>Level {v}</option>)}
            </select>
            <button 
              onClick={addSkill}
              className="bg-[#5A5A40] text-white rounded-xl p-3 hover:bg-[#4a4a35]"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={onCancel} className="flex-1 py-4 rounded-full border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button 
            onClick={() => onSubmit(formData)}
            className="flex-1 py-4 rounded-full bg-[#5A5A40] text-white hover:bg-[#4a4a35]"
          >
            Post Opportunity
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ApplicationForm = ({ job, onCancel, onSubmit }: { job: Job, onCancel: () => void, onSubmit: (app: any) => void, key?: string }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    qualification: '',
    skills: [] as StudentSkill[],
    projects: [] as Project[]
  });

  const [newSkill, setNewSkill] = useState({ skill: '', level: 3 });
  const [newProject, setNewProject] = useState({ title: '', skills: [] as string[] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    if (newSkill.skill) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill({ skill: '', level: 3 });
    }
  };

  const addProject = () => {
    if (newProject.title) {
      setFormData({ ...formData, projects: [...formData.projects, newProject] });
      setNewProject({ title: '', skills: [] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const feedback = await calculateMatch(job, {
        skills: formData.skills,
        projects: formData.projects,
        qualification: formData.qualification
      });
      onSubmit({ ...formData, jobId: job.id, matchScore: feedback.percentage, aiFeedback: feedback });
    } catch (error) {
      console.error(error);
      alert("Error calculating match. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white p-12 rounded-[40px] shadow-2xl border border-black/5"
    >
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-serif mb-2">Application Form</h2>
          <p className="text-gray-500 font-serif italic">Applying for: <span className="text-[#5A5A40] font-bold">{job.role}</span></p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full"><XCircle size={24} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-serif border-b border-black/5 pb-2">Personal Details</h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl bg-[#f5f5f0] border-none"
              value={formData.studentName}
              onChange={e => setFormData({...formData, studentName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Student ID</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl bg-[#f5f5f0] border-none"
              value={formData.studentId}
              onChange={e => setFormData({...formData, studentId: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Qualification</label>
            <input 
              type="text" 
              placeholder="e.g. B.Tech in CSE"
              className="w-full p-4 rounded-2xl bg-[#f5f5f0] border-none"
              value={formData.qualification}
              onChange={e => setFormData({...formData, qualification: e.target.value})}
            />
          </div>

          <h3 className="text-xl font-serif border-b border-black/5 pb-2 pt-6">Skills & Proficiency</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map((s, i) => (
              <span key={i} className="bg-[#5A5A40] text-white px-4 py-2 rounded-full text-xs flex items-center gap-2">
                {s.skill} (L{s.level})
                <button onClick={() => setFormData({...formData, skills: formData.skills.filter((_, idx) => idx !== i)})}>×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Skill"
              className="flex-1 p-3 rounded-xl bg-[#f5f5f0] border-none text-sm"
              value={newSkill.skill}
              onChange={e => setNewSkill({...newSkill, skill: e.target.value})}
            />
            <select 
              className="p-3 rounded-xl bg-[#f5f5f0] border-none text-sm"
              value={newSkill.level}
              onChange={e => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5].map(v => <option key={v} value={v}>Lvl {v}</option>)}
            </select>
            <button onClick={addSkill} className="bg-[#5A5A40] text-white px-4 rounded-xl"><Plus size={18} /></button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-serif border-b border-black/5 pb-2">Projects</h3>
          <div className="space-y-3">
            {formData.projects.map((p, i) => (
              <div key={i} className="p-4 bg-[#f5f5f0] rounded-2xl relative">
                <h4 className="font-bold text-sm">{p.title}</h4>
                <p className="text-xs text-gray-500">{p.skills.join(', ')}</p>
                <button 
                  onClick={() => setFormData({...formData, projects: formData.projects.filter((_, idx) => idx !== i)})}
                  className="absolute top-2 right-2 text-red-400"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-6 border-2 border-dashed border-gray-200 rounded-[24px] space-y-4">
            <input 
              type="text" 
              placeholder="Project Title"
              className="w-full p-3 rounded-xl bg-[#f5f5f0] border-none text-sm"
              value={newProject.title}
              onChange={e => setNewProject({...newProject, title: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Skills used (comma separated)"
              className="w-full p-3 rounded-xl bg-[#f5f5f0] border-none text-sm"
              onChange={e => setNewProject({...newProject, skills: e.target.value.split(',').map(s => s.trim())})}
            />
            <button 
              onClick={addProject}
              className="w-full py-3 bg-white border border-[#5A5A40] text-[#5A5A40] rounded-xl text-sm font-bold hover:bg-[#5A5A40] hover:text-white transition-all"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-black/5">
        <button 
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full py-5 bg-[#5A5A40] text-white rounded-full text-xl font-serif hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>Calculating Match with AI...</>
          ) : (
            <>Submit Application <Send size={24} /></>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const MatchResultModal = ({ result, onDone }: { result: AIFeedback, onDone: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-2xl mx-auto bg-white p-12 rounded-[40px] shadow-2xl border border-black/5 text-center"
  >
    <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 ${
      result.isShortlisted ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
    }`}>
      <span className="text-4xl font-bold">{result.percentage}%</span>
    </div>
    
    <h2 className="text-4xl font-serif mb-4">
      {result.isShortlisted ? "You're a Great Match!" : "Keep Improving!"}
    </h2>
    <p className="text-gray-500 font-serif italic mb-8">{result.explanation}</p>

    <div className="grid grid-cols-2 gap-6 text-left mb-8">
      <div className="p-6 bg-emerald-50 rounded-[24px]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">Matched Skills</h4>
        <ul className="space-y-2">
          {result.matchedSkills.map((s, i) => (
            <li key={i} className="text-sm flex items-center gap-2"><CheckCircle size={14} /> {s}</li>
          ))}
        </ul>
      </div>
      <div className="p-6 bg-orange-50 rounded-[24px]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-4">Missing/Low Skills</h4>
        <ul className="space-y-2">
          {result.missingSkills.map((s, i) => (
            <li key={i} className="text-sm flex items-center gap-2"><XCircle size={14} /> {s}</li>
          ))}
        </ul>
      </div>
    </div>

    <div className="bg-[#f5f5f0] p-8 rounded-[24px] text-left mb-8">
      <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-4 flex items-center gap-2">
        <Zap size={16} /> AI Suggestions
      </h4>
      <ul className="space-y-3">
        {result.suggestions.map((s, i) => (
          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 bg-[#5A5A40] rounded-full shrink-0" />
            {s}
          </li>
        ))}
      </ul>
    </div>

    <button 
      onClick={onDone}
      className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-bold hover:bg-[#4a4a35]"
    >
      Return to Dashboard
    </button>
  </motion.div>
);

const ApplicationsList = ({ job, applications, onBack }: { job: Job, applications: Application[], onBack: () => void, key?: string }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-2 hover:bg-white rounded-full"><ChevronRight className="rotate-180" /></button>
      <div>
        <h2 className="text-4xl font-serif">{job.role}</h2>
        <p className="text-gray-500 font-serif italic">Applications for this role</p>
      </div>
    </div>

    <div className="space-y-4">
      {applications.map((app) => (
        <motion.div 
          key={app.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-8">
            <div className={`w-20 h-20 rounded-[24px] flex flex-col items-center justify-center ${
              app.match_score >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
            }`}>
              <span className="text-2xl font-bold">{app.match_score}%</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Match</span>
            </div>
            <div>
              <h3 className="text-2xl font-serif">{app.student_name}</h3>
              <p className="text-sm text-gray-400 font-mono">{app.student_id} • {app.qualification}</p>
              <div className="flex gap-2 mt-2">
                {app.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-[10px] bg-gray-50 px-2 py-1 rounded-full border border-black/5">
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-1">AI Verdict</p>
              <p className="text-sm text-gray-500 max-w-xs line-clamp-2 italic">"{app.ai_feedback.explanation}"</p>
            </div>
            <button className="text-[#5A5A40] font-bold text-sm flex items-center gap-1 hover:underline">
              View Full Profile <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      ))}
      {applications.length === 0 && (
        <div className="text-center py-20 bg-white/50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-serif italic text-xl">No applications yet.</p>
        </div>
      )}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [view, setView] = useState<'dashboard' | 'post' | 'apply' | 'result' | 'apps'>('dashboard');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [matchResult, setMatchResult] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  const studentId = "STU123"; // Mock student ID for demo

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const jobsRes = await fetch('/api/jobs');
      if (!jobsRes.ok) throw new Error(`Failed to fetch jobs: ${jobsRes.statusText}`);
      const jobsData = await jobsRes.json();
      setJobs(jobsData);

      if (role === 'student') {
        const appsRes = await fetch(`/api/applications/student/${studentId}`);
        if (!appsRes.ok) throw new Error(`Failed to fetch applications: ${appsRes.statusText}`);
        const appsData = await appsRes.json();
        setApplications(appsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (jobData: Partial<Job>) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (!res.ok) throw new Error(`Failed to post job: ${res.statusText}`);
      fetchData();
      setView('dashboard');
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  const handleApply = async (appData: any) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...appData, studentId })
      });
      if (!res.ok) throw new Error(`Failed to submit application: ${res.statusText}`);
      const data = await res.json();
      setMatchResult(appData.aiFeedback);
      setView('result');
      fetchData();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const viewJobApplications = async (job: Job) => {
    setSelectedJob(job);
    try {
      const res = await fetch(`/api/applications/job/${job.id}`);
      if (!res.ok) throw new Error(`Failed to fetch applications for job: ${res.statusText}`);
      const data = await res.json();
      setApplications(data);
      setView('apps');
    } catch (error) {
      console.error("Error viewing applications:", error);
    }
  };

  if (loading && !role) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-semibold text-xl text-slate-400">Loading Skill-Based Internship...</div>;

  if (!role) return <Login onLogin={(r) => { setRole(r); fetchData(); }} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Target size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">Skill-Based Internship</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {role === 'admin' ? 'Administrator' : 'Student Profile'}
            </span>
          </div>
          <button 
            onClick={() => setRole(null)}
            className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {role === 'admin' ? (
                <AdminDashboard 
                  jobs={jobs} 
                  onNewPost={() => setView('post')} 
                  onViewApplications={viewJobApplications}
                />
              ) : (
                <StudentDashboard 
                  jobs={jobs} 
                  appliedJobs={applications} 
                  onApply={(j) => { setSelectedJob(j); setView('apply'); }}
                />
              )}
            </motion.div>
          )}

          {view === 'post' && (
            <JobPostForm key="post" onCancel={() => setView('dashboard')} onSubmit={handlePostJob} />
          )}

          {view === 'apply' && selectedJob && (
            <ApplicationForm 
              key="apply" 
              job={selectedJob} 
              onCancel={() => setView('dashboard')} 
              onSubmit={handleApply} 
            />
          )}

          {view === 'result' && matchResult && (
            <MatchResultModal key="result" result={matchResult} onDone={() => setView('dashboard')} />
          )}

          {view === 'apps' && selectedJob && (
            <ApplicationsList 
              key="apps" 
              job={selectedJob} 
              applications={applications} 
              onBack={() => setView('dashboard')} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-200 mt-12 flex justify-between items-center text-slate-400 text-sm">
        <p>© 2026 Skill-Based Internship. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
