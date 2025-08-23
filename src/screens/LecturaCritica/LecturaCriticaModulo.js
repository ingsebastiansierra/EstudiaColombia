import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from 'react-native-paper';
import { supabase } from '../../DataBase/supabaseClient';
import { SCREEN_NAMES, ICFES_AREAS, COLORS } from '../../constants';

export default function LecturaCriticaModulo({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // ======================
  // Cargar preguntas
  // ======================
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          difficulty,
          passages(id, type, content, difficulty),
          options(
            id,
            text,
            is_correct,
            deep_analysis(
              id,
              explanation,
              is_correct_explanation
            )
          )
        `)
        .eq('competency_id', 1);

      if (error) {
        console.error('Error fetching questions:', error);
        setError('No se pudieron cargar las preguntas. Intenta de nuevo.');
      } else {
        setQuestions(data);
        setQuestionStartTime(Date.now()); // reset timer
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ======================
  // Guardar respuesta
  // ======================
  const saveUserResponse = async (questionId, optionId, isCorrect) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error obteniendo usuario:", userError);
        return;
      }

      const user = userData?.user;
      if (!user) {
        console.warn("Usuario no autenticado, no se guarda respuesta.");
        return;
      }

      const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

      const { error } = await supabase.from('user_responses').insert([
        {
          user_id: user.id, // 👈 este debe ser UUID válido
          question_id: questionId,
          selected_option_id: optionId,
          time_taken_seconds: timeTaken,
        }
      ]);

      if (error) {
        console.error("Error guardando respuesta:", error);
      } else {
        console.log("✅ Respuesta guardada en user_responses");
      }
    } catch (err) {
      console.error("Error inesperado al guardar:", err);
    }
  };

  // ======================
  // Pasar a la siguiente
  // ======================
  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selected = currentQuestion.options.find(opt => opt.id === selectedOption);

    if (!selected) return;

    await saveUserResponse(currentQuestion.id, selectedOption, selected.is_correct);

    if (selected.is_correct) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setQuestionStartTime(Date.now());
    } else {
      Alert.alert(
        "¡Simulacro finalizado!",
        `Tu puntaje: ${score + (selected.is_correct ? 1 : 0)} / ${questions.length}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

  // ======================
  // Render
  // ======================
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchQuestions} style={{ marginTop: 20 }}>
          Reintentar
        </Button>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>No hay preguntas disponibles para esta área.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const passage = currentQuestion.passages;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.questionCounter}>
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </Text>
          <Text style={styles.areaTitle}>Lectura Crítica</Text>
        </View>

        {/* Pasaje */}
        {passage && (
          <Card style={styles.passageCard}>
            <Card.Content>
              <Text style={styles.passageTitle}>Lectura:</Text>
              <Text style={styles.passageText}>{passage.content}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Pregunta */}
        <Card style={styles.questionCard}>
          <Card.Content>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </Card.Content>
        </Card>

        {/* Opciones */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.selectedOption
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}.</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.nextButton}
          onPress={handleNextQuestion}
          disabled={selectedOption === null}
        >
          Siguiente Pregunta
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 10, fontSize: 16, color: COLORS.textSecondary },
  errorText: { fontSize: 16, color: COLORS.error, textAlign: 'center', paddingHorizontal: 20 },
  header: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  questionCounter: { fontSize: 14, color: COLORS.textSecondary },
  areaTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginTop: 5 },
  passageCard: { marginHorizontal: 15, marginTop: 20, marginBottom: 10, elevation: 2 },
  passageTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  passageText: { fontSize: 15, lineHeight: 22, color: COLORS.textSecondary },
  questionCard: { marginHorizontal: 15, marginTop: 10, elevation: 2 },
  questionText: { fontSize: 16, fontWeight: '500', lineHeight: 24, color: COLORS.text },
  optionsContainer: { marginHorizontal: 15, marginTop: 20, marginBottom: 80 },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 8, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  selectedOption: { backgroundColor: COLORS.accent + '30', borderColor: COLORS.accent },
  optionLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginRight: 10 },
  optionText: { flex: 1, fontSize: 15, lineHeight: 22, color: COLORS.text },
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  nextButton: { paddingVertical: 5, backgroundColor: COLORS.primary },
});
