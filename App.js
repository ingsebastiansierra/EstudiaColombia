import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { COLORS } from './src/constants';

// Tema personalizado para React Native Paper
const theme = {
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    onSurface: COLORS.text,
    disabled: COLORS.textSecondary,
    placeholder: COLORS.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: COLORS.error,
  },
};

export default function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Inicializar el estado de autenticación al cargar la app
    initializeAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
