
import React from 'react';
import { 
  Clock, 
  Play, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Send, 
  ClipboardList,
  RotateCcw
} from 'lucide-react';
import { ContentStatus, Priority, Client } from './types';

export const THEME_COLORS = {
  navy: '#0f172a',
  coral: '#f97316', 
  slate: '#64748b'
};

export const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; icon: React.ReactNode }> = {
  [ContentStatus.PENDENTE]: { label: 'Pendente', color: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400', icon: <ClipboardList size={16} /> },
  [ContentStatus.A_PRODUZIR]: { label: 'A Produzir', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Clock size={16} /> },
  [ContentStatus.EM_PRODUCAO]: { label: 'Em Produção', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <Play size={16} /> },
  [ContentStatus.EM_REVISAO]: { label: 'Em Revisão', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: <Eye size={16} /> },
  [ContentStatus.APROVADO]: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: <CheckCircle size={16} /> },
  [ContentStatus.REPROVADO]: { label: 'Reprovado', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: <XCircle size={16} /> },
  [ContentStatus.AJUSTES_SOLICITADOS]: { label: 'Ajustes', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: <RotateCcw size={16} /> },
  [ContentStatus.ENTREGUE]: { label: 'Entregue', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', icon: <Send size={16} /> },
};

export const PRIORITY_CONFIG: Record<Priority, string> = {
  [Priority.BAIXA]: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  [Priority.MEDIA]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  [Priority.ALTA]: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export const MOCK_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'TechStore Brasil', 
    sector: 'E-commerce', 
    logo: 'https://picsum.photos/seed/tech/100', 
    active: true,
    targets: [
      { id: 'tg1', label: 'Vídeos Reels', count: 8 },
      { id: 'tg2', label: 'Flyers', count: 8 },
      { id: 'tg3', label: 'Carrosséis', count: 2 },
      { id: 'tg4', label: 'Campanhas Ads', count: 2 },
    ]
  },
  { 
    id: 'c2', 
    name: 'FitLife Academy', 
    sector: 'Fitness', 
    logo: 'https://picsum.photos/seed/fit/100', 
    active: true,
    targets: [
      { id: 'tg5', label: 'Vídeos Treino', count: 4 },
      { id: 'tg6', label: 'Stories Estáticos', count: 20 },
    ]
  },
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Rodrigo Admin', email: 'admin@lvmedia.com', role: 'ADMIN', avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: 'u2', name: 'Ana Designer', email: 'ana@lvmedia.com', role: 'EQUIPE', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: 'u3', name: 'Carlos Copy', email: 'carlos@lvmedia.com', role: 'EQUIPE', avatar: 'https://i.pravatar.cc/150?u=carlos' },
  { id: 'u4', name: 'Marina Cliente', email: 'marina@techstore.com', role: 'CLIENTE', clientId: 'c1', avatar: 'https://i.pravatar.cc/150?u=marina' },
];
