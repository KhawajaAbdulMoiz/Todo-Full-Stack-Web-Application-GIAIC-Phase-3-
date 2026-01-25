'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TaskList from '@/components/tasks/task-list';
import ChatButton from '@/components/ChatButton';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api';
import { Task } from '@/lib/types';

// Dynamically import ChatInterface to avoid SSR issues
const ChatInterface = dynamic(() => import('@/components/ChatInterface'), {
  ssr: false,
  loading: () => <div>Loading chat...</div>
});

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authIsLoading && !isAuthenticated && !redirecting) {
      setRedirecting(true);
      router.push('/auth/login');
      router.refresh();
    }
  }, [authIsLoading, isAuthenticated, router, redirecting]);

  // Fetch tasks for stats
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          setTasksLoading(true);
          const tasksData = await apiClient.getTasks();
          const formattedTasks = (Array.isArray(tasksData) ? tasksData : []).map(task => ({
            id: String(task.id),
            title: task.title,
            description: task.description || '',
            completed: task.completed || false,
            user_id: task.user_id,
            created_at: task.created_at,
            updated_at: task.updated_at,
          }));
          setTasks(formattedTasks);
        } catch (err) {
          console.error('Error fetching tasks for stats:', err);
        } finally {
          setTasksLoading(false);
        }
      };
      fetchTasks();
    }
  }, [user]);

  if (authIsLoading || redirecting || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="text-center glass-xl p-8 rounded-2xl shadow-lg border border-white/30 animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 tracking-wide">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-destructive/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="glass-xl text-destructive p-6 rounded-2xl max-w-md text-center shadow-lg border border-white/30 animate-fade-in">
          <h2 className="text-lg font-medium">Error Loading Dashboard</h2>
          <p className="mt-2">{error}</p>
          <Button
            onClick={() => setError(null)}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <header className="glass-xl backdrop-blur-xl shadow-lg sticky top-0 z-10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="animate-slide-in">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TaskFlow Dashboard</h1>
            <p className="text-sm text-gray-500 tracking-wide">
              Welcome back, <span className="font-medium text-gray-700">{user.email}</span>
            </p>

          </div>
          <div className="flex items-center space-x-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-neon-pulse"></div>
              <span>Online</span>
            </div>
            <Button
              onClick={logout}
              className="glass border-destructive/50 text-destructive hover:bg-destructive/10 transition-all duration-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-xl p-6 rounded-2xl shadow-lg border border-white/30 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground text-secondary">{tasksLoading ? '...' : totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="glass-xl p-6 rounded-2xl shadow-lg border border-white/30 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-400">{tasksLoading ? '...' : completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="glass-xl p-6 rounded-2xl shadow-lg border border-white/30 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-primary">{tasksLoading ? '...' : activeTasks}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="glass-xl p-6 rounded-2xl shadow-lg border border-white/30 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-3xl font-bold text-secondary">{tasksLoading ? '...' : `${productivityScore}%`}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="glass-xl rounded-2xl shadow-xl p-6 border border-white/30 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <TaskList userId={user.id} />
        </div>
      </main>

      {/* Chat Interface */}
      <ChatInterface
        userId={user.id}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Floating Chat Button */}
      <ChatButton onClick={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
}
