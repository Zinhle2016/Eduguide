import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CourseBuilder from './components/CourseBuilder';
import VoiceTutor from './components/VoiceTutor';
import VisualLab from './components/VisualLab';
import { AppView } from './types';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.COURSE_GEN:
        return <CourseBuilder />;
      case AppView.AI_TUTOR:
        return <VoiceTutor />;
      case AppView.LAB:
        return <VisualLab />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed top-0 right-0 -z-10 w-[50vw] h-[50vh] bg-indigo-100/30 blur-[100px] rounded-full"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[40vw] h-[40vh] bg-purple-100/30 blur-[100px] rounded-full"></div>
    </div>
  );
};

export default App;
