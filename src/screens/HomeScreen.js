import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '../store/authStore';
import { COLORS, SCREEN_NAMES } from '../constants';
import ICFESScoreForm from '../components/ICFESScoreForm';
import ICFESScoresService from '../services/icfesService';
import ViableCareersModal from '../components/ViableCareersModal';

// Reemplaza estos valores con tu URL y tu clave pública de Supabase
const supabaseUrl = 'https://mxywbszjymzegermyhej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eXdic3pqeW16ZWdlcm15aGVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzYzMTM5NiwiZXhwIjoyMDY5MjA3Mzk2fQ.AVOBrJr5S4wSEhERyHjTOoRPtF-RjurBNlMs5KrAnGc';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [userScores, setUserScores] = useState(null);
  const [cutoffScores, setCutoffScores] = useState([]);
  const [ponderations, setPonderations] = useState([]);
  const [showViableCareersModal, setShowViableCareersModal] = useState(false);
  const [viableCareers, setViableCareers] = useState([]);

  // Cargar puntajes de usuario, ponderaciones y puntajes de corte al iniciar
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        try {
          // Cargar puntajes del usuario
          const scores = await ICFESScoresService.getUserScores(user.id);
          setUserScores(scores);

          // Cargar ponderaciones desde Supabase
          const { data: ponderationData, error: ponderationError } = await supabase
            .from('ponderados_2025_1')
            .select('*');

          if (ponderationError) {
            console.error('Error cargando ponderaciones:', ponderationError.message);
          } else {
            console.log('Datos de ponderaciones cargados:', ponderationData);
            setPonderations(ponderationData);
          }

          // Cargar puntajes de corte desde Supabase
          const { data: cutoffData, error: cutoffError } = await supabase
            .from('puntajes_corte')
            .select('*');

          if (cutoffError) {
            console.error('Error cargando puntajes de corte:', cutoffError.message);
          } else {
            console.log('Datos de puntajes de corte cargados:', cutoffData);
            setCutoffScores(cutoffData);
          }

        } catch (error) {
          console.error('Error cargando datos:', error);
        }
      }
    };
    loadData();
  }, [user]);

  // Manejar guardado de puntajes
  const handleSaveScores = async (scores) => {
    if (!user?.id) return false;
    
    try {
      const updatedScores = await ICFESScoresService.saveScores(user.id, scores);
      setUserScores(updatedScores);
      return true;
    } catch (error) {
      console.error('Error guardando puntajes ICFES:', error);
      return false;
    }
  };
  
  const handleUPTCAdmissionCheck = () => {
    if (!userScores) {
      Alert.alert('Puntajes no encontrados', 'Por favor, registra tus puntajes ICFES para realizar esta simulación.');
      return;
    }
  
    const viable = [];
  
    const scoreMap = {
      lecturaCritica: 'LECTURA CRITICA',
      cienciasNaturales: 'CIENCIAS NATURALES',
      sociales: 'SOCIALES Y CIDADANAS',
      matematicas: 'MATEMATICAS',
      ingles: 'INGLES',
    };
  
    cutoffScores.forEach(dbCareer => {
      // Usamos el campo CODIGO para encontrar la ponderación correspondiente
      const ponderationData = ponderations.find(
        p => p.CODIGO === dbCareer.CODIGO
      );
  
      if (ponderationData) {
        let total = 0;
        let isValid = true;
  
        for (const [userKey, dbKey] of Object.entries(scoreMap)) {
          const score = parseFloat(userScores[userKey]);
          const ponderation = parseFloat(ponderationData[dbKey]);
  
          if (isNaN(score) || isNaN(ponderation)) {
            console.warn(`Puntaje o ponderación no válida para ${userKey} en el programa con código ${dbCareer.CODIGO}. Se saltará la verificación de esta carrera.`);
            isValid = false;
            break;
          }
          total += (score * (ponderation / 100));
        }
  
        if (isValid) {
          const finalScore = Math.round(total * 100) / 100;
          const cutoffScoreUltimo = parseFloat(dbCareer.ULTIMO.replace(',', '.'));
          const cutoffScorePrimero = parseFloat(dbCareer.PRIMERO.replace(',', '.'));
  
          if (finalScore >= cutoffScoreUltimo) {
            viable.push({
              name: dbCareer.PROGRAMA,
              campus: dbCareer.SEDE,
              jornada: dbCareer.JORNADA,
              finalScore,
              cutoffRange: `${cutoffScoreUltimo} - ${cutoffScorePrimero}`,
            });
          }
        }
      }
    });
  
    if (viable.length > 0) {
      setViableCareers(viable);
      setShowViableCareersModal(true);
    } else {
      Alert.alert('No se encontraron carreras viables', 'No hay carreras en las que seas admitido con tus puntajes actuales.');
    }
  };

  const quickActions = [
    {
      title: 'Resultados ICFES',
      subtitle: 'Actualiza tus puntajes',
      icon: 'school',
      onPress: () => setShowScoreForm(true),
      color: COLORS.primary,
    },
    {
      title: 'Buscar Universidades',
      subtitle: 'Encuentra tu universidad ideal',
      icon: 'search',
      screen: SCREEN_NAMES.UNIVERSITIES,
      onPress: () => navigation.navigate(SCREEN_NAMES.UNIVERSITIES),
      color: COLORS.secondary,
    },
    // ... otras acciones
    {
      title: 'Carreras Activas Viables',
      subtitle: 'Verifica tu admisión en UPTC',
      icon: 'check-circle',
      onPress: userScores ? handleUPTCAdmissionCheck : () => Alert.alert('Puntajes no encontrados', 'Por favor, registra tus puntajes ICFES para realizar esta simulación.'),
      color: userScores ? COLORS.secondary : COLORS.textSecondary,
    },
    {
      title: 'Simulador ICFES',
      subtitle: 'Practica para tu examen',
      icon: 'assessment',
      screen: SCREEN_NAMES.SIMULATOR,
      onPress: () => navigation.navigate(SCREEN_NAMES.SIMULATOR),
      color: COLORS.accent
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
              size={45} 
              label={user?.name?.charAt(0) || 'U'} 
              style={{ backgroundColor: COLORS.primary, marginLeft: -30 }}
              labelStyle={{ fontSize: 25, fontWeight: 'bold' }}
            />
          </TouchableOpacity>
        </View>

        {/* Tarjeta de Puntajes ICFES */}
        <Card style={[styles.progressCard, { backgroundColor: COLORS.primary }]}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Tus Puntajes ICFES</Text>
              <TouchableOpacity onPress={() => setShowScoreForm(true)}>
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            {userScores ? (
              <View style={styles.scoresContainer}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreValue}>
                    {Object.values(userScores).reduce((a, b) => a + (parseInt(b) || 0), 0)}
                  </Text>
                  <Text style={styles.scoreLabel}>Puntos Totales</Text>
                </View>
                <View style={styles.scoresGrid}>
                  {Object.entries(userScores).map(([key, value]) => (
                    <View key={key} style={styles.scoreBadge}>
                      <Text style={styles.scoreBadgeValue}>{value || '--'}</Text>
                      <Text style={styles.scoreBadgeLabel}>
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').substring(0, 3)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.noScoresContainer}>
                <Text style={styles.noScoresText}>No has registrado tus puntajes ICFES</Text>
                <Button 
                  mode="contained" 
                  onPress={() => setShowScoreForm(true)}
                  style={styles.addScoresButton}
                  labelStyle={{ color: COLORS.primary }}
                >
                  Agregar Puntajes
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: `${action.color}20` }]}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <MaterialIcons name={action.icon} size={24} color="white" />
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Actividad Reciente */}
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

        {/* Llamado a la acción */}
        <Card style={styles.ctaCard}>
          <Card.Content>
            <Text style={styles.ctaTitle}>¡Impulsa tu futuro!</Text>
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

      {/* Formularios y Modales */}
      <ICFESScoreForm
        visible={showScoreForm}
        onClose={() => setShowScoreForm(false)}
        initialScores={userScores || {}}
        onSubmit={handleSaveScores}
      />
      <ViableCareersModal
        visible={showViableCareersModal}
        onClose={() => setShowViableCareersModal(false)}
        viableCareers={viableCareers}
      />
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
    paddingVertical: 16,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  scoresContainer: {
    alignItems: 'center',
  },
  scoreItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white'
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  scoreBadge: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreBadgeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  scoreBadgeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  noScoresContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noScoresText: {
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  addScoresButton: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    elevation: 2
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary
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
    marginHorizontal: 16,
    marginBottom: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    elevation: 2,
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
    paddingVertical: 4
  }
});