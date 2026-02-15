
import React, { useState } from 'react';
import { Search, Plus, Mail, Shield, User as UserIcon, Edit2, CheckCircle2, Users, Trash2 } from 'lucide-react';
import { User, UserRole } from '../types';

interface UsersModuleProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersModule: React.FC<UsersModuleProps> = ({ users, onAddUser, onEditUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    (u.role === UserRole.ADMIN || u.role === UserRole.EQUIPE) &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all"
          />
        </div>
        <button 
          onClick={onAddUser}
          className="flex items-center justify-center space-x-2 bg-slate-950 dark:bg-orange-500 hover:bg-slate-800 dark:hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Membro</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Função</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" alt={user.name} />
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Mail size={12} className="mr-1.5" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    user.role === UserRole.ADMIN 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {user.role === UserRole.ADMIN ? <Shield size={10} /> : <UserIcon size={10} />}
                    <span>{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-500 text-xs font-black">
                    <CheckCircle2 size={14} />
                    <span>Ativo</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onEditUser(user)}
                      className="p-2 text-slate-400 dark:text-slate-600 hover:text-orange-500 dark:hover:text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-slate-200 dark:text-slate-700" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Nenhum membro</p>
          </div>
        )}
      </div>
    </div>
  );
};
