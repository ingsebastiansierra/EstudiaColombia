import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Card, Button, Divider } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const profileStats = [
    { label: 'Simulacros Realizados', value: '12' },
    { label: 'Promedio General', value: '85%' },
    { label: 'Universidades Guardadas', value: '5' },
    { label: 'Días Consecutivos', value: '7' },
  ];

  const menuItems = [
    { title: 'Mis Resultados ICFES', icon: '📊', action: () => {} },
    { title: 'Universidades Favoritas', icon: '⭐', action: () => {} },
    { title: 'Configuración', icon: '⚙️', action: () => {} },
    { title: 'Notificaciones', icon: '🔔', action: () => {} },
    { title: 'Ayuda y Soporte', icon: '❓', action: () => {} },
    { title: 'Acerca de', icon: 'ℹ️', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Avatar.Text 
              size={80} 
              label={user?.name?.charAt(0) || 'U'} 
              style={{ backgroundColor: COLORS.primary }}
            />
            <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'usuario@email.com'}</Text>
            <Text style={styles.userGrade}>{user?.grade || 'Grado 11'}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Premium Banner */}
        <Card style={styles.premiumCard}>
          <Card.Content>
            <View style={styles.premiumContent}>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>🚀 Estudia Colombia Premium</Text>
                <Text style={styles.premiumSubtitle}>
                  Desbloquea simulacros ilimitados y análisis avanzados
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.premiumButton}
                buttonColor={COLORS.accent}
                textColor="white"
                onPress={() => {}}
              >
                Actualizar
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuItemContent}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuArrow}>→</Text>
              </View>
              {index < menuItems.length - 1 && <Divider />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={COLORS.error}
        >
          Cerrar Sesión
        </Button>

        {/* Version Info */}
        <Text style={styles.versionText}>Versión 1.0.0</Text>
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
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.surface,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  userGrade: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: 'white',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  premiumCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.accent + '10',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumText: {
    flex: 1,
    marginRight: 16,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  premiumButton: {
    paddingHorizontal: 8,
  },
  menuSection: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderColor: COLORS.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
});
