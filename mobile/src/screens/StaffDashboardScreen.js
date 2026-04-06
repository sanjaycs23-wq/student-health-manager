import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function StaffDashboardScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name}</Text>
      <Text style={styles.subtitle}>Staff Dashboard</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('StudentList')}
      >
        <Text style={styles.cardTitle}>View Students</Text>
        <Text style={styles.cardText}>Browse and search student records</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#065f46' },
  subtitle: { marginVertical: 8, color: '#6b7280' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 2
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardText: { color: '#6b7280' },
  logoutButton: {
    marginTop: 'auto',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fee2e2'
  },
  logoutText: { color: '#b91c1c', fontWeight: '600' }
});

