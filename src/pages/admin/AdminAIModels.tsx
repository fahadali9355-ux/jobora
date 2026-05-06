import { useState } from 'react';
import { Brain, Cpu, Database, Activity, RefreshCw } from 'lucide-react';

const initialModels = [
  { id: 1, name: 'BERT Resume Matcher', desc: 'Core deep learning model for semantic resume-to-job matching.', accuracy: 94.2, status: 'Active', date: '2 days ago', icon: Brain },
  { id: 2, name: 'spaCy NER Parser', desc: 'Named Entity Recognition for extracting skills, dates, and locations.', accuracy: 98.1, status: 'Active', date: '1 week ago', icon: Database },
  { id: 3, name: 'TF-IDF Keyword Engine', desc: 'Fallback keyword extraction and basic relevance scoring.', accuracy: 91.5, status: 'Active', date: '1 month ago', icon: Cpu },
];

export default function AdminAIModels() {
  const [models, setModels] = useState(initialModels);
  const [trainingMap, setTrainingMap] = useState<Record<number, boolean>>({});

  const handleRetrain = (id: number) => {
    setTrainingMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setTrainingMap(prev => ({ ...prev, [id]: false }));
      // slightly bump accuracy to simulate learning
      setModels(prev => prev.map(m => m.id === id ? { ...m, accuracy: Math.min(99.9, m.accuracy + 0.3), date: 'Just now' } : m));
    }, 2000);
  };

  const healthMetrics = [
    { label: 'Resume Parse Time', value: '1.2s' },
    { label: 'Match Score Time', value: '0.8s' },
    { label: 'API Response Time', value: '45ms' },
    { label: 'System Uptime', value: '99.9%' },
  ];

  return (
    <div className="px-8 lg:px-12 py-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Machine Learning</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          AI Model <span className="font-serif italic font-normal text-black/60">Configuration & Performance</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          {models.map(model => {
            const isTraining = trainingMap[model.id];
            return (
              <div key={model.id} className="bg-white border border-black/5 p-6 flex flex-col sm:flex-row gap-6">
                <div className="w-16 h-16 shrink-0 bg-[#F5F5F2] flex items-center justify-center">
                  <model.icon className="w-6 h-6 text-black/60" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{model.name}</h3>
                      <p className="text-sm text-black/60 mt-1">{model.desc}</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[9px] uppercase tracking-widest font-bold border border-emerald-200">
                      {model.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm mb-2">
                     <span className="text-black/60 font-medium">Accuracy</span>
                     <span className="font-bold">{model.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#F5F5F2] overflow-hidden mb-4">
                     <div className="h-full bg-[#1A1A1A] transition-all duration-1000" style={{ width: `${model.accuracy}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center border-t border-black/5 pt-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-black/40">Last Trained: {model.date}</span>
                    <button 
                      onClick={() => handleRetrain(model.id)}
                      disabled={isTraining}
                      className={`btn-31 !py-2 !px-4 !text-[10px] ${isTraining ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-container"><span className="text flex items-center gap-2">
                         {isTraining ? <><RefreshCw className="w-3 h-3 animate-spin"/> Training...</> : 'Retrain Model'}
                      </span></span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <section className="bg-[#1A1A1A] text-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h2 className="text-[11px] uppercase tracking-widest font-bold text-white/50">System Health</h2>
            </div>
            <div className="space-y-6">
              {healthMetrics.map((m, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-sm text-white/60">{m.label}</span>
                  <span className="font-serif italic font-bold">{m.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-black/5 p-6 text-center">
             <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2">AI Engine Status</div>
             <div className="text-2xl font-bold tracking-tight text-emerald-600 flex justify-center items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
               Online
             </div>
             <p className="text-xs text-black/40 mt-4 leading-relaxed">
                All machine learning models are currently operational and serving predictions at normal latency.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
}
