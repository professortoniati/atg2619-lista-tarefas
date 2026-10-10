import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { 
  Task, 
  Category, 
  FilterStatus, 
  SortOption, 
  NavigationTab, 
  ToastMessage,
  UserProfile
} from './types';
import type { User } from '@supabase/supabase-js';
import { taskService } from './services/taskService';
import { authService } from './services/authService';
import { Navbar } from './components/Navbar';
import { TasksView } from './components/TasksView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { TaskFormModal } from './components/TaskFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { LogoutModal } from './components/LogoutModal';
import { ToastContainer } from './components/ToastContainer';
import { AuthPage } from './components/Auth/AuthPage';
import { Loader2 } from 'lucide-react';

export function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // App data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('tarefas');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  // Filters & Search
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('dueDate');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Carrega perfil do usuário
  const loadProfile = useCallback(async (userId: string) => {
    const profile = await authService.getUserProfile(userId);
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  // Carrega dados de tarefas e categorias
  const loadData = useCallback(async (showToast = false) => {
    try {
      setIsSyncing(true);
      const [taskResult, loadedCategories] = await Promise.all([
        taskService.getTasks(),
        taskService.getCategories(),
      ]);

      setTasks(taskResult.tasks);
      setCategories(loadedCategories);
      setIsOnline(taskResult.source === 'supabase');

      if (showToast) {
        if (taskResult.source === 'supabase') {
          addToast('Tarefas sincronizadas com o Supabase!', 'success');
        } else {
          addToast('Carregado do cache local (offline).', 'info');
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setIsOnline(false);
      addToast('Não foi possível conectar ao Supabase.', 'warning');
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [addToast]);

  // Observer de autenticação do Supabase
  useEffect(() => {
    authService.getSession().then(async (session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        await loadProfile(session.user.id);
        await loadData(false);
      }
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          setCurrentUser(session.user);
          await loadProfile(session.user.id);
          await loadData(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUserProfile(null);
        setTasks([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadData, loadProfile]);

  // CRUD Handlers
  const handleSaveTask = async (taskData: {
    title: string;
    description?: string;
    category: Category;
    priority: 'baixa' | 'media' | 'alta';
    dueDate?: string;
  }) => {
    if (taskToEdit && taskToEdit.id) {
      // Atualização
      const updated = await taskService.updateTask(taskToEdit.id, taskData);
      if (updated) {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        addToast('Tarefa atualizada no Supabase com sucesso!', 'success');
      }
    } else {
      // Criação
      const newTask = await taskService.addTask({
        ...taskData,
        completed: false,
      });
      setTasks((prev) => [newTask, ...prev.filter((t) => t.id !== newTask.id)]);
      addToast('Nova tarefa salva no Supabase com sucesso!', 'success');
    }
    setTaskToEdit(null);
  };

  const handleToggleComplete = async (id: string) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask) return;

    // Otimista na UI
    const targetCompleted = !currentTask.completed;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: targetCompleted,
              completedAt: targetCompleted ? new Date().toISOString() : undefined,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    const updated = await taskService.toggleTaskCompleted(id, currentTask.completed);
    if (updated) {
      if (updated.completed) {
        addToast(`🎉 Parabéns! Tarefa "${updated.title.slice(0, 24)}..." concluída!`, 'success');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
          });
        } catch {
          // ignore
        }
      } else {
        addToast('Tarefa movida para pendentes.', 'info');
      }
    }
  };

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setTaskToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDeleteId) {
      const id = taskToDeleteId;
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await taskService.deleteTask(id);
      addToast('Tarefa excluída do Supabase com sucesso.', 'info');
      setTaskToDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddCategory = async (catName: string) => {
    const updated = await taskService.addCategory(catName);
    setCategories(updated);
    addToast(`Categoria "${catName}" salva no Supabase!`, 'success');
  };

  const handleOpenCreateWithDate = (dateString: string) => {
    setTaskToEdit({
      id: '',
      title: '',
      category: 'Trabalho',
      priority: 'media',
      dueDate: dateString,
      completed: false,
      createdAt: '',
      updatedAt: '',
    });
    setIsTaskModalOpen(true);
  };

  const handleResetData = async () => {
    setIsLoading(true);
    const reset = await taskService.resetData();
    setTasks(reset);
    setIsLoading(false);
    setIsLogoutModalOpen(false);
    addToast('Tarefas restauradas para o padrão no seu perfil.', 'info');
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await authService.signOut();
    setCurrentUser(null);
    setUserProfile(null);
    setTasks([]);
    addToast('Sessão encerrada com sucesso.', 'info');
  };

  // Se estiver validando o token/sessão inicial
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-400">Verificando sessão com Supabase...</p>
      </div>
    );
  }

  // Se não estiver logado, exibe tela de Autenticação
  if (!currentUser) {
    return (
      <>
        <AuthPage 
          onSuccess={() => loadData(false)} 
          onToast={addToast} 
        />
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </>
    );
  }

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Header & Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
        pendingCount={pendingCount}
        isSyncing={isSyncing}
        onSync={() => loadData(true)}
        isOnline={isOnline}
        userProfile={userProfile}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Carregando suas tarefas do Supabase...</p>
          </div>
        ) : (
          <>
            {currentTab === 'tarefas' && (
              <TasksView
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleOpenEdit}
                onDeleteTask={handleOpenDelete}
                onOpenCreateModal={() => {
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            )}

            {currentTab === 'analises' && (
              <AnalyticsView
                tasks={tasks}
                categories={categories}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'calendario' && (
              <CalendarView
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleOpenEdit}
                onDeleteTask={handleOpenDelete}
                onOpenCreateModalWithDate={handleOpenCreateWithDate}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <span>TaskPulse • Gestão de Tarefas</span>
            <span>—</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Perfil: {userProfile?.name || currentUser?.email}
            </span>
          </p>
          <p className="text-slate-500">
            PostgreSQL & Supabase Auth • Projeto <span className="font-bold text-slate-700">lista-tarefas</span>
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Tarefa"
        message="Tem certeza de que deseja excluir esta tarefa do banco de dados? Esta ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTaskToDeleteId(null);
        }}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleLogout}
        onResetData={handleResetData}
        userName={userProfile?.name || currentUser?.email}
      />

      {/* Floating Toasts */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

    </div>
  );
}

export default App;
