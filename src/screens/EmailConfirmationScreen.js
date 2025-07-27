import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { authService } from '../services/supabase';
import { SCREEN_NAMES, COLORS } from '../constants';

export default function EmailConfirmationScreen({ navigation, route }) {
  const [isResending, setIsResending] = useState(false);
  const email = route?.params?.email || '';

  const handleResendConfirmation = async () => {
    if (!email) {
      Alert.alert('Error', 'No se pudo obtener el email. Intenta registrarte nuevamente.');
      return;
    }

    setIsResending(true);
    try {
      const result = await authService.resetPassword(email); // Esto reenvía el email de confirmación
      if (result.success) {
        Alert.alert(
          '✅ Email Reenviado',
          'Se ha enviado un nuevo email de confirmación. Revisa tu bandeja de entrada y spam.'
        );
      } else {
        Alert.alert('Error', 'No se pudo reenviar el email. Intenta más tarde.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al reenviar el email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📧</Text>
          </View>
          <Text style={styles.title}>Confirma tu Email</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un email de confirmación a:
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>¿Qué hacer ahora?</Text>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Revisa tu bandeja de entrada y carpeta de spam
            </Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Busca un email de Supabase con el asunto "Confirm your signup"
            </Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Haz clic en el enlace "Confirm your mail"
            </Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>
              Regresa a la app e inicia sesión con tu email y contraseña
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={handleResendConfirmation}
            loading={isResending}
            disabled={isResending}
            style={styles.resendButton}
            textColor={COLORS.primary}
          >
            {isResending ? 'Reenviando...' : 'Reenviar Email'}
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}
            style={styles.loginButton}
            buttonColor={COLORS.primary}
          >
            Ir a Iniciar Sesión
          </Button>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate(SCREEN_NAMES.WELCOME)}
          >
            <Text style={styles.backButtonText}>← Volver al inicio</Text>
          </TouchableOpacity>
        </View>

        {/* Help */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>¿No recibes el email?</Text>
          <Text style={styles.helpText}>
            • Revisa tu carpeta de spam{'\n'}
            • Verifica que el email esté escrito correctamente{'\n'}
            • Espera unos minutos, a veces puede tardar{'\n'}
            • Intenta reenviar el email de confirmación
          </Text>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  instructionsContainer: {
    marginVertical: 30,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  resendButton: {
    marginBottom: 12,
    borderColor: COLORS.primary,
  },
  loginButton: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  helpContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
