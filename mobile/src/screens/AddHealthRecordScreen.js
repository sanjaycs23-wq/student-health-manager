import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import api from '../api/api';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorMessage from '../components/ErrorMessage';

export default function AddHealthRecordScreen() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [healthIssues, setHealthIssues] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSave = async () => {
    setError('');
    setSuccess('');
    if (!bloodGroup) {
      setError('Blood group is required');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/api/health/create', {
        bloodGroup,
        healthIssues,
        allergies,
        medicalNotes
      });
      setSuccess('Health record saved successfully.');
    } catch (err) {
      console.log('Save record error', err.message);
      setError(
        err.response?.data?.message ||
          'Could not save record. Check network / login.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <LoadingOverlay />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add / Update Health Record</Text>
      <ErrorMessage message={error} />
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TextInput
        placeholder="Blood Group (e.g. O+)"
        style={styles.input}
        value={bloodGroup}
        onChangeText={setBloodGroup}
      />
      <TextInput
        placeholder="Health Issues"
        style={styles.input}
        value={healthIssues}
        onChangeText={setHealthIssues}
        multiline
      />
      <TextInput
        placeholder="Allergies"
        style={styles.input}
        value={allergies}
        onChangeText={setAllergies}
        multiline
      />
      <TextInput
        placeholder="Medical Notes"
        style={styles.input}
        value={medicalNotes}
        onChangeText={setMedicalNotes}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Save Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flexGrow: 1
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  success: {
    color: '#16a34a',
    marginBottom: 8,
    textAlign: 'center'
  }
});

