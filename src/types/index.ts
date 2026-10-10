export type Priority = 'alta' | 'media' | 'baixa';

export type Category = 'Trabalho' | 'Pessoal' | 'Estudos' | 'Saúde' | 'Finanças' | 'Outros' | string;

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string; // Formato YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type FilterStatus = 'todas' | 'pendentes' | 'concluidas';

export type SortOption = 'dueDate' | 'priority' | 'createdAt' | 'title';

export type NavigationTab = 'tarefas' | 'analises' | 'calendario';

export interface CategoryConfig {
  name: string;
  label: string;
  bgLight: string;
  text: string;
  border: string;
  badgeBg: string;
  dotColor: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
