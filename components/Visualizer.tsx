import React, { useMemo, useState } from 'react';
import { SimulationResult, Qubit, Basis } from '../types';
import { ArrowUp, ArrowRight, ArrowUpRight, ArrowDownRight, EyeOff, Eye, Search } from 'lucide-react';

interface VisualizerProps {
  result: SimulationResult | null;
}

const QubitIcon: React.FC<{ state: string, className?: string }> = ({ state, className }) => {
  const iconClass = `w-4 h-4 ${className}`;
  switch (state) {
    case '↑': return <ArrowUp className={iconClass} />;
    case '→': return <ArrowRight className={iconClass} />;
    case '↗': return <ArrowUpRight className={iconClass} />;
    case '↘': return <ArrowDownRight className={iconClass} />;
    default: return null;
  }
};

export const Visualizer: React.FC<VisualizerProps> = ({ result }) => {
  const [page, setPage] = useState(0);
  const pageSize = 50;

  if (!result) return null;

  const totalPages = Math.ceil(result.qubits.length / pageSize);
  const currentQubits = result.qubits.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <h3 className="font-bold text-white flex items-center gap-2">
            <Search size={16} className="text-cyan-400"/> Quantum Channel Inspector
        </h3>
        <div className="flex gap-2 text-xs">
            <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-2 py-1 bg-slate-700 rounded disabled:opacity-50 hover:bg-slate-600"
            >
                Prev
            </button>
            <span className="self-center text-slate-400">Page {page + 1} / {totalPages}</span>
            <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-2 py-1 bg-slate-700 rounded disabled:opacity-50 hover:bg-slate-600"
            >
                Next
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900 text-xs uppercase font-medium text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3 text-center">Alice State</th>
              <th className="px-4 py-3 text-center">Alice Basis</th>
              <th className="px-4 py-3 text-center">Eve Action</th>
              <th className="px-4 py-3 text-center">Bob Basis</th>
              <th className="px-4 py-3 text-center">Measured</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {currentQubits.map((q) => (
              <tr key={q.id} className={`hover:bg-slate-700/30 transition-colors ${q.basisMatch ? 'bg-cyan-900/10' : ''}`}>
                <td className="px-4 py-2 font-mono text-xs">{q.id}</td>
                
                {/* Alice */}
                <td className="px-4 py-2 text-center">
                    <div className="flex justify-center text-cyan-400">
                        <QubitIcon state={q.sentState} />
                    </div>
                </td>
                <td className="px-4 py-2 text-center font-mono text-xs text-slate-500">
                    {q.aliceBasis}
                </td>

                {/* Eve */}
                <td className="px-4 py-2 text-center">
                    {q.eveIntercepted ? (
                        <div className="flex flex-col items-center justify-center">
                            <Eye size={14} className="text-red-400 mb-1" />
                            <span className="text-[10px] text-red-300 font-mono">{q.eveBasis}</span>
                        </div>
                    ) : (
                        <div className="flex justify-center opacity-20">
                            <span className="h-0.5 w-4 bg-slate-500 block"></span>
                        </div>
                    )}
                </td>

                {/* Bob */}
                <td className="px-4 py-2 text-center font-mono text-xs text-slate-500">
                    {q.bobBasis}
                </td>
                <td className="px-4 py-2 text-center font-mono font-bold text-white">
                    {q.bobMeasuredBit}
                </td>

                {/* Result */}
                <td className="px-4 py-2 text-center">
                    {!q.basisMatch ? (
                        <span className="text-xs text-slate-600">Discarded</span>
                    ) : q.sampleForQBER ? (
                         q.aliceBit === q.bobMeasuredBit ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] border border-blue-500/30">Public (OK)</span>
                         ) : (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] border border-red-500/30">Public (Err)</span>
                         )
                    ) : (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] border border-green-500/30">Key Bit</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
