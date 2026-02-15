
import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Layers,
  CheckSquare,
  Clock,
  Search,
  Plus,
  Bell,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Sun,
  Moon,
  X,
  ChevronLeft
} from 'lucide-react';
import {
  User,
  UserRole,
  ContentTask,
  ContentStatus,
  Priority,
  Client
} from './types';
import {
  MOCK_USERS,
  MOCK_CLIENTS,
} from './constants';
import * as supabaseService from './services/supabaseService';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { StatCard } from './components/StatCard';
import { TaskModal } from './components/TaskModal';
import { ClientsModule } from './components/ClientsModule';
import { CalendarModule } from './components/CalendarModule';
import { ReportsModule } from './components/ReportsModule';
import { CreateTaskModal } from './components/CreateTaskModal';
import { UsersModule } from './components/UsersModule';
import { CreateUserModal } from './components/CreateUserModal';
import { CreateClientModal } from './components/CreateClientModal';
import { ClientDetailView } from './components/ClientDetailView';
import { DashboardModule } from './components/DashboardModule';
import { Login } from './components/Login';

const INITIAL_TASKS: ContentTask[] = [
  {
    id: 't1',
    clientId: 'c1',
    title: 'Post Instagram: Promoção de Verão',
    briefing: 'Criar arte para carrossel anunciando 30% OFF em smartwatches. Usar paleta vibrante.',
    format: 'Carrosséis',
    channel: 'Instagram',
    priority: Priority.ALTA,
    status: ContentStatus.EM_PRODUCAO,
    deadline: '2024-06-25',
    assignedTo: 'u2',
    attachments: [],
    links: ['https://drive.google.com/share/ref1'],
    createdAt: '2024-06-15'
  },
  {
    id: 't2',
    clientId: 'c1',
    title: 'Reel: Unboxing Novo Smartphone',
    briefing: 'Roteiro de unboxing rápido destacando a câmera de 100MP.',
    format: 'Vídeos Reels',
    channel: 'Instagram/TikTok',
    priority: Priority.MEDIA,
    status: ContentStatus.APROVADO,
    deadline: '2024-06-28',
    assignedTo: 'u3',
    attachments: [],
    links: [],
    createdAt: '2024-06-16'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<ContentTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ContentTask | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  // Check for session and load data on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const session = await supabaseService.getSession();

        if (session?.user) {
          const userData = await supabaseService.getCurrentUserData(session.user.id);
          const finalUser = userData || {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
            role: session.user.user_metadata?.role || 'EQUIPE',
            avatar: session.user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${session.user.user_metadata?.name || session.user.email}&background=random`
          } as any;
          setCurrentUser(finalUser);
          await loadAppData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabaseService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = await supabaseService.getCurrentUserData(session.user.id);
        const finalUser = userData || {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
          role: session.user.user_metadata?.role || 'EQUIPE',
          avatar: session.user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${session.user.user_metadata?.name || session.user.email}&background=random`
        } as any;
        setCurrentUser(finalUser);
        await loadAppData();
      } else {
        setCurrentUser(null);
        setTasks([]);
        setUsers([]);
        setClients([]);
      }
    });

    initAuth();
    return () => subscription.unsubscribe();
  }, []);

  const loadAppData = async () => {
    try {
      const [usersData, clientsData, tasksData] = await Promise.all([
        supabaseService.getUsers(),
        supabaseService.getClients(),
        supabaseService.getTasks()
      ]);

      setUsers(usersData);
      setClients(clientsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading app data:', error);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (activeTab !== 'clients') {
      setSelectedClientId(null);
    }
  }, [activeTab]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogout = async () => {
    try {
      await supabaseService.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: ContentStatus, comment?: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updates: Partial<ContentTask> = {
        status: newStatus,
        reviewComment: comment || task.reviewComment,
        reviewedBy: (newStatus === ContentStatus.APROVADO || newStatus === ContentStatus.AJUSTES_SOLICITADOS) ? currentUser?.id : task.reviewedBy,
        reviewedAt: (newStatus === ContentStatus.APROVADO || newStatus === ContentStatus.AJUSTES_SOLICITADOS) ? new Date().toISOString() : task.reviewedAt
      };

      const updatedTask = await supabaseService.updateTask(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Erro ao atualizar status da tarefa. Tente novamente.');
    }
  };

  const handleSaveNewTask = async (taskData: Omit<ContentTask, 'id' | 'createdAt'>) => {
    try {
      const newTask = await supabaseService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Erro ao criar tarefa. Tente novamente.');
    }
  };

  const handleSaveUser = async (userData: Omit<User, 'id'>) => {
    try {
      if (editingUser) {
        const updatedUser = await supabaseService.updateUser(editingUser.id, userData);
        setUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
        setEditingUser(null);
      } else {
        const newUser = await supabaseService.createUser(userData);
        setUsers(prev => [...prev, newUser]);
      }
      setIsCreateUserModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro ao salvar usuário. Tente novamente.');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsCreateUserModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Deseja realmente remover este membro da equipe?')) {
      try {
        await supabaseService.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erro ao remover usuário. Tente novamente.');
      }
    }
  };

  const handleSaveClientTargets = async (clientId: string, targets: any[]) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;

      const updatedClient = await supabaseService.updateClient(clientId, { ...client, targets });
      setClients(prev => prev.map(c => c.id === clientId ? updatedClient : c));
    } catch (error) {
      console.error('Error updating client targets:', error);
      alert('Erro ao atualizar metas do cliente. Tente novamente.');
    }
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (currentUser?.role === UserRole.CLIENTE) {
      result = result.filter(t => t.clientId === currentUser.clientId && (t.status === ContentStatus.APROVADO || t.status === ContentStatus.ENTREGUE));
    } else if (currentUser?.role === UserRole.EQUIPE) {
      result = result.filter(t => t.assignedTo === currentUser.id);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(lower) || t.briefing.toLowerCase().includes(lower));
    }
    return result;
  }, [tasks, currentUser, searchTerm]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardModule
            tasks={tasks}
            clients={clients}
            users={users}
            setActiveTab={setActiveTab}
          />
        );
      case 'tasks':
        return (
          <div className="h-[calc(100vh-180px)] flex flex-col">
            <KanbanBoard tasks={filteredTasks} onTaskClick={setSelectedTask} currentUser={currentUser!} />
          </div>
        );
      case 'clients':
        if (selectedClientId) {
          const client = clients.find(c => c.id === selectedClientId);
          if (!client) return null;
          return (
            <ClientDetailView
              client={client}
              tasks={tasks.filter(t => t.clientId === client.id)}
              onBack={() => setSelectedClientId(null)}
              onUpdateTargets={(targets) => handleSaveClientTargets(client.id, targets)}
              onNewTask={() => setIsCreateModalOpen(true)}
              onTaskClick={setSelectedTask}
            />
          );
        }
        return (
          <ClientsModule
            clients={clients}
            tasks={tasks}
            onAddClient={() => setIsCreateClientModalOpen(true)}
            onSelectClient={setSelectedClientId}
          />
        );
      case 'team':
        return (
          <UsersModule
            users={users}
            onAddUser={() => {
              setEditingUser(null);
              setIsCreateUserModalOpen(true);
            }}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'calendar':
        return <CalendarModule tasks={tasks} onTaskClick={setSelectedTask} onUpdateStatus={handleUpdateStatus} />;
      case 'reports':
        return <ReportsModule tasks={tasks} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {selectedClientId && activeTab === 'clients' && (
              <button
                onClick={() => setSelectedClientId(null)}
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-orange-500 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight transition-colors">
                {selectedClientId && activeTab === 'clients' ? clients.find(c => c.id === selectedClientId)?.name :
                  activeTab === 'dashboard' ? 'Painel Geral' : activeTab}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Olá, {currentUser.name}. LVmedia em ação.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-all active:scale-95 shadow-sm"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>
        {renderContent()}
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          user={currentUser}
          onUpdateStatus={(id, status, comment) => {
            handleUpdateStatus(id, status, comment);
            setSelectedTask(null);
          }}
        />
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewTask}
        preSelectedClientId={selectedClientId || undefined}
      />

      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => {
          setIsCreateUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialData={editingUser}
      />

      <CreateClientModal
        isOpen={isCreateClientModalOpen}
        onClose={() => setIsCreateClientModalOpen(false)}
        onSave={async (clientData) => {
          try {
            const newClient = await supabaseService.createClient(clientData, clientData.targets);
            setClients(prev => [...prev, newClient]);
            setIsCreateClientModalOpen(false);
          } catch (error) {
            console.error('Error creating client:', error);
            alert('Erro ao criar cliente. Tente novamente.');
          }
        }}
      />
    </div>
  );
};

export default App;
