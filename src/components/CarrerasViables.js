import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import { COLORS } from '../constants';

// Reemplaza estos valores con tu URL y tu clave pública de Supabase
const supabaseUrl = 'https://mxywbszjymzegermyhej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eXdic3pqeW16ZWdlcm15aGVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzYzMTM5NiwiZXhwIjoyMDY5MjA3Mzk2fQ.AVOBrJr5S4wSEhERyHjTOoRPtF-RjurBNlMs5KrAnGc';
const supabase = createClient(supabaseUrl, supabaseKey);

const CarrerasViables = ({ userScores }) => {
  const [loading, setLoading] = useState(false);
  const [cutoffScores, setCutoffScores] = useState([]);
  const [ponderations, setPonderations] = useState([]);
  const [showViableCareersModal, setShowViableCareersModal] = useState(false);
  const [viableCareers, setViableCareers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCareers, setFilteredCareers] = useState([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [{ data: ponderationData }, { data: cutoffData }] = await Promise.all([
          supabase.from('ponderados_2025_1').select('*'),
          supabase.from('puntajes_corte').select('*')
        ]);
        setPonderations(ponderationData);
        setCutoffScores(cutoffData);
      } catch (error) {
        console.error('Error cargando datos:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos de las carreras.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Función para filtrar las carreras según la búsqueda
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCareers(viableCareers);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = viableCareers.filter(career =>
        career.name.toLowerCase().includes(lowerCaseQuery) ||
        career.campus.toLowerCase().includes(lowerCaseQuery) ||
        career.jornada.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCareers(filtered);
    }
  }, [searchQuery, viableCareers]);

  // Función para verificar la admisión
  const handleUPTCAdmissionCheck = () => {
    if (!userScores) {
      Alert.alert('Puntajes no encontrados', 'Por favor, registra tus puntajes ICFES para realizar esta simulación.');
      return;
    }

    const viable = [];
    const scoreMap = {
      lectura_critica: 'LECTURA CRITICA',
      ciencias_naturales: 'CIENCIAS NATURALES',
      sociales_ciudadanas: 'SOCIALES Y CIDADANAS',
      matematicas: 'MATEMATICAS',
      ingles: 'INGLES',
    };

    cutoffScores.forEach(dbCareer => {
      const ponderationData = ponderations.find(p => p.CODIGO === dbCareer.CODIGO);

      if (ponderationData) {
        let total = 0;
        let isValid = true;
        for (const [userKey, dbKey] of Object.entries(scoreMap)) {
          const userScore = parseFloat(userScores[userKey]);
          const ponderation = parseFloat(ponderationData[dbKey]);
          if (isNaN(userScore) || isNaN(ponderation)) {
            isValid = false;
            break;
          }
          total += (userScore * (ponderation / 100));
        }

        if (isValid) {
          const finalScore = Math.round(total * 100) / 100;
          const cutoffScoreUltimo = parseFloat(dbCareer.ULTIMO.replace(',', '.'));
          const cutoffScorePrimero = parseFloat(dbCareer.PRIMERO.replace(',', '.'));
          if (!isNaN(cutoffScoreUltimo) && finalScore >= cutoffScoreUltimo) {
            viable.push({
              name: dbCareer.PROGRAMA,
              campus: dbCareer.SEDE,
              jornada: dbCareer.JORNADA,
              finalScore,
              cutoffRange: `${cutoffScoreUltimo.toFixed(2)} - ${cutoffScorePrimero.toFixed(2)}`,
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

  const renderCareerItem = ({ item }) => (
    <Card style={styles.careerCard}>
      <Card.Content>
        <Text style={styles.careerTitle}>{item.name}</Text>
        <Text style={styles.careerDetails}>
          <Text style={styles.boldText}>Sede:</Text> {item.campus} | <Text style={styles.boldText}>Jornada:</Text> {item.jornada}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.careerScore}>Tu puntaje: {item.finalScore.toFixed(2)}</Text>
          <Text style={styles.careerCutoff}>Puntaje de corte: {item.cutoffRange}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: userScores ? COLORS.primary : COLORS.gray }]}
        onPress={handleUPTCAdmissionCheck}
        disabled={loading || !userScores}
      >
        <View style={styles.actionIcon}>
          <MaterialIcons name="check-circle" size={24} color="white" />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>Carreras Viables UPTC</Text>
          <Text style={styles.actionSubtitle}>Verifica tu admisión en UPTC</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showViableCareersModal}
        onRequestClose={() => {
          setShowViableCareersModal(false);
          setSearchQuery('');
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🎉 Carreras Viables UPTC</Text>
            <TouchableOpacity onPress={() => {
              setShowViableCareersModal(false);
              setSearchQuery('');
            }}>
              <MaterialIcons name="close" size={38} color={COLORS.text} style={{ marginLeft: -26 }}/>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por carrera, sede o jornada..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <>
              <Text style={styles.modalSubtitle}>
                Con tus puntajes, serías admitido en **{filteredCareers.length}** carreras.
              </Text>
              <FlatList
                data={filteredCareers}
                keyExtractor={(item, index) => `${item.name}-${item.campus}-${index}`}
                renderItem={renderCareerItem}
                style={styles.careerList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 4, // Sombra más pronunciada
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#34495E',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  searchBar: {
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  careerList: {
    flex: 1,
  },
  careerCard: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  careerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  careerDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  careerScore: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
  },
  careerCutoff: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default CarrerasViables;