import React, { useState } from 'react';
import { 
  CheckSquare, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  KeyRound, 
  Loader2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ShieldCheck
} from 'lucide-react';
import { authService } from '../../services/authService';

interface AuthPageProps {
  onSuccess: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onToast }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Preenchimento rápido para o usuário inicial informado pelo professor
  const handleUseDemoAccount = () => {
    setEmail('professor.toniati@gmail.com');
    setPassword('senai@2026');
    setMode('login');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('Por favor, informe seu e-mail e sua senha.');
          setIsLoading(false);
          return;
        }

        const { user, error } = await authService.signIn(email, password);
        if (error) {
          setErrorMessage(error);
          onToast(error, 'error');
        } else if (user) {
          onToast(`Bem-vindo de volta, ${user.user_metadata?.name || user.email}!`, 'success');
          onSuccess();
        }
      } else if (mode === 'signup') {
        if (!email.trim() || !password) {
          setErrorMessage('Preencha todos os campos obrigatórios.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
          setIsLoading(false);
          return;
        }

        const { user, error, message } = await authService.signUp(email, password, name);
        if (error) {
          setErrorMessage(error);
          onToast(error, 'error');
        } else {
          setSuccessMessage(message || 'Conta criada com sucesso!');
          onToast('Conta criada com sucesso!', 'success');
          if (user) {
            // Tenta fazer login imediato se auto-confirm estiver ativo
            const loginResult = await authService.signIn(email, password);
            if (loginResult.user) {
              onSuccess();
            } else {
              setMode('login');
            }
          }
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMessage('Por favor, digite seu e-mail cadastrado.');
          setIsLoading(false);
          return;
        }

        const { error, success } = await authService.resetPasswordForEmail(email);
        if (error) {
          setErrorMessage(error);
          onToast(error, 'error');
        } else if (success) {
          setSuccessMessage(`Enviamos as instruções de recuperação para ${email}. Verifique sua caixa de entrada.`);
          onToast('E-mail de recuperação enviado!', 'success');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      
      {/* Container Card */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
            <CheckSquare className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>TaskPulse</span>
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">PRO</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestão inteligente de tarefas com autenticação Supabase
          </p>
        </div>

        {/* Main Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          
          {/* Quick Demo Helper Button */}
          <div className="mb-6 p-3.5 bg-blue-950/50 border border-blue-800/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-blue-200">Acesso Rápido:</p>
                <p className="text-blue-400/90 text-[11px] font-mono">professor.toniati@gmail.com</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoAccount}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer text-[11px] whitespace-nowrap"
            >
              Preencher
            </button>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              Criar Conta
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'forgot'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              Recuperar
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-rose-400 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nome (apenas no modo cadastro) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Professor Toniati"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* E-mail */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Endereço de E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Senha (apenas em login e cadastro) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Entrar no TaskPulse</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Cadastrar e Começar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Enviar Link de Recuperação</span>
                </>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Autenticação Segura</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400/90 font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Cloud</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright info */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Projeto isolado multiusuário com Row Level Security (RLS)
        </p>

      </div>
    </div>
  );
};
