import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Chip } from 'react-native-paper';
import { COLORS, ICFES_AREAS } from '../constants';

export default function AreasGenerales({ navigation }) {
    const areas = [
        {
            key: ICFES_AREAS.LECTURA_CRITICA,
            title: 'Lectura Crítica',
            subtitle: 'Analiza textos y argumentos',
            duration: '18 minutos', // 5 preguntas * 90s
            questions: '12',
            difficulty: 'Media',
            icon: '📖',
            color: COLORS.accent,
            premium: false,
            action: () => navigation.navigate('LecturaCriticaModulo'),
        },
        {
            key: ICFES_AREAS.MATEMATICAS,
            title: 'Matemáticas',
            subtitle: 'Razonamiento y problemas',
            duration: 'Próximamente',
            questions: 'Próximamente',
            difficulty: 'Próximamente',
            icon: '🔢',
            color: '#FF6347',
            premium: true,
            action: () => { },
        },
        {
            key: ICFES_AREAS.SOCIALES,
            title: 'Sociales y Ciudadanas',
            subtitle: 'Historia, geografía y ciudadanía',
            duration: 'Próximamente',
            questions: 'Próximamente',
            difficulty: 'Próximamente',
            icon: '🌍',
            color: '#1E90FF',
            premium: true,
            action: () => { },
        },
        {
            key: ICFES_AREAS.CIENCIAS_NATURALES,
            title: 'Ciencias Naturales',
            subtitle: 'Biología, Química y Física',
            duration: 'Próximamente',
            questions: 'Próximamente',
            difficulty: 'Próximamente',
            icon: '🧪',
            color: '#32CD32',
            premium: true,
            action: () => { },
        },
        {
            key: ICFES_AREAS.INGLES,
            title: 'Inglés',
            subtitle: 'Comprensión lectora en Inglés',
            duration: 'Próximamente',
            questions: 'Próximamente',
            difficulty: 'Próximamente',
            icon: '🇺🇸',
            color: '#8A2BE2',
            premium: true,
            action: () => { },
        },
    ];

    const renderAreaCard = (area) => (
        <Card key={area.key} style={[styles.areaCard, { borderLeftColor: area.color }]}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: area.color + '20' }]}>
                        <Text style={styles.cardIcon}>{area.icon}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                        <View style={styles.titleRow}>
                            <Text style={styles.cardTitle}>{area.title}</Text>
                            {area.premium && (
                                <Chip style={styles.premiumChip} textStyle={styles.premiumText}>
                                    Próximamente
                                </Chip>
                            )}
                        </View>
                        <Text style={styles.cardSubtitle}>{area.subtitle}</Text>
                    </View>
                </View>

                <View style={styles.cardStats}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>⏱️ Duración:</Text>
                        <Text style={styles.statValue}>{area.duration}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>❓ Preguntas:</Text>
                        <Text style={styles.statValue}>{area.questions}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>📊 Dificultad:</Text>
                        <Text style={styles.statValue}>{area.difficulty}</Text>
                    </View>
                </View>

                <Button
                    mode="contained"
                    style={[styles.startButton, { backgroundColor: area.color }]}
                    onPress={area.action}
                    disabled={area.premium}
                >
                    {area.premium ? 'Próximamente' : 'Comenzar Prueba'}
                </Button>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Simulacro por Área</Text>
                    <Text style={styles.subtitle}>Elige el área para empezar a practicar</Text>
                </View>
                <View style={styles.areaSection}>
                    {areas.map(renderAreaCard)}
                </View>
            </ScrollView>
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
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    areaSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    areaCard: {
        marginBottom: 16,
        backgroundColor: 'white',
        borderLeftWidth: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardIcon: {
        fontSize: 24,
    },
    cardInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    premiumChip: {
        backgroundColor: COLORS.accent,
    },
    premiumText: {
        color: 'white',
        fontSize: 10,
    },
    cardSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    cardStats: {
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    startButton: {
        paddingVertical: 4,
    },
});
