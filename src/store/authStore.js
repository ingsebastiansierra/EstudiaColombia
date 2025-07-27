import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, subscribeToAuthChanges } from '../services/supabase';
import { isDevelopmentMode, getMockUser } from '../constants/config';

// Auth Store with Zustand
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setSession: (session) => set({ session }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Modo desarrollo: simular login exitoso
          if (isDevelopmentMode()) {
            console.log('🛠️ Modo desarrollo: Login simulado');
            const mockUser = getMockUser();
            set({ 
              user: { ...mockUser, email }, 
              session: { access_token: 'dev-token' },
              isAuthenticated: true, 
              isLoading: false 
            });
            return { success: true };
          }
          
          // Modo producción: usar Supabase
          const result = await authService.signIn(email, password);
          
          if (result.success) {
            const user = {
              id: result.data.user.id,
              email: result.data.user.email,
              name: result.data.user.user_metadata?.name || 'Usuario',
              grade: result.data.user.user_metadata?.grade || '',
              ...result.data.user.user_metadata,
            };
            
            set({ 
              user, 
              session: result.data.session,
              isAuthenticated: true, 
              isLoading: false 
            });
            return { success: true };
          } else {
            set({ error: result.error, isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      register: async (email, password, userData) => {
        set({ isLoading: true, error: null });
        try {
          // Modo desarrollo: simular registro exitoso
          if (isDevelopmentMode()) {
            console.log('🛠️ Modo desarrollo: Registro simulado');
            const user = {
              id: 'dev-user-' + Date.now(),
              email,
              name: userData.name,
              grade: userData.grade,
              ...userData,
            };
            
            set({ 
              user, 
              session: { access_token: 'dev-token' },
              isAuthenticated: true, 
              isLoading: false 
            });
            return { success: true };
          }
          
          // Modo producción: usar Supabase
          const result = await authService.signUp(email, password, userData);
          
          if (result.success) {
            // Nota: Supabase puede requerir confirmación de email
            if (result.data.user && !result.data.session) {
              set({ isLoading: false });
              return { 
                success: true, 
                message: 'Revisa tu email para confirmar tu cuenta' 
              };
            }
            
            const user = {
              id: result.data.user.id,
              email: result.data.user.email,
              name: userData.name,
              grade: userData.grade,
              ...userData,
            };
            
            set({ 
              user, 
              session: result.data.session,
              isAuthenticated: !!result.data.session, 
              isLoading: false 
            });
            return { success: true };
          } else {
            set({ error: result.error, isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          if (!isDevelopmentMode()) {
            await authService.signOut();
          }
          
          // Limpiar estado
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
          
          // Limpiar AsyncStorage completamente
          await AsyncStorage.removeItem('auth-storage');
          
          return { success: true };
        } catch (error) {
          console.error('Error en logout:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      clearStorage: async () => {
        try {
          await AsyncStorage.removeItem('auth-storage');
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
          console.log('🧹 Almacenamiento local limpiado completamente');
          return { success: true };
        } catch (error) {
          console.error('Error limpiando almacenamiento:', error);
          return { success: false, error: error.message };
        }
      },
      
      clearError: () => set({ error: null }),
      
      // Función para restablecer contraseña
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.resetPassword(email);
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Función para actualizar perfil
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.updateProfile(updates);
          
          if (result.success) {
            const currentUser = get().user;
            set({ 
              user: { ...currentUser, ...updates },
              isLoading: false 
            });
          } else {
            set({ error: result.error, isLoading: false });
          }
          
          return result;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Initialize auth state (to be called on app start)
      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // Modo desarrollo: no inicializar sesión automáticamente
          if (isDevelopmentMode()) {
            console.log('🛠️ Modo desarrollo activo - Supabase deshabilitado');
            console.log('📝 Para habilitar Supabase:');
            console.log('1. Crea un proyecto en supabase.com');
            console.log('2. Actualiza las credenciales en .env');
            console.log('3. Cambia DEVELOPMENT_MODE a false en config.js');
            set({ isLoading: false });
            return;
          }
          
          // Modo producción: usar Supabase
          const sessionResult = await authService.getCurrentSession();
          
          if (sessionResult.success && sessionResult.session) {
            const userResult = await authService.getCurrentUser();
            
            if (userResult.success && userResult.user) {
              const user = {
                id: userResult.user.id,
                email: userResult.user.email,
                name: userResult.user.user_metadata?.name || 'Usuario',
                grade: userResult.user.user_metadata?.grade || '',
                ...userResult.user.user_metadata,
              };
              
              set({ 
                user, 
                session: sessionResult.session,
                isAuthenticated: true, 
                isLoading: false 
              });
            } else {
              // Usuario no válido, limpiar sesión local
              console.log('🧹 Sesión local inválida, limpiando...');
              await get().logout();
              set({ isLoading: false });
            }
          } else {
            // Sesión no válida, limpiar datos locales
            console.log('🧹 No hay sesión válida, limpiando datos locales...');
            set({ 
              user: null, 
              session: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
          
          // Configurar listener para cambios de autenticación
          subscribeToAuthChanges((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
              set({ 
                user: null, 
                session: null, 
                isAuthenticated: false 
              });
            }
          });
          
        } catch (error) {
          console.error('Error inicializando auth:', error);
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
