import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SCREEN_NAMES } from '../constants';

export default function UniversitiesScreen({ navigation }) {
  const universities = [
    {
      id: 'uptc',
      name: 'UPTC',
      fullName: 'Universidad Pedagógica y Tecnológica de Colombia',
      description: 'Simulador de ponderado para la UPTC',
      icon: 'calculator',
      isSimulator: true,
      color: COLORS.primary,
    },
    {
      id: 'unal',
      name: 'UNAL',
      fullName: 'Universidad Nacional de Colombia',
      description: 'Información de admisión',
      icon: 'school',
      color: COLORS.primary,
    },
    {
      id: 'udea',
      name: 'UdeA',
      fullName: 'Universidad de Antioquia',
      description: 'Información de admisión',
      icon: 'school',
      color: COLORS.primary,
    },
    // Puedes agregar más universidades aquí
  ];

  const navigateToUniversity = (university) => {
    if (university.isSimulator) {
      navigation.navigate(SCREEN_NAMES.UPTC_PONDERADO);
    } else {
      // For now, navigate to a generic screen or show an alert
      Alert.alert(
        'Información de la Universidad',
        `${university.fullName}\n\n${university.description}`,
        [{ text: 'Entendido' }]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: COLORS.primary }]}>
            Universidades
          </Text>
          <Text style={[styles.subtitle, { color: COLORS.text }]}>
            Selecciona una universidad para ver más información
          </Text>
        </View>

        <View style={styles.universitiesContainer}>
          {universities.map((university) => (
            <TouchableOpacity
              key={university.id}
              style={[
                styles.universityCard,
                { backgroundColor: COLORS.surface, borderColor: COLORS.primary }
              ]}
              onPress={() => navigateToUniversity(university)}
            >
              <View style={styles.universityHeader}>
                <Ionicons 
                  name={university.icon} 
                  size={24} 
                  color={university.color || COLORS.primary} 
                  style={styles.universityIcon}
                />
                <View style={styles.universityInfo}>
                  <Text style={[styles.universityName, { color: COLORS.text }]}>
                    {university.name}
                  </Text>
                  <Text 
                    style={[styles.universityFullName, { color: COLORS.textSecondary }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {university.fullName}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={COLORS.primary} 
                  style={{ opacity: 0.5 }}
                />
              </View>
              <Text style={[styles.universityDescription, { color: COLORS.textSecondary }]}>
                {university.description}
              </Text>
              {university.isSimulator && (
                <View style={[styles.simulatorBadge, { backgroundColor: `${university.color}20` }]}>
                  <Text style={[styles.simulatorText, { color: university.color }]}>
                    Simulador Disponible
                  </Text>
                </View>
              )}
              <View style={styles.universityFooter}>
                <Text style={[styles.universityAction, { color: COLORS.primary }]}>
                  {university.isSimulator ? 'Abrir simulador' : 'Ver más'}
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={COLORS.primary} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  universitiesContainer: {
    marginTop: 10,
  },
  universityCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  universityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  universityIcon: {
    marginRight: 12,
  },
  universityInfo: {
    flex: 1,
    marginRight: 10,
  },
  universityName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  universityFullName: {
    fontSize: 14,
    marginBottom: 8,
  },
  universityDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  universityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  universityAction: {
    fontWeight: '600',
  },
  simulatorBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  simulatorText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
