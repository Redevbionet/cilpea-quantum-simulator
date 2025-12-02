import React, { useState } from 'react';
import { SimulationConfig, SimulationResult } from './types';
import { runBB84Simulation } from './services/bb84';
import { ControlPanel } from './components/ControlPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Visualizer } from './components/Visualizer';
import { AIChat } from './components/AIChat';
import { Atom, FileDown } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SimulationConfig>({
    numQubits: 800,
    eveInterceptRate: 0.0,
    sampleRate: 0.2
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRun = () => {
    setIsSimulating(true);
    // Add small delay to visualize loading state
    setTimeout(() => {
      const res = runBB84Simulation(config);
      setResult(res);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-lg">
                <Atom className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                CilPea
              </h1>
              <p className="text-xs text-slate-500">Amazing Calculator & Quantum Simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col text-right mr-4 text-xs text-slate-500 border-r border-slate-700 pr-4">
                <span>Protocol: BB84</span>
                <span>Security: Info-Theoretic</span>
             </div>
             <a 
               href="/BB84_demo.ipynb" 
               download 
               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg text-sm transition-colors border border-slate-700"
               title="Download Jupyter Notebook"
             >
               <FileDown size={16} />
               <span className="hidden sm:inline">Notebook</span>
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls & Viz (8 cols) */}
          <div className="lg:col-span-8">
            <ControlPanel 
              config={config} 
              setConfig={setConfig} 
              onRun={handleRun} 
              isSimulating={isSimulating}
            />
            
            <ResultsDashboard result={result} />
            
            <Visualizer result={result} />
          </div>

          {/* Right Column: AI Assistant (4 cols) */}
          <div className="lg:col-span-4">
             <div className="sticky top-24">
                <AIChat result={result} />
             </div>
          </div>

        </div>
      </main>
      
      <footer className="border-t border-slate-800 mt-12 py-6 text-center text-slate-600 text-sm">
        <p>© 2024 CilPea Project. BB84 Simulation & Molecular Quantum Context.</p>
        <p className="text-xs mt-1">Disclaimer: This is a client-side simulation for educational purposes.</p>
      </footer>
    </div>
  );
}