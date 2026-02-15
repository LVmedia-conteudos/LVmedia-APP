
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.EQUIPE, UserRole.CLIENTE] },
    { id: 'tasks', label: 'Tarefas', icon: <Briefcase size={20} />, roles: [UserRole.ADMIN, UserRole.EQUIPE, UserRole.CLIENTE] },
    { id: 'clients', label: 'Clientes', icon: <Users size={20} />, roles: [UserRole.ADMIN] },
    { id: 'team', label: 'Equipe', icon: <Shield size={20} />, roles: [UserRole.ADMIN] },
    { id: 'calendar', label: 'Agenda', icon: <Calendar size={20} />, roles: [UserRole.ADMIN, UserRole.EQUIPE] },
    { id: 'reports', label: 'Relatórios', icon: <FileText size={20} />, roles: [UserRole.ADMIN] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-slate-950 h-screen flex flex-col fixed left-0 top-0 text-slate-300 border-r border-slate-900 z-50">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-orange-500/20">
          LV
        </div>
        <div>
          <h1 className="text-white font-bold leading-none">LVmedia</h1>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Agência de Marketing</span>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
              activeTab === item.id 
                ? 'bg-orange-500/10 text-orange-500' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={activeTab === item.id ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <div className="flex items-center space-x-3 p-3 mb-4 rounded-xl bg-white/5">
          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-slate-700 border border-slate-800" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{user.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};
