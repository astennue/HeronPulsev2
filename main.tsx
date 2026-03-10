/**
 * ============================================
 * HERONPULSE - GLOBAL STATE MANAGEMENT
 * ============================================
 * 
 * Comprehensive React Context for managing:
 * - Authentication state
 * - Theme (dark/light mode)
 * - User data
 * - Tasks, Courses, Projects
 * - UI state (sidebar, modals, etc.)
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  User,
  Task,
  Course,
  Project,
  CalendarEvent,
  ChatRoom,
  Notification,
  Theme,
  ViewMode,
  FilterState,
  AuthState,
  Badge,
  StreakData,
} from '@/types';
import { initializeTheme, toggleTheme as toggleThemeFn } from '@/lib/theme';

// ============================================
// STATE INTERFACE
// ============================================

interface AppState {
  // Auth
  auth: AuthState;
  
  // Theme
  theme: Theme;
  
  // Data
  user: User | null;
  tasks: Task[];
  courses: Course[];
  projects: Project[];
  events: CalendarEvent[];
  chatRooms: ChatRoom[];
  notifications: Notification[];
  badges: Badge[];
  streak: StreakData | null;
  
  // UI State
  sidebarCollapsed: boolean;
  activeView: string;
  taskViewMode: ViewMode;
  filters: FilterState;
  searchQuery: string;
  
  // Modals
  modals: {
    createTask: boolean;
    createCourse: boolean;
    createProject: boolean;
    inviteMembers: boolean;
    taskDetails: string | null; // task ID
  };
  
  // Loading states
  loading: {
    tasks: boolean;
    courses: boolean;
    projects: boolean;
    events: boolean;
  };
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: AppState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  },
  theme: 'light',
  user: null,
  tasks: [],
  courses: [],
  projects: [],
  events: [],
  chatRooms: [],
  notifications: [],
  badges: [],
  streak: null,
  sidebarCollapsed: false,
  activeView: 'overview',
  taskViewMode: 'list',
  filters: {
    status: [],
    priority: [],
    course: [],
    dateRange: {},
    search: '',
    assignee: [],
  },
  searchQuery: '',
  modals: {
    createTask: false,
    createCourse: false,
    createProject: false,
    inviteMembers: false,
    taskDetails: null,
  },
  loading: {
    tasks: false,
    courses: false,
    projects: false,
    events: false,
  },
};

// ============================================
// ACTION TYPES
// ============================================

type Action =
  // Auth actions
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: User }
  | { type: 'AUTH_LOGIN_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_UPDATE_USER'; payload: Partial<User> }
  
  // Theme actions
  | { type: 'THEME_SET'; payload: Theme }
  | { type: 'THEME_TOGGLE' }
  
  // Data actions
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_EVENTS'; payload: CalendarEvent[] }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_CHAT_ROOMS'; payload: ChatRoom[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_BADGES'; payload: Badge[] }
  | { type: 'SET_STREAK'; payload: StreakData }
  
  // UI actions
  | { type: 'SIDEBAR_TOGGLE' }
  | { type: 'SIDEBAR_SET'; payload: boolean }
  | { type: 'SET_ACTIVE_VIEW'; payload: string }
  | { type: 'SET_TASK_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  
  // Modal actions
  | { type: 'MODAL_OPEN'; payload: keyof AppState['modals'] }
  | { type: 'MODAL_CLOSE'; payload: keyof AppState['modals'] }
  | { type: 'MODAL_SET_TASK_DETAILS'; payload: string | null }
  
  // Loading actions
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } };

// ============================================
// REDUCER
// ============================================

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // Auth
    case 'AUTH_LOGIN_START':
      return { ...state, auth: { ...state.auth, isLoading: true, error: null } };
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        auth: { user: action.payload, isAuthenticated: true, isLoading: false, error: null },
        user: action.payload,
      };
    case 'AUTH_LOGIN_FAILURE':
      return { ...state, auth: { ...state.auth, isLoading: false, error: action.payload } };
    case 'AUTH_LOGOUT':
      return { 
        ...initialState, 
        theme: state.theme,
        auth: { user: null, isAuthenticated: false, isLoading: false, error: null }
      };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
        auth: state.auth.user
          ? { ...state.auth, user: { ...state.auth.user, ...action.payload } }
          : state.auth,
      };
      
    // Theme
    case 'THEME_SET':
      return { ...state, theme: action.payload };
    case 'THEME_TOGGLE':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: newTheme };
      
    // Tasks
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
      
    // Courses
    case 'SET_COURSES':
      return { ...state, courses: action.payload };
    case 'ADD_COURSE':
      return { ...state, courses: [...state.courses, action.payload] };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_COURSE':
      return { ...state, courses: state.courses.filter((c) => c.id !== action.payload) };
      
    // Projects
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter((p) => p.id !== action.payload) };
      
    // Events
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((e) => (e.id === action.payload.id ? action.payload : e)),
      };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter((e) => e.id !== action.payload) };
      
    // Chat & Notifications
    case 'SET_CHAT_ROOMS':
      return { ...state, chatRooms: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
      
    // Badges & Streak
    case 'SET_BADGES':
      return { ...state, badges: action.payload };
    case 'SET_STREAK':
      return { ...state, streak: action.payload };
      
    // UI
    case 'SIDEBAR_TOGGLE':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SIDEBAR_SET':
      return { ...state, sidebarCollapsed: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_TASK_VIEW_MODE':
      return { ...state, taskViewMode: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
      
    // Modals
    case 'MODAL_OPEN':
      return { ...state, modals: { ...state.modals, [action.payload]: true } };
    case 'MODAL_CLOSE':
      return { ...state, modals: { ...state.modals, [action.payload]: false } };
    case 'MODAL_SET_TASK_DETAILS':
      return { ...state, modals: { ...state.modals, taskDetails: action.payload } };
      
    // Loading
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.payload.key]: action.payload.value } };
      
    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => void;
  
  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  
  // Data actions
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  inviteToProject: (projectId: string, emailOrUsername: string) => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  // UI actions
  toggleSidebar: () => void;
  setActiveView: (view: string) => void;
  openModal: (modal: keyof AppState['modals']) => void;
  closeModal: (modal: keyof AppState['modals']) => void;
  setTaskViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  
  // Computed
  filteredTasks: Task[];
  upcomingTasks: Task[];
  overdueTasks: Task[];
  tasksByStatus: Record<string, Task[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Initialize theme on mount
  useEffect(() => {
    const theme = initializeTheme();
    dispatch({ type: 'THEME_SET', payload: theme });
    
    // Check for stored auth
    const storedUser = localStorage.getItem('heronpulse-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('heronpulse-user');
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } else {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);
  
  // ============================================
  // DEMO DATA LOADER (defined before auth actions)
  // ============================================
  
  const loadDemoData = useCallback(() => {
    // Demo Courses
    const demoCourses: Course[] = [
      {
        id: 'course-001',
        code: 'CS 301',
        name: 'Data Structures and Algorithms',
        description: 'Advanced data structures and algorithm analysis',
        units: 3,
        schedule: [
          { day: 'Monday', startTime: '09:00', endTime: '12:00', room: 'Lab 3' },
          { day: 'Wednesday', startTime: '09:00', endTime: '12:00', room: 'Lab 3' },
        ],
        instructor: 'Prof. Santos',
        color: '#0055A4',
        userId: 'demo-user-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        targetGrade: 1.5,
        currentGrade: 1.75,
        timeSpent: 45,
      },
      {
        id: 'course-002',
        code: 'IT 302',
        name: 'Network Security',
        description: 'Network security principles and practices',
        units: 3,
        schedule: [
          { day: 'Tuesday', startTime: '13:00', endTime: '16:00', room: 'Room 201' },
          { day: 'Thursday', startTime: '13:00', endTime: '16:00', room: 'Room 201' },
        ],
        instructor: 'Prof. Reyes',
        color: '#10B981',
        userId: 'demo-user-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        targetGrade: 1.75,
        currentGrade: 2.0,
        timeSpent: 32,
      },
      {
        id: 'course-003',
        code: 'CC 303',
        name: 'Cloud Computing',
        description: 'Cloud infrastructure and services',
        units: 3,
        schedule: [
          { day: 'Friday', startTime: '09:00', endTime: '12:00', room: 'Lab 5' },
        ],
        instructor: 'Prof. Cruz',
        color: '#F59E0B',
        userId: 'demo-user-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        targetGrade: 1.5,
        currentGrade: 1.5,
        timeSpent: 28,
      },
      {
        id: 'course-004',
        code: 'GE 304',
        name: 'Ethics in Technology',
        description: 'Ethical considerations in computing',
        units: 3,
        schedule: [
          { day: 'Monday', startTime: '15:00', endTime: '18:00', room: 'Room 105' },
        ],
        instructor: 'Prof. Garcia',
        color: '#8B5CF6',
        userId: 'demo-user-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        targetGrade: 2.0,
        currentGrade: 1.75,
        timeSpent: 15,
      },
    ];
    
    // Demo Tasks
    const demoTasks: Task[] = [
      {
        id: 'task-001',
        title: 'Implement Binary Search Tree',
        description: 'Create a BST with insert, delete, and traversal operations',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        courseId: 'course-001',
        userId: 'demo-user-001',
        assignees: ['demo-user-001'],
        subtasks: [
          { id: 'sub-001', title: 'Implement insert operation', completed: true, createdAt: new Date() },
          { id: 'sub-002', title: 'Implement delete operation', completed: false, createdAt: new Date() },
          { id: 'sub-003', title: 'Add traversal methods', completed: false, createdAt: new Date() },
        ],
        attachments: [],
        tags: ['programming', 'algorithms'],
        timeEstimate: 240,
        timeSpent: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-002',
        title: 'Network Security Quiz',
        description: 'Quiz on chapters 5-7',
        status: 'todo',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        courseId: 'course-002',
        userId: 'demo-user-001',
        assignees: ['demo-user-001'],
        subtasks: [],
        attachments: [],
        tags: ['quiz', 'study'],
        timeEstimate: 180,
        timeSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-003',
        title: 'Cloud Deployment Project',
        description: 'Deploy a web app to AWS',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        courseId: 'course-003',
        userId: 'demo-user-001',
        assignees: ['demo-user-001'],
        subtasks: [
          { id: 'sub-004', title: 'Set up EC2 instance', completed: false, createdAt: new Date() },
          { id: 'sub-005', title: 'Configure security groups', completed: false, createdAt: new Date() },
        ],
        attachments: [],
        tags: ['aws', 'deployment'],
        timeEstimate: 360,
        timeSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-004',
        title: 'Ethics Case Study',
        description: 'Analyze the Facebook data privacy case',
        status: 'done',
        priority: 'low',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        courseId: 'course-004',
        userId: 'demo-user-001',
        assignees: ['demo-user-001'],
        subtasks: [],
        attachments: [],
        tags: ['essay'],
        timeEstimate: 120,
        timeSpent: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];
    
    // Demo Projects
    const demoProjects: Project[] = [
      {
        id: 'project-001',
        name: 'HeronPulse Development',
        description: 'Capstone project - Academic workload management system',
        color: '#0055A4',
        ownerId: 'demo-user-001',
        members: [
          { userId: 'demo-user-001', role: 'owner', joinedAt: new Date() },
          { userId: 'user-002', role: 'member', joinedAt: new Date() },
          { userId: 'user-003', role: 'member', joinedAt: new Date() },
        ],
        tasks: [],
        courseId: 'course-001',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: 65,
      },
      {
        id: 'project-002',
        name: 'Network Security Audit',
        description: 'Security assessment for local business',
        color: '#10B981',
        ownerId: 'demo-user-001',
        members: [
          { userId: 'demo-user-001', role: 'owner', joinedAt: new Date() },
          { userId: 'user-004', role: 'member', joinedAt: new Date() },
        ],
        tasks: [],
        courseId: 'course-002',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: 30,
      },
    ];
    
    // Demo Events
    const demoEvents: CalendarEvent[] = [
      {
        id: 'event-001',
        title: 'CS 301 - Lab Session',
        description: 'Data Structures lab',
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        allDay: false,
        type: 'class',
        courseId: 'course-001',
        color: '#0055A4',
        userId: 'demo-user-001',
        isRecurring: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'event-002',
        title: 'Midterm Exam',
        description: 'IT 302 Midterm',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        allDay: false,
        type: 'exam',
        courseId: 'course-002',
        color: '#EF4444',
        userId: 'demo-user-001',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    // Demo Chat Rooms
    const demoChatRooms: ChatRoom[] = [
      {
        id: 'chat-001',
        name: 'HeronPulse Team',
        type: 'project',
        participants: [
          { userId: 'demo-user-001', role: 'admin', joinedAt: new Date(), isOnline: true },
          { userId: 'user-002', role: 'member', joinedAt: new Date(), isOnline: false, lastSeen: new Date(Date.now() - 30 * 60 * 1000) },
          { userId: 'user-003', role: 'member', joinedAt: new Date(), isOnline: true },
        ],
        unreadCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'project-001',
      },
      {
        id: 'chat-002',
        name: 'CS 301 Study Group',
        type: 'course',
        participants: [
          { userId: 'demo-user-001', role: 'member', joinedAt: new Date(), isOnline: true },
          { userId: 'user-005', role: 'member', joinedAt: new Date(), isOnline: false },
        ],
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        courseId: 'course-001',
      },
    ];
    
    // Demo Notifications
    const demoNotifications: Notification[] = [
      {
        id: 'notif-001',
        userId: 'demo-user-001',
        type: 'deadline',
        title: 'Deadline approaching',
        message: 'Network Security Quiz is due tomorrow',
        data: { taskId: 'task-002' },
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'notif-002',
        userId: 'demo-user-001',
        type: 'achievement',
        title: 'New badge earned!',
        message: 'You earned the Silver Streaker badge',
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];
    
    dispatch({ type: 'SET_COURSES', payload: demoCourses });
    dispatch({ type: 'SET_TASKS', payload: demoTasks });
    dispatch({ type: 'SET_PROJECTS', payload: demoProjects });
    dispatch({ type: 'SET_EVENTS', payload: demoEvents });
    dispatch({ type: 'SET_CHAT_ROOMS', payload: demoChatRooms });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: demoNotifications });
  }, [dispatch]);
  
  // ============================================
  // AUTH ACTIONS
  // ============================================
  
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOGIN_START' });
    
    try {
      // Demo account check
      if (email === 'reinernuevas.acads@gmail.com' && password === '@CSFDSARein03082026') {
        const demoUser: User = {
          id: 'demo-user-001',
          email: 'reinernuevas.acads@gmail.com',
          username: 'reinernuevas',
          firstName: 'Reiner',
          lastName: 'Nuevas',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=reinernuevas`,
          role: 'student',
          department: 'CCIS',
          yearLevel: 3,
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date(),
          isActive: true,
          streak: 32,
          totalPoints: 2840,
          badges: [],
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              push: true,
              deadlineReminders: true,
              workloadAlerts: true,
              teamUpdates: true,
              digestFrequency: 'daily',
            },
            calendarSync: {
              google: true,
              outlook: false,
              apple: false,
            },
            language: 'en',
            timezone: 'Asia/Manila',
          },
        };
        
        localStorage.setItem('heronpulse-user', JSON.stringify(demoUser));
        dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: demoUser });
        
        // Load demo data
        loadDemoData();
      } else {
        throw new Error('Invalid credentials. Use demo account.');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_LOGIN_FAILURE', payload: (error as Error).message });
    }
  }, [loadDemoData]);
  
  const loginWithGoogle = useCallback(async (_token: string) => {
    dispatch({ type: 'AUTH_LOGIN_START' });
    
    try {
      // In real implementation, verify token with Google
      // For demo, we'll create a user based on token info
      const demoUser: User = {
        id: 'google-user-001',
        email: 'student@umak.edu.ph',
        username: 'umakstudent',
        firstName: 'UMAK',
        lastName: 'Student',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=umakstudent`,
        role: 'student',
        department: 'CCIS',
        yearLevel: 2,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        streak: 5,
        totalPoints: 450,
        badges: [],
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            deadlineReminders: true,
            workloadAlerts: true,
            teamUpdates: true,
            digestFrequency: 'weekly',
          },
          calendarSync: {
            google: true,
            outlook: false,
            apple: false,
          },
          language: 'en',
          timezone: 'Asia/Manila',
        },
      };
      
      localStorage.setItem('heronpulse-user', JSON.stringify(demoUser));
      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: demoUser });
      loadDemoData();
    } catch (error) {
      dispatch({ type: 'AUTH_LOGIN_FAILURE', payload: (error as Error).message });
    }
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('heronpulse-user');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);
  
  // ============================================
  // THEME ACTIONS
  // ============================================
  
  const toggleThemeCallback = useCallback(() => {
    const newTheme = toggleThemeFn(state.theme);
    dispatch({ type: 'THEME_SET', payload: newTheme });
  }, [state.theme]);
  
  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'THEME_SET', payload: theme });
  }, []);
  
  // ============================================
  // DATA ACTIONS
  // ============================================
  
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  }, []);
  
  const updateTask = useCallback(async (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, updatedAt: new Date() } });
  }, []);
  
  const deleteTask = useCallback(async (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, []);
  
  const createCourse = useCallback(async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_COURSE', payload: newCourse });
  }, []);
  
  const updateCourse = useCallback(async (course: Course) => {
    dispatch({ type: 'UPDATE_COURSE', payload: { ...course, updatedAt: new Date() } });
  }, []);
  
  const deleteCourse = useCallback(async (courseId: string) => {
    dispatch({ type: 'DELETE_COURSE', payload: courseId });
  }, []);
  
  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  }, []);
  
  const inviteToProject = useCallback(async (projectId: string, emailOrUsername: string) => {
    // In real implementation, send invite
    console.log(`Inviting ${emailOrUsername} to project ${projectId}`);
  }, []);
  
  const createEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  }, []);
  
  // ============================================
  // UI ACTIONS
  // ============================================
  
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'SIDEBAR_TOGGLE' });
  }, []);
  
  const setActiveView = useCallback((view: string) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  }, []);
  
  const openModal = useCallback((modal: keyof AppState['modals']) => {
    dispatch({ type: 'MODAL_OPEN', payload: modal });
  }, []);
  
  const closeModal = useCallback((modal: keyof AppState['modals']) => {
    dispatch({ type: 'MODAL_CLOSE', payload: modal });
  }, []);
  
  const setTaskViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_TASK_VIEW_MODE', payload: mode });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);
  
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const filteredTasks = React.useMemo(() => {
    let filtered = [...state.tasks];
    
    // Apply search
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply filters
    if (state.filters.status.length > 0) {
      filtered = filtered.filter((t) => state.filters.status.includes(t.status));
    }
    
    if (state.filters.priority.length > 0) {
      filtered = filtered.filter((t) => state.filters.priority.includes(t.priority));
    }
    
    if (state.filters.course.length > 0) {
      filtered = filtered.filter((t) => t.courseId && state.filters.course.includes(t.courseId));
    }
    
    return filtered;
  }, [state.tasks, state.searchQuery, state.filters]);
  
  const upcomingTasks = React.useMemo(() => {
    const now = new Date();
    return state.tasks
      .filter((t) => t.status !== 'done' && new Date(t.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [state.tasks]);
  
  const overdueTasks = React.useMemo(() => {
    const now = new Date();
    return state.tasks.filter((t) => t.status !== 'done' && new Date(t.dueDate) < now);
  }, [state.tasks]);
  
  const tasksByStatus = React.useMemo(() => {
    return {
      todo: state.tasks.filter((t) => t.status === 'todo'),
      in_progress: state.tasks.filter((t) => t.status === 'in_progress'),
      review: state.tasks.filter((t) => t.status === 'review'),
      done: state.tasks.filter((t) => t.status === 'done'),
    };
  }, [state.tasks]);
  
  // ============================================
  // CONTEXT VALUE
  // ============================================
  
  const value: AppContextType = {
    state,
    dispatch,
    login,
    loginWithGoogle,
    logout,
    toggleTheme: toggleThemeCallback,
    setTheme,
    createTask,
    updateTask,
    deleteTask,
    createCourse,
    updateCourse,
    deleteCourse,
    createProject,
    inviteToProject,
    createEvent,
    toggleSidebar,
    setActiveView,
    openModal,
    closeModal,
    setTaskViewMode,
    setSearchQuery,
    filteredTasks,
    upcomingTasks,
    overdueTasks,
    tasksByStatus,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
