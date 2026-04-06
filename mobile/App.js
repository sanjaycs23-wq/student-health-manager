import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingOverlay from './src/components/LoadingOverlay';

function Root() {
  const { loading } = useContext(AuthContext);
  if (loading) return <LoadingOverlay />;
  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

