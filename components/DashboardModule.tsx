
import React, { useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Layers, 
  Clock, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { ContentTask, ContentStatus, Client, User, UserRole } from '../types';
import { StatCard } from './StatCard';

interface DashboardModuleProps {
  tasks: ContentTask[];
  clients: Client[];
  users: User[];
  setActiveTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ tasks, clients, users, setActiveTab }) => {
  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === ContentStatus.PENDENTE).length,
    inProgress: tasks.filter(t => t.status === ContentStatus.EM_PRODUCAO || t.status === ContentStatus.AJUSTES_SOLICITADOS).length,
    approved: tasks.filter(t => t.status === ContentStatus.APROVADO || t.status === ContentStatus.ENTREGUE).length,
    delayed: tasks.filter(t => t.deadline < new Date().toISOString().split('T')[0] && t.status !== ContentStatus.ENTREGUE && t.status !== ContentStatus.APROVADO).length,
  }), [tasks]);

  // Fix: Explicitly type statusCounts to avoid 'unknown' inference in Object.values and Object.entries
  const statusCounts: Record<string, number> = useMemo(() => {
    return {
      Pendente: tasks.filter(t => t.status === ContentStatus.PENDENTE || t.status === ContentStatus.A_PRODUZIR).length,
      Produção: tasks.filter(t => t.status === ContentStatus.EM_PRODUCAO || t.status === ContentStatus.AJUSTES_SOLICITADOS).length,
      Revisão: tasks.filter(t => t.status === ContentStatus.EM_REVISAO).length,
      Concluído: tasks.filter(t => t.status === ContentStatus.APROVADO || t.status === ContentStatus.ENTREGUE).length,
    };
  }, [tasks]);

  const maxCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Conteúdos Totais" value={stats.total} icon={<Layers className="text-blue-500" />} trend="12%" trendUp={true} />
        <StatCard label="Em Produção" value={stats.inProgress} icon={<Clock className="text-amber-500" />} />
        <StatCard label="Aprovados" value={stats.approved} icon={<CheckSquare className="text-emerald-500" />} trend="8%" trendUp={true} />
        <StatCard label="Prazos Críticos" value={stats.delayed} icon={<AlertTriangle className="text-rose-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Gráfico de Produtividade */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <BarChart3 size={20} className="text-orange-500" />
                  <span>Produtividade de Conteúdo</span>
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Distribuição por Status de Produção</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Tempo Real
              </div>
            </div>

            <div className="flex items-end justify-between h-64 gap-4 sm:gap-8 pt-6 border-b border-slate-100 dark:border-slate-800 pb-2">
              {Object.entries(statusCounts).map(([label, count]) => (
                <div key={label} className="flex-1 flex flex-col items-center group">
                  <div className="w-full flex flex-col items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                      {count}
                    </span>
                    <div 
                      className={`w-full max-w-[60px] rounded-t-2xl transition-all duration-700 ease-out cursor-help relative overflow-hidden ${
                        label === 'Concluído' ? 'bg-emerald-500' : 
                        label === 'Revisão' ? 'bg-indigo-500' : 
                        label === 'Produção' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                      style={{ height: `${(count / maxCount) * 200}px` }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <span className="mt-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center whitespace-nowrap">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Concluído</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Pendente</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('reports')}
                className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-all"
              >
                Relatório Detalhado <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <TrendingUp size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Crescimento</span>
                </div>
                <h3 className="text-2xl font-black uppercase">Meta do Trimestre</h3>
                <p className="text-slate-400 text-xs font-medium mt-1">Sua agência produziu +15% de conteúdos que no mês passado.</p>
              </div>
              <div className="text-center">
                <span className="block text-4xl font-black">92%</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Da Meta Atingida</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]"></div>
          </div>
        </div>

        {/* Lado Direito: Sumário Clientes e Equipe */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Sessão Clientes */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Users size={14} className="text-orange-500" />
                <span>Nossos Clientes</span>
              </h3>
              <button onClick={() => setActiveTab('clients')} className="text-[9px] font-black text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">Ver Todos</button>
            </div>
            <div className="p-6 space-y-4">
              {clients.slice(0, 4).map(client => (
                <div key={client.id} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab('clients')}>
                  <div className="flex items-center gap-3">
                    <img src={client.logo} className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800" alt={client.name} />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{client.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{client.sector}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${client.active ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessão Equipe */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} className="text-orange-500" />
                <span>Time de Performance</span>
              </h3>
              <button onClick={() => setActiveTab('team')} className="text-[9px] font-black text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">Gerenciar</button>
            </div>
            <div className="p-6 space-y-4">
              {users.slice(0, 4).map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <img src={user.avatar} className="w-9 h-9 rounded-full border-2 border-slate-50 dark:border-slate-800" alt={user.name} />
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
