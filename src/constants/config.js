// Configuración de desarrollo
export const DEV_CONFIG = {
  // Modo de desarrollo: true = sin Supabase, false = con Supabase
  DEVELOPMENT_MODE: false,
  
  // Usuario mock para desarrollo
  MOCK_USER: {
    id: 'dev-user-1',
    email: 'estudiante@test.com',
    name: 'Estudiante de Prueba',
    grade: 'Grado 11',
    created_at: new Date().toISOString(),
  },
  
  // Configuración de Supabase
  SUPABASE_ENABLED: false, // Cambiar a true cuando tengas Supabase configurado
};

// Función para verificar si estamos en modo desarrollo
export const isDevelopmentMode = () => {
  const hasSupabaseCredentials = 
    process.env.EXPO_PUBLIC_SUPABASE_URL && 
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.EXPO_PUBLIC_SUPABASE_URL.includes('tu-proyecto') &&
    !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.includes('tu_clave');
  
  return DEV_CONFIG.DEVELOPMENT_MODE || !hasSupabaseCredentials;
};

// Función para obtener usuario de desarrollo
export const getMockUser = () => DEV_CONFIG.MOCK_USER;
