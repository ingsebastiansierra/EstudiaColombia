import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from 'react-native-paper';
import { supabase } from '../../DataBase/supabaseClient';
import { SCREEN_NAMES, ICFES_AREAS, COLORS } from '../../constants';
import ModalInstructor from '../../components/Modals/ModalInstructor';

export default function LecturaCriticaModulo({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(90);
  const [expandedPassage, setExpandedPassage] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);

  // 👇 VERIFICAR ESTA SECCIÓN: La data debe estar definida y no vacía
  const instructionsData = [
    {
      icon: '⏳',
      title: 'Tiempo Límite',
      body: 'Tendrás 90 segundos para responder cada pregunta. ¡Maneja tu tiempo sabiamente!',
    },
    {
      icon: '🧠',
      title: 'Habilidades a Evaluar',
      body: 'Esta prueba mide tu capacidad para interpretar textos, inferir información y evaluar la validez de argumentos.',
    },
    {
      icon: '📝',
      title: 'Número de Preguntas',
      body: 'La prueba consta de 12 preguntas variadas para evaluar tus conocimientos.',
    },
    {
      icon: '✅',
      title: 'Reglas Importantes',
      body: 'Responde cada pregunta de forma individual. Una vez que pases a la siguiente, no podrás regresar.',
    },
  ];

  const handleCloseModal = () => {
    setShowInstructionsModal(false);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          competency_id,
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
        `);
  
      if (error) {
        console.error('Error fetching questions:', error);
        setError('No se pudieron cargar las preguntas. Intenta de nuevo.');
      } else {
        const competencias = [1, 2, 3];
        const preguntasPorCompetencia = competencias.flatMap(c => {
          return data.filter(q => q.competency_id === c).slice(0, 5);
        });
        const shuffled = preguntasPorCompetencia.sort(() => Math.random() - 0.5);
  
        setQuestions(shuffled);
        setQuestionStartTime(Date.now());
        setTimeLeft(90);
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

  useEffect(() => {
    if (loading || questions.length === 0 || showInstructionsModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleNextQuestion(true);
          return 90;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, loading, questions, showInstructionsModal]);

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
          user_id: user.id,
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

  const handleNextQuestion = async (autoSkip = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selected = currentQuestion.options.find(opt => opt.id === selectedOption);

    if (!autoSkip && !selected) return;

    if (selected) {
      await saveUserResponse(currentQuestion.id, selectedOption, selected.is_correct);
      if (selected.is_correct) {
        setScore(prev => prev + 1);
      }
    } else if (autoSkip) {
      await saveUserResponse(currentQuestion.id, null, false);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuestionStartTime(Date.now());
      setTimeLeft(90);
      setExpandedPassage(false);
    } else {
      Alert.alert(
        "¡Simulacro finalizado!",
        `Tu puntaje: ${score + (selected?.is_correct ? 1 : 0)} / ${questions.length}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

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
  const charLimit = 180;
  const passageText = passage?.content || "";
  const isLong = passageText.length > charLimit;
  const displayText = expandedPassage ? passageText : passageText.slice(0, charLimit);

  return (
    <SafeAreaView style={styles.container}>
      <ModalInstructor
        isVisible={showInstructionsModal}
        onClose={handleCloseModal}
        title="Instrucciones para la Prueba"
        instructions={instructionsData} // Asegúrate de pasar el array aquí
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.questionCounter}>
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </Text>
          <Text style={styles.areaTitle}>Lectura Crítica</Text>
          <Text style={styles.timer}>⏱️ {timeLeft}s</Text>
        </View>

        {passage && (
          <Card style={styles.passageCard}>
            <Card.Content>
              <Text style={styles.passageTitle}>Lectura:</Text>
              <Text style={styles.passageText}>
                {displayText}
                {!expandedPassage && isLong ? "..." : ""}
              </Text>
              {isLong && (
                <TouchableOpacity onPress={() => setExpandedPassage(!expandedPassage)}>
                  <Text style={styles.verMas}>
                    {expandedPassage ? "Ver menos ▲" : "Ver más ▼"}
                  </Text>
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>
        )}

        <Card style={styles.questionCard}>
          <Card.Content>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </Card.Content>
        </Card>

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
          onPress={() => handleNextQuestion(false)}
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
  timer: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginTop: 5 },
  passageCard: { marginHorizontal: 15, marginTop: 20, marginBottom: 10, elevation: 2 },
  passageTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  passageText: { fontSize: 15, lineHeight: 22, color: COLORS.textSecondary },
  verMas: { fontSize: 14, color: COLORS.primary, marginTop: 5, fontWeight: '500' },
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