import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { Task, Category } from '../types';
import { storageService } from './storageService';
import { INITIAL_TASKS } from '../utils/constants';

interface DbTask {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: 'baixa' | 'media' | 'alta';
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DbCategory {
  id: string;
  name: string;
  created_at: string;
}

function mapDbToTask(db: DbTask): Task {
  let priority: 'alta' | 'media' | 'baixa' = 'media';
  const rawPriority = String(db.priority || '').toLowerCase();
  if (rawPriority === 'alta' || rawPriority === 'high' || rawPriority === 'urgent') {
    priority = 'alta';
  } else if (rawPriority === 'baixa' || rawPriority === 'low') {
    priority = 'baixa';
  } else {
    priority = 'media';
  }

  return {
    id: db.id,
    title: db.title,
    description: db.description || undefined,
    category: db.category,
    priority,
    dueDate: db.due_date || undefined,
    completed: db.completed,
    completedAt: db.completed_at || undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}


function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class TaskService {
  private isOnline = true;

  public async getTasks(): Promise<{ tasks: Task[]; source: 'supabase' | 'local' }> {
    if (!isSupabaseConfigured) {
      return { tasks: storageService.getTasks(), source: 'local' };
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getTasks error, usando localStorage:', error.message);
        this.isOnline = false;
        return { tasks: storageService.getTasks(), source: 'local' };
      }

      this.isOnline = true;

      // Se o banco estiver vazio pela primeira vez, popula com tarefas iniciais
      if (!data || data.length === 0) {
        const localTasks = storageService.getTasks();
        const initialToSeed = localTasks.length > 0 ? localTasks : INITIAL_TASKS;
        await this.seedInitialTasks(initialToSeed);
        return { tasks: initialToSeed, source: 'supabase' };
      }

      const tasks = data.map((item) => mapDbToTask(item as DbTask));
      storageService.saveTasks(tasks); // Mantém cache local atualizado
      return { tasks, source: 'supabase' };
    } catch (err) {
      console.warn('Erro ao conectar ao Supabase:', err);
      this.isOnline = false;
      return { tasks: storageService.getTasks(), source: 'local' };
    }
  }

  public async addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newId = generateUuid();
    const nowIso = new Date().toISOString();

    const localTask: Task = {
      ...taskData,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    if (isSupabaseConfigured) {
      try {
        const dbPayload: Partial<DbTask> = {
          id: newId,
          title: taskData.title,
          description: taskData.description || null,
          category: taskData.category,
          priority: taskData.priority,
          due_date: taskData.dueDate || null,
          completed: taskData.completed,
          completed_at: taskData.completedAt || null,
          created_at: nowIso,
          updated_at: nowIso,
        };

        const { data, error } = await supabase
          .from('tasks')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          console.error('Erro ao adicionar tarefa no Supabase:', error.message);
        } else if (data) {
          const created = mapDbToTask(data as DbTask);
          storageService.saveTasks([created, ...storageService.getTasks().filter((t) => t.id !== created.id)]);
          return created;
        }
      } catch (err) {
        console.error('Falha de rede ao adicionar no Supabase:', err);
      }
    }

    // Fallback local
    storageService.addTask(taskData);
    return localTask;
  }

  public async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    const nowIso = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const dbUpdates: Partial<DbTask> = {
          updated_at: nowIso,
        };

        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description || null;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
        if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate || null;
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
        if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt || null;

        const { data, error } = await supabase
          .from('tasks')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar tarefa no Supabase:', error.message);
        } else if (data) {
          const updated = mapDbToTask(data as DbTask);
          storageService.updateTask(id, updates);
          return updated;
        }
      } catch (err) {
        console.error('Falha de rede ao atualizar no Supabase:', err);
      }
    }

    return storageService.updateTask(id, updates);
  }

  public async toggleTaskCompleted(id: string, currentCompleted: boolean): Promise<Task | null> {
    const willBeCompleted = !currentCompleted;
    const completedAt = willBeCompleted ? new Date().toISOString() : undefined;

    return this.updateTask(id, {
      completed: willBeCompleted,
      completedAt,
    });
  }

  public async deleteTask(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Erro ao excluir tarefa no Supabase:', error.message);
        }
      } catch (err) {
        console.error('Falha de rede ao excluir no Supabase:', err);
      }
    }

    return storageService.deleteTask(id);
  }

  public async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured) {
      return storageService.getCategories();
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return storageService.getCategories();
      }

      const categories = (data as DbCategory[]).map((c) => c.name);
      return categories;
    } catch {
      return storageService.getCategories();
    }
  }

  public async addCategory(name: string): Promise<Category[]> {
    const trimmed = name.trim();
    if (!trimmed) return this.getCategories();

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('categories')
          .upsert([{ name: trimmed }], { onConflict: 'name' });
      } catch (err) {
        console.error('Erro ao salvar categoria no Supabase:', err);
      }
    }

    return storageService.addCategory(trimmed);
  }

  public async resetData(): Promise<Task[]> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tasks').delete().neq('id', '___non_existent___');
        await this.seedInitialTasks(INITIAL_TASKS);
      } catch (err) {
        console.error('Erro ao resetar dados no Supabase:', err);
      }
    }

    return storageService.resetToDefault();
  }

  private async seedInitialTasks(tasks: Task[]): Promise<void> {
    try {
      const isUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const rows = tasks.map((t) => ({
        id: isUuidPattern.test(t.id) ? t.id : generateUuid(),
        title: t.title,
        description: t.description || null,
        category: t.category,
        priority: t.priority,
        due_date: t.dueDate || null,
        completed: t.completed,
        completed_at: t.completedAt || null,
        created_at: t.createdAt || new Date().toISOString(),
        updated_at: t.updatedAt || new Date().toISOString(),
      }));

      await supabase.from('tasks').upsert(rows, { onConflict: 'id' });
    } catch (err) {
      console.warn('Erro ao popular dados iniciais no Supabase:', err);
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }
}

export const taskService = new TaskService();
