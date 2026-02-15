
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Target, 
  BarChart2, 
  Plus, 
  Calendar, 
  Edit3, 
  CheckCircle2, 
  Search,
  Settings,
  X,
  PlusCircle,
  Trash2,
  Filter
} from 'lucide-react';
import { Client, ContentTask, ContentStatus, ContentTarget } from '../types';
import { STATUS_CONFIG } from '../constants';

interface ClientDetailViewProps {
  client: Client;
  tasks: ContentTask[];
  onBack: () => void;
  onUpdateTargets: (targets: ContentTarget[]) => void;
  onNewTask: () => void;
  onTaskClick: (task: ContentTask) => void;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({ 
  client, 
  tasks, 
  onBack, 
  onUpdateTargets,
  onNewTask,
  onTaskClick
}) => {
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [editTargets, setEditTargets] = useState<ContentTarget[]>(client.targets);
  const [taskFilter, setTaskFilter] = useState('');

  // Lógica de cálculo de progresso
  const progressData = useMemo(() => {
    return client.targets.map(target => {
      const done = tasks.filter(t => 
        t.format.toLowerCase() === target.label.toLowerCase() && 
        (t.status === ContentStatus.APROVADO || t.status === ContentStatus.ENTREGUE)
      ).length;
      return { ...target, done };
    });
  }, [client.targets, tasks]);

  const totalPlanned = client.targets.reduce((acc, t) => acc + t.count, 0);
  const totalDone = progressData.reduce((acc, t) => acc + t.done, 0);

  const handleSaveTargets = () => {
    onUpdateTargets(editTargets);
    setIsEditingTargets(false);
  };

  const addTargetRow = () => {
    setEditTargets([...editTargets, { id: `tg${Date.now()}`, label: '', count: 0 }]);
  };

  const removeTargetRow = (id: string) => {
    setEditTargets(editTargets.filter(t => t.id !== id));
  };

  const updateTargetRow = (id: string, field: 'label' | 'count', value: any) => {
    setEditTargets(editTargets.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(taskFilter.toLowerCase()) ||
    t.format.toLowerCase().includes(taskFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* A) Cabeçalho */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-lg">
            <img src={client.logo} alt={client.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{client.name}</h2>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Ativo</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm mt-1">{client.sector} • Plano Mensal de Conteúdo</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-[2rem] text-center min-w-[120px]">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Planejado</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalPlanned}</span>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 px-6 py-4 rounded-[2rem] text-center min-w-[120px] border border-orange-100 dark:border-orange-900/30">
            <span className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Concluído</span>
            <span className="text-2xl font-black text-orange-600">{totalDone}</span>
          </div>
          <div className="bg-slate-900 dark:bg-white px-6 py-4 rounded-[2rem] text-center min-w-[120px]">
            <span className="block text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-1">Restante</span>
            <span className="text-2xl font-black text-white dark:text-slate-900">{Math.max(0, totalPlanned - totalDone)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* B) METAS / PLANO (Lado Esquerdo) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Target size={16} className="text-orange-500" />
                <span>Metas de Produção</span>
              </h3>
              {!isEditingTargets ? (
                <button onClick={() => setIsEditingTargets(true)} className="p-2 text-slate-400 hover:text-orange-500 transition-colors">
                  <Edit3 size={18} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditingTargets(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={18} />
                  </button>
                  <button onClick={handleSaveTargets} className="p-2 text-emerald-500 hover:text-emerald-600 transition-colors">
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              {isEditingTargets ? (
                <div className="space-y-4">
                  {editTargets.map((tg) => (
                    <div key={tg.id} className="flex gap-2 items-center animate-in slide-in-from-left-2">
                      <input 
                        type="text" 
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                        value={tg.label}
                        placeholder="Tipo de conteúdo..."
                        onChange={(e) => updateTargetRow(tg.id, 'label', e.target.value)}
                      />
                      <input 
                        type="number" 
                        className="w-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-center"
                        value={tg.count}
                        onChange={(e) => updateTargetRow(tg.id, 'count', parseInt(e.target.value) || 0)}
                      />
                      <button onClick={() => removeTargetRow(tg.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addTargetRow}
                    className="w-full py-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={14} />
                    <span>Adicionar Meta</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {progressData.map((item) => {
                    const pct = Math.min(Math.round((item.done / (item.count || 1)) * 100), 100);
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                          <span className="text-slate-500">{item.done} / {item.count}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${pct === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 italic">
                          {item.done >= item.count ? '✓ Concluído' : `Faltam ${item.count - item.done}`}
                        </p>
                      </div>
                    );
                  })}
                  {progressData.length === 0 && (
                    <p className="text-center text-xs text-slate-400 italic py-4">Nenhuma meta definida.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* D) CONTEÚDOS DO CLIENTE (Lado Direito) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Pesquisar neste cliente..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                />
              </div>
              <button 
                onClick={onNewTask}
                className="flex items-center justify-center space-x-2 bg-slate-900 dark:bg-orange-500 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                <Plus size={16} />
                <span>Novo Conteúdo</span>
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => onTaskClick(task)}
                  className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-orange-500/50 hover:shadow-xl transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${STATUS_CONFIG[task.status].color.split(' ')[0]}`}>
                      {STATUS_CONFIG[task.status].icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{task.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{task.format}</span>
                        <span className="text-[9px] text-slate-300">•</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(task.deadline).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${STATUS_CONFIG[task.status].color}`}>
                      {STATUS_CONFIG[task.status].label}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Filter size={24} className="text-slate-300" />
                  </div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Nenhum conteúdo encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
