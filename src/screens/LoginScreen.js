import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { SCREEN_NAMES, COLORS } from '../constants';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

export default function LoginScreen({ navigation }) {
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    const result = await login(values.email, values.password);
    if (!result.success) {
      let errorMessage = result.error || 'Error al iniciar sesión';
      
      // Mejorar mensajes de error comunes
      if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos. Verifica tus datos.';
      }
      
      Alert.alert('Error de Acceso', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Bienvenido de nuevo a Estudia Colombia
          </Text>
        </View>

        {/* Form */}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <TextInput
                label="Correo electrónico"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: COLORS.primary } }}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Contraseña"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && errors.password}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: COLORS.primary } }}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                buttonColor={COLORS.primary}
              >
                Iniciar Sesión
              </Button>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD)}
              >
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER)}
          >
            <Text style={styles.footerLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 8,
    marginTop: -8,
  },
  loginButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
