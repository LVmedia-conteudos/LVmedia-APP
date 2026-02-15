
import React, { useState, useRef } from 'react';
import { X, Building2, Camera, Upload, Package, Video, Image, Layers, Megaphone } from 'lucide-react';
import { Client, ClientPackage } from '../types';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    logo: '',
    active: true,
    package: {
      videos: 0,
      flyers: 0,
      carousels: 0,
      campaigns: 0,
      total: 0
    } as ClientPackage
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePackageField = (field: keyof ClientPackage, value: number) => {
    setFormData(prev => {
      const newPackage = { ...prev.package, [field]: value };
      // Recalcula o total automaticamente
      newPackage.total = newPackage.videos + newPackage.flyers + newPackage.carousels + newPackage.campaigns;
      return { ...prev, package: newPackage };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sector) return alert('Nome e setor são obrigatórios.');
    
    onSave({
      ...formData,
      logo: formData.logo || `https://picsum.photos/seed/${formData.name}/100`
    });
    
    setFormData({ 
      name: '', 
      sector: '', 
      logo: '', 
      active: true, 
      package: { videos: 0, flyers: 0, carousels: 0, campaigns: 0, total: 0 } 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 transition-colors">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Configurar Novo Cliente</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-600 transition-all active:scale-90">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer group hover:border-orange-500 dark:hover:border-orange-500 overflow-hidden transition-all"
              >
                {formData.logo ? (
                  <img src={formData.logo} className="w-full h-full object-cover" alt="" />
                ) : (
                  <Camera size={28} className="text-slate-300 dark:text-slate-700 group-hover:text-orange-500 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={24} className="text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase mt-3 tracking-widest">Logo</p>
            </div>

            <div className="flex-1 space-y-5 w-full">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Nome da Empresa</label>
                <input 
                  required
                  type="text"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold transition-all"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Apple Brasil"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Setor de Atuação</label>
                <input 
                  required
                  type="text"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold transition-all"
                  value={formData.sector}
                  onChange={e => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                  placeholder="Ex: Tecnologia"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Package size={16} className="text-orange-500" />
              <span>Pacote de Conteúdo Mensal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-2">
                  <Video size={14} className="text-slate-400" />
                  <span>Número de Vídeos</span>
                </label>
                <input 
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm"
                  value={formData.package.videos}
                  onChange={e => updatePackageField('videos', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-2">
                  <Image size={14} className="text-slate-400" />
                  <span>Número de Cartazes / Flyers</span>
                </label>
                <input 
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm"
                  value={formData.package.flyers}
                  onChange={e => updatePackageField('flyers', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-2">
                  <Layers size={14} className="text-slate-400" />
                  <span>Número de Carrosséis</span>
                </label>
                <input 
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm"
                  value={formData.package.carousels}
                  onChange={e => updatePackageField('carousels', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-2">
                  <Megaphone size={14} className="text-slate-400" />
                  <span>Campanhas de Anúncios</span>
                </label>
                <input 
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm"
                  value={formData.package.campaigns}
                  onChange={e => updatePackageField('campaigns', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl flex justify-between items-center">
              <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Total de Conteúdos:</span>
              <span className="text-xl font-black text-orange-600 dark:text-orange-400">{formData.package.total}</span>
            </div>
          </div>

          <div className="pt-6 flex items-center space-x-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Cancelar</button>
            <button type="submit" className="flex-[2] py-4 bg-slate-950 dark:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 dark:shadow-orange-500/20 transition-all active:scale-95">Salvar Cliente e Pacote</button>
          </div>
        </form>
      </div>
    </div>
  );
};
