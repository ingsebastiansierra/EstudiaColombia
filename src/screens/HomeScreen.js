import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Avatar } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { COLORS, SCREEN_NAMES } from '../constants';

export default function HomeScreen({ navigation }) {
  const { user } = useAuthStore();

  const quickActions = [
    {
      title: 'Buscar Universidades',
      subtitle: 'Encuentra tu universidad ideal',
      icon: '🏛️',
      screen: SCREEN_NAMES.UNIVERSITIES,
      color: COLORS.primary,
    },
    {
      title: 'Simulador ICFES',
      subtitle: 'Practica para tu examen',
      icon: '📊',
      screen: SCREEN_NAMES.SIMULATOR,
      color: COLORS.secondary,
    },
    {
      title: 'Entrenador Adaptativo',
      subtitle: 'Mejora tus debilidades',
      icon: '🎯',
      screen: SCREEN_NAMES.TRAINER,
      color: COLORS.accent,
    },
  ];

  const recentActivity = [
    { title: 'Simulacro de Matemáticas', score: '85%', date: 'Hace 2 días' },
    { title: 'Universidad Nacional', action: 'Guardada', date: 'Hace 3 días' },
    { title: 'Entrenamiento Lectura Crítica', score: '78%', date: 'Hace 1 semana' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, {user?.name || 'Estudiante'}!</Text>
            <Text style={styles.subtitle}>¿Listo para alcanzar tus metas universitarias?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}>
            <Avatar.Text 
              size={50} 
              label={user?.name?.charAt(0) || 'U'} 
              style={{ backgroundColor: COLORS.primary }}
            />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text style={styles.progressTitle}>Tu Progreso</Text>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Simulacros</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Promedio</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Universidades</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={styles.actionContent}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Text style={styles.actionEmoji}>{action.icon}</Text>
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          {recentActivity.map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDate}>{item.date}</Text>
              </View>
              <Text style={[
                styles.activityScore,
                { color: item.score ? COLORS.success : COLORS.primary }
              ]}>
                {item.score || item.action}
              </Text>
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <Card style={styles.ctaCard}>
          <Card.Content>
            <Text style={styles.ctaTitle}>🚀 ¡Impulsa tu futuro!</Text>
            <Text style={styles.ctaText}>
              Descubre las mejores universidades para tu perfil y entrena para obtener el puntaje que necesitas.
            </Text>
            <Button
              mode="contained"
              style={styles.ctaButton}
              buttonColor={COLORS.primary}
              onPress={() => navigation.navigate(SCREEN_NAMES.UNIVERSITIES)}
            >
              Explorar Universidades
            </Button>
          </Card.Content>
        </Card>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.primary,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: COLORS.text,
  },
  activityDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityScore: {
    fontSize: 16,
    fontWeight: '600',
  },
  ctaCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: COLORS.surface,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaButton: {
    paddingVertical: 4,
  },
});
