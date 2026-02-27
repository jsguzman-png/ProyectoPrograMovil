// ============================================
// DividirCuenta – App Principal
// ============================================
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { GroupProvider } from './src/context/GroupContext';

/**
 * Componente raíz de DividirCuenta.
 *
 * Providers (de afuera hacia adentro):
 *  AuthProvider  → gestiona sesión del usuario (→ Supabase Auth)
 *  GroupProvider → gestiona grupos y gastos   (→ Supabase DB + ExchangeRate API)
 *  NavigationContainer → navegación de la app
 */
export default function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#0f0f13" />
          <StackNavigator />
        </NavigationContainer>
      </GroupProvider>
    </AuthProvider>
  );
}