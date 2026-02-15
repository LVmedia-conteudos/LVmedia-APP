import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Loader2, Sparkles, CheckSquare } from 'lucide-react';
import * as supabaseService from '../services/supabaseService';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { user } = await supabaseService.signIn(email, password);
                if (user) {
                    const userData = await supabaseService.getCurrentUserData(user.id);
                    // Fallback se o trigger ainda não tiver criado o registro no public.users
                    const finalUser = userData || {
                        id: user.id,
                        email: user.email!,
                        name: user.user_metadata?.name || email.split('@')[0],
                        role: user.user_metadata?.role || 'EQUIPE',
                        avatar: user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${user.user_metadata?.name || email}&background=random`
                    };
                    onLoginSuccess(finalUser);
                }
            } else {
                const { user } = await supabaseService.signUp(email, password, name);
                if (user) {
                    setSuccess('Conta criada com sucesso! Por favor, faça o login.');
                    setIsLogin(true);
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'Ocorreu um erro na autenticação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full p-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
                                <Sparkles className="text-white" size={32} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">LVmedia</h1>
                        <p className="text-slate-400 text-sm">Acesse sua plataforma de gestão de conteúdo</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-slate-300 text-sm font-medium ml-1">Nome Completo</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <LogIn size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">E-mail</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="exemplo@lvmedia.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium ml-1">Senha</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-rose-400 bg-rose-400/10 p-4 rounded-xl text-sm border border-rose-400/20">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl text-sm border border-emerald-400/20">
                                <CheckSquare size={18} />
                                <span>{success}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-orange-500/20"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Entrar agora' : 'Criar minha conta'}</span>
                                    {isLogin && <LogIn size={18} />}
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                                setSuccess(null);
                            }}
                            className="text-orange-500 font-semibold ml-2 hover:underline"
                        >
                            {isLogin ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};
