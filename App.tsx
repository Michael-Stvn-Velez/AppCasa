import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMobileContainer } from './Infrastructure/CompositionRoot/mobileContainer';
import type { RootStackParamList } from './UI/Presentation/navigation/types';
import { LocalDatabaseInitScreen } from './UI/Presentation/screens/LocalDatabaseInitScreen';
import { UsuarioFormScreen } from './UI/Presentation/screens/UsuarioFormScreen';
import { UsuarioListScreen } from './UI/Presentation/screens/UsuarioListScreen';

const container = createMobileContainer();
const Stack = createNativeStackNavigator<RootStackParamList>();

function UsuarioListRoute() {
  return <UsuarioListScreen container={container} />;
}

function UsuarioFormRoute() {
  return <UsuarioFormScreen container={container} />;
}

export default function App() {
  const [fase, setFase] = useState<'init' | 'usuarios'>('init');

  if (fase === 'init') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
          <StatusBar style="auto" />
          <LocalDatabaseInitScreen
            container={container}
            onContinue={() => setFase('usuarios')}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
          <StatusBar style="auto" />
          <View style={styles.webMsg}>
            <Text style={styles.webMsgText}>
              El CRUD de usuarios usa SQLite en el dispositivo. Ábrelo en Android o iOS (Emulador,
              Expo Go o build nativo).
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="UsuarioList"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="UsuarioList" component={UsuarioListRoute} />
          <Stack.Screen name="UsuarioForm" component={UsuarioFormRoute} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webMsg: { flex: 1, padding: 24, justifyContent: 'center' },
  webMsgText: { fontSize: 16, lineHeight: 24, textAlign: 'center', color: '#333' },
});
