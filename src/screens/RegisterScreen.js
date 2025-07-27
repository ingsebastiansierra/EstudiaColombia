import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { SCREEN_NAMES, COLORS } from '../constants';

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Confirma tu contraseña'),
  grade: Yup.string()
    .required('Selecciona tu grado'),
});

export default function RegisterScreen({ navigation }) {
  const { register, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (values) => {
    const { confirmPassword, ...userData } = values;
    const result = await register(values.email, values.password, userData);
    
    if (result.success) {
      if (result.message) {
        // Usuario registrado pero necesita confirmar email
        navigation.navigate('EmailConfirmation', { email: values.email });
      }
      // Si no hay mensaje, significa que se autenticó directamente (no debería pasar con email confirmation habilitado)
    } else {
      Alert.alert('Error', result.error || 'Error al registrarse');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Atrás</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>
              Únete a miles de estudiantes que ya usan Estudia Colombia
            </Text>
          </View>

          {/* Form */}
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              grade: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <TextInput
                  label="Nombre completo"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name}
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { primary: COLORS.primary } }}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

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
                  label="Grado actual"
                  value={values.grade}
                  onChangeText={handleChange('grade')}
                  onBlur={handleBlur('grade')}
                  error={touched.grade && errors.grade}
                  placeholder="Ej: Grado 11, Egresado"
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { primary: COLORS.primary } }}
                />
                {touched.grade && errors.grade && (
                  <Text style={styles.errorText}>{errors.grade}</Text>
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

                <TextInput
                  label="Confirmar contraseña"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { primary: COLORS.primary } }}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.registerButton}
                  buttonColor={COLORS.primary}
                >
                  Crear Cuenta
                </Button>
              </View>
            )}
          </Formik>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}
            >
              <Text style={styles.footerLink}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
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
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
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
  registerButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
