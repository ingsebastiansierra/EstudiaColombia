import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Definir colores y otros constantes
const COLORS = {
  primary: '#E61876', 
  secondary: '#880E4F',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
  placeholder: '#999999',
};

// Datos completos de las carreras con sede, jornada y ponderaciones
const CAREERS = [
  // SEDE: TUNJA
  { name: 'Ingeniería Agronómica', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.5, sociales: 0.05, matematicas: 0.2, ingles: 0.05 }, icon: 'leaf-outline' },
  { name: 'Medicina Veterinaria y Zootecnia', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.55, sociales: 0.08, matematicas: 0.12, ingles: 0.05 }, icon: 'paw-outline' },
  { name: 'Biología', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.15, cienciasNaturales: 0.45, sociales: 0.1, matematicas: 0.15, ingles: 0.15 }, icon: 'leaf-outline' },
  { name: 'Física', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.09, cienciasNaturales: 0.3, sociales: 0.11, matematicas: 0.27, ingles: 0.23 }, icon: 'nuclear-outline' },
  { name: 'Matemáticas', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.2, sociales: 0.05, matematicas: 0.45, ingles: 0.1 }, icon: 'calculator-outline' },
  { name: 'Química', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.1, cienciasNaturales: 0.55, sociales: 0.05, matematicas: 0.15, ingles: 0.15 }, icon: 'flask-outline' },
  { name: 'Artes Plásticas, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.15, sociales: 0.4, matematicas: 0.05, ingles: 0.05 }, icon: 'brush-outline' },
  { name: 'Ciencias Naturales y Educación Ambiental, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.15, cienciasNaturales: 0.4, sociales: 0.15, matematicas: 0.15, ingles: 0.15 }, icon: 'earth-outline' },
  { name: 'Ciencias Sociales, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.15, sociales: 0.5, matematicas: 0.1, ingles: 0.0 }, icon: 'people-outline' },
  { name: 'Educación Física, Recreación y Deportes, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.25, sociales: 0.2, matematicas: 0.15, ingles: 0.15 }, icon: 'walk-outline' },
  { name: 'Educación Infantil, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.52, cienciasNaturales: 0.15, sociales: 0.18, matematicas: 0.1, ingles: 0.05 }, icon: 'happy-outline' },
  { name: 'Filosofía, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.15, sociales: 0.25, matematicas: 0.15, ingles: 0.1 }, icon: 'book-outline' },
  { name: 'Idiomas Modernos, Español-Inglés, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.15, sociales: 0.18, matematicas: 0.11, ingles: 0.26 }, icon: 'language-outline' },
  { name: 'Lic en Informática', campus: 'Tunja', jornada: 'Especial', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.2, sociales: 0.1, matematicas: 0.3, ingles: 0.1 }, icon: 'laptop-outline' },
  { name: 'Lic en Lenguas Modernas con énfasis en Ingles', campus: 'Tunja', jornada: 'Especial', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.0, sociales: 0.2, matematicas: 0.05, ingles: 0.4 }, icon: 'language-outline' },
  { name: 'Lic en Literatura y Lengua Castellana', campus: 'Tunja', jornada: 'Especial', weights: { lecturaCritica: 0.4, cienciasNaturales: 0.12, sociales: 0.2, matematicas: 0.12, ingles: 0.16 }, icon: 'pencil-outline' },
  { name: 'Lenguas Extranjeras, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.15, sociales: 0.18, matematicas: 0.11, ingles: 0.26 }, icon: 'language-outline' },
  { name: 'Matemáticas, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.15, cienciasNaturales: 0.2, sociales: 0.15, matematicas: 0.45, ingles: 0.05 }, icon: 'calculator-outline' },
  { name: 'Matemáticas, Lic.', campus: 'Tunja', jornada: 'Nocturna', weights: { lecturaCritica: 0.15, cienciasNaturales: 0.2, sociales: 0.15, matematicas: 0.45, ingles: 0.05 }, icon: 'calculator-outline' },
  { name: 'Música, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.45, cienciasNaturales: 0.05, sociales: 0.25, matematicas: 0.05, ingles: 0.2 }, icon: 'musical-notes-outline' },
  { name: 'Psicopedagogía énfasis Asesoría Educación, Lic.', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.4, cienciasNaturales: 0.15, sociales: 0.25, matematicas: 0.1, ingles: 0.1 }, icon: 'school-outline' },
  { name: 'Licenciatura en Educación Básica Primaria (FESAD)', campus: 'Tunja', jornada: 'Distancia', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.2, sociales: 0.2, matematicas: 0.2, ingles: 0.15 }, icon: 'book-outline' },
  { name: 'Administración de Empresas', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.0, sociales: 0.2, matematicas: 0.3, ingles: 0.15 }, icon: 'business-outline' },
  { name: 'Administración de Empresas', campus: 'Tunja', jornada: 'Nocturna', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.0, sociales: 0.2, matematicas: 0.3, ingles: 0.15 }, icon: 'business-outline' },
  { name: 'Contaduría Pública', campus: 'Tunja', jornada: 'Nocturna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.05, sociales: 0.3, matematicas: 0.25, ingles: 0.1 }, icon: 'calculator-outline' },
  { name: 'Economía', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.05, sociales: 0.25, matematicas: 0.3, ingles: 0.1 }, icon: 'cash-outline' },
  { name: 'Economía', campus: 'Tunja', jornada: 'Nocturna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.05, sociales: 0.25, matematicas: 0.3, ingles: 0.1 }, icon: 'cash-outline' },
  { name: 'Enfermería', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.23, sociales: 0.23, matematicas: 0.15, ingles: 0.09 }, icon: 'medkit-outline' },
  { name: 'Medicina', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.25, sociales: 0.2, matematicas: 0.15, ingles: 0.1 }, icon: 'pulse-outline' },
  { name: 'Psicología', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.25, sociales: 0.25, matematicas: 0.15, ingles: 0.1 }, icon: 'happy-outline' },
  { name: 'Derecho y Ciencias Sociales', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.4, cienciasNaturales: 0.0, sociales: 0.4, matematicas: 0.1, ingles: 0.1 }, icon: 'scale-outline' },
  { name: 'Ingeniería Metalúrgica', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.3, sociales: 0.1, matematicas: 0.3, ingles: 0.1 }, icon: 'hammer-outline' },
  { name: 'Ingeniería Civil', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.25, sociales: 0.1, matematicas: 0.3, ingles: 0.15 }, icon: 'build-outline' },
  { name: 'Ingeniería de Sistemas y Computación', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.2, sociales: 0.1, matematicas: 0.4, ingles: 0.1 }, icon: 'laptop-outline' },
  { name: 'Ingeniería Electrónica', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.2, sociales: 0.15, matematicas: 0.3, ingles: 0.1 }, icon: 'bulb-outline' },
  { name: 'Ingeniería en Transportes y Vías', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.15, sociales: 0.15, matematicas: 0.35, ingles: 0.1 }, icon: 'car-outline' },
  { name: 'Ingeniería Ambiental', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.3, sociales: 0.1, matematicas: 0.3, ingles: 0.05 }, icon: 'leaf-outline' },
  { name: 'Arquitectura', campus: 'Tunja', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.2, sociales: 0.2, matematicas: 0.25, ingles: 0.1 }, icon: 'home-outline' },

  // SEDE: SOGAMOSO
  { name: 'Administración de Empresas', campus: 'Sogamoso', jornada: 'Nocturna', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.0, sociales: 0.2, matematicas: 0.3, ingles: 0.15 }, icon: 'business-outline' },
  { name: 'Contaduría Pública', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.05, sociales: 0.3, matematicas: 0.25, ingles: 0.1 }, icon: 'calculator-outline' },
  { name: 'Ingeniería de Minas', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.3, sociales: 0.1, matematicas: 0.3, ingles: 0.1 }, icon: 'hammer-outline' },
  { name: 'Ingeniería Electrónica', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.2, sociales: 0.15, matematicas: 0.3, ingles: 0.1 }, icon: 'bulb-outline' },
  { name: 'Ingeniería Geológica', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.25, sociales: 0.15, matematicas: 0.25, ingles: 0.15 }, icon: 'earth-outline' },
  { name: 'Ingeniería de Sistemas y Computación', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.2, cienciasNaturales: 0.2, sociales: 0.1, matematicas: 0.4, ingles: 0.1 }, icon: 'laptop-outline' },
  { name: 'Finanzas y Comercio Internacional', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.05, sociales: 0.3, matematicas: 0.25, ingles: 0.1 }, icon: 'cash-outline' },
  { name: 'Ingeniería Industrial', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.15, cienciasNaturales: 0.35, sociales: 0.07, matematicas: 0.35, ingles: 0.08 }, icon: 'cog-outline' },
  { name: 'Ingeniería de Vías y Transporte', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.15, cienciasNaturales: 0.25, sociales: 0.1, matematicas: 0.4, ingles: 0.1 }, icon: 'car-outline' },
  { name: 'Licenciatura en Educación Básica con Énfasis en Humanidades y Lengua Castellana', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.4, cienciasNaturales: 0.05, sociales: 0.35, matematicas: 0.1, ingles: 0.1 }, icon: 'pencil-outline' },
  { name: 'Licenciatura en Matemáticas', campus: 'Sogamoso', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.1, sociales: 0.15, matematicas: 0.4, ingles: 0.1 }, icon: 'calculator-outline' },

  // SEDE: DUITAMA
  { name: 'Lic. en Tecnología', campus: 'Duitama', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.2, sociales: 0.2, matematicas: 0.25, ingles: 0.1 }, icon: 'construct-outline' },
  { name: 'Administración de Empresas Agropecuarias', campus: 'Duitama', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.15, sociales: 0.25, matematicas: 0.25, ingles: 0.1 }, icon: 'business-outline' },
  { name: 'Administración Industrial', campus: 'Duitama', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.15, sociales: 0.25, matematicas: 0.25, ingles: 0.1 }, icon: 'business-outline' },
  { name: 'Administración Turística y Hotelera', campus: 'Duitama', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.1, sociales: 0.28, matematicas: 0.25, ingles: 0.12 }, icon: 'business-outline' },
  { name: 'Diseño Industrial', campus: 'Duitama', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.23, sociales: 0.21, matematicas: 0.21, ingles: 0.1 }, icon: 'brush-outline' },
  { name: 'Ingeniería Electromecánica', campus: 'Duitama', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.25, sociales: 0.1, matematicas: 0.3, ingles: 0.1 }, icon: 'cog-outline' },
  { name: 'Matemáticas, Lic.', campus: 'Duitama', jornada: 'Nocturna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.1, sociales: 0.15, matematicas: 0.4, ingles: 0.1 }, icon: 'calculator-outline' },
  
  // SEDE: CHIQUINQUIRÁ
  { name: 'Administración de Empresas', campus: 'Chiquinquirá', jornada: 'Nocturna', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.0, sociales: 0.2, matematicas: 0.3, ingles: 0.15 }, icon: 'business-outline' },
  { name: 'Contaduría Pública', campus: 'Chiquinquirá', jornada: 'Nocturna', weights: { lecturaCritica: 0.3, cienciasNaturales: 0.05, sociales: 0.3, matematicas: 0.25, ingles: 0.1 }, icon: 'calculator-outline' },
  { name: 'Educación Física, Recreación y Deportes, Lic.', campus: 'Chiquinquirá', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.25, sociales: 0.2, matematicas: 0.15, ingles: 0.15 }, icon: 'walk-outline' },

  // SEDE: AGUAZUL
  { name: 'Derecho', campus: 'Aguazul', jornada: 'Diurna', weights: { lecturaCritica: 0.4, cienciasNaturales: 0.0, sociales: 0.4, matematicas: 0.1, ingles: 0.1 }, icon: 'scale-outline' },
  { name: 'Lic. Matemáticas', campus: 'Aguazul', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.1, sociales: 0.15, matematicas: 0.4, ingles: 0.1 }, icon: 'calculator-outline' },
  { name: 'Administración de Empresas Turísticas', campus: 'Aguazul', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.1, sociales: 0.28, matematicas: 0.25, ingles: 0.12 }, icon: 'business-outline' },
  { name: 'Lic. En Lenguas Modernas con Énfasis en Ingles', campus: 'Aguazul', jornada: 'Diurna', weights: { lecturaCritica: 0.35, cienciasNaturales: 0.0, sociales: 0.2, matematicas: 0.05, ingles: 0.4 }, icon: 'language-outline' },
  { name: 'Lic. Educación Física, Lúdica y Deportes', campus: 'Aguazul', jornada: 'Diurna', weights: { lecturaCritica: 0.25, cienciasNaturales: 0.25, sociales: 0.2, matematicas: 0.15, ingles: 0.15 }, icon: 'walk-outline' },
];

