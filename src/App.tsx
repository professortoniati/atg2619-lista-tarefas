import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { 
  Task, 
  Category, 
  FilterStatus, 
  SortOption, 
  NavigationTab, 
  ToastMessage 
} from './types';
import { taskService } from './services/taskService';
import { Navbar } from './components/Navbar';
import { TasksView } from './components/TasksView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { TaskFormModal } from './components/TaskFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { LogoutModal } from './components/LogoutModal';
import { ToastContainer } from './components/ToastContainer';
import { CheckSquare, LogIn, Loader2, Database } from 'lucide-react';

export function App() {
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
  const [isLoggedOut, setIsLoggedOut] = useState(false);

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

  // Carrega dados iniciais do Supabase
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
          addToast('Dados sincronizados com o Supabase!', 'success');
        } else {
          addToast('Carregado do cache local (offline).', 'info');
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setIsOnline(false);
      addToast('Não foi possível conectar ao Supabase. Modo offline ativado.', 'warning');
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

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
    addToast('Dados restaurados para o padrão no Supabase.', 'info');
  };

  const handleSimulateLogout = () => {
    setIsLogoutModalOpen(false);
    setIsLoggedOut(true);
    addToast('Sessão encerrada com segurança.', 'info');
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/10">
            <CheckSquare className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">TaskPulse</h1>
            <p className="text-sm text-slate-500 mt-1">Você encerrou a sessão com segurança.</p>
          </div>
          <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2">
            <p className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Persistência em Nuvem:</span>
            </p>
            <p className="text-slate-500">
              Suas tarefas estão sincronizadas diretamente no projeto <strong>lista-tarefas</strong> no Supabase.
            </p>
          </div>
          <button
            onClick={() => setIsLoggedOut(false)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Retornar ao Aplicativo</span>
          </button>
        </div>
      </div>
    );
  }

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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Carregando tarefas do Supabase...</p>
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
            <span>TaskPulse • Lista de Tarefas</span>
            <span>—</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Supabase Ativo (lista-tarefas)
            </span>
          </p>
          <p className="text-slate-500">
            Conectado com PostgreSQL & MCP no projeto <span className="font-bold text-slate-700">lista-tarefas</span>
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
        onSimulateLogout={handleSimulateLogout}
        onResetData={handleResetData}
      />

      {/* Floating Toasts */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

    </div>
  );
}

export default App;
