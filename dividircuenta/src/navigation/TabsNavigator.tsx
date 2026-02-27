// ============================================
// Navegación: TabsNavigator (Bottom Tabs)
// ============================================
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';

export type TabParamList = {
  Home: undefined;
  // TODO: agregar más tabs según crezca el proyecto
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#5B8CFF',
        tabBarInactiveTintColor: '#3a3a4a',
        tabBarStyle: {
          backgroundColor: '#1c1c26',
          borderTopWidth: 1,
          borderTopColor: '#2a2a38',
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'people-outline',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Grupos' }}
      />
    </Tab.Navigator>
  );
}