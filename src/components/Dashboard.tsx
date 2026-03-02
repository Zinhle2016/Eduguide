import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Clock, Star, ArrowRight, PlayCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Courses Started', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Quizzes Passed', value: '45', icon: Trophy, color: 'bg-amber-500' },
    { label: 'Study Hours', value: '128h', icon: Clock, color: 'bg-emerald-500' },
    { label: 'Avg Score', value: '92%', icon: Star, color: 'bg-purple-500' },
  ];

  const recentCourses = [
    { title: 'Quantum Mechanics 101', progress: 75, category: 'Physics', lastAccessed: '2 hours ago' },
    { title: 'Modern Art History', progress: 30, category: 'Arts', lastAccessed: 'Yesterday' },
    { title: 'Python for Data Science', progress: 95, category: 'Programming', lastAccessed: '3 days ago' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome back, Scholar!</h2>
        <p className="text-lg text-slate-500 font-medium">Ready to continue your learning journey?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Continue Learning</h3>
            <button className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid gap-4">
            {recentCourses.map((course, idx) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-6 group hover:border-indigo-200 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <PlayCircle className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{course.category}</span>
                    <span className="text-xs text-slate-400 font-medium">• {course.lastAccessed}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{course.title}</h4>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{course.progress}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Insights</h3>
          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-3 leading-tight">You're excelling in Visual Learning!</h4>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-90">
                Based on your recent lab sessions, you grasp spatial concepts 40% faster than average. Try the new "Advanced Geometry" module.
              </p>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Explore Module
              </button>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
