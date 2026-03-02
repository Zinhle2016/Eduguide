import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Sparkles, Download, Share2, Loader2, Search, Info } from 'lucide-react';
import { generateVisualAid } from '../services/geminiService';

const VisualLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateVisualAid(prompt);
      setGeneratedImage(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-xl">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Visual Learning Lab</h2>
        </div>
        <p className="text-lg text-slate-500 font-medium">Generate high-quality educational illustrations to visualize complex concepts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Concept to Visualize</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., The internal structure of a plant cell with labeled organelles..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all outline-none resize-none font-medium text-slate-700"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Visual
            </button>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Pro Tips
              </h4>
              <ul className="space-y-3">
                {['Be specific about labels', 'Mention cross-sections', 'Specify instructional style'].map((tip) => (
                  <li key={tip} className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-100 rounded-[2rem] aspect-video flex items-center justify-center border-4 border-white shadow-inner relative overflow-hidden group">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                  <p className="text-purple-600 font-bold uppercase tracking-widest text-sm">Crafting Illustration...</p>
                </motion.div>
              ) : generatedImage ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full"
                >
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-purple-50 hover:text-purple-600 transition-all shadow-xl">
                      <Download className="w-6 h-6" />
                    </button>
                    <button className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-purple-50 hover:text-purple-600 transition-all shadow-xl">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No visual generated yet</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-white rounded-2xl border border-slate-100 p-2 hover:border-purple-200 transition-colors cursor-pointer group">
                <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/edu${i}/800/450`} 
                    alt="Sample" 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualLab;
