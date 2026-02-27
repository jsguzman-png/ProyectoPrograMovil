// ============================================
// Pantalla: HomeScreen – Lista de grupos
// ============================================
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import GroupCard from '../components/GroupCard';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useGroups } from '../context/GroupContext';

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { groups, deleteGroup, getExpensesByGroup } = useGroups();

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <ScreenContainer>
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Mis Grupos 👥</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <CustomButton title="Salir" onPress={handleLogout} variant="secondary" />
      </View>

      {/* TODO (Supabase): cargar grupos del usuario autenticado */}

      {/* Botón crear grupo */}
      <CustomButton
        title="➕ Nuevo grupo"
        onPress={() => navigation.navigate('CreateGroup')}
        variant="primary"
      />

      {/* Lista de grupos */}
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🗂️</Text>
          <Text style={styles.emptyText}>Aún no tienes grupos</Text>
          <Text style={styles.emptySubtext}>
            Crea un grupo para empezar a dividir gastos con tus amigos.
          </Text>
        </View>
      ) : (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.countText}>
            {groups.length} grupo{groups.length !== 1 ? 's' : ''}
          </Text>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              expenseCount={getExpensesByGroup(group.id).length}
              onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
              onDelete={() => deleteGroup(group.id)}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting:  { fontSize: 22, fontWeight: '700', color: '#f0eee8' },
  email:     { fontSize: 13, color: '#6b6b7a', marginTop: 2 },
  countText: { fontSize: 13, color: '#6b6b7a', marginBottom: 4 },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon:    { fontSize: 48, marginBottom: 16 },
  emptyText:    { fontSize: 17, fontWeight: '600', color: '#6b6b7a', textAlign: 'center' },
  emptySubtext: { fontSize: 13, color: '#3a3a4a', textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
});
