
import React from 'react';
import { ContentTask, ContentStatus, UserRole, User } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
import { MoreVertical, MessageSquare, Paperclip, Calendar, User as UserIcon } from 'lucide-react';

interface KanbanBoardProps {
  tasks: ContentTask[];
  onTaskClick: (task: ContentTask) => void;
  currentUser: User;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskClick, currentUser }) => {
  const statuses = [
    ContentStatus.PENDENTE,
    ContentStatus.A_PRODUZIR,
    ContentStatus.EM_PRODUCAO,
    ContentStatus.EM_REVISAO,
    ContentStatus.APROVADO,
    ContentStatus.ENTREGUE
  ];

  const getTasksByStatus = (status: ContentStatus) => 
    tasks.filter(t => t.status === status);

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6 h-full min-h-[600px] custom-scrollbar">
      {statuses.map(status => (
        <div key={status} className="flex-shrink-0 w-80 bg-slate-100/50 dark:bg-slate-900/30 rounded-[2rem] p-4 flex flex-col h-full border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center space-x-3">
              <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].color.split(' ')[0]}`}></span>
              <h3 className="font-black text-xs text-slate-700 dark:text-slate-300 uppercase tracking-[0.15em]">
                {STATUS_CONFIG[status].label}
              </h3>
            </div>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              {getTasksByStatus(status).length}
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {getTasksByStatus(status).map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all cursor-pointer group animate-in slide-in-from-bottom-2"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${PRIORITY_CONFIG[task.priority]}`}>
                    {task.priority}
                  </span>
                  <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400">
                    <MoreVertical size={14} />
                  </button>
                </div>

                <h4 className="text-sm font-black text-slate-800 dark:text-white mb-2 group-hover:text-orange-500 transition-colors leading-tight">
                  {task.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 leading-relaxed font-medium">
                  {task.briefing}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MessageSquare size={12} />
                      <span className="text-[10px] font-black">4</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Paperclip size={12} />
                      <span className="text-[10px] font-black">{task.links.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-end mr-1">
                       <span className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Prazo</span>
                       <div className="flex items-center space-x-1 text-[10px] font-black text-slate-700 dark:text-slate-300">
                         <Calendar size={10} />
                         <span>{new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                       </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                      <UserIcon size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {getTasksByStatus(status).length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl opacity-50 transition-colors">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest italic">Vazio</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
