import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ProgressBar, Avatar } from 'react-native-paper';
import { COLORS, ICFES_AREAS } from '../constants';

export default function TrainerScreen({ navigation }) {
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  const levels = [
    { key: 'beginner', label: 'Principiante', color: COLORS.success || '#10b981' },
    { key: 'intermediate', label: 'Intermedio', color: COLORS.accent || '#eab308' },
    { key: 'advanced', label: 'Avanzado', color: COLORS.error || '#ef4444' },
  ];

  const areaProgress = [
    {
      area: 'Matemáticas',
      icon: '🔢',
      progress: 0.75,
      level: 'Intermedio',
      weakPoints: ['Geometría', 'Estadística'],
      nextSession: 'Álgebra básica',
      color: COLORS.primary,
    },
    {
      area: 'Lectura Crítica',
      icon: '📖',
      progress: 0.60,
      level: 'Principiante',
      weakPoints: ['Comprensión', 'Análisis'],
      nextSession: 'Técnicas de lectura',
      color: COLORS.secondary,
    },
    {
      area: 'Sociales',
      icon: '🌍',
      progress: 0.85,
      level: 'Avanzado',
      weakPoints: ['Historia contemporánea'],
      nextSession: 'Geografía económica',
      color: COLORS.accent,
    },
    {
      area: 'Ciencias',
      icon: '🧪',
      progress: 0.45,
      level: 'Principiante',
      weakPoints: ['Química', 'Física', 'Biología'],
      nextSession: 'Conceptos básicos',
      color: '#9333ea',
    },
    {
      area: 'Inglés',
      icon: '🇺🇸',
      progress: 0.90,
      level: 'Avanzado',
      weakPoints: ['Vocabulario técnico'],
      nextSession: 'Reading comprehension',
      color: '#f59e0b',
    },
  ];

  const dailyGoals = [
    { task: 'Completar 10 preguntas de matemáticas', completed: true },
    { task: 'Revisar errores del último simulacro', completed: true },
    { task: 'Estudiar 15 minutos de inglés', completed: false },
    { task: 'Hacer ejercicios de lectura crítica', completed: false },
  ];

  const achievements = [
    { title: 'Primera semana', icon: '🏆', unlocked: true },
    { title: 'Racha de 7 días', icon: '🔥', unlocked: true },
    { title: 'Maestro en matemáticas', icon: '🧮', unlocked: false },
    { title: 'Lector experto', icon: '📚', unlocked: false },
  ];

  const renderAreaCard = (area, index) => (
    <Card key={index} style={styles.areaCard}>
      <Card.Content>
        <View style={styles.areaHeader}>
          <View style={[styles.areaIcon, { backgroundColor: area.color + '20' }]}>
            <Text style={styles.areaEmoji}>{area.icon}</Text>
          </View>
          <View style={styles.areaInfo}>
            <Text style={styles.areaName}>{area.area}</Text>
            <Text style={[styles.areaLevel, { color: area.color }]}>
              {area.level}
            </Text>
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(area.progress * 100)}%
          </Text>
        </View>

        <ProgressBar 
          progress={area.progress} 
          color={area.color}
          style={styles.progressBar}
        />

        <View style={styles.areaDetails}>
          <Text style={styles.detailLabel}>Puntos débiles:</Text>
          <Text style={styles.detailText}>
            {area.weakPoints.join(', ')}
          </Text>
        </View>

        <View style={styles.areaDetails}>
          <Text style={styles.detailLabel}>Próxima sesión:</Text>
          <Text style={styles.detailText}>{area.nextSession}</Text>
        </View>

        <Button
          mode="contained"
          style={[styles.trainButton, { backgroundColor: area.color }]}
          onPress={() => {}}
        >
          Entrenar Ahora
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Entrenador Adaptativo</Text>
          <Text style={styles.subtitle}>Mejora tus debilidades con IA</Text>
        </View>

        {/* Daily Goals */}
        <Card style={styles.goalsCard}>
          <Card.Content>
            <Text style={styles.goalsTitle}>🎯 Metas del Día</Text>
            {dailyGoals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <View style={[
                  styles.goalCheckbox,
                  goal.completed && styles.goalCompleted
                ]}>
                  {goal.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[
                  styles.goalText,
                  goal.completed && styles.goalTextCompleted
                ]}>
                  {goal.task}
                </Text>
              </View>
            ))}
            <View style={styles.goalsProgress}>
              <Text style={styles.goalsProgressText}>
                2 de 4 completadas
              </Text>
              <ProgressBar 
                progress={0.5} 
                color={COLORS.success}
                style={styles.goalsProgressBar}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Level Selection */}
        <View style={styles.levelSection}>
          <Text style={styles.sectionTitle}>Nivel de Dificultad</Text>
          <View style={styles.levelContainer}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.levelChip,
                  selectedLevel === level.key && styles.selectedLevel,
                  { borderColor: level.color || COLORS.primary }
                ]}
                onPress={() => setSelectedLevel(level.key)}
              >
                <Text style={[
                  styles.levelText,
                  selectedLevel === level.key && { color: level.color || COLORS.primary }
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Areas Progress */}
        <View style={styles.areasSection}>
          <Text style={styles.sectionTitle}>Progreso por Área</Text>
          {areaProgress.map(renderAreaCard)}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 Logros</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View key={index} style={[
                styles.achievementItem,
                !achievement.unlocked && styles.achievementLocked
              ]}>
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.achievementIconLocked
                ]}>
                  {achievement.icon}
                </Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Study Streak */}
        <Card style={styles.streakCard}>
          <Card.Content>
            <View style={styles.streakContent}>
              <View style={styles.streakInfo}>
                <Text style={styles.streakTitle}>🔥 Racha de Estudio</Text>
                <Text style={styles.streakDays}>7 días consecutivos</Text>
                <Text style={styles.streakMotivation}>
                  ¡Sigue así! Estás en una excelente racha.
                </Text>
              </View>
              <Avatar.Text 
                size={60} 
                label="7" 
                style={{ backgroundColor: COLORS.accent }}
              />
            </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  goalsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  goalTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  goalsProgress: {
    marginTop: 16,
  },
  goalsProgressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  goalsProgressBar: {
    height: 6,
    borderRadius: 3,
  },
  levelSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  levelChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  selectedLevel: {
    backgroundColor: COLORS.surface,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  areasSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  areaCard: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  areaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  areaEmoji: {
    fontSize: 20,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  areaLevel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  areaDetails: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  trainButton: {
    marginTop: 12,
    paddingVertical: 4,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementIconLocked: {
    opacity: 0.3,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: COLORS.textSecondary,
  },
  streakCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: COLORS.accent + '10',
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  streakDays: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: 4,
  },
  streakMotivation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
