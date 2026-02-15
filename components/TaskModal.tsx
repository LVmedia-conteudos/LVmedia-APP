
import React, { useState, useEffect } from 'react';
import { X, Send, Paperclip, ExternalLink, Calendar, Check, AlertCircle, Sparkles, RotateCcw, XCircle, MessageSquare, User as UserIcon } from 'lucide-react';
import { ContentTask, UserRole, User, ContentStatus } from '../types';
import { STATUS_CONFIG, MOCK_USERS } from '../constants';
import { generateBriefing } from '../services/geminiService';

interface TaskModalProps {
  task: ContentTask | null;
  onClose: () => void;
  user: User;
  onUpdateStatus: (taskId: string, newStatus: ContentStatus, comment?: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, user, onUpdateStatus }) => {
  const [comment, setComment] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [localBrief, setLocalBrief] = useState('');
  const [isAdjustmentView, setIsAdjustmentView] = useState(false);
  const [adjustmentText, setAdjustmentText] = useState('');

  useEffect(() => {
    if (task) {
      setLocalBrief(task.briefing);
      setIsAdjustmentView(false);
      setAdjustmentText('');
      setComment('');
    }
  }, [task]);

  if (!task) return null;

  const isAdmin = user.role === UserRole.ADMIN;
  const isEquipe = user.role === UserRole.EQUIPE;
  const responsible = MOCK_USERS.find(u => u.id === task.assignedTo);

  const handleAiRefine = async () => {
    setIsAiLoading(true);
    const newBrief = await generateBriefing(task.title, task.format, task.channel);
    setLocalBrief(newBrief);
    setIsAiLoading(false);
  };

  const handleApprove = () => {
    onUpdateStatus(task.id, ContentStatus.APROVADO);
    onClose();
  };

  const handleReject = () => {
    const motivo = prompt('Descreva o motivo da reprovação:');
    if (motivo !== null) {
      onUpdateStatus(task.id, ContentStatus.REPROVADO, motivo || undefined);
      onClose();
    }
  };

  const handleSendAdjustment = () => {
    if (!adjustmentText.trim()) {
      alert('Por favor, descreva o que precisa ser ajustado.');
      return;
    }
    onUpdateStatus(task.id, ContentStatus.AJUSTES_SOLICITADOS, adjustmentText);
    onClose();
  };

  const handleStatusChange = (newStatus: ContentStatus) => {
    onUpdateStatus(task.id, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 transition-colors">
        
        <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${STATUS_CONFIG[task.status].color}`}>
                {STATUS_CONFIG[task.status].label}
              </span>
              <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest">#{task.id}</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-slate-400 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight transition-colors">{task.title}</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-center transition-colors">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Canal</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{task.channel}</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Formato</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{task.format}</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Prazo</span>
              <span className="text-sm font-bold text-orange-600 flex items-center justify-center space-x-1">
                <Calendar size={14} />
                <span>{new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
              </span>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest">Briefing</h3>
              {isAdmin && (
                <button 
                  onClick={handleAiRefine}
                  disabled={isAiLoading}
                  className="flex items-center space-x-1.5 text-[10px] font-black text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all"
                >
                  <Sparkles size={12} className={isAiLoading ? 'animate-spin' : ''} />
                  <span>REFINAR COM IA</span>
                </button>
              )}
            </div>
            <div className="bg-white dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium shadow-sm transition-colors">
              {localBrief || task.briefing}
            </div>
            {task.reviewComment && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl">
                <p className="text-[10px] font-black text-orange-600 uppercase mb-1">Solicitação de Ajuste</p>
                <p className="text-sm text-orange-800 dark:text-orange-400 font-medium italic">"{task.reviewComment}"</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-4">Entregas e Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {task.links.length > 0 ? task.links.map((link, idx) => (
                <a key={idx} href={link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all group">
                  <div className="flex items-center space-x-4">
                    <Paperclip size={18} className="text-slate-400 group-hover:text-orange-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Link de Entrega #{idx + 1}</span>
                  </div>
                  <ExternalLink size={16} className="text-slate-300 dark:text-slate-600" />
                </a>
              )) : (
                <div className="col-span-2 py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-600">
                  <p className="text-[10px] font-black uppercase italic">Aguardando entrega de arquivos</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-96 bg-slate-50 dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800 p-8 md:p-10 flex flex-col transition-colors">
          
          {isAdmin && (
            <div className="mb-12">
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-8">Gestão Administrativa</h3>
              
              {!isAdjustmentView ? (
                <div className="space-y-4">
                  <button 
                    onClick={handleApprove}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center space-x-4 active:scale-95"
                  >
                    <Check size={22} strokeWidth={3} />
                    <span>APROVAR</span>
                  </button>

                  <button 
                    onClick={() => setIsAdjustmentView(true)}
                    className="w-full py-5 bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-900/50 text-orange-600 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 rounded-3xl font-black text-sm transition-all flex items-center justify-center space-x-4 active:scale-95"
                  >
                    <RotateCcw size={20} strokeWidth={3} />
                    <span>SOLICITAR AJUSTES</span>
                  </button>
                  
                  <button 
                    onClick={handleReject}
                    className="w-full py-3 text-rose-500 dark:text-rose-400 text-[10px] font-black uppercase hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                  >
                    Reprovar Completamente
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-6 duration-300">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-orange-200 dark:border-orange-900/50 p-4">
                    <textarea 
                      autoFocus
                      className="w-full bg-transparent text-sm font-medium outline-none min-h-[140px] resize-none text-slate-900 dark:text-white"
                      placeholder="Descreva detalhadamente o que precisa ser corrigido..."
                      value={adjustmentText}
                      onChange={(e) => setAdjustmentText(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button onClick={() => setIsAdjustmentView(false)} className="flex-1 py-4 text-xs font-bold text-slate-400">Voltar</button>
                    <button 
                      onClick={handleSendAdjustment}
                      className="flex-[2] py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-lg"
                    >
                      ENVIAR PARA AJUSTES
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isEquipe && task.status !== ContentStatus.APROVADO && (
             <div className="mb-12">
               <h3 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-6">Controle de Produção</h3>
               <div className="space-y-3">
                 {task.status === ContentStatus.A_PRODUZIR || task.status === ContentStatus.AJUSTES_SOLICITADOS || task.status === ContentStatus.PENDENTE ? (
                    <button 
                      onClick={() => handleStatusChange(ContentStatus.EM_PRODUCAO)}
                      className="w-full py-4 bg-amber-500 text-white rounded-3xl font-black text-xs shadow-lg active:scale-95 transition-all"
                    >
                      INICIAR PRODUÇÃO
                    </button>
                 ) : null}
                 
                 {task.status === ContentStatus.EM_PRODUCAO ? (
                    <button 
                      onClick={() => handleStatusChange(ContentStatus.EM_REVISAO)}
                      className="w-full py-4 bg-indigo-600 text-white rounded-3xl font-black text-xs shadow-lg active:scale-95 transition-all"
                    >
                      ENVIAR PARA REVISÃO INTERNA
                    </button>
                 ) : null}
               </div>
             </div>
          )}

          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-6 flex items-center space-x-2">
              <MessageSquare size={14} />
              <span>Discussão e Histórico</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter text-center pt-10">
              Nenhuma mensagem ainda
            </div>

            <div className="relative">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva um comentário..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl px-5 py-4 text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                rows={2}
              />
              <button 
                disabled={!comment.trim()}
                className="absolute bottom-3 right-3 p-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 disabled:opacity-20 transition-all active:scale-90"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
