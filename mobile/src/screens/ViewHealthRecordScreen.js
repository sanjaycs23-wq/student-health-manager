import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView
} from 'react-native';
import api from '../api/api';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorMessage from '../components/ErrorMessage';

export default function ViewHealthRecordScreen() {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadRecord = async () => {
    setError('');
    try {
      const res = await api.get('/api/health/student');
      setRecord(res.data);
    } catch (err) {
      console.log('Fetch student record error', err.message);
      setError(
        err.response?.data?.message ||
          'Unable to load record. Make sure you added one and are online.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRecord();
  }, []);

  if (loading) return <LoadingOverlay />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadRecord();
          }}
        />
      }
    >
      <Text style={styles.title}>My Health Record</Text>
      <ErrorMessage message={error} />
      {record ? (
        <View style={styles.card}>
          <Row label="Blood Group" value={record.bloodGroup} />
          <Row label="Health Issues" value={record.healthIssues || '-'} />
          <Row label="Allergies" value={record.allergies || '-'} />
          <Row label="Medical Notes" value={record.medicalNotes || '-'} />
        </View>
      ) : (
        <Text>No record found. Please create one from "Update Record".</Text>
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2
  },
  row: {
    marginBottom: 12
  },
  rowLabel: {
    color: '#6b7280',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  rowValue: {
    fontSize: 16,
    color: '#111827',
    marginTop: 2
  }
});

