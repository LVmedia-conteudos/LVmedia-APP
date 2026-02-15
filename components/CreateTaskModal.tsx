
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, User as UserIcon, Building2, Layout, Target, Link as LinkIcon } from 'lucide-react';
import { ContentTask, ContentStatus, Priority, User, Client, UserRole } from '../types';
import { MOCK_CLIENTS, MOCK_USERS } from '../constants';
import { generateBriefing } from '../services/geminiService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<ContentTask, 'id' | 'createdAt'>) => void;
  preSelectedClientId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  preSelectedClientId 
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientId: preSelectedClientId || MOCK_CLIENTS[0].id,
    format: 'Flyers',
    channel: 'Instagram',
    priority: Priority.MEDIA,
    deadline: new Date().toISOString().split('T')[0],
    assignedTo: MOCK_USERS.find(u => u.role === UserRole.EQUIPE)?.id || '',
    briefing: '',
    links: ['']
  });

  useEffect(() => {
    if (preSelectedClientId) {
      setFormData(prev => ({ ...prev, clientId: preSelectedClientId }));
    }
  }, [preSelectedClientId, isOpen]);

  if (!isOpen) return null;

  const handleAiGenerate = async () => {
    if (!formData.title) return alert('Por favor, insira um título primeiro.');
    setIsAiLoading(true);
    const briefing = await generateBriefing(formData.title, formData.format, formData.channel);
    setFormData(prev => ({ ...prev, briefing }));
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.briefing) return alert('Título e briefing são obrigatórios.');
    
    onSave({
      ...formData,
      status: ContentStatus.PENDENTE,
      attachments: [],
      links: formData.links.filter(l => l.trim() !== '')
    });
    
    setFormData({
      title: '',
      clientId: preSelectedClientId || MOCK_CLIENTS[0].id,
      format: 'Flyers',
      channel: 'Instagram',
      priority: Priority.MEDIA,
      deadline: new Date().toISOString().split('T')[0],
      assignedTo: MOCK_USERS.find(u => u.role === UserRole.EQUIPE)?.id || '',
      briefing: '',
      links: ['']
    });
    onClose();
  };

  const addLink = () => setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
  const updateLink = (index: number, val: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = val;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 transition-colors">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Criar Nova Tarefa</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">Preencha os detalhes para a equipe de produção.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2 ml-1">
                <Target size={14} />
                <span>Título do Conteúdo</span>
              </label>
              <input 
                required
                type="text"
                placeholder="Ex: Campanha Dia dos Pais - Carrossel"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold text-sm"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2 ml-1">
                <Building2 size={14} />
                <span>Cliente</span>
              </label>
              <select 
                disabled={!!preSelectedClientId}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm disabled:opacity-50 appearance-none"
                value={formData.clientId}
                onChange={e => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              >
                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2 ml-1">
                <Layout size={14} />
                <span>Tipo / Formato</span>
              </label>
              <input 
                type="text"
                placeholder="Ex: Flyers, Vídeos..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm"
                value={formData.format}
                onChange={e => setFormData(prev => ({ ...prev, format: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2 ml-1">
                <UserIcon size={14} />
                <span>Responsável</span>
              </label>
              <select 
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm"
                value={formData.assignedTo}
                onChange={e => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              >
                {MOCK_USERS.filter(u => u.role !== UserRole.CLIENTE).map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2 ml-1">
                <Calendar size={14} />
                <span>Prazo Final</span>
              </label>
              <input 
                type="date"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm"
                value={formData.deadline}
                onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Briefing de Produção</label>
              <button 
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiLoading}
                className="flex items-center space-x-2 text-[10px] font-black text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-4 py-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all disabled:opacity-50"
              >
                <Sparkles size={12} className={isAiLoading ? 'animate-spin' : ''} />
                <span>{isAiLoading ? 'IA trabalhando...' : 'Gerar com IA'}</span>
              </button>
            </div>
            <textarea 
              required
              rows={5}
              placeholder="Descreva as orientações para a equipe..."
              className="w-full px-6 py-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-sm resize-none"
              value={formData.briefing}
              onChange={e => setFormData(prev => ({ ...prev, briefing: e.target.value }))}
            />
          </div>
        </form>

        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancelar</button>
          <button 
            onClick={handleSubmit}
            className="px-10 py-4 bg-slate-900 dark:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Criar Conteúdo
          </button>
        </div>
      </div>
    </div>
  );
};
