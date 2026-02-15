
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black mt-2 text-slate-900 dark:text-white">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-2 text-[10px] font-black uppercase ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span>{trendUp ? '↑' : '↓'} {trend}</span>
              <span className="text-slate-400 dark:text-slate-500 font-bold ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
          {icon}
        </div>
      </div>
    </div>
  );
};
