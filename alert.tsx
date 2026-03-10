/**
 * ============================================
 * HERONPULSE - MAIN APPLICATION
 * ============================================
 * 
 * A world-class Academic Work OS that rivals Monday.com and ClickUp
 * Built exclusively for UMAK CCIS students
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Calendar, BookOpen, FolderKanban, MessageSquare,
  Trophy, BarChart3, Settings, Bell, Search, Plus, Menu, X, Sun, Moon, LogOut,
  ChevronDown, Filter, Grid3X3, List, CalendarDays, MoreVertical, Clock, Flag,
  Paperclip, CheckCircle2, Circle, UserPlus, Video, Phone, Send, Smile, Flame,
  Award, Zap, Edit3, Trash2, Eye, EyeOff, User, ChevronRight, ChevronLeft,
  Loader2, Palette, Lock,
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { AppProvider, useApp } from '@/context/AppContext';
import { calculateAcademicLoadIndex } from '@/lib/algorithm';
import type { Task, Course, Project, TaskStatus, TaskPriority } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

import './App.css';

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 72 },
};


// ============================================
// AUTH PAGE
// ============================================

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { login, loginWithGoogle, state } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle('mock-token');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-[var(--color-text-primary)]">HeronPulse</CardTitle>
            <CardDescription className="text-[var(--color-text-secondary)]">Academic Work OS for UMAK CCIS</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@umak.edu.ph" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[var(--color-background)] border-[var(--color-border)]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[var(--color-background)] border-[var(--color-border)] pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {state.auth.error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                      {state.auth.error}
                    </motion.div>
                  )}
                  <Button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  <p>Sign up with your UMAK Google Account</p>
                  <p className="text-sm mt-2">@umak.edu.ph emails only</p>
                </div>
              </TabsContent>
            </Tabs>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--color-surface)] px-2 text-[var(--color-text-muted)]">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full border-[var(--color-border)]" onClick={handleGoogleLogin} disabled={isLoading}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <div className="mt-6 p-4 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] text-center">
                <strong>Demo Account:</strong><br />
                Email: reinernuevas.acads@gmail.com<br />
                Password: @CSFDSARein03082026
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


// ============================================
// SIDEBAR COMPONENT
// ============================================

function Sidebar() {
  const { state, toggleSidebar, setActiveView, toggleTheme } = useApp();
  const { sidebarCollapsed, activeView, theme, user, notifications } = state;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <motion.aside variants={sidebarVariants} initial="expanded" animate={sidebarCollapsed ? 'collapsed' : 'expanded'} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="fixed left-0 top-0 h-full bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50 flex flex-col">
      <div className="h-16 flex items-center px-4 border-b border-[var(--color-border)]">
        <motion.div className="flex items-center gap-3" layout>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bold text-lg text-[var(--color-text-primary)]">HeronPulse</motion.span>}
        </motion.div>
        <button onClick={toggleSidebar} className="ml-auto p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <TooltipProvider key={item.id} delayDuration={sidebarCollapsed ? 0 : 1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'}`}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                      {item.id === 'chat' && !sidebarCollapsed && <Badge variant="secondary" className="ml-auto text-xs">3</Badge>}
                    </button>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-2 border-t border-[var(--color-border)] space-y-1">
        <TooltipProvider delayDuration={sidebarCollapsed ? 0 : 1000}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-all">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                {!sidebarCollapsed && <span className="text-sm font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
              </button>
            </TooltipTrigger>
            {sidebarCollapsed && <TooltipContent side="right">Toggle Theme</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={sidebarCollapsed ? 0 : 1000}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => setActiveView('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeView === 'settings' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'}`}>
                <Settings className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
              </button>
            </TooltipTrigger>
            {sidebarCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="p-3 border-t border-[var(--color-border)]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-all">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[var(--color-primary)] text-white text-sm">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
                </div>
              )}
              {!sidebarCollapsed && <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveView('settings')}><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
            <DropdownMenuItem><Bell className="w-4 h-4 mr-2" />Notifications {unreadCount > 0 && <Badge variant="destructive" className="ml-auto text-xs">{unreadCount}</Badge>}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500"><LogOut className="w-4 h-4 mr-2" />Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.aside>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================

function Header() {
  const { state, setSearchQuery, toggleSidebar } = useApp();
  const { searchQuery, notifications } = state;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-4 sticky top-0 z-40">
      <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] lg:hidden">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input placeholder="Search tasks, courses, projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-[var(--color-background)] border-[var(--color-border)]" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"><X className="w-4 h-4" /></button>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">{unreadCount}</span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              {notifications.length === 0 ? <div className="p-4 text-center text-[var(--color-text-muted)]">No notifications</div> : notifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-3">
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{notif.message}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{format(new Date(notif.createdAt), 'MMM d, h:mm a')}</p>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"><Plus className="w-4 h-4 mr-1" />Quick Add</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><CheckSquare className="w-4 h-4 mr-2" />New Task</DropdownMenuItem>
            <DropdownMenuItem><BookOpen className="w-4 h-4 mr-2" />New Course</DropdownMenuItem>
            <DropdownMenuItem><FolderKanban className="w-4 h-4 mr-2" />New Project</DropdownMenuItem>
            <DropdownMenuItem><Calendar className="w-4 h-4 mr-2" />New Event</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


// ============================================
// OVERVIEW VIEW
// ============================================

function OverviewView() {
  const { state } = useApp();
  const { tasks, courses, events, user } = state;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'done' && isPast(new Date(t.dueDate))).length;
  const upcomingTasks = tasks.filter((t) => t.status !== 'done').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5);
  const ali = calculateAcademicLoadIndex(tasks, events, courses);
  const todayEvents = events.filter((e) => isSameDay(new Date(e.startDate), new Date()));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Good {getTimeOfDay()}, {user?.firstName}!</h1>
          <p className="text-[var(--color-text-secondary)]">Here's what's happening with your academic journey</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-[var(--color-text-muted)]">Current Streak</p>
            <div className="flex items-center gap-1 text-orange-500"><Flame className="w-5 h-5" /><span className="font-bold text-lg">{user?.streak} days</span></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={totalTasks} subtitle={`${completedTasks} completed`} icon={CheckSquare} color="blue" />
        <StatCard title="Pending" value={pendingTasks} subtitle={`${overdueTasks} overdue`} icon={Clock} color="yellow" />
        <StatCard title="Courses" value={courses.length} subtitle="This semester" icon={BookOpen} color="green" />
        <StatCard title="Academic Load" value={`${ali.percentage}%`} subtitle={ali.status === 'optimal' ? 'Optimal' : ali.status === 'high' ? 'High' : 'Critical'} icon={Zap} color={ali.status === 'optimal' ? 'green' : ali.status === 'high' ? 'yellow' : 'red'} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle className="text-lg">Upcoming Tasks</CardTitle><CardDescription>Tasks due soon</CardDescription></div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.length === 0 ? <div className="text-center py-8 text-[var(--color-text-muted)]"><CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No upcoming tasks</p><p className="text-sm">You're all caught up!</p></div> : upcomingTasks.map((task) => <TaskRow key={task.id} task={task} />)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader><CardTitle className="text-lg">Today's Schedule</CardTitle><CardDescription>{format(new Date(), 'EEEE, MMMM d')}</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.length === 0 ? <div className="text-center py-8 text-[var(--color-text-muted)]"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No events today</p></div> : todayEvents.map((event) => <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-background)]"><div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: event.color }} /><div className="flex-1"><p className="font-medium text-sm">{event.title}</p><p className="text-xs text-[var(--color-text-muted)]">{format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}</p></div></div>)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
        <CardHeader><CardTitle className="text-lg">Course Progress</CardTitle><CardDescription>Your progress in each course</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => {
              const courseTasks = tasks.filter((t) => t.courseId === course.id);
              const completed = courseTasks.filter((t) => t.status === 'done').length;
              const total = courseTasks.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;
              return <div key={course.id} className="p-4 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]"><div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }} /><span className="font-medium text-sm truncate">{course.code}</span></div><div className="space-y-2"><div className="flex justify-between text-xs"><span className="text-[var(--color-text-muted)]">Progress</span><span>{Math.round(progress)}%</span></div><Progress value={progress} className="h-2" /><p className="text-xs text-[var(--color-text-muted)]">{completed}/{total} tasks completed</p></div></div>;
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: { title: string; value: string | number; subtitle: string; icon: React.ElementType; color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'; }) {
  const colorClasses = { blue: 'bg-blue-500/10 text-blue-500', green: 'bg-green-500/10 text-green-500', yellow: 'bg-yellow-500/10 text-yellow-500', red: 'bg-red-500/10 text-red-500', purple: 'bg-purple-500/10 text-purple-500' };
  return <Card className="border-[var(--color-border)] bg-[var(--color-surface)]"><CardContent className="p-6"><div className="flex items-start justify-between"><div><p className="text-sm text-[var(--color-text-muted)]">{title}</p><p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{value}</p><p className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</p></div><div className={`p-3 rounded-lg ${colorClasses[color]}`}><Icon className="w-5 h-5" /></div></div></CardContent></Card>;
}

function TaskRow({ task }: { task: Task }) {
  const { courses } = useApp().state;
  const course = courses.find((c) => c.id === task.courseId);
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== 'done';
  const priorityColors = { low: 'bg-gray-500', medium: 'bg-blue-500', high: 'bg-orange-500', urgent: 'bg-red-500' };
  return <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] transition-colors"><div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} /><div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{task.title}</p><div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">{course && <><span style={{ color: course.color }}>{course.code}</span><span>•</span></>}<span className={isOverdue ? 'text-red-500' : ''}>{isToday(dueDate) ? 'Today' : isTomorrow(dueDate) ? 'Tomorrow' : format(dueDate, 'MMM d')}</span></div></div><Badge variant={task.status === 'done' ? 'default' : 'secondary'} className="text-xs">{task.status.replace('_', ' ')}</Badge></div>;
}

function getTimeOfDay() { const hour = new Date().getHours(); if (hour < 12) return 'morning'; if (hour < 18) return 'afternoon'; return 'evening'; }


// ============================================
// TASKS VIEW
// ============================================

function TasksView() {
  const { state, setTaskViewMode, filteredTasks, tasksByStatus } = useApp();
  const { taskViewMode } = state;
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
      <div className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Tasks</h1>
          <div className="flex items-center bg-[var(--color-background)] rounded-lg p-1">
            <button onClick={() => setTaskViewMode('list')} className={`p-1.5 rounded ${taskViewMode === 'list' ? 'bg-[var(--color-surface)] shadow-sm' : ''}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setTaskViewMode('board')} className={`p-1.5 rounded ${taskViewMode === 'board' ? 'bg-[var(--color-surface)] shadow-sm' : ''}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setTaskViewMode('calendar')} className={`p-1.5 rounded ${taskViewMode === 'calendar' ? 'bg-[var(--color-surface)] shadow-sm' : ''}`}><CalendarDays className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" />Filter</Button>
          <Button size="sm" className="bg-[var(--color-primary)]"><Plus className="w-4 h-4 mr-1" />New Task</Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {taskViewMode === 'list' && <TaskListView tasks={filteredTasks} onTaskClick={setSelectedTask} />}
        {taskViewMode === 'board' && <TaskBoardView tasksByStatus={tasksByStatus} onTaskClick={setSelectedTask} />}
        {taskViewMode === 'calendar' && <TaskCalendarView tasks={filteredTasks} />}
      </div>
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}><DialogContent className="max-w-2xl">{selectedTask && <TaskDetail task={selectedTask} />}</DialogContent></Dialog>
    </motion.div>
  );
}

function TaskListView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (task: Task) => void; }) {
  return (
    <ScrollArea className="h-full"><div className="p-4"><table className="w-full"><thead><tr className="border-b border-[var(--color-border)]"><th className="text-left py-2 px-4 text-xs font-medium text-[var(--color-text-muted)]">Task</th><th className="text-left py-2 px-4 text-xs font-medium text-[var(--color-text-muted)]">Status</th><th className="text-left py-2 px-4 text-xs font-medium text-[var(--color-text-muted)]">Priority</th><th className="text-left py-2 px-4 text-xs font-medium text-[var(--color-text-muted)]">Due Date</th><th className="text-left py-2 px-4 text-xs font-medium text-[var(--color-text-muted)]">Course</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} onClick={() => onTaskClick(task)} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] cursor-pointer"><td className="py-3 px-4"><div className="flex items-center gap-3"><button onClick={(e) => e.stopPropagation()} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">{task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}</button><span className={task.status === 'done' ? 'line-through text-[var(--color-text-muted)]' : ''}>{task.title}</span></div></td><td className="py-3 px-4"><StatusBadge status={task.status} /></td><td className="py-3 px-4"><PriorityBadge priority={task.priority} /></td><td className="py-3 px-4 text-sm">{format(new Date(task.dueDate), 'MMM d')}</td><td className="py-3 px-4"><CourseBadge courseId={task.courseId} /></td></tr>)}</tbody></table></div></ScrollArea>
  );
}

function TaskBoardView({ tasksByStatus, onTaskClick }: { tasksByStatus: Record<string, Task[]>; onTaskClick: (task: Task) => void; }) {
  const columns: { id: TaskStatus; title: string }[] = [{ id: 'todo', title: 'To Do' }, { id: 'in_progress', title: 'In Progress' }, { id: 'review', title: 'Review' }, { id: 'done', title: 'Done' }];
  return (
    <ScrollArea className="h-full"><div className="p-4 flex gap-4 min-w-max">{columns.map((column) => <div key={column.id} className="w-80"><div className="flex items-center justify-between mb-3"><h3 className="font-medium">{column.title}</h3><Badge variant="secondary">{tasksByStatus[column.id]?.length || 0}</Badge></div><div className="space-y-2">{tasksByStatus[column.id]?.map((task) => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)}</div></div>)}</div></ScrollArea>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void; }) {
  const { courses } = useApp().state;
  const course = courses.find((c) => c.id === task.courseId);
  return (
    <div onClick={onClick} className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:shadow-md cursor-pointer transition-shadow">
      <div className="flex items-start justify-between mb-2"><p className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-[var(--color-text-muted)]' : ''}`}>{task.title}</p><PriorityIcon priority={task.priority} /></div>
      {task.description && <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">{course && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }} />}<span className="text-xs text-[var(--color-text-muted)]">{format(new Date(task.dueDate), 'MMM d')}</span></div>
        <div className="flex items-center gap-2">{task.subtasks.length > 0 && <span className="text-xs text-[var(--color-text-muted)]">{task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}</span>}{task.attachments.length > 0 && <Paperclip className="w-3 h-3 text-[var(--color-text-muted)]" />}</div>
      </div>
    </div>
  );
}

function TaskCalendarView({ tasks }: { tasks: Task[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 rounded hover:bg-[var(--color-surface-hover)]"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm rounded hover:bg-[var(--color-surface-hover)]">Today</button>
          <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 rounded hover:bg-[var(--color-surface-hover)]"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="text-center text-xs font-medium text-[var(--color-text-muted)] py-2">{day}</div>)}
        {days.map((day) => {
          const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dueDate), day));
          return <div key={day.toISOString()} className={`min-h-24 p-2 rounded-lg border ${isToday(day) ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)]'}`}><span className={`text-sm ${isToday(day) ? 'font-bold text-[var(--color-primary)]' : ''}`}>{format(day, 'd')}</span><div className="mt-1 space-y-1">{dayTasks.slice(0, 3).map((task) => <div key={task.id} className="text-xs p-1 rounded bg-[var(--color-surface)] truncate">{task.title}</div>)}{dayTasks.length > 3 && <div className="text-xs text-[var(--color-text-muted)]">+{dayTasks.length - 3} more</div>}</div></div>;
        })}
      </div>
    </div>
  );
}

function TaskDetail({ task }: { task: Task }) {
  const { courses } = useApp().state;
  const course = courses.find((c) => c.id === task.courseId);
  return (
    <><DialogHeader><DialogTitle>{task.title}</DialogTitle><DialogDescription>{course?.code} • Due {format(new Date(task.dueDate), 'MMMM d, yyyy')}</DialogDescription></DialogHeader>
    <div className="space-y-4">
      <div className="flex items-center gap-4"><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div>
      {task.description && <div><Label className="text-xs text-[var(--color-text-muted)]">Description</Label><p className="text-sm mt-1">{task.description}</p></div>}
      {task.subtasks.length > 0 && <div><Label className="text-xs text-[var(--color-text-muted)]">Subtasks</Label><div className="mt-2 space-y-2">{task.subtasks.map((subtask) => <div key={subtask.id} className="flex items-center gap-2"><button className="text-[var(--color-text-muted)]">{subtask.completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4" />}</button><span className={`text-sm ${subtask.completed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>{subtask.title}</span></div>)}</div></div>}
      <div className="flex items-center gap-2"><Button variant="outline" size="sm"><Edit3 className="w-4 h-4 mr-1" />Edit</Button><Button variant="outline" size="sm" className="text-red-500"><Trash2 className="w-4 h-4 mr-1" />Delete</Button></div>
    </div></>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const variants: Record<TaskStatus, string> = { todo: 'bg-gray-500/10 text-gray-500', in_progress: 'bg-blue-500/10 text-blue-500', review: 'bg-yellow-500/10 text-yellow-500', done: 'bg-green-500/10 text-green-500' };
  return <Badge variant="secondary" className={`${variants[status]} text-xs capitalize`}>{status.replace('_', ' ')}</Badge>;
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const variants: Record<TaskPriority, string> = { low: 'bg-gray-500/10 text-gray-500', medium: 'bg-blue-500/10 text-blue-500', high: 'bg-orange-500/10 text-orange-500', urgent: 'bg-red-500/10 text-red-500' };
  return <Badge variant="secondary" className={`${variants[priority]} text-xs capitalize`}>{priority}</Badge>;
}

function PriorityIcon({ priority }: { priority: TaskPriority }) {
  const colors = { low: 'text-gray-400', medium: 'text-blue-400', high: 'text-orange-400', urgent: 'text-red-400' };
  return <Flag className={`w-4 h-4 ${colors[priority]}`} />;
}

function CourseBadge({ courseId }: { courseId?: string }) {
  const { courses } = useApp().state;
  const course = courses.find((c) => c.id === courseId);
  if (!course) return <span className="text-xs text-[var(--color-text-muted)]">-</span>;
  return <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }} /><span className="text-xs">{course.code}</span></div>;
}


// ============================================
// CALENDAR VIEW
// ============================================

function CalendarView() {
  const { state } = useApp();
  const { events, tasks } = state;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
      <div className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Calendar</h1>
          <div className="flex items-center bg-[var(--color-background)] rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map((v) => <button key={v} onClick={() => setView(v)} className={`px-3 py-1 text-sm rounded capitalize ${view === v ? 'bg-[var(--color-surface)] shadow-sm' : ''}`}>{v}</button>)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 rounded hover:bg-[var(--color-surface-hover)]"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-medium min-w-32 text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 rounded hover:bg-[var(--color-surface-hover)]"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <Button size="sm" className="bg-[var(--color-primary)]"><Plus className="w-4 h-4 mr-1" />New Event</Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-7 gap-px bg-[var(--color-border)] rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="bg-[var(--color-surface)] p-3 text-center text-xs font-medium text-[var(--color-text-muted)]">{day}</div>)}
          {days.map((day) => {
            const dayEvents = events.filter((e) => isSameDay(new Date(e.startDate), day));
            const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dueDate), day));
            return <div key={day.toISOString()} className={`bg-[var(--color-surface)] min-h-32 p-2 ${isToday(day) ? 'bg-[var(--color-primary)]/5' : ''}`}><span className={`text-sm ${isToday(day) ? 'font-bold text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>{format(day, 'd')}</span><div className="mt-1 space-y-1">{dayEvents.map((event) => <div key={event.id} className="text-xs p-1 rounded truncate" style={{ backgroundColor: `${event.color}20`, color: event.color }}>{event.title}</div>)}{dayTasks.map((task) => <div key={task.id} className="text-xs p-1 rounded bg-[var(--color-background)] text-[var(--color-text-secondary)] truncate"><CheckSquare className="w-3 h-3 inline mr-1" />{task.title}</div>)}</div></div>;
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// COURSES VIEW
// ============================================

function CoursesView() {
  const { state, createCourse } = useApp();
  const { courses } = state;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', description: '', units: 3, color: '#0055A4' });

  const handleCreate = async () => {
    await createCourse({ ...newCourse, schedule: [], userId: state.user?.id || '', timeSpent: 0 });
    setIsCreateOpen(false);
    setNewCourse({ code: '', name: '', description: '', units: 3, color: '#0055A4' });
    toast.success('Course created successfully!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Courses</h1><p className="text-[var(--color-text-secondary)]">Manage your courses and track progress</p></div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-[var(--color-primary)]"><Plus className="w-4 h-4 mr-1" />Add Course</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{courses.map((course) => <CourseCard key={course.id} course={course} />)}</div>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Course</DialogTitle><DialogDescription>Enter the details for your new course</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Course Code</Label><Input placeholder="e.g., CS 301" value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} /></div>
            <div className="space-y-2"><Label>Course Name</Label><Input placeholder="e.g., Data Structures" value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Brief description of the course" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Units</Label><Input type="number" value={newCourse.units} onChange={(e) => setNewCourse({ ...newCourse, units: parseInt(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Color</Label><div className="flex gap-2">{['#0055A4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => <button key={color} onClick={() => setNewCourse({ ...newCourse, color })} className={`w-8 h-8 rounded-full ${newCourse.color === color ? 'ring-2 ring-offset-2 ring-[var(--color-primary)]' : ''}`} style={{ backgroundColor: color }} />)}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} className="bg-[var(--color-primary)]">Create Course</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const { state } = useApp();
  const { tasks } = state;
  const courseTasks = tasks.filter((t) => t.courseId === course.id);
  const completed = courseTasks.filter((t) => t.status === 'done').length;
  const total = courseTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${course.color}20` }}><BookOpen className="w-5 h-5" style={{ color: course.color }} /></div>
            <div><CardTitle className="text-lg">{course.code}</CardTitle><CardDescription className="line-clamp-1">{course.name}</CardDescription></div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button className="p-1 rounded hover:bg-[var(--color-surface-hover)]"><MoreVertical className="w-4 h-4" /></button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem><Edit3 className="w-4 h-4 mr-2" />Edit</DropdownMenuItem><DropdownMenuItem className="text-red-500"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div><div className="flex justify-between text-sm mb-1"><span className="text-[var(--color-text-muted)]">Progress</span><span>{Math.round(progress)}%</span></div><Progress value={progress} className="h-2" /></div>
          <div className="flex items-center justify-between text-sm"><span className="text-[var(--color-text-muted)]">Tasks</span><span>{completed}/{total} completed</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-[var(--color-text-muted)]">Units</span><span>{course.units}</span></div>
          {course.instructor && <div className="flex items-center justify-between text-sm"><span className="text-[var(--color-text-muted)]">Instructor</span><span>{course.instructor}</span></div>}
        </div>
      </CardContent>
      <CardFooter><Button variant="outline" className="w-full">View Details</Button></CardFooter>
    </Card>
  );
}


// ============================================
// PROJECTS VIEW
// ============================================

function ProjectsView() {
  const { state, createProject } = useApp();
  const { projects } = state;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '', color: '#0055A4' });

  const handleCreate = async () => {
    await createProject({ ...newProject, ownerId: state.user?.id || '', members: [], tasks: [], status: 'active', progress: 0 });
    setIsCreateOpen(false);
    setNewProject({ name: '', description: '', color: '#0055A4' });
    toast.success('Project created successfully!');
  };

  const handleInvite = async () => {
    if (selectedProject && inviteEmail) {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setIsInviteOpen(false);
      setInviteEmail('');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Projects</h1><p className="text-[var(--color-text-secondary)]">Collaborate with your team on projects</p></div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-[var(--color-primary)]"><Plus className="w-4 h-4 mr-1" />New Project</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{projects.map((project) => <ProjectCard key={project.id} project={project} onInvite={() => { setSelectedProject(project); setIsInviteOpen(true); }} />)}</div>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Project</DialogTitle><DialogDescription>Set up a new project for your team</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Project Name</Label><Input placeholder="e.g., HeronPulse Development" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What is this project about?" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Color</Label><div className="flex gap-2">{['#0055A4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => <button key={color} onClick={() => setNewProject({ ...newProject, color })} className={`w-8 h-8 rounded-full ${newProject.color === color ? 'ring-2 ring-offset-2 ring-[var(--color-primary)]' : ''}`} style={{ backgroundColor: color }} />)}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} className="bg-[var(--color-primary)]">Create Project</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Team Members</DialogTitle><DialogDescription>Invite by email or username</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Email or Username</Label><Input placeholder="colleague@umak.edu.ph" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} /></div>
            <p className="text-xs text-[var(--color-text-muted)]">You can invite multiple people by separating emails with commas</p>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button><Button onClick={handleInvite} className="bg-[var(--color-primary)]"><UserPlus className="w-4 h-4 mr-1" />Send Invite</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function ProjectCard({ project, onInvite }: { project: Project; onInvite: () => void; }) {
  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${project.color}20` }}><FolderKanban className="w-5 h-5" style={{ color: project.color }} /></div>
            <div><CardTitle className="text-lg">{project.name}</CardTitle><CardDescription className="line-clamp-1">{project.description}</CardDescription></div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button className="p-1 rounded hover:bg-[var(--color-surface-hover)]"><MoreVertical className="w-4 h-4" /></button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem onClick={onInvite}><UserPlus className="w-4 h-4 mr-2" />Invite Members</DropdownMenuItem><DropdownMenuItem><Edit3 className="w-4 h-4 mr-2" />Edit</DropdownMenuItem><DropdownMenuItem className="text-red-500"><Trash2 className="w-4 h-4 mr-2" />Archive</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div><div className="flex justify-between text-sm mb-1"><span className="text-[var(--color-text-muted)]">Progress</span><span>{project.progress}%</span></div><Progress value={project.progress} className="h-2" /></div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">{project.members.slice(0, 4).map((_member, i) => <Avatar key={i} className="w-8 h-8 border-2 border-[var(--color-surface)]"><AvatarFallback className="text-xs bg-[var(--color-primary)] text-white">U{i + 1}</AvatarFallback></Avatar>)}{project.members.length > 4 && <div className="w-8 h-8 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-surface)] flex items-center justify-center text-xs">+{project.members.length - 4}</div>}</div>
            <span className="text-sm text-[var(--color-text-muted)]">{project.members.length} members</span>
          </div>
          {project.deadline && <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]"><Clock className="w-4 h-4" /><span>Due {format(new Date(project.deadline), 'MMM d, yyyy')}</span></div>}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2"><Button variant="outline" className="flex-1" onClick={onInvite}><UserPlus className="w-4 h-4 mr-1" />Invite</Button><Button className="flex-1 bg-[var(--color-primary)]">View Project</Button></CardFooter>
    </Card>
  );
}

// ============================================
// CHAT VIEW
// ============================================

function ChatView() {
  const { state } = useApp();
  const { chatRooms } = state;
  const [selectedRoom, setSelectedRoom] = useState<typeof chatRooms[0] | null>(chatRooms[0] || null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', content: 'Hey team! How is the project going?', sender: 'user-002', time: new Date(Date.now() - 3600000) },
    { id: '2', content: 'Going well! Just finished the dashboard component.', sender: 'demo-user-001', time: new Date(Date.now() - 3000000) },
    { id: '3', content: 'Great work! Let me review it.', sender: 'user-003', time: new Date(Date.now() - 2400000) },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now().toString(), content: message, sender: 'demo-user-001', time: new Date() }]);
      setMessage('');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-full flex">
      <div className="w-72 border-r border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="p-4 border-b border-[var(--color-border)]"><h2 className="font-semibold">Messages</h2></div>
        <ScrollArea className="h-[calc(100%-65px)]">
          {chatRooms.map((room) => (
            <button key={room.id} onClick={() => setSelectedRoom(room)} className={`w-full p-4 flex items-center gap-3 hover:bg-[var(--color-surface-hover)] transition-colors ${selectedRoom?.id === room.id ? 'bg-[var(--color-primary)]/5' : ''}`}>
              <div className="relative">
                <Avatar className="w-10 h-10"><AvatarFallback className="bg-[var(--color-primary)] text-white">{room.name[0]}</AvatarFallback></Avatar>
                {room.participants.some((p) => p.isOnline) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-surface)]" />}
              </div>
              <div className="flex-1 text-left"><p className="font-medium text-sm">{room.name}</p><p className="text-xs text-[var(--color-text-muted)] truncate">{room.lastMessage?.content || 'No messages yet'}</p></div>
              {room.unreadCount > 0 && <Badge variant="default" className="text-xs">{room.unreadCount}</Badge>}
            </button>
          ))}
        </ScrollArea>
      </div>
      {selectedRoom ? (
        <div className="flex-1 flex flex-col bg-[var(--color-background)]">
          <div className="h-16 border-b border-[var(--color-border)] flex items-center justify-between px-4 bg-[var(--color-surface)]">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10"><AvatarFallback className="bg-[var(--color-primary)] text-white">{selectedRoom.name[0]}</AvatarFallback></Avatar>
              <div><p className="font-medium">{selectedRoom.name}</p><p className="text-xs text-[var(--color-text-muted)]">{selectedRoom.participants.filter((p) => p.isOnline).length} online</p></div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)]"><Video className="w-5 h-5" /></button>
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)]"><Phone className="w-5 h-5" /></button>
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)]"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender === 'demo-user-001';
                return <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe ? 'bg-[var(--color-primary)] text-white rounded-br-md' : 'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-bl-md'}`}><p>{msg.content}</p><p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>{format(msg.time, 'h:mm a')}</p></div></div>;
              })}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"><Paperclip className="w-5 h-5" /></button>
              <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1" />
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"><Smile className="w-5 h-5" /></button>
              <Button onClick={handleSend} className="bg-[var(--color-primary)]"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center"><div className="text-center text-[var(--color-text-muted)]"><MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>Select a chat to start messaging</p></div></div>
      )}
    </motion.div>
  );
}


// ============================================
// LEADERBOARD VIEW
// ============================================

function LeaderboardView() {
  const { state } = useApp();
  const { user, badges } = state;
  const leaderboardData = [
    { rank: 1, name: 'Maria Santos', username: 'mariasantos', score: 3250, tasks: 156, streak: 45, avatar: 'MS' },
    { rank: 2, name: 'Juan Cruz', username: 'juancruz', score: 2980, tasks: 142, streak: 38, avatar: 'JC' },
    { rank: 3, name: 'Anna Reyes', username: 'annareyes', score: 2840, tasks: 138, streak: 32, avatar: 'AR' },
    { rank: 4, name: (user?.firstName || '') + ' ' + (user?.lastName || ''), username: user?.username || '', score: 2840, tasks: 135, streak: user?.streak || 0, avatar: (user?.firstName?.[0] || '') + (user?.lastName?.[0] || ''), isMe: true },
    { rank: 5, name: 'Pedro Garcia', username: 'pedrogarcia', score: 2650, tasks: 128, streak: 28, avatar: 'PG' },
    { rank: 6, name: 'Lisa Lim', username: 'lisalim', score: 2420, tasks: 115, streak: 25, avatar: 'LL' },
    { rank: 7, name: 'Mark Tan', username: 'marktan', score: 2380, tasks: 112, streak: 22, avatar: 'MT' },
    { rank: 8, name: 'Sarah Lee', username: 'sarahlee', score: 2150, tasks: 98, streak: 18, avatar: 'SL' },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Leaderboard</h1><p className="text-[var(--color-text-secondary)]">Compete with your peers and earn badges</p></div>
        <div className="flex items-center gap-4"><div className="text-right"><p className="text-sm text-[var(--color-text-muted)]">Your Rank</p><p className="text-2xl font-bold text-[var(--color-primary)]">#{leaderboardData.find((e) => e.isMe)?.rank}</p></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader><CardTitle>Top Performers</CardTitle><CardDescription>This week's rankings</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboardData.map((entry) => (
                <div key={entry.rank} className={`flex items-center gap-4 p-3 rounded-lg ${entry.isMe ? 'bg-[var(--color-primary)]/10' : 'hover:bg-[var(--color-surface-hover)]'}`}>
                  <div className={`w-8 text-center font-bold ${entry.rank === 1 ? 'text-yellow-500' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-amber-600' : 'text-[var(--color-text-muted)]'}`}>
                    {entry.rank <= 3 ? <Trophy className="w-6 h-6 mx-auto" /> : entry.rank}
                  </div>
                  <Avatar className="w-10 h-10"><AvatarFallback className="bg-[var(--color-primary)] text-white">{entry.avatar}</AvatarFallback></Avatar>
                  <div className="flex-1"><p className="font-medium">{entry.name}</p><p className="text-xs text-[var(--color-text-muted)]">@{entry.username}</p></div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center"><p className="font-bold">{entry.score}</p><p className="text-xs text-[var(--color-text-muted)]">points</p></div>
                    <div className="text-center"><p className="font-bold">{entry.tasks}</p><p className="text-xs text-[var(--color-text-muted)]">tasks</p></div>
                    <div className="text-center"><p className="font-bold flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" />{entry.streak}</p><p className="text-xs text-[var(--color-text-muted)]">streak</p></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader><CardTitle>Your Badges</CardTitle><CardDescription>Achievements you've earned</CardDescription></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {badges.filter((b) => b.earnedAt).map((badge) => (
                <div key={badge.id} className="aspect-square rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col items-center justify-center p-2 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${badge.tier === 'bronze' ? 'bg-amber-700/20 text-amber-700' : badge.tier === 'silver' ? 'bg-gray-400/20 text-gray-400' : badge.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-purple-500/20 text-purple-500'}`}><Award className="w-5 h-5" /></div>
                  <p className="text-xs font-medium truncate w-full">{badge.name}</p>
                </div>
              ))}
              {badges.filter((b) => b.earnedAt).length === 0 && <div className="col-span-3 text-center py-8 text-[var(--color-text-muted)]"><Award className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No badges yet</p><p className="text-sm">Complete tasks to earn badges!</p></div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// ============================================
// ANALYTICS VIEW
// ============================================

function AnalyticsView() {
  const { state } = useApp();
  const { tasks, courses } = state;
  const workloadData = [{ day: 'Mon', hours: 6 }, { day: 'Tue', hours: 8 }, { day: 'Wed', hours: 10 }, { day: 'Thu', hours: 7 }, { day: 'Fri', hours: 9 }, { day: 'Sat', hours: 4 }, { day: 'Sun', hours: 3 }];
  const taskDistribution = [{ name: 'Completed', value: tasks.filter((t) => t.status === 'done').length, color: '#10B981' }, { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length, color: '#3B82F6' }, { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#6B7280' }, { name: 'Review', value: tasks.filter((t) => t.status === 'review').length, color: '#F59E0B' }];
  const gradePredictions = courses.map((course) => ({ course: course.code, predicted: Math.floor(Math.random() * 20) + 80, current: course.currentGrade ? 100 - (course.currentGrade - 1) * 20 : null }));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Analytics</h1><p className="text-[var(--color-text-secondary)]">Insights into your academic performance</p></div>
        <Select defaultValue="week"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="semester">This Semester</SelectItem></SelectContent></Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader><CardTitle>Weekly Workload</CardTitle><CardDescription>Hours spent on academic activities</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
                <Bar dataKey="hours" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader><CardTitle>Task Distribution</CardTitle><CardDescription>Breakdown by status</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={taskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{taskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">{taskDistribution.map((item) => <div key={item.name} className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-xs">{item.name}</span></div>)}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 border-[var(--color-border)] bg-[var(--color-surface)]">
          <CardHeader><CardTitle>Grade Predictions</CardTitle><CardDescription>AI-powered grade forecasting</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradePredictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="course" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" domain={[0, 100]} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
                <Bar dataKey="predicted" fill="var(--color-primary)" name="Predicted" radius={[4, 4, 0, 0]} />
                <Bar dataKey="current" fill="var(--color-secondary)" name="Current" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// ============================================
// SETTINGS VIEW
// ============================================

function SettingsView() {
  const { state, toggleTheme } = useApp();
  const { user, theme } = state;
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Settings</h1>
      <div className="flex gap-6">
        <div className="w-48 space-y-1">
          {[{ id: 'profile', label: 'Profile', icon: User }, { id: 'account', label: 'Account', icon: Lock }, { id: 'notifications', label: 'Notifications', icon: Bell }, { id: 'appearance', label: 'Appearance', icon: Palette }].map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'}`}><Icon className="w-4 h-4" /><span className="text-sm">{item.label}</span></button>;
          })}
        </div>
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Manage your public profile information</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20"><AvatarImage src={user?.avatar} /><AvatarFallback className="text-2xl bg-[var(--color-primary)] text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback></Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>First Name</Label><Input defaultValue={user?.firstName} /></div>
                  <div className="space-y-2"><Label>Last Name</Label><Input defaultValue={user?.lastName} /></div>
                </div>
                <div className="space-y-2"><Label>Username</Label><Input defaultValue={user?.username} /></div>
                <div className="space-y-2"><Label>Bio</Label><Textarea placeholder="Tell us about yourself" /></div>
                <Button className="bg-[var(--color-primary)]">Save Changes</Button>
              </CardContent>
            </Card>
          )}
          {activeTab === 'account' && (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardHeader><CardTitle>Account</CardTitle><CardDescription>Manage your account settings</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div><p className="font-medium">Danger Zone</p><p className="text-sm text-[var(--color-text-muted)]">Once you delete your account, it cannot be recovered</p></div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === 'notifications' && (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose what notifications you receive</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {[{ id: 'email', label: 'Email Notifications', description: 'Receive notifications via email' }, { id: 'push', label: 'Push Notifications', description: 'Receive push notifications' }, { id: 'deadlines', label: 'Deadline Reminders', description: 'Get reminded before task deadlines' }, { id: 'workload', label: 'Workload Alerts', description: 'Get alerted about high workload periods' }].map((item) => <div key={item.id} className="flex items-center justify-between"><div><p className="font-medium">{item.label}</p><p className="text-sm text-[var(--color-text-muted)]">{item.description}</p></div><Switch defaultChecked /></div>)}
              </CardContent>
            </Card>
          )}
          {activeTab === 'appearance' && (
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize how HeronPulse looks</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-medium">Dark Mode</p><p className="text-sm text-[var(--color-text-muted)]">Toggle between light and dark themes</p></div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}


// ============================================
// MAIN DASHBOARD LAYOUT
// ============================================

function Dashboard() {
  const { state } = useApp();
  const { activeView, sidebarCollapsed } = state;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <main className="transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '72px' : '260px' }}>
        <Header />
        <div className="h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && <OverviewView key="overview" />}
            {activeView === 'tasks' && <TasksView key="tasks" />}
            {activeView === 'calendar' && <CalendarView key="calendar" />}
            {activeView === 'courses' && <CoursesView key="courses" />}
            {activeView === 'projects' && <ProjectsView key="projects" />}
            {activeView === 'chat' && <ChatView key="chat" />}
            {activeView === 'leaderboard' && <LeaderboardView key="leaderboard" />}
            {activeView === 'analytics' && <AnalyticsView key="analytics" />}
            {activeView === 'settings' && <SettingsView key="settings" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ============================================
// ROOT APP COMPONENT
// ============================================

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { state } = useApp();
  const { isAuthenticated, isLoading } = state.auth;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <Flame className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-[var(--color-text-muted)]">Loading HeronPulse...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {isAuthenticated ? <Dashboard key="dashboard" /> : <AuthPage key="auth" />}
      </AnimatePresence>
    </TooltipProvider>
  );
}

export default App;
