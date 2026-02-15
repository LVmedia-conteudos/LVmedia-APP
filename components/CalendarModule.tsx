
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { ContentTask, ContentStatus } from '../types';
import { STATUS_CONFIG, MOCK_CLIENTS, MOCK_USERS } from '../constants';

interface CalendarModuleProps {
  tasks: ContentTask[];
  onTaskClick: (task: ContentTask) => void;
  onUpdateStatus: (taskId: string, newStatus: ContentStatus, comment?: string) => void;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({ tasks, onTaskClick, onUpdateStatus }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Helpers
  const formatIsoDate = (date: Date) => date.toISOString().split('T')[0];
  
  const tasksByDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const date = task.deadline;
      if (!acc[date]) acc[date] = [];
      acc[date].push(task);
      return acc;
    }, {} as Record<string, ContentTask[]>);
  }, [tasks]);

  const selectedDateTasks = tasksByDate[selectedDate] || [];

  const alerts = useMemo(() => {
    const today = formatIsoDate(new Date());
    return {
      today: tasks.filter(t => t.deadline === today && t.status !== ContentStatus.ENTREGUE).length,
      late: tasks.filter(t => t.deadline < today && t.status !== ContentStatus.ENTREGUE && t.status !== ContentStatus.APROVADO).length,
      review: tasks.filter(t => t.status === ContentStatus.EM_REVISAO).length
    };
  }, [tasks]);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2024, 5, i + 1); // Mock Junho 2024
    return formatIsoDate(date);
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      
      {/* Coluna Esquerda: Calendário e Lembretes */}
      <div className="w-full lg:w-80 space-y-6">
        
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="font-bold flex items-center space-x-2 text-sm uppercase tracking-widest text-orange-500">
            <Clock size={16} />
            <span>Prazos LVmedia</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span className="text-xs font-medium">Hoje</span>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${alerts.today > 0 ? 'bg-orange-500' : 'bg-white/10'}`}>
                {alerts.today}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span className="text-xs font-medium">Em Revisão</span>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${alerts.review > 0 ? 'bg-indigo-500' : 'bg-white/10'}`}>
                {alerts.review}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <span className="text-xs font-medium text-rose-300">Atrasadas</span>
              <span className="px-2 py-1 bg-rose-500 rounded-lg text-xs font-bold">
                {alerts.late}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-sm">Junho 2024</h3>
            <div className="flex space-x-1">
              <button className="p-1 hover:bg-slate-100 rounded-md text-slate-400"><ChevronLeft size={16} /></button>
              <button className="p-1 hover:bg-slate-100 rounded-md text-slate-400"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((dateStr, i) => {
              const hasTasks = tasksByDate[dateStr]?.length > 0;
              const isSelected = selectedDate === dateStr;
              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative aspect-square flex flex-col items-center justify-center text-xs rounded-xl transition-all ${
                    isSelected ? 'bg-slate-900 text-white font-bold scale-110 shadow-lg' : 'hover:bg-orange-50 text-slate-600'
                  }`}
                >
                  <span>{i + 1}</span>
                  {hasTasks && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Coluna Direita: Entregas do Dia Selecionado */}
      <div className="flex-1 space-y-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Entregas: {new Date(selectedDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{selectedDateTasks.length} tarefas encontradas</p>
            </div>
            <CalendarIcon className="text-slate-300" size={24} />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {selectedDateTasks.map(task => {
              const client = MOCK_CLIENTS.find(c => c.id === task.clientId);
              const responsible = MOCK_USERS.find(u => u.id === task.assignedTo);
              const needsReview = task.status === ContentStatus.EM_REVISAO;

              return (
                <div 
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className={`group p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row md:items-center gap-6 cursor-pointer ${
                    needsReview ? 'border-indigo-200 bg-indigo-50/20 shadow-lg shadow-indigo-100/50' : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${STATUS_CONFIG[task.status].color}`}>
                        {STATUS_CONFIG[task.status].label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {client?.name}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">{task.title}</h4>
                    <div className="flex items-center space-x-2 mt-3">
                       <img src={responsible?.avatar} className="w-6 h-6 rounded-full border border-slate-200" alt="" />
                       <span className="text-[11px] text-slate-500 font-bold tracking-tight">{responsible?.name}</span>
                       <span className="text-[11px] text-slate-300">•</span>
                       <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{task.channel}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {needsReview ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mr-2">Revisão Pendente</span>
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <RotateCcw size={20} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Ver Detalhes</span>
                    )}
                  </div>
                </div>
              );
            })}

            {selectedDateTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-4">
                  <CalendarIcon size={32} className="text-slate-200" />
                </div>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Nenhuma entrega</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Selecione outro dia no calendário</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
