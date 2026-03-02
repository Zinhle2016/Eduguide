import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, BookOpen, Clock, ChevronRight, ChevronLeft, CheckCircle2, Loader2, ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import { generateCourseStructure, generateLessonContent, generateQuiz } from '../services/geminiService';
import { Course, Lesson, Quiz } from '../types';
import Markdown from 'react-markdown';

const CourseBuilder: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateCourseStructure(topic);
      setCourse(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsLessonLoading(true);
    setQuiz(null);
    setShowQuiz(false);
    try {
      const content = await generateLessonContent(course?.title || '', lesson.title);
      setLessonContent(content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLessonLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedLesson || !lessonContent) return;
    setIsQuizLoading(true);
    setShowQuiz(true);
    try {
      const result = await generateQuiz(selectedLesson.title, lessonContent);
      setQuiz(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const currentLessonIndex = course && selectedLesson 
    ? course.lessons.findIndex(l => l.id === selectedLesson.id) 
    : -1;

  const handlePreviousLesson = () => {
    if (course && currentLessonIndex > 0) {
      handleSelectLesson(course.lessons[currentLessonIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (course && currentLessonIndex < course.lessons.length - 1) {
      handleSelectLesson(course.lessons[currentLessonIndex + 1]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> AI Powered
        </div>
        <h2 className="text-5xl font-bold text-slate-900 tracking-tight">What do you want to learn today?</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Enter any topic, and our AI will craft a personalized curriculum just for you.
        </p>
      </header>

      {!course ? (
        <form onSubmit={handleGenerate} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Quantum Computing, Renaissance Art, Python Basics..."
            className="w-full pl-16 pr-40 py-6 bg-white border-2 border-slate-100 rounded-3xl text-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-sm font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => { setCourse(null); setTopic(''); }}
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> New Course
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{course.category}</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">{course.difficulty}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-10 shadow-sm">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">{course.title}</h3>
            <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mb-10 font-medium">{course.description}</p>
            
            <div className="grid gap-4">
              {course.lessons.map((lesson, idx) => (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleSelectLesson(lesson)}
                  className="w-full flex items-center gap-6 p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lesson.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-500 flex items-center gap-1 font-medium"><Clock className="w-4 h-4" /> {lesson.duration}</span>
                      <span className="text-sm text-slate-400 font-medium">• {lesson.content}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-all" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Lesson Content</p>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedLesson.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedLesson(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10">
                {isLessonLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-sm">Generating lesson content...</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {!showQuiz ? (
                      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:rounded">
                        <Markdown>{lessonContent || ''}</Markdown>
                        
                        <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col items-center text-center space-y-6">
                          <div className="bg-indigo-50 p-4 rounded-full">
                            <HelpCircle className="w-8 h-8 text-indigo-600" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-2xl font-bold text-slate-900">Ready to test your knowledge?</h4>
                            <p className="text-slate-500 font-medium">Generate a quick quiz based on this lesson to reinforce what you've learned.</p>
                          </div>
                          <button 
                            onClick={handleGenerateQuiz}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                          >
                            <Sparkles className="w-5 h-5" /> Generate Quiz
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-indigo-600" /> Lesson Quiz
                          </h4>
                          <button 
                            onClick={() => setShowQuiz(false)}
                            className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                          >
                            Back to Lesson
                          </button>
                        </div>

                        {isQuizLoading ? (
                          <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                            <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-sm">Crafting your quiz...</p>
                          </div>
                        ) : quiz && (
                          <div className="space-y-8">
                            {quiz.questions.map((q, qIdx) => (
                              <div key={qIdx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
                                <h5 className="text-xl font-bold text-slate-900 flex gap-3">
                                  <span className="text-indigo-600">{qIdx + 1}.</span> {q.question}
                                </h5>
                                <div className="grid gap-3">
                                  {q.options.map((option, oIdx) => (
                                    <div 
                                      key={oIdx}
                                      className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 font-medium ${
                                        oIdx === q.correctAnswerIndex 
                                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                          : 'bg-white border-slate-100 text-slate-600'
                                      }`}
                                    >
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                        oIdx === q.correctAnswerIndex 
                                          ? 'border-emerald-500 bg-emerald-500 text-white' 
                                          : 'border-slate-200 text-slate-400'
                                      }`}>
                                        {String.fromCharCode(65 + oIdx)}
                                      </div>
                                      {option}
                                      {oIdx === q.correctAnswerIndex && <CheckCircle2 className="w-5 h-5 ml-auto" />}
                                    </div>
                                  ))}
                                </div>
                                <div className="p-4 bg-indigo-50/50 rounded-2xl flex gap-3 items-start">
                                  <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                  <p className="text-sm text-indigo-900 leading-relaxed">
                                    <span className="font-bold">Explanation:</span> {q.explanation}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={handlePreviousLesson}
                    disabled={currentLessonIndex <= 0 || isLessonLoading}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Previous
                  </button>
                  <button 
                    onClick={handleNextLesson}
                    disabled={course ? currentLessonIndex >= course.lessons.length - 1 || isLessonLoading : true}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setSelectedLesson(null)}
                    className="flex-1 sm:flex-none px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
                    <CheckCircle2 className="w-5 h-5" /> Mark as Complete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseBuilder;
