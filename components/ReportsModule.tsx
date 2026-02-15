
import React, { useState } from 'react';
import { BarChart, PieChart, TrendingUp, Users, Target, Zap, Loader2, Check } from 'lucide-react';
import { ContentTask, ContentStatus } from '../types';

interface ReportsModuleProps {
  tasks: ContentTask[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ tasks }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = tasks.length;
  const approvedCount = statusCounts[ContentStatus.APROVADO] || 0;
  const deliveredCount = statusCounts[ContentStatus.ENTREGUE] || 0;
  const completionRate = total > 0 ? Math.round(((approvedCount + deliveredCount) / total) * 100) : 0;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setHasExported(true);
      setTimeout(() => setHasExported(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-orange-100 dark:bg-orange-950/30 text-orange-600 rounded-xl">
            <Target size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Taxa de Conclusão</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{completionRate}%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 rounded-xl">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Média de Produção</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">4.2 <span className="text-xs font-normal text-slate-400">/semana</span></p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Crescimento Vol.</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">+15.4%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <PieChart size={20} className="text-orange-500" />
              <span>Distribuição por Status</span>
            </h3>
          </div>
          <div className="space-y-5">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black">
                  <span className="text-slate-500 uppercase tracking-widest">{status}</span>
                  <span className="text-slate-900 dark:text-slate-300">{count} ({total > 0 ? Math.round(((count as number) / total) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${total > 0 ? ((count as number) / total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart size={20} className="text-orange-500" />
              <span>Produtividade por Canal</span>
            </h3>
          </div>
          <div className="flex items-end justify-around h-48 pt-4">
             {['Instagram', 'TikTok', 'YouTube', 'Ads', 'Web'].map((canal, i) => {
               const height = [85, 40, 65, 30, 55][i];
               return (
                 <div key={canal} className="flex flex-col items-center group w-12">
                   <div 
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg group-hover:bg-orange-400 transition-all duration-500 relative cursor-pointer"
                    style={{ height: `${height}%` }}
                   >
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-900 dark:text-white opacity-0 group-hover:opacity-100">
                       {Math.round(height/10)}
                     </div>
                   </div>
                   <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 mt-3 rotate-45 origin-left">{canal}</span>
                 </div>
               )
             })}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 text-white p-8 md:p-12 rounded-[3rem] relative overflow-hidden border border-slate-900 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-black uppercase tracking-tight">Relatório Executivo</h3>
            <p className="text-slate-400 text-sm font-medium max-w-md">Gere um PDF detalhado com todas as métricas de performance e ROI para apresentar aos seus clientes.</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={`min-w-[240px] flex items-center justify-center space-x-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${
              hasExported 
                ? 'bg-emerald-500 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Exportando...</span>
              </>
            ) : hasExported ? (
              <>
                <Check size={20} />
                <span>Download Pronto</span>
              </>
            ) : (
              <span>Exportar PDF Completo</span>
            )}
          </button>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};
