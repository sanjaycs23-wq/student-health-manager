import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorMessage from '../components/ErrorMessage';

export default function SignupScreen() {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSignup = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Please fill all fields');
      return;
    }
    try {
      setSubmitting(true);
      await signup(name.trim(), email.trim(), password, role);
    } catch (err) {
      console.log('Signup error', err.message);
      setError(
        err.response?.data?.message ||
          'Unable to sign up. Check network or details.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <ErrorMessage message={error} />

      <TextInput
        placeholder="Name"
        style={styles.input}
        placeholderTextColor="#6b7280"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#6b7280"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        placeholderTextColor="#6b7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.roleRow}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'student' && styles.roleButtonActive
          ]}
          onPress={() => setRole('student')}
        >
          <Text
            style={[
              styles.roleText,
              role === 'student' && styles.roleTextActive
            ]}
          >
            Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'staff' && styles.roleButtonActive
          ]}
          onPress={() => setRole('staff')}
        >
          <Text
            style={[
              styles.roleText,
              role === 'staff' && styles.roleTextActive
            ]}
          >
            Staff
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={onSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f6f7fb'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#065f46'
  },
  input: {
    backgroundColor: '#fff',
    color: '#111827',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  roleButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  roleButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#059669'
  },
  roleText: { color: '#374151' },
  roleTextActive: { color: '#fff', fontWeight: 'bold' },
  button: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
