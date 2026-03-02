import React from 'react';
import { LayoutDashboard, BookOpen, Mic2, FlaskConical, GraduationCap } from 'lucide-react';
import { AppView } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.COURSE_GEN, label: 'Course Builder', icon: BookOpen },
    { id: AppView.AI_TUTOR, label: 'AI Voice Tutor', icon: Mic2 },
    { id: AppView.LAB, label: 'Visual Lab', icon: FlaskConical },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Eduguide</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span className="font-medium">{item.label}</span>
            {currentView === item.id && (
              <motion.div
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Learning Progress</p>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-2/3 rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">65% of weekly goal</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
