import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Keyboard, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';

// Asume que esta es la forma en que obtienes el ID de usuario autenticado
// Reemplaza esto con tu método real (ej. useAuthStore)
const MOCK_USER_ID = '82e10789-2a96-4d0d-b1b8-b01545ee0cb7'; 

const supabaseUrl = 'https://mxywbszjymzegermyhej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eXdic3pqeW16ZWdlcm15aGVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzYzMTM5NiwiZXhwIjoyMDY5MjA3Mzk2fQ.AVOBrJr5S4wSEhERyHjTOoRPtF-RjurBNlMs5KrAnGc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Definir colores y otros constantes
const COLORS = {
  primary: '#E61876',
  secondary: '#880E4F',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
  placeholder: '#999999',
};

const UPTCPonderadoScreen = () => {
  const [userScores, setUserScores] = useState(null);
  const [userScoresLoading, setUserScoresLoading] = useState(true);
  const [ponderationsLoading, setPonderationsLoading] = useState(true);
  
  const [careersData, setCareersData] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [jornadas, setJornadas] = useState([]);

  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedJornada, setSelectedJornada] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const { data, error } = await supabase
          .from('user_icfes_scores')
          .select('lectura_critica, matematicas, sociales_ciudadanas, ciencias_naturales, ingles')
          .eq('user_id', MOCK_USER_ID)
          .single();

        if (error && error.message !== 'Puntajes ICFES no encontrados') {
          console.error('Error fetching user scores:', error);
          Alert.alert('Error', 'No se pudieron cargar tus puntajes. Por favor, revisa tu conexión.');
        } else if (data) {
          // Adaptar los nombres de la base de datos a los del código
          setUserScores({
            lecturaCritica: data.lectura_critica,
            matematicas: data.matematicas,
            sociales: data.sociales_ciudadanas,
            cienciasNaturales: data.ciencias_naturales,
            ingles: data.ingles,
          });
        }
      } catch (e) {
        console.error('Error inesperado al cargar puntajes:', e);
      } finally {
        setUserScoresLoading(false);
      }
    };

    const fetchPonderations = async () => {
      try {
        const { data, error } = await supabase
          .from('ponderados_2025_1')
          .select('*');

        if (error) {
          console.error('Error fetching ponderations:', error);
          Alert.alert('Error', 'No se pudieron cargar los datos de ponderación. Por favor, verifica tu conexión.');
        } else {
          setCareersData(data);
          const uniqueCampuses = [...new Set(data.map(c => c.SEDE))].sort();
          const uniqueJornadas = [...new Set(data.map(c => c.JORNADA))].sort();
          setCampuses(uniqueCampuses);
          setJornadas(uniqueJornadas);
        }
      } catch (e) {
        console.error('Error inesperado al cargar ponderaciones:', e);
      } finally {
        setPonderationsLoading(false);
      }
    };

    fetchUserScores();
    fetchPonderations();
  }, []);

  const calculateScores = () => {
    Keyboard.dismiss();

    if (!userScores) {
      Alert.alert('Error', 'No se han encontrado tus puntajes ICFES. Por favor, regístralos.');
      return;
    }

    if (!selectedCampus || !selectedJornada) {
      Alert.alert('Error', 'Por favor selecciona una sede y una jornada.');
      return;
    }

    const filteredCareers = careersData.filter(career => 
      career.SEDE === selectedCampus && career.JORNADA === selectedJornada
    );

    if (filteredCareers.length === 0) {
      Alert.alert('Información', `No hay datos de ponderado disponibles para la sede de ${selectedCampus} en jornada ${selectedJornada}.`);
      setResults([]);
      return;
    }

    const calculatedResults = filteredCareers.map(career => {
      let total = 0;
      const weights = {
        lecturaCritica: parseFloat(career['LECTURA CRITICA']) / 100,
        cienciasNaturales: parseFloat(career['CIENCIAS NATURALES']) / 100,
        sociales: parseFloat(career['SOCIALES Y CIDADANAS']) / 100,
        matematicas: parseFloat(career['MATEMATICAS']) / 100,
        ingles: parseFloat(career['INGLES']) / 100,
      };

      for (const [subject, weight] of Object.entries(weights)) {
        const score = parseInt(userScores[subject]);
        if (!isNaN(score) && !isNaN(weight)) {
          total += (score * weight);
        } else {
          console.warn(`Puntaje o ponderación no válida para ${subject} en el programa con código ${career.CODIGO}. Se saltará la verificación de esta carrera.`);
          total = 0;
          break;
        }
      }

      return {
        ...career,
        weights,
        score: Math.round(total * 100) / 100,
      };
    });

    calculatedResults.sort((a, b) => b.score - a.score);
    
    setResults(calculatedResults);
  };

  const renderResults = () => {
    if (!results) return null;
    if (results.length === 0) return null;

    return (
      <View style={styles.resultsSection}>
        <Text style={[styles.resultsTitle, { color: COLORS.text }]}>
          Ponderados para {selectedCampus} ({selectedJornada})
        </Text>
        
        {results.map((career, index) => (
          <View 
            key={career.CODIGO + career.PROGRAMA + career.SEDE + career.JORNADA}
            style={[
              styles.resultCard,
              { borderLeftColor: COLORS.primary },
              index < 3 && styles.topResultCard
            ]}
          >
            <View style={styles.resultHeader}>
              <Ionicons 
                name="school-outline" 
                size={24} 
                color={COLORS.primary} 
                style={styles.resultIcon} 
              />
              <Text style={[styles.careerName, { color: COLORS.text }]}>{career.PROGRAMA}</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: COLORS.primary }]}>{career.score} pts</Text>
            </View>
            
            <View style={styles.weightsContainer}>
              {Object.entries(career.weights).map(([subject, weight]) => (
                weight > 0 && (
                  <View key={subject} style={[styles.weightBadge, { backgroundColor: COLORS.primary + '1A' }]}>
                    <Text style={[styles.weightText, { color: COLORS.primary }]}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1).replace(/([A-Z])/g, ' $1')}: {Math.round(weight * 100)}%
                    </Text>
                  </View>
                )
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const loading = userScoresLoading || ponderationsLoading;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.text }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: COLORS.primary }]}>Simulador Ponderado UPTC</Text>
            <Text style={[styles.subtitle, { color: COLORS.text }]}>
              {userScores ? 'Tus puntajes ICFES (no editables)' : 'Ingresa tus puntajes ICFES para realizar la simulación.'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {!userScores ? (
              <View style={styles.noScoresWarning}>
                <Ionicons name="alert-circle-outline" size={24} color={COLORS.secondary} />
                <Text style={styles.noScoresText}>
                  No se encontraron tus puntajes ICFES. Por favor, regístralos en la pantalla de inicio.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.label, { color: COLORS.text }]}>Sede</Text>
                <View style={[styles.pickerContainer, { borderColor: COLORS.primary }]}>
                  <Picker
                    selectedValue={selectedCampus}
                    onValueChange={(itemValue) => {
                      setSelectedCampus(itemValue);
                      setResults(null); 
                    }}
                    style={[styles.picker, { color: COLORS.text }]}
                    dropdownIconColor={COLORS.primary}
                  >
                    <Picker.Item label="Selecciona una sede" value="" />
                    {campuses.map((item, index) => (
                      <Picker.Item key={index} label={item} value={item} />
                    ))}
                  </Picker>
                </View>

                <Text style={[styles.label, { color: COLORS.text }]}>Jornada</Text>
                <View style={[styles.pickerContainer, { borderColor: COLORS.primary }]}>
                  <Picker
                    selectedValue={selectedJornada}
                    onValueChange={(itemValue) => {
                      setSelectedJornada(itemValue);
                      setResults(null);
                    }}
                    style={[styles.picker, { color: COLORS.text }]}
                    dropdownIconColor={COLORS.primary}
                  >
                    <Picker.Item label="Selecciona una jornada" value="" />
                    {jornadas.map((item, index) => (
                      <Picker.Item key={index} label={item} value={item} />
                    ))}
                  </Picker>
                </View>

                {Object.entries({
                    lecturaCritica: 'Lectura Crítica',
                    matematicas: 'Matemáticas',
                    sociales: 'Sociales y Ciudadanas',
                    cienciasNaturales: 'Ciencias Naturales',
                    ingles: 'Inglés'
                  }).map(([key, label]) => (
                    <View key={key}>
                      <Text style={[styles.label, { color: COLORS.text }]}>
                        {label}
                      </Text>
                      <TextInput
                        style={[styles.input, { 
                          borderColor: COLORS.primary, 
                          color: COLORS.text,
                          backgroundColor: '#E0E0E0' // Color para indicar que no es editable
                        }]}
                        value={userScores[key] ? userScores[key].toString() : ''}
                        editable={false}
                      />
                    </View>
                  ))
                }
                
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    { backgroundColor: (selectedCampus && selectedJornada) ? COLORS.primary : COLORS.placeholder }
                  ]}
                  onPress={calculateScores}
                  disabled={!selectedCampus || !selectedJornada}
                >
                  <Text style={styles.buttonText}>Calcular Ponderado</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {renderResults()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  noScoresWarning: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    flexDirection: 'row',
  },
  noScoresText: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#E0E0E0',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    height: 55,
    borderColor: '#E0E0E0',
  },
  picker: {
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsSection: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  topResultCard: {
    backgroundColor: '#FFFBEA',
    borderLeftColor: COLORS.secondary,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultIcon: {
    marginRight: 10,
  },
  careerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  weightBadge: {
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  weightText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default UPTCPonderadoScreen; 