const CAMPUS = [...new Set(CAREERS.map(c => c.campus))];
const JORNADAS = [...new Set(CAREERS.map(c => c.jornada))];

const UPTCPonderadoScreen = () => {
  const [scores, setScores] = useState({
    matematicas: '',
    cienciasNaturales: '',
    sociales: '',
    lecturaCritica: '',
    ingles: ''
  });

  const [campus, setCampus] = useState('');
  const [jornada, setJornada] = useState('');
  const [results, setResults] = useState(null);

  const calculateScores = () => {
    Keyboard.dismiss();

    if (!campus || !jornada) {
      Alert.alert('Error', 'Por favor selecciona una sede y una jornada.');
      return;
    }

    if (Object.values(scores).some(score => !score || isNaN(parseInt(score)) || parseInt(score) < 0 || parseInt(score) > 100)) {
      Alert.alert('Error', 'Por favor ingresa puntajes válidos (0-100) en todos los campos.');
      return;
    }

    const filteredCareers = CAREERS.filter(career => career.campus === campus && career.jornada === jornada);
    
    if (filteredCareers.length === 0) {
      Alert.alert('Información', `No hay datos de ponderado disponibles para la sede de ${campus} en jornada ${jornada}.`);
      setResults([]);
      return;
    }

    const calculatedResults = filteredCareers.map(career => {
      let total = 0;
      for (const [subject, weight] of Object.entries(career.weights)) {
        total += (parseInt(scores[subject]) * weight);
      }

      return {
        ...career,
        score: Math.round(total * 100) / 100,
      };
    });

    calculatedResults.sort((a, b) => b.score - a.score);
    
    setResults(calculatedResults);
  };

  const handleInputChange = (name, value) => {
    if (value === '' || /^\d{1,3}$/.test(value)) {
      setScores({
        ...scores,
        [name]: value
      });
    }
  };

  const renderResults = () => {
    if (!results) return null;
    if (results.length === 0) return null;

    return (
      <View style={styles.resultsSection}>
        <Text style={[styles.resultsTitle, { color: COLORS.text }]}>
          Ponderados para {campus} ({jornada})
        </Text>
        
        {results.map((career, index) => (
          <View 
            key={career.name + career.campus + career.jornada}
            style={[
              styles.resultCard,
              { borderLeftColor: COLORS.primary },
              index < 3 && styles.topResultCard
            ]}
          >
            <View style={styles.resultHeader}>
              <Ionicons 
                name={career.icon} 
                size={24} 
                color={COLORS.primary} 
                style={styles.resultIcon} 
              />
              <Text style={[styles.careerName, { color: COLORS.text }]}>{career.name}</Text>
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
              Ingresa tus puntajes ICFES, la sede y la jornada para calcular tu ponderado.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: COLORS.text }]}>Sede</Text>
            <View style={[styles.pickerContainer, { borderColor: COLORS.primary }]}>
              <Picker
                selectedValue={campus}
                onValueChange={(itemValue) => {
                  setCampus(itemValue);
                  setResults(null); 
                }}
                style={[styles.picker, { color: COLORS.text }]}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Selecciona una sede" value="" />
                {CAMPUS.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>

            <Text style={[styles.label, { color: COLORS.text }]}>Jornada</Text>
            <View style={[styles.pickerContainer, { borderColor: COLORS.primary }]}>
              <Picker
                selectedValue={jornada}
                onValueChange={(itemValue) => {
                  setJornada(itemValue);
                  setResults(null);
                }}
                style={[styles.picker, { color: COLORS.text }]}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Selecciona una jornada" value="" />
                {JORNADAS.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>

            {Object.entries({
              matematicas: 'Matemáticas',
              cienciasNaturales: 'Ciencias Naturales',
              sociales: 'Sociales y Ciudadanas',
              lecturaCritica: 'Lectura Crítica',
              ingles: 'Inglés'
            }).map(([key, label]) => (
              <View key={key}>
                <Text style={[styles.label, { color: COLORS.text }]}>
                  {label}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: COLORS.primary, 
                    color: COLORS.text 
                  }]}
                  placeholder="0-100"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="numeric"
                  maxLength={3}
                  value={scores[key]}
                  onChangeText={(value) => handleInputChange(key, value)}
                />
              </View>
            ))}

            <TouchableOpacity 
              style={[
                styles.button, 
                { backgroundColor: (campus && jornada) ? COLORS.primary : COLORS.placeholder }
              ]}
              onPress={calculateScores}
              disabled={!campus || !jornada}
            >
              <Text style={styles.buttonText}>Calcular Ponderado</Text>
            </TouchableOpacity>
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
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    height: 55,
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