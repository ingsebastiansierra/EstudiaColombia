import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, ProgressBar, Avatar } from 'react-native-paper';
import { COLORS, ICFES_AREAS } from '../constants';
import { supabase } from '../DataBase/supabaseClient';

export default function TrainerScreen({ navigation }) {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [areaProgress, setAreaProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const levels = [
    { key: 'beginner', label: 'Principiante', color: COLORS.success || '#10b981' },
    { key: 'intermediate', label: 'Intermedio', color: COLORS.accent || '#eab308' },
    { key: 'advanced', label: 'Avanzado', color: COLORS.error || '#ef4444' },
  ];

  useEffect(() => {
    async function fetchIcfesScores() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_icfes_scores')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const latestScores = data[0];
          const transformedData = [
            {
              area: 'Lectura Crítica',
              icon: '📖',
              score: latestScores.lectura_critica,
              progress: latestScores.lectura_critica / 100,
              color: COLORS.secondary,
            },
            {
              area: 'Matemáticas',
              icon: '🔢',
              score: latestScores.matematicas,
              progress: latestScores.matematicas / 100,
              color: COLORS.primary,
            },
            {
              area: 'Sociales',
              icon: '🌍',
              score: latestScores.sociales_ciudadanas,
              progress: latestScores.sociales_ciudadanas / 100,
              color: COLORS.accent,
            },
            {
              area: 'Ciencias Naturales',
              icon: '🧪',
              score: latestScores.ciencias_naturales,
              progress: latestScores.ciencias_naturales / 100,
              color: '#9333ea',
            },
            {
              area: 'Inglés',
              icon: '🇺🇸',
              score: latestScores.ingles,
              progress: latestScores.ingles / 100,
              color: '#f59e0b',
            },
          ].map(item => ({
            ...item,
            level: getLevelByScore(item.score),
            weakPoints: getWeakPoints(item.area),
            nextSession: getNextSession(item.area),
          }));

          setAreaProgress(transformedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("No se pudieron cargar los datos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    }

    fetchIcfesScores();
  }, []);

  const getLevelByScore = (score) => {
    if (score < 60) return 'Principiante';
    if (score >= 60 && score <= 75) return 'Intermedio';
    return 'Avanzado';
  };

  const getWeakPoints = (area) => {
    switch (area) {
      case 'Matemáticas': return ['Geometría', 'Estadística'];
      case 'Lectura Crítica': return ['Comprensión', 'Análisis'];
      case 'Sociales': return ['Historia contemporánea'];
      case 'Ciencias Naturales': return ['Química', 'Física', 'Biología'];
      case 'Inglés': return ['Vocabulario técnico'];
      default: return [];
    }
  };

  const getNextSession = (area) => {
    switch (area) {
      case 'Matemáticas': return 'Álgebra básica';
      case 'Lectura Crítica': return 'Técnicas de lectura';
      case 'Sociales': return 'Geografía económica';
      case 'Ciencias Naturales': return 'Conceptos básicos';
      case 'Inglés': return 'Reading comprehension';
      default: return '';
    }
  };

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
          onPress={() => {
            if (area.area === 'Lectura Crítica') {
              navigation.navigate('LecturaCriticaModulo');
            } else {
              // Puedes agregar aquí la lógica para otros módulos
              console.log(`Entrenar: ${area.area}`);
            }
          }}
        >
          Entrenar Ahora
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Entrenador Adaptativo</Text>
          <Text style={styles.subtitle}>Mejora tus debilidades con IA</Text>
        </View>

        <Card style={styles.goalsCard}>
          <Card.Content>
            <Text style={styles.goalsTitle}>🎯 Metas del Día</Text>
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

        <View style={styles.areasSection}>
          <Text style={styles.sectionTitle}>Progreso por Área</Text>
          {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!loading && !error && areaProgress.length > 0 ? (
            areaProgress.map(renderAreaCard)
          ) : (
            <Text style={styles.noDataText}>No hay datos de progreso disponibles.</Text>
          )}
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 Logros</Text>
          <View style={styles.achievementsGrid}>
            <View style={[styles.achievementItem, { opacity: 1 }]}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementTitle}>Primera semana</Text>
            </View>
            <View style={[styles.achievementItem, { opacity: 1 }]}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={styles.achievementTitle}>Racha de 7 días</Text>
            </View>
            <View style={[styles.achievementItem, { opacity: 0.5 }]}>
              <Text style={styles.achievementIcon}>🧮</Text>
              <Text style={styles.achievementTitle}>Maestro en matemáticas</Text>
            </View>
            <View style={[styles.achievementItem, { opacity: 0.5 }]}>
              <Text style={styles.achievementIcon}>📚</Text>
              <Text style={styles.achievementTitle}>Lector experto</Text>
            </View>
          </View>
        </View>

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
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
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
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.error,
  }
});