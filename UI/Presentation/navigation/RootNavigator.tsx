import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import type { MobileContainer } from '../../../Infrastructure/CompositionRoot/mobileContainer';
import { AdminEditScreen } from '../screens/admin/AdminEditScreen';
import { AdminWelcomeScreen } from '../screens/admin/AdminWelcomeScreen';
import { BootstrapScreen } from '../screens/bootstrap/BootstrapScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { WebDbUnavailableScreen } from '../screens/platform/WebDbUnavailableScreen';
import { UsuarioFormScreen } from '../screens/usuario/UsuarioFormScreen';
import { UsuarioListScreen } from '../screens/usuario/UsuarioListScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  container: MobileContainer;
};

export function RootNavigator({ container }: Props) {
  const WebDbUnavailableRoute = () => <WebDbUnavailableScreen />;
  const BootstrapRoute = () => <BootstrapScreen container={container} />;
  const AdminWelcomeRoute = () => <AdminWelcomeScreen container={container} />;
  const AdminEditRoute = () => <AdminEditScreen container={container} />;
  const HomeRoute = () => <HomeScreen container={container} />;
  const UsuarioListRoute = () => <UsuarioListScreen container={container} />;
  const UsuarioFormRoute = () => <UsuarioFormScreen container={container} />;

  if (Platform.OS === 'web') {
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="WebDbUnavailable">
        <Stack.Screen name="WebDbUnavailable" component={WebDbUnavailableRoute} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Bootstrap"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Bootstrap" component={BootstrapRoute} />
      <Stack.Screen name="AdminWelcome" component={AdminWelcomeRoute} />
      <Stack.Screen name="AdminEdit" component={AdminEditRoute} />
      <Stack.Screen name="Home" component={HomeRoute} />
      <Stack.Screen name="UsuarioList" component={UsuarioListRoute} />
      <Stack.Screen name="UsuarioForm" component={UsuarioFormRoute} />
    </Stack.Navigator>
  );
}
