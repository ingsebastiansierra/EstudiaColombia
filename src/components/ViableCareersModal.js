import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { Card } from 'react-native-paper';

const ViableCareersModal = ({ visible, onClose, viableCareers }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCareers, setFilteredCareers] = useState([]);

  useEffect(() => {
    if (visible) {
      setSearchText('');
      setFilteredCareers(viableCareers);
    }
  }, [visible, viableCareers]);

  useEffect(() => {
    if (searchText === '') {
      setFilteredCareers(viableCareers);
    } else {
      const filtered = viableCareers.filter(career =>
        career.name.toLowerCase().includes(searchText.toLowerCase()) ||
        career.campus.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCareers(filtered);
    }
  }, [searchText, viableCareers]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.careerName}>{item.name}</Text>
        <Text style={styles.careerDetails}>Sede: {item.campus} ({item.jornada})</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tu puntaje ponderado:</Text>
          <Text style={styles.infoValue}>{item.finalScore} pts</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rango de corte:</Text>
          <Text style={styles.infoValue}>{item.cutoffRange} pts</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Carreras Viables</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar carrera o sede..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />

          <FlatList
            data={filteredCareers}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No se encontraron carreras viables.</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchInput: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: COLORS.text,
  },
  listContent: {
    flexGrow: 1,
    width: '100%',
  },
  card: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: COLORS.surface,
  },
  careerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  careerDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ViableCareersModal;