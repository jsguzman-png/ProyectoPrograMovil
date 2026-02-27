// ============================================
// Componente reutilizable: ExpenseCard
// Muestra un gasto con monto, quién pagó y conversión
// ============================================
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense } from '../types';

interface ExpenseCardProps {
  expense: Expense;
  exchangeRate: number | null;
  onSettle: () => void;
  onDelete: () => void;
}

export default function ExpenseCard({ expense, exchangeRate, onSettle, onDelete }: ExpenseCardProps) {
  // Conversión HNL → USD
  const amountUSD = exchangeRate ? (expense.amount / exchangeRate).toFixed(2) : null;

  return (
    <View style={[styles.card, expense.settled && styles.cardSettled]}>
      <View style={styles.row}>
        {/* Info izquierda */}
        <View style={styles.left}>
          <Text style={styles.description}>{expense.description}</Text>
          <Text style={styles.paidBy}>Pagó: {expense.paidBy}</Text>
          <Text style={styles.date}>{expense.createdAt}</Text>
        </View>

        {/* Monto derecho */}
        <View style={styles.right}>
          <Text style={styles.amount}>L {expense.amount.toFixed(2)}</Text>
          {/* Conversión API */}
          {amountUSD ? (
            <Text style={styles.amountUSD}>$ {amountUSD}</Text>
          ) : null}
          {/* Badge saldado */}
          {expense.settled ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Saldado ✓</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Acciones */}
      {!expense.settled && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.settleBtn} onPress={onSettle} activeOpacity={0.75}>
            <Ionicons name="checkmark-circle-outline" size={15} color="#2dd4bf" />
            <Text style={styles.settleBtnText}>Marcar saldado</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color="#FF5B5B" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1c26',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#2a2a38',
  },
  cardSettled: {
    borderColor: '#2dd4bf44',
    opacity: 0.65,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left:  { flex: 1, marginRight: 12 },
  right: { alignItems: 'flex-end' },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f0eee8',
    marginBottom: 4,
  },
  paidBy: { fontSize: 12, color: '#6b6b7a' },
  date:   { fontSize: 11, color: '#3a3a4a', marginTop: 2 },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5B8CFF',
  },
  amountUSD: {
    fontSize: 12,
    color: '#6b6b7a',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#2dd4bf22',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#2dd4bf44',
  },
  badgeText: { fontSize: 10, color: '#2dd4bf', fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a38',
    paddingTop: 10,
  },
  settleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settleBtnText: { fontSize: 13, color: '#2dd4bf', fontWeight: '600' },
  deleteBtn: { padding: 4 },
});