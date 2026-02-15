
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Building2, BarChart2, ChevronRight } from 'lucide-react';
import { Client, ContentTask, ContentStatus } from '../types';

interface ClientsModuleProps {
  clients: Client[];
  tasks: ContentTask[];
  onAddClient: () => void;
  onSelectClient: (clientId: string) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({ clients, tasks, onAddClient, onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStats = (clientId: string) => {
    const clientTasks = tasks.filter(t => t.clientId === clientId);
    const done = clientTasks.filter(t => t.status === ContentStatus.APROVADO || t.status === ContentStatus.ENTREGUE).length;
    return { done, total: clientTasks.length };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar clientes por nome ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all"
          />
        </div>
        <button 
          onClick={onAddClient}
          className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredClients.map(client => {
          const { done, total } = getStats(client.id);
          return (
            <div 
              key={client.id} 
              onClick={() => onSelectClient(client.id)}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden animate-in zoom-in-95 cursor-pointer"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                    <img src={client.logo} alt={client.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-tight">{client.name}</h3>
                    <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                      <Building2 size={12} />
                      <span>{client.sector}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status de Entrega</div>
                  <div className="flex items-center justify-end space-x-3">
                    <span className="text-lg font-black text-slate-900 dark:text-white">{done} <span className="text-slate-300 font-bold">/ {total}</span></span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 transition-colors">
                <span className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${client.active ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm shadow-emerald-500/20`}></span>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {client.active ? 'Ativo' : 'Inativo'}
                  </span>
                </span>
                <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest flex items-center space-x-1.5 transition-colors group-hover:translate-x-1">
                  <span>Gerenciar Cliente</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
