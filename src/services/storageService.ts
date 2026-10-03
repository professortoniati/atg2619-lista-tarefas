import type { Task, Category } from '../types';
import { INITIAL_TASKS } from '../utils/constants';

const STORAGE_KEY = 'taskpulse_tasks_v1';
const CATEGORIES_KEY = 'taskpulse_categories_v1';

export const DEFAULT_CATEGORIES: Category[] = [
  'Trabalho',
  'Pessoal',
  'Estudos',
  'Saúde',
  'Finanças',
  'Outros',
];

class StorageService {
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // --- TAREFAS ---

  public getTasks(): Task[] {
    if (!this.isLocalStorageAvailable()) {
      return INITIAL_TASKS;
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveTasks(INITIAL_TASKS);
        return INITIAL_TASKS;
      }
      return JSON.parse(data) as Task[];
    } catch (err) {
      console.error('Erro ao ler tarefas do localStorage:', err);
      return INITIAL_TASKS;
    }
  }

  public saveTasks(tasks: Task[]): void {
    if (!this.isLocalStorageAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Erro ao salvar tarefas no localStorage:', err);
    }
  }

  public addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    this.saveTasks(updatedTasks);
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTask: Task = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  public deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;

    this.saveTasks(filtered);
    return true;
  }

  public toggleTaskCompleted(id: string): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const task = tasks[index];
    const willBeCompleted = !task.completed;

    const updatedTask: Task = {
      ...task,
      completed: willBeCompleted,
      completedAt: willBeCompleted ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  public resetToDefault(): Task[] {
    this.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  }

  // --- CATEGORIAS ---

  public getCategories(): Category[] {
    if (!this.isLocalStorageAvailable()) {
      return DEFAULT_CATEGORIES;
    }

    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (!data) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
      }
      return JSON.parse(data) as Category[];
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  public addCategory(name: string): Category[] {
    const trimmed = name.trim();
    if (!trimmed) return this.getCategories();

    const categories = this.getCategories();
    if (!categories.includes(trimmed)) {
      const updated = [...categories, trimmed];
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
      }
      return updated;
    }
    return categories;
  }
}

export const storageService = new StorageService();
