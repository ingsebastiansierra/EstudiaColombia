// App Constants
export const APP_NAME = 'Estudia Colombia';
export const APP_VERSION = '1.0.0';

// Colors (complementing Tailwind config)
export const COLORS = {
  primary: '#E61876',
  secondary: '#22c55e',
  accent: '#eab308',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#06b6d4',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1f2937',
  textSecondary: '#6b7280',
};

// Screen Names
export const SCREEN_NAMES = {
  // Auth
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main App
  HOME: 'Home',
  PROFILE: 'Profile',
  UNIVERSITIES: 'Universities',
  SIMULATOR: 'Simulator',
  TRAINER: 'Trainer',
  ALERTS: 'Alerts',
  BLOG: 'Blog',
  
  // University Details
  UNIVERSITY_DETAIL: 'UniversityDetail',
  CAREER_DETAIL: 'CareerDetail',
  UPTC_PONDERADO: 'UPTCPonderado',
  
  // ICFES
  ICFES_RESULTS: 'ICFESResults',
  ICFES_SIMULATOR: 'ICFESSimulator',
  ICFES_TRAINING: 'ICFESTraining',
  
  // Settings
  SETTINGS: 'Settings',
  NOTIFICATIONS: 'Notifications',
  ABOUT: 'About',
};

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  UNIVERSITIES: '/universities',
  CAREERS: '/careers',
  ICFES_RESULTS: '/icfes-results',
  USER_PROFILE: '/user-profile',
  NOTIFICATIONS: '/notifications',
};

// ICFES Areas
export const ICFES_AREAS = {
  MATEMATICAS: 'matematicas',
  LECTURA_CRITICA: 'lectura_critica',
  SOCIALES: 'sociales_ciudadanas',
  CIENCIAS_NATURALES: 'ciencias_naturales',
  INGLES: 'ingles',
};

// University Types
export const UNIVERSITY_TYPES = {
  PUBLIC: 'publica',
  PRIVATE: 'privada',
  MIXED: 'mixta',
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  UNIVERSITY_DEADLINE: 'university_deadline',
  ICFES_REMINDER: 'icfes_reminder',
  TRAINING_SUGGESTION: 'training_suggestion',
  NEW_CONTENT: 'new_content',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_PROFILE: 'user_profile',
  ICFES_RESULTS: 'icfes_results',
  PREFERENCES: 'user_preferences',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};
