
import React, { useState, useRef, useEffect } from 'react';
import { X, User as UserIcon, Mail, Shield, Users, Camera, Upload } from 'lucide-react';
import { User, UserRole } from '../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
  initialData?: User | null;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.EQUIPE,
    avatar: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        avatar: initialData.avatar || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: UserRole.EQUIPE,
        avatar: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A foto deve ter no máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return alert('Nome e e-mail são obrigatórios.');
    
    // Fallback if no photo uploaded
    const finalAvatar = formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=f97316&color=fff&bold=true`;
    
    onSave({
      ...formData,
      avatar: finalAvatar
    });
    
    onClose();
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Editar Membro' : 'Adicionar Novo Membro'}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {isEditing ? 'Atualize as informações do perfil.' : 'Cadastre administradores ou equipe.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div 
              onClick={triggerFileInput}
              className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer group hover:border-orange-500 transition-all overflow-hidden"
            >
              {formData.avatar ? (
                <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 group-hover:text-orange-500 flex flex-col items-center">
                  <Camera size={24} />
                  <span className="text-[8px] font-bold uppercase mt-1">Subir Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <p className="text-[10px] text-slate-400 font-medium">JPG ou PNG, Máx 2MB</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-2">
                <UserIcon size={12} />
                <span>Nome Completo</span>
              </label>
              <input 
                required
                type="text"
                placeholder="Ex: João Silva"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-2">
                <Mail size={12} />
                <span>E-mail Profissional</span>
              </label>
              <input 
                required
                type="email"
                placeholder="joao@lvmedia.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-2">
                <Shield size={12} />
                <span>Papel / Função</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: UserRole.EQUIPE }))}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                    formData.role === UserRole.EQUIPE 
                    ? 'border-orange-500 bg-orange-50 text-orange-600' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <Users size={16} />
                  <span className="text-xs font-bold">Equipe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: UserRole.ADMIN }))}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                    formData.role === UserRole.ADMIN 
                    ? 'border-orange-500 bg-orange-50 text-orange-600' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <Shield size={16} />
                  <span className="text-xs font-bold">Admin</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Membro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
