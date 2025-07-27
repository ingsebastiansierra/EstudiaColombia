import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.log('📝 Instrucciones:');
  console.log('1. Ve a https://supabase.com y crea un proyecto');
  console.log('2. En Settings > API, copia la URL y anon key');
  console.log('3. Actualiza el archivo .env con tus credenciales');
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usar AsyncStorage para persistir la sesión
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Funciones de autenticación
export const authService = {
  // Registrar nuevo usuario
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            grade: userData.grade,
            ...userData,
          },
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error en registro:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Iniciar sesión
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error en login:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error) {
      console.error('Error obteniendo usuario:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obtener sesión actual
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session };
    } catch (error) {
      console.error('Error obteniendo sesión:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Restablecer contraseña
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error restableciendo contraseña:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Actualizar perfil de usuario
  async updateProfile(updates) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando perfil:', error.message);
      return { success: false, error: error.message };
    }
  },
};

// Funciones para escuchar cambios de autenticación
export const subscribeToAuthChanges = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Exportar cliente por defecto
export default supabase;
