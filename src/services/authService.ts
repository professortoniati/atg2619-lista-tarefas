import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserProfile } from '../types';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

class AuthService {
  /**
   * Realiza login com e-mail e senha
   */
  public async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { user: null, error: 'Supabase não configurado no ambiente (.env).' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let errorMsg = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'E-mail ou senha incorretos.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'E-mail ainda não confirmado. Verifique sua caixa de entrada.';
        }
        return { user: null, error: errorMsg };
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err?.message || 'Falha de conexão ao autenticar.' };
    }
  }

  /**
   * Cria uma nova conta de usuário
   */
  public async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null; message?: string }> {
    if (!isSupabaseConfigured) {
      return { user: null, error: 'Supabase não configurado no ambiente (.env).' };
    }

    try {
      const cleanEmail = email.trim();
      const cleanName = name.trim() || cleanEmail.split('@')[0];

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
          },
        },
      });

      if (error) {
        let msg = error.message;
        if (error.message.includes('User already registered')) {
          msg = 'Este e-mail já está cadastrado. Tente fazer login.';
        } else if (error.message.includes('Password should be at least')) {
          msg = 'A senha deve ter pelo menos 6 caracteres.';
        }
        return { user: null, error: msg };
      }

      // Se o usuário foi criado e sessão já iniciada (auto-confirm)
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: cleanName,
            email: cleanEmail,
          });
        } catch {
          // Trigger no postgres já cuida se falhar aqui
        }
      }

      return { 
        user: data.user, 
        error: null,
        message: data.session ? 'Conta criada com sucesso!' : 'Conta criada! Verifique seu e-mail se a confirmação estiver ativada.' 
      };
    } catch (err: any) {
      return { user: null, error: err?.message || 'Erro ao registrar usuário.' };
    }
  }

  /**
   * Envia link de recuperação de senha por e-mail
   */
  public async resetPasswordForEmail(email: string): Promise<{ error: string | null; success: boolean }> {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase não configurado.', success: false };
    }

    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { error: error.message, success: false };
      }

      return { error: null, success: true };
    } catch (err: any) {
      return { error: err?.message || 'Falha ao solicitar recuperação de senha.', success: false };
    }
  }

  /**
   * Atualiza a senha do usuário autenticado
   */
  public async updatePassword(newPassword: string): Promise<{ error: string | null; success: boolean }> {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase não configurado.', success: false };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message, success: false };
      }

      return { error: null, success: true };
    } catch (err: any) {
      return { error: err?.message || 'Erro ao atualizar senha.', success: false };
    }
  }

  /**
   * Encerra a sessão
   */
  public async signOut(): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
  }

  /**
   * Obtém a sessão atual
   */
  public async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Obtém o usuário atualmente autenticado
   */
  public async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  }

  /**
   * Carrega perfil do usuário da tabela profiles
   */
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Fallback para os metadados do auth
        const user = await this.getCurrentUser();
        if (user && user.id === userId) {
          return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            avatarUrl: user.user_metadata?.avatar_url,
          };
        }
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name || data.email?.split('@')[0] || 'Usuário',
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      return null;
    }
  }

  /**
   * Atualiza informações do perfil
   */
  public async updateProfile(userId: string, updates: { name?: string; avatarUrl?: string }): Promise<UserProfile | null> {
    if (!isSupabaseConfigured || !userId) return null;

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) payload.name = updates.name.trim();
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar perfil:', error.message);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.error('Falha ao atualizar perfil:', err);
      return null;
    }
  }

  /**
   * Observa mudanças no estado de autenticação
   */
  public onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
