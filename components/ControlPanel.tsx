import React from 'react';
import { SimulationConfig } from '../types';
import { Play, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';

interface ControlPanelProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  onRun: () => void;
  isSimulating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, onRun, isSimulating }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Quantum Controller</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* N Qubits */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            จำนวน Qubits (N): {config.numQubits}
          </label>
          <input
            type="range"
            name="numQubits"
            min="50"
            max="2000"
            step="50"
            value={config.numQubits}
            onChange={handleChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Eve Rate */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <ShieldAlert size={16} className={config.eveInterceptRate > 0 ? "text-red-400" : "text-green-400"} />
            ระดับการดักฟัง (Eve Intercept Rate): {(config.eveInterceptRate * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            name="eveInterceptRate"
            min="0"
            max="1"
            step="0.05"
            value={config.eveInterceptRate}
            onChange={handleChange}
            className={`w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer ${
              config.eveInterceptRate > 0.2 ? 'accent-red-500' : 'accent-yellow-400'
            }`}
          />
        </div>

        {/* Sample Rate */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            อัตราการสุ่มตรวจสอบ (Sample Rate): {(config.sampleRate * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            name="sampleRate"
            min="0.1"
            max="0.9"
            step="0.1"
            value={config.sampleRate}
            onChange={handleChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onRun}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
            isSimulating 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]'
          }`}
        >
          {isSimulating ? <RotateCcw className="animate-spin" /> : <Play />}
          {isSimulating ? 'Simulating...' : 'Run Protocol'}
        </button>
      </div>
    </div>
  );
};
