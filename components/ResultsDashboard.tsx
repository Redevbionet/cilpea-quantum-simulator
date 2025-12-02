import React from 'react';
import { SimulationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lock, Eye, Info, Activity, Key } from 'lucide-react';

interface ResultsDashboardProps {
  result: SimulationResult | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  if (!result) return <div className="text-center text-slate-500 py-10">Waiting for simulation data...</div>;

  const matchData = [
    { name: 'Matched Basis', value: result.siftedKeyLength },
    { name: 'Discarded', value: result.rawKeyLength - result.siftedKeyLength },
  ];

  const qberPercent = (result.qber * 100).toFixed(2);
  const qberColor = result.isSecure ? '#4ade80' : '#f87171'; // Green vs Red

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 overflow-visible">
            <div className="flex justify-between items-start">
                <div className="relative group flex items-center gap-1 cursor-help">
                    <span className="text-slate-400 text-sm border-b border-dotted border-slate-600">QBER</span>
                    <Info size={14} className="text-slate-500 hover:text-cyan-400 transition-colors" />
                    
                    {/* Tooltip */}
                    <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-slate-900 border border-slate-600 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none invisible group-hover:visible">
                        <h4 className="text-cyan-400 font-bold text-xs mb-1">Why 11%?</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            This is the <strong>Shor-Preskill limit</strong>. If the error rate exceeds ~11%, it is theoretically impossible to distill a secure key using one-way communication because Eve could have gained more information about the key than Bob.
                        </p>
                        <div className="absolute bottom-[-5px] left-6 w-2.5 h-2.5 bg-slate-900 border-b border-r border-slate-600 transform rotate-45"></div>
                    </div>
                </div>
                <Activity size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-mono font-bold mt-1" style={{ color: qberColor }}>
                {qberPercent}%
            </div>
            <div className="text-xs text-slate-500 mt-1">Threshold: 11%</div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start">
                <span className="text-slate-400 text-sm">Sifted Key</span>
                <Key size={16} className="text-yellow-400" />
            </div>
            <div className="text-2xl font-mono font-bold mt-1 text-white">
                {result.siftedKeyLength} <span className="text-sm font-normal text-slate-500">bits</span>
            </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 col-span-2">
            <div className="flex items-center gap-2 mb-2">
                {result.isSecure ? <Lock className="text-green-500" /> : <Eye className="text-red-500" />}
                <span className={`font-bold ${result.isSecure ? 'text-green-400' : 'text-red-400'}`}>
                    {result.isSecure ? "SECURE CHANNEL" : "COMPROMISED"}
                </span>
            </div>
            <p className="text-sm text-slate-300">{result.securityMessage}</p>
        </div>

        {result.isSecure && (
            <div className="bg-slate-900 p-4 rounded-xl border border-green-900 col-span-2 overflow-hidden relative">
                <div className="absolute top-2 right-2 text-xs text-green-700 font-mono">FINAL KEY (HEX)</div>
                <div className="font-mono text-green-500 break-all text-sm mt-4 max-h-24 overflow-y-auto">
                    {result.finalKey}
                </div>
            </div>
        )}
      </div>

      {/* Charts */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
        <h3 className="text-slate-400 text-sm mb-4 w-full text-left">Basis Matching Efficiency</h3>
        <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matchData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                        cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {matchData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : '#475569'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        
        {result.sampleSize > 0 && (
            <div className="w-full mt-4 pt-4 border-t border-slate-700">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Sampled for QBER: {result.sampleSize} bits</span>
                    <span>Errors: {result.errorsFound}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${Math.min(result.qber * 100, 100)}%` }}
                    />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};