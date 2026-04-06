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

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      setSubmitting(true);
      await login(email.trim(), password);
    } catch (err) {
      console.log('Login error', err.message);
      setError(
        err.response?.data?.message ||
          'Unable to login. Check network or credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HealthHub Login</Text>
      <ErrorMessage message={error} />

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>No account? Sign up</Text>
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  button: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#2563eb'
  }
});

