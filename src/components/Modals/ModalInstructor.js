import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS } from '../../constants';

const ModalInstructor = ({ isVisible, onClose, title, instructions }) => {
  useEffect(() => {
    if (isVisible) {
      console.log('📌 Modal recibió instrucciones:', instructions);
    }
  }, [isVisible, instructions]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✖️</Text>
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.modalTitle}>{title}</Text>

          {/* Contenido scrollable */}
          <ScrollView
            style={styles.scrollViewStyle}
            contentContainerStyle={styles.instructionsContainer}
            showsVerticalScrollIndicator={true}
          >
            {instructions && instructions.length > 0 ? (
              instructions.map((item, index) => (
                <View key={index} style={styles.instructionItem}>
                  <Text style={styles.instructionIcon}>{item.icon}</Text>
                  <View style={styles.instructionTextContainer}>
                    <Text style={styles.instructionTitle}>{item.title}</Text>
                    <Text style={styles.instructionBody}>{item.body}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noInstructionsText}>No se encontraron instrucciones.</Text>
            )}
          </ScrollView>

          {/* Botón comenzar */}
          <Button
            mode="contained"
            onPress={onClose}
            style={styles.startButton}
            labelStyle={styles.startButtonLabel}
          >
            Comenzar Prueba
          </Button>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollViewStyle: {
    width: '100%',
    maxHeight: 300, // 👈 ahora no ocupa todo el alto, solo hasta 300px
    marginBottom: 20,
  },
  instructionsContainer: {
    paddingBottom: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  instructionIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  instructionBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 20,
  },
  noInstructionsText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  startButton: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: COLORS.success,
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ModalInstructor;
