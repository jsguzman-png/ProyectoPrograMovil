// ============================================
// Componente reutilizable: GroupCard
// Muestra un grupo con participantes y acciones
// ============================================
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Group } from '../types';

interface GroupCardProps {
  group: Group;
  expenseCount: number;
  onPress: () => void;
  onDelete: () => void;
}

export default function GroupCard({ group, expenseCount, onPress, onDelete }: GroupCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>👥</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.meta}>
            {group.participants.length} participante{group.participants.length !== 1 ? 's' : ''}
            {'  ·  '}
            {expenseCount} gasto{expenseCount !== 1 ? 's' : ''}
          </Text>
        </View>
        {/* Botón eliminar */}
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={18} color="#FF5B5B" />
        </TouchableOpacity>
      </View>

      {/* Chips de participantes */}
      <View style={styles.chips}>
        {group.participants.map((p) => (
          <View key={p.id} style={styles.chip}>
            <Text style={styles.chipText}>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Fecha */}
      <Text style={styles.date}>{group.createdAt}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1c26',
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#2a2a38',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5B8CFF22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 20 },
  info:     { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f0eee8',
  },
  meta: {
    fontSize: 12,
    color: '#6b6b7a',
    marginTop: 2,
  },
  deleteBtn: { padding: 4 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#5B8CFF22',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#5B8CFF44',
  },
  chipText: { fontSize: 12, color: '#5B8CFF', fontWeight: '600' },
  date: { fontSize: 11, color: '#3a3a4a', textAlign: 'right' },
});