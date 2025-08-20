import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, useTheme, HelperText } from 'react-native-paper';
import { COLORS } from '../constants';

const ICFES_AREAS = [
  { key: 'lectura_critica', label: 'Lectura Crítica' },
  { key: 'matematicas', label: 'Matemáticas' },
  { key: 'sociales_ciudadanas', label: 'Sociales y Ciudadanas' },
  { key: 'ciencias_naturales', label: 'Ciencias Naturales' },
  { key: 'ingles', label: 'Inglés' },
];

const ICFESScoreForm = ({ visible, onClose, initialScores = {}, onSubmit }) => {
  const theme = useTheme();
  const [scores, setScores] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar el estado con los puntajes iniciales
  useEffect(() => {
    if (visible) {
      setScores({
        lectura_critica: initialScores.lectura_critica?.toString() || '',
        matematicas: initialScores.matematicas?.toString() || '',
        sociales_ciudadanas: initialScores.sociales_ciudadanas?.toString() || '',
        ciencias_naturales: initialScores.ciencias_naturales?.toString() || '',
        ingles: initialScores.ingles?.toString() || '',
      });
      setErrors({});
    }
  }, [visible, initialScores]);

  const handleScoreChange = (key, value) => {
    // Solo permitir números y borrar
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      
      // Validar que el valor esté entre 0 y 100
      if (value === '' || (numValue >= 0 && numValue <= 100)) {
        setScores(prev => ({
          ...prev,
          [key]: value
        }));
        
        // Limpiar el error si existe
        if (errors[key]) {
          setErrors(prev => ({
            ...prev,
            [key]: null
          }));
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ICFES_AREAS.forEach(({ key }) => {
      if (scores[key] === '') {
        newErrors[key] = 'Este campo es requerido';
        isValid = false;
      } else {
        const numValue = parseInt(scores[key], 10);
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          newErrors[key] = 'Debe ser un número entre 0 y 100';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Convertir los valores a números
      const scoresToSubmit = {};
      Object.keys(scores).forEach(key => {
        scoresToSubmit[key] = parseInt(scores[key], 10);
      });
      
      const success = await onSubmit(scoresToSubmit);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar los puntajes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return Object.values(scores).reduce((sum, value) => {
      return sum + (parseInt(value, 10) || 0);
    }, 0);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={[styles.modalContent, { 
          backgroundColor: theme.colors.surface,
          width: '90%',
          maxHeight: '90%',
          borderRadius: 8,
          padding: 20,
        }]}>
          <Text style={[{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.colors.text
          }]}>
            Tus Puntajes ICFES
          </Text>
          
          <ScrollView style={{ width: '100%' }}>
            {ICFES_AREAS.map((area) => (
              <View key={area.key} style={{ marginBottom: 15, width: '100%' }}>
                <TextInput
                  label={area.label}
                  value={scores[area.key] || ''}
                  onChangeText={(text) => handleScoreChange(area.key, text)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={{ width: '100%' }}
                  right={
                    <TextInput.Affix text="/100" />
                  }
                  error={!!errors[area.key]}
                />
                {errors[area.key] && (
                  <HelperText type="error" visible={!!errors[area.key]}>
                    {errors[area.key]}
                  </HelperText>
                )}
              </View>
            ))}

            <View style={styles.buttonsContainer}>
              <Button
                mode="outlined"
                onPress={onClose}
                style={{ marginRight: 10 }}
                labelStyle={{ color: theme.colors.primary }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ backgroundColor: theme.colors.primary }}
                labelStyle={{ color: theme.colors.onPrimary }}
              >
                Guardar
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderRadius: 8,
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export default ICFESScoreForm;
