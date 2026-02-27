<<<<<<< HEAD
import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users, 
  BarChart3, 
  Archive, 
  LogOut, 
  User as UserIcon,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Filter,
  Eye,
  EyeOff,
  Download,
  Star,
  AlertCircle,
  TrendingUp,
  MapPin,
  Building2,
  Calendar,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Post, Application, Role, Skill, Project } from './types';
import { SKILLS_LIST, POST_TYPES, APPLICATION_STATUSES } from './constants';

// --- Contexts ---
const AuthContext = createContext<{
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });

// --- Components ---

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M50 5L95 50L50 95L5 50L50 5Z" stroke="#18181B" strokeWidth="8" />
      <path d="M25 35H75L65 15H35L25 35Z" fill="#06B6D4" />
      <path d="M45 35C45 35 40 60 40 80C40 100 60 100 60 80C60 60 55 35 55 35H45Z" fill="#8B5CF6" />
    </svg>
  </div>
);

const Sidebar = ({ role, activeTab, setActiveTab, onLogout }: { role: Role, activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void }) => {
  const adminLinks = [
    { id: 'new-post', label: 'New Post', icon: PlusCircle },
    { id: 'posted', label: 'Posted', icon: Briefcase },
    { id: 'shortlist', label: 'Shortlist Members', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'archived', label: 'Archived Posts', icon: Archive },
  ];

  const userLinks = [
    { id: 'new-posts', label: 'New Posts', icon: Briefcase },
    { id: 'shortlisted', label: 'Shortlisted', icon: CheckCircle2 },
    { id: 'recommended', label: 'Recommended', icon: Star },
    { id: 'tracker', label: 'Application Tracker', icon: Clock },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="w-64 bg-zinc-900 text-zinc-400 h-screen flex flex-col border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Logo className="w-8 h-8" />
          TalentMatrix AI
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === link.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <link.icon size={20} />
            <span className="font-medium">{link.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="bg-zinc-100 p-2 rounded-lg">
          <Search size={18} className="text-zinc-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="bg-transparent border-none focus:ring-0 text-sm w-64"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-zinc-50 p-1 rounded-xl transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-zinc-900">{user.full_name}</p>
              <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200">
              <UserIcon size={20} className="text-zinc-600" />
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 z-50"
              >
                <div className="p-3 border-b border-zinc-100 mb-2">
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Account</p>
                  <p className="text-sm font-bold text-zinc-900">{user.username}</p>
                </div>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 text-sm text-zinc-600 transition-all">
                  <UserIcon size={16} /> Edit Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 text-sm text-zinc-600 transition-all">
                  <FileText size={16} /> Upload Resume (PDF)
                </button>
                <div className="mt-2 pt-2 border-t border-zinc-100">
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 transition-all"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const LoginPage = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin ? { username, password, role } : { username, password, role, full_name: fullName };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      if (isLogin) {
        onLogin(data.user);
      } else {
        setIsLogin(true);
      }
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <Logo className="w-24 h-24" />
          </div>
          <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">
            TalentMatrix AI
          </h2>
          <p className="text-zinc-500 text-center mb-8 text-sm">
            {isLogin ? 'Enter your credentials to access your dashboard' : 'Join our platform to start your career journey'}
          </p>

          <div className="flex p-1 bg-zinc-100 rounded-xl mb-8">
            <button 
              onClick={() => setRole('user')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'user' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
            >
              User
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                placeholder="johndoe123"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
            <button className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-zinc-500 hover:text-emerald-600 font-medium transition-all"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Admin Sub-pages ---

const NewPost = () => {
  const [formData, setFormData] = useState({
    type: 'Job',
    role: '',
    vacancies: 1,
    deadline: '',
    company_name: '',
    address: '',
    description: '',
    communication_required: 5,
    skills: [{ name: 'Java', level: 5 }]
  });

  const [lastPost, setLastPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => {
      if (data.length > 0) setLastPost(data[0]);
    });
  }, []);

  const handleUseTemplate = () => {
    if (lastPost) {
      setFormData({
        ...lastPost,
        deadline: '',
        vacancies: 1
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role || !formData.deadline || !formData.company_name) {
      alert('Please fill all required fields');
      return;
    }
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert('Post created successfully!');
      setFormData({
        type: 'Job',
        role: '',
        vacancies: 1,
        deadline: '',
        company_name: '',
        address: '',
        description: '',
        communication_required: 5,
        skills: [{ name: 'Java', level: 5 }]
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Create New Opportunity</h2>
          <p className="text-zinc-500">Post a new job, internship, or project for candidates.</p>
        </div>
        {lastPost && (
          <button 
            onClick={handleUseTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-100 transition-all border border-emerald-200"
          >
            <FileText size={18} />
            Use Last Post Template
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Post Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {POST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Role Title</label>
            <input 
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Vacancies</label>
            <input 
              type="number"
              value={formData.vacancies}
              onChange={(e) => setFormData({...formData, vacancies: parseInt(e.target.value)})}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Deadline</label>
            <input 
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-zinc-500 uppercase">Required Skills</label>
          {formData.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <select 
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...formData.skills];
                  newSkills[idx].name = e.target.value;
                  setFormData({...formData, skills: newSkills});
                }}
                className="flex-1 px-4 py-2 bg-white border border-zinc-200 rounded-lg outline-none"
              >
                {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex-1 flex items-center gap-4">
                <span className="text-xs font-bold text-zinc-400 w-16">Level: {skill.level}</span>
                <input 
                  type="range" min="1" max="10" 
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[idx].level = parseInt(e.target.value);
                    setFormData({...formData, skills: newSkills});
                  }}
                  className="flex-1 accent-emerald-500"
                />
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newSkills = formData.skills.filter((_, i) => i !== idx);
                  setFormData({...formData, skills: newSkills});
                }}
                className="text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => setFormData({...formData, skills: [...formData.skills, { name: 'Java', level: 5 }]})}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <PlusCircle size={16} /> Add Skill
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Communication Level Required (1-10)</label>
          <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <span className="text-xs font-bold text-zinc-400 w-16">Level: {formData.communication_required}</span>
            <input 
              type="range" min="1" max="10" 
              value={formData.communication_required}
              onChange={(e) => setFormData({...formData, communication_required: parseInt(e.target.value)})}
              className="flex-1 accent-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Company Name</label>
            <input 
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Location/Address</label>
            <input 
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Description</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
          ></textarea>
        </div>

        <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
          Submit Post
        </button>
      </form>
    </div>
  );
};

const PostedPage = ({ onSelectPost }: { onSelectPost: (p: Post) => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => {
      setPosts(data.filter((p: Post) => p.status === 'active'));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Active Opportunities</h2>
          <p className="text-zinc-500">Manage and monitor your live job postings.</p>
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<<<<<<< HEAD
        {posts.map(post => (
          <motion.div 
            key={post.id}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {post.type}
              </div>
              <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
                <Clock size={14} />
                {new Date(post.deadline).toLocaleDateString()}
              </div>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-emerald-600 transition-colors">{post.role}</h3>
            <p className="text-sm text-zinc-500 mb-6 flex items-center gap-1">
              <Building2 size={14} /> {post.company_name}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Applicants</p>
                <p className="text-xl font-bold text-zinc-900">12</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Avg Score</p>
                <p className="text-xl font-bold text-emerald-600">84%</p>
              </div>
            </div>

            <button 
              onClick={() => onSelectPost(post)}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              View Details <ChevronRight size={18} />
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
            </button>
          </motion.div>
        ))}
      </div>
<<<<<<< HEAD
    </div>
  );
};

const ShortlistPage = ({ post, onBack }: { post: Post | null, onBack: () => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(post);
  const [applications, setApplications] = useState<Application[]>([]);
  const [blindMode, setBlindMode] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => setPosts(data));
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetch(`/api/applications/post/${selectedPost.id}`).then(res => res.json()).then(data => setApplications(data));
    }
  }, [selectedPost]);

  const handleStatusUpdate = async (appId: number, status: string) => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: status as any } : a));
      if (selectedApp?.id === appId) setSelectedApp(null);
    }
  };

  if (!selectedPost) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-8">Select a Post to Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedPost(p)}
              className="bg-white p-6 rounded-3xl border border-zinc-200 text-left hover:border-emerald-500 transition-all"
            >
              <p className="text-xs font-bold text-emerald-600 uppercase mb-2">{p.type}</p>
              <h3 className="text-lg font-bold text-zinc-900">{p.role}</h3>
              <p className="text-sm text-zinc-500">{p.company_name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => { setSelectedPost(null); onBack(); }} className="p-2 hover:bg-zinc-100 rounded-lg"><ArrowRight className="rotate-180" /></button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">{selectedPost.role}</h2>
            <p className="text-zinc-500">Reviewing {applications.length} applicants</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
            <button 
              onClick={() => setBlindMode(true)}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${blindMode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
            >
              <EyeOff size={16} /> Blind Mode
            </button>
            <button 
              onClick={() => setBlindMode(false)}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${!blindMode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
            >
              <Eye size={16} /> Reveal Names
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {applications.sort((a, b) => b.match_score - a.match_score).map(app => (
            <motion.div 
              key={app.id}
              layoutId={`app-${app.id}`}
              onClick={() => setSelectedApp(app)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer ${selectedApp?.id === app.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 font-bold">
                    {blindMode ? '#' + app.id : app.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{blindMode ? 'Candidate #' + app.id : app.full_name}</h4>
                    <p className="text-xs text-zinc-500">{blindMode ? 'Confidential Profile' : app.qualification}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-600">{Math.round(app.match_score)}%</div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Match Score</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedApp ? (
              <motion.div 
                key={selectedApp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm sticky top-24"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center text-zinc-400 font-bold text-2xl mx-auto mb-4">
                    {blindMode ? '?' : selectedApp.full_name?.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{blindMode ? 'Candidate #' + selectedApp.id : selectedApp.full_name}</h3>
                  <p className="text-zinc-500">{blindMode ? 'Hidden Identity' : selectedApp.qualification}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase mb-3 tracking-widest">Skills & Proficiency</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.skills?.map(s => (
                        <div key={s.name} className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-xs font-medium text-zinc-600">
                          {s.name} <span className="text-emerald-500 font-bold ml-1">{s.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase mb-3 tracking-widest">Match Breakdown</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500 font-medium">Technical Skills</span>
                        <span className="text-zinc-900 font-bold">85%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500 font-medium">Communication</span>
                        <span className="text-zinc-900 font-bold">{selectedApp.communication_level! * 10}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${selectedApp.communication_level! * 10}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => handleStatusUpdate(selectedApp.id, 'shortlisted')}
                      className="py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all text-sm"
                    >
                      Shortlist
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                      className="py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all text-sm border border-red-200"
                    >
                      Reject
                    </button>
                  </div>
                  <button 
                    onClick={() => handleStatusUpdate(selectedApp.id, 'selected')}
                    className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all text-sm"
                  >
                    Final Select
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center text-zinc-400">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">Select a candidate to view their full profile and match breakdown</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- User Sub-pages ---

const UserNewPosts = ({ onApply }: { onApply: (p: Post) => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => setPosts(data.filter((p: Post) => p.status === 'active')));
    if (user) {
      fetch(`/api/applications/user/${user.id}`).then(res => res.json()).then(data => {
        setAppliedIds(data.map((a: Application) => a.post_id));
      });
    }
  }, [user]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-8">Discover Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => {
          const isApplied = appliedIds.includes(post.id);
          return (
            <motion.div 
              key={post.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {post.type}
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                  92% Match
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-emerald-600 transition-colors">{post.role}</h3>
              <p className="text-sm text-zinc-500 mb-6 flex items-center gap-1">
                <Building2 size={14} /> {post.company_name}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.skills.slice(0, 3).map(s => (
                  <span key={s.name} className="px-2 py-1 bg-zinc-100 rounded-md text-[10px] font-bold text-zinc-500 uppercase">
                    {s.name}
                  </span>
                ))}
              </div>

              <button 
                disabled={isApplied}
                onClick={() => onApply(post)}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isApplied 
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {isApplied ? <><CheckCircle2 size={18} /> Applied</> : 'Apply Now'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ApplyForm = ({ post, onBack }: { post: Post, onBack: () => void }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    qualification: '',
    communication_level: 5,
    skills: [{ name: 'Java', level: 5 }],
    projects: [{ title: '', languages: '', description: '' }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        post_id: post.id,
        user_id: user?.id
      })
    });
    if (res.ok) {
      alert('Application submitted successfully!');
      onBack();
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
    }
  };

  return (
<<<<<<< HEAD
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-lg"><ArrowRight className="rotate-180" /></button>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Apply for {post.role}</h2>
          <p className="text-zinc-500">{post.company_name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Highest Qualification</label>
            <input 
              type="text"
              required
              value={formData.qualification}
              onChange={(e) => setFormData({...formData, qualification: e.target.value})}
              placeholder="e.g. B.Tech in Computer Science"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-zinc-500 uppercase">Your Skills & Proficiency</label>
          {formData.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <select 
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...formData.skills];
                  newSkills[idx].name = e.target.value;
                  setFormData({...formData, skills: newSkills});
                }}
                className="flex-1 px-4 py-2 bg-white border border-zinc-200 rounded-lg outline-none"
              >
                {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex-1 flex items-center gap-4">
                <span className="text-xs font-bold text-zinc-400 w-16">Level: {skill.level}</span>
                <input 
                  type="range" min="1" max="10" 
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[idx].level = parseInt(e.target.value);
                    setFormData({...formData, skills: newSkills});
                  }}
                  className="flex-1 accent-emerald-500"
                />
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newSkills = formData.skills.filter((_, i) => i !== idx);
                  setFormData({...formData, skills: newSkills});
                }}
                className="text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => setFormData({...formData, skills: [...formData.skills, { name: 'Java', level: 5 }]})}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <PlusCircle size={16} /> Add Skill
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Communication Level (1-10)</label>
          <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <span className="text-xs font-bold text-zinc-400 w-16">Level: {formData.communication_level}</span>
            <input 
              type="range" min="1" max="10" 
              value={formData.communication_level}
              onChange={(e) => setFormData({...formData, communication_level: parseInt(e.target.value)})}
              className="flex-1 accent-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-zinc-500 uppercase">Key Projects</label>
          {formData.projects.map((project, idx) => (
            <div key={idx} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-4">
              <input 
                type="text"
                placeholder="Project Title"
                value={project.title}
                onChange={(e) => {
                  const newProjects = [...formData.projects];
                  newProjects[idx].title = e.target.value;
                  setFormData({...formData, projects: newProjects});
                }}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg outline-none"
              />
              <input 
                type="text"
                placeholder="Languages/Tools Used (e.g. React, Node.js)"
                value={project.languages}
                onChange={(e) => {
                  const newProjects = [...formData.projects];
                  newProjects[idx].languages = e.target.value;
                  setFormData({...formData, projects: newProjects});
                }}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg outline-none"
              />
              <textarea 
                placeholder="Brief description of your role and impact"
                value={project.description}
                onChange={(e) => {
                  const newProjects = [...formData.projects];
                  newProjects[idx].description = e.target.value;
                  setFormData({...formData, projects: newProjects});
                }}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg outline-none"
              ></textarea>
              <button 
                type="button"
                onClick={() => {
                  const newProjects = formData.projects.filter((_, i) => i !== idx);
                  setFormData({...formData, projects: newProjects});
                }}
                className="text-red-400 text-xs font-bold uppercase"
              >
                Remove Project
              </button>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => setFormData({...formData, projects: [...formData.projects, { title: '', languages: '', description: '' }]})}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <PlusCircle size={16} /> Add Project
          </button>
        </div>

        <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20">
          Submit Application
        </button>
      </form>
    </div>
  );
};

const ApplicationTracker = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/applications/user/${user.id}`).then(res => res.json()).then(data => setApplications(data));
    }
  }, [user]);

  const getStatusStep = (status: string) => {
    const steps = ['applied', 'under_review', 'shortlisted', 'selected'];
    const idx = steps.indexOf(status);
    if (status === 'rejected') return -1;
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-zinc-900 mb-8">Application Tracker</h2>
      <div className="space-y-6">
        {applications.map(app => (
          <div key={app.id} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">{app.role}</h3>
                <p className="text-zinc-500">{app.company_name} • {app.type}</p>
              </div>
              <div className="text-right">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${APPLICATION_STATUSES.find(s => s.value === app.status)?.color}`}>
                  {APPLICATION_STATUSES.find(s => s.value === app.status)?.label}
                </div>
                <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                {['Applied', 'Review', 'Shortlist', 'Result'].map((step, i) => {
                  const currentStep = getStatusStep(app.status);
                  const isCompleted = currentStep >= i;
                  const isRejected = app.status === 'rejected' && i === currentStep + 1;
                  
                  return (
                    <div key={step} className="flex flex-col items-center gap-3 relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                        isCompleted ? 'bg-emerald-500 border-emerald-100 text-white' : 
                        isRejected ? 'bg-red-500 border-red-100 text-white' :
                        'bg-white border-zinc-100 text-zinc-300'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : i + 1}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-600' : 'text-zinc-400'}`}>
                        {isRejected ? 'Rejected' : step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {app.status === 'shortlisted' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100"
              >
                <h4 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
                  <Star size={18} /> You've been shortlisted!
                </h4>
                <p className="text-emerald-700 text-sm">
                  Your profile match score of {Math.round(app.match_score)}% caught the recruiter's eye. 
                  Expect an interview invitation in your email soon.
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => {
      setPosts(data);
      if (data.length > 0) setSelectedPostId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedPostId) {
      fetch(`/api/analytics/post/${selectedPostId}`).then(res => res.json()).then(data => setStats(data));
    }
  }, [selectedPostId]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Hiring Analytics</h2>
          <p className="text-zinc-500">Data-driven insights for your recruitment process.</p>
        </div>
        <select 
          value={selectedPostId || ''}
          onChange={(e) => setSelectedPostId(Number(e.target.value))}
          className="px-4 py-2 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {posts.map(p => <option key={p.id} value={p.id}>{p.role}</option>)}
        </select>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase mb-1">Total Applicants</p>
            <p className="text-3xl font-black text-zinc-900">{stats.total_applicants}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <Star size={24} />
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase mb-1">Avg Match Score</p>
            <p className="text-3xl font-black text-zinc-900">{Math.round(stats.avg_score || 0)}%</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase mb-1">Top Candidate Score</p>
            <p className="text-3xl font-black text-zinc-900">{Math.round(stats.top_score || 0)}%</p>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400">
          Select a post to view analytics
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-6">Most Missing Skills</h3>
          <div className="space-y-4">
            {['Docker', 'Kubernetes', 'AWS'].map((skill, i) => (
              <div key={skill} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-zinc-700">{skill}</span>
                    <span className="text-zinc-400">{80 - i * 10}% missing</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400" style={{ width: `${80 - i * 10}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-6">Application Source</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-zinc-200 mb-2" />
              <p className="text-zinc-400 text-sm">Source distribution chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchivedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => {
      setPosts(data.filter((p: Post) => new Date(p.deadline) < new Date()));
    });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">Archived Posts</h2>
      <p className="text-zinc-500 mb-8">Historical data for expired opportunities.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-3xl border border-zinc-200 opacity-75 grayscale hover:grayscale-0 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                {post.type}
              </div>
              <div className="text-red-500 text-xs font-bold">EXPIRED</div>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">{post.role}</h3>
            <p className="text-sm text-zinc-500 mb-6">{post.company_name}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all">View Data</button>
              <button className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-all">Duplicate</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400">
            No archived posts found.
          </div>
        )}
      </div>
    </div>
  );
};

const RecommendedPosts = ({ onApply }: { onApply: (p: Post) => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(data => {
      // Simple recommendation: filter by some logic or just show top matches
      setPosts(data.filter((p: Post) => p.status === 'active').slice(0, 2));
    });
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="bg-emerald-600 rounded-[2rem] p-10 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4">AI Recommendations</h2>
          <p className="text-emerald-100 max-w-md">We've analyzed your profile and found these top matches for your skills and experience.</p>
        </div>
        <Star className="absolute -right-8 -bottom-8 text-emerald-500/30 w-64 h-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-8 rounded-[2rem] border border-zinc-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
                <Building2 size={28} />
              </div>
              <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                98% Match
              </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors">{post.role}</h3>
            <p className="text-zinc-500 mb-8">{post.company_name} • {post.address}</p>
            
            <div className="p-6 bg-zinc-50 rounded-2xl mb-8 border border-zinc-100">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-4 tracking-widest">Why Recommended?</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Matches your Java & React expertise
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 size={16} className="text-emerald-500" /> High communication score alignment
                </li>
              </ul>
            </div>

            <button 
              onClick={() => onApply(post)}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              Apply with QuickMatch <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserShortlisted = () => {
  const { user } = useContext(AuthContext);
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/applications/user/${user.id}`).then(res => res.json()).then(data => {
        setApps(data.filter((a: Application) => a.status === 'shortlisted' || a.status === 'selected'));
      });
    }
  }, [user]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-8">Shortlisted Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <div key={app.id} className="bg-white p-6 rounded-3xl border border-emerald-200 bg-emerald-50/10 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                {app.status}
              </div>
              <div className="text-emerald-600 text-xs font-bold">{Math.round(app.match_score)}% Match</div>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">{app.role}</h3>
            <p className="text-sm text-zinc-500 mb-6">{app.company_name}</p>
            <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all">View Next Steps</button>
          </div>
        ))}
        {apps.length === 0 && (
          <div className="col-span-full p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-400">
            No shortlisted applications yet. Keep applying!
          </div>
        )}
      </div>
    </div>
  );
};
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3

// --- Main App ---

export default function App() {
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (user) {
      setActiveTab(user.role === 'admin' ? 'new-post' : 'new-posts');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setActiveTab('');
    setSelectedPost(null);
  };

  const renderContent = () => {
    if (user.role === 'admin') {
      switch (activeTab) {
        case 'new-post': return <NewPost />;
        case 'posted': return <PostedPage onSelectPost={(p) => { setSelectedPost(p); setActiveTab('shortlist'); }} />;
        case 'shortlist': return <ShortlistPage post={selectedPost} onBack={() => setSelectedPost(null)} />;
        case 'analytics': return <AnalyticsPage />;
        case 'archived': return <ArchivedPage />;
        default: return <NewPost />;
      }
    } else {
      switch (activeTab) {
        case 'new-posts': return <UserNewPosts onApply={(p) => { setSelectedPost(p); setActiveTab('apply'); }} />;
        case 'apply': return selectedPost ? <ApplyForm post={selectedPost} onBack={() => setActiveTab('new-posts')} /> : null;
        case 'shortlisted': return <UserShortlisted />;
        case 'recommended': return <RecommendedPosts onApply={(p) => { setSelectedPost(p); setActiveTab('apply'); }} />;
        case 'tracker': return <ApplicationTracker />;
        default: return <UserNewPosts onApply={(p) => { setSelectedPost(p); setActiveTab('apply'); }} />;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: setUser, logout: handleLogout }}>
      {!user ? (
        <LoginPage onLogin={setUser} />
      ) : (
        <div className="flex min-h-screen bg-zinc-50 font-sans">
        <Sidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto bg-zinc-50/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    )}
    </AuthContext.Provider>
=======
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
>>>>>>> a85f3bb77bdc99b5f772285df2d20d72dcea38a3
  );
}
