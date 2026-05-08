import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createMobileContainer } from './Infrastructure/CompositionRoot/mobileContainer';
import { LocalDatabaseInitScreen } from './UI/Presentation/screens/LocalDatabaseInitScreen';

const container = createMobileContainer();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <LocalDatabaseInitScreen container={container} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
