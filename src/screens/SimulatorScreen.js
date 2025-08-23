import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ProgressBar, Chip } from 'react-native-paper';
import { COLORS, ICFES_AREAS } from '../constants';

export default function SimulatorScreen({ navigation }) {
  const [selectedArea, setSelectedArea] = useState('all');

  const areas = [
    { key: 'all', label: 'Todas las áreas', icon: '📚' },
    { key: ICFES_AREAS.MATEMATICAS, label: 'Matemáticas', icon: '🔢' },
    { key: ICFES_AREAS.LECTURA_CRITICA, label: 'Lectura Crítica', icon: '📖' },
    { key: ICFES_AREAS.SOCIALES, label: 'Sociales', icon: '🌍' },
    { key: ICFES_AREAS.CIENCIAS_NATURALES, label: 'Ciencias', icon: '🧪' },
    { key: ICFES_AREAS.INGLES, label: 'Inglés', icon: '🇺🇸' },
  ];

  const simulatorOptions = [
    {
      title: 'Simulacro Completo',
      subtitle: 'Prueba completa de 4.5 horas',
      duration: '4h 30min',
      questions: 268,
      difficulty: 'Oficial',
      icon: '🎯',
      color: COLORS.primary,
      premium: false,
      action: () => {},
    },
    {
      title: 'Simulacro Rápido',
      subtitle: 'Versión corta de 2 horas',
      duration: '2h 00min',
      questions: 134,
      difficulty: 'Intermedio',
      icon: '⚡',
      color: COLORS.secondary,
      premium: false,
      action: () => {},
    },
    {
      title: 'Simulacro por Área',
      subtitle: 'Enfócate en un área específica',
      duration: 'Variable',
      questions: 'Variable',
      difficulty: 'Variable',
      icon: '🎲',
      color: COLORS.accent,
      premium: false,
      action: () => navigation.navigate('AreasGenerales'),
    },
    {
      title: 'Simulacro Adaptativo',
      subtitle: 'IA ajusta dificultad según tu nivel',
      duration: '1h 30min',
      questions: 100,
      difficulty: 'Adaptativo',
      icon: '🤖',
      color: '#9333ea',
      premium: true,
      action: () => {},
    },
  ];

  const recentResults = [
    { date: '25 Jul', score: 385, area: 'Completo', improvement: '+12' },
    { date: '22 Jul', score: 420, area: 'Matemáticas', improvement: '+8' },
    { date: '20 Jul', score: 378, area: 'Lectura Crítica', improvement: '-5' },
    { date: '18 Jul', score: 395, area: 'Ciencias', improvement: '+15' },
  ];

  const renderSimulatorCard = (option, index) => (
    <Card key={index} style={[styles.simulatorCard, { borderLeftColor: option.color }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
            <Text style={styles.cardIcon}>{option.icon}</Text>
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              {option.premium && (
                <Chip style={styles.premiumChip} textStyle={styles.premiumText}>
                  <Text style={styles.premiumText}>Premium</Text>
                </Chip>
              )}
            </View>
            <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
          </View>
        </View>

        <View style={styles.cardStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>⏱️ Duración:</Text>
            <Text style={styles.statValue}>{option.duration}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>❓ Preguntas:</Text>
            <Text style={styles.statValue}>{option.questions}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>📊 Dificultad:</Text>
            <Text style={styles.statValue}>{option.difficulty}</Text>
          </View>
        </View>

        <Button
          mode="contained"
          style={[styles.startButton, { backgroundColor: option.color }]}
          onPress={option.action}
          disabled={option.premium}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {option.premium ? 'Requiere Premium' : 'Comenzar Simulacro'}
          </Text>
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Simulador ICFES</Text>
          <Text style={styles.subtitle}>Practica y mejora tu puntaje</Text>
        </View>

        {/* Progress Overview */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text style={styles.progressTitle}>Tu Progreso</Text>
            <View style={styles.progressStats}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>385</Text>
                <Text style={styles.progressLabel}>Último puntaje</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>12</Text>
                <Text style={styles.progressLabel}>Simulacros</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>+15</Text>
                <Text style={styles.progressLabel}>Mejora</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <Text style={styles.progressBarLabel}>Meta: 400 puntos</Text>
              <ProgressBar 
                progress={385 / 400} 
                color={COLORS.primary}
                style={styles.progressBar}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Area Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Selecciona el área</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {areas.map((area) => (
              <TouchableOpacity
                key={area.key}
                style={[
                  styles.areaChip,
                  selectedArea === area.key && styles.selectedAreaChip
                ]}
                onPress={() => setSelectedArea(area.key)}
              >
                <Text style={styles.areaIcon}>{area.icon}</Text>
                <Text style={[
                  styles.areaLabel,
                  selectedArea === area.key && styles.selectedAreaLabel
                ]}>
                  {area.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Simulator Options */}
        <View style={styles.simulatorSection}>
          <Text style={styles.sectionTitle}>Tipos de Simulacro</Text>
          {simulatorOptions.map(renderSimulatorCard)}
        </View>

        {/* Recent Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Resultados Recientes</Text>
          {recentResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.resultInfo}>
                <Text style={styles.resultDate}>{result.date}</Text>
                <Text style={styles.resultArea}>{result.area}</Text>
              </View>
              <View style={styles.resultScore}>
                <Text style={styles.scoreNumber}>{result.score}</Text>
                <Text style={[
                  styles.improvement,
                  { color: result.improvement.startsWith('+') ? COLORS.success : COLORS.error }
                ]}>
                  {result.improvement}
                </Text>
              </View>
            </View>
          ))}
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
    marginBottom: 16,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  progressLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarLabel: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  filterContainer: {
    paddingLeft: 20,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    elevation: 2,
  },
  selectedAreaChip: {
    backgroundColor: COLORS.primary,
  },
  areaIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  areaLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedAreaLabel: {
    color: 'white',
  },
  simulatorSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  simulatorCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  premiumChip: {
    backgroundColor: COLORS.accent,
  },
  premiumText: {
    color: 'white',
    fontSize: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardStats: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  startButton: {
    paddingVertical: 4,
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  resultInfo: {
    flex: 1,
  },
  resultDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resultArea: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  resultScore: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  improvement: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  }
});
