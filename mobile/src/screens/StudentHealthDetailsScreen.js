 import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import api from '../api/api';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorMessage from '../components/ErrorMessage';

export default function StudentHealthDetailsScreen({ route }) {
  const { studentId } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDetails = async () => {
    setError('');
    try {
      const res = await api.get(`/api/health/${studentId}`);
      setData(res.data);
    } catch (err) {
      console.log('Fetch student detail error', err.message);
      setError(
        err.response?.data?.message ||
          'Unable to load student details. Check network / staff access.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading) return <LoadingOverlay />;

  if (!data) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error || 'No data found.'} />
      </View>
    );
  }

  const { student, record } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{student.name}</Text>
      <Text style={styles.subtitle}>{student.email}</Text>
      <ErrorMessage message={error} />

      {record ? (
        <View style={styles.card}>
          <Row label="Blood Group" value={record.bloodGroup} />
          <Row label="Health Issues" value={record.healthIssues || '-'} />
          <Row label="Allergies" value={record.allergies || '-'} />
          <Row label="Medical Notes" value={record.medicalNotes || '-'} />
        </View>
      ) : (
        <Text>This student has no health record yet.</Text>
      )}
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9fafb', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  subtitle: { color: '#6b7280', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2
  },
  row: { marginBottom: 12 },
  rowLabel: {
    color: '#6b7280',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  rowValue: { fontSize: 16, marginTop: 2 }
});

