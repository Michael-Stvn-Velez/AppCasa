import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createMobileContainer } from './Infrastructure/CompositionRoot/mobileContainer';
import { RootNavigator } from './UI/Presentation/navigation/RootNavigator';
import { configureSystemTextInputDefaults } from './UI/Presentation/theme/appTheme';

configureSystemTextInputDefaults();

const container = createMobileContainer();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator container={container} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
