// ============================================
// Pantalla: GroupDetailScreen – Gastos del grupo
// ============================================
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ExpenseCard from '../components/ExpenseCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useGroups } from '../context/GroupContext';
import { Expense,Group,Participant,Balance } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function GroupDetailScreen({ route, navigation }: any) {
  const { groupId } = route.params as { groupId: string };
  const {
    groups,
    getExpensesByGroup,
    addExpense,
    deleteExpense,
    settleExpense,
    calculateBalances,
    exchangeRate,
    loadingRate,
    fetchExchangeRate,
  } = useGroups();

  const group = groups.find((g: Group) => g.id === groupId);
  const expenses = getExpensesByGroup(groupId);
  const balances = calculateBalances(groupId);

  // --- Estado formulario nuevo gasto ---
  const [description, setDescription] = useState('');
  const [amount, setAmount]           = useState('');
  const [paidBy, setPaidBy]           = useState('');
  const [submitted, setSubmitted]     = useState(false);
  const [showForm, setShowForm]       = useState(false);

  // Validaciones
  const descError   = submitted && description.trim() === '' ? 'La descripción es obligatoria' : '';
  const amountError = submitted && (isNaN(Number(amount)) || Number(amount) <= 0) ? 'Monto inválido' : '';
  const paidByError = submitted && paidBy.trim() === '' ? 'Indica quién pagó' : '';
  const isFormValid = description.trim() !== '' && Number(amount) > 0 && paidBy.trim() !== '';

  // Cargar tasa de cambio al entrar
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  if (!group) {
    return (
      <ScreenContainer>
        <Text style={{ color: '#f0eee8' }}>Grupo no encontrado.</Text>
      </ScreenContainer>
    );
  }

  const handleAddExpense = () => {
    setSubmitted(true);
    if (!isFormValid) return;

   const validParticipant = group.participants.some(
  (p: Participant) => p.name.toLowerCase() === paidBy.trim().toLowerCase()
);
    if (!validParticipant) {
      Alert.alert('Participante inválido', `"${paidBy}" no está en el grupo.`);
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      groupId,
      description: description.trim(),
      amount: Number(amount),
      paidBy: paidBy.trim(),
      settled: false,
      createdAt: new Date().toLocaleDateString('es-HN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
    };

    // TODO (Supabase): insertar gasto en tabla "expenses"
    addExpense(newExpense);
    setDescription('');
    setAmount('');
    setPaidBy('');
    setSubmitted(false);
    setShowForm(false);
  };

  return (
    <ScreenContainer>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.participants}>
          {group.participants.map((p: Participant) => p.name).join('  ·  ')}
        </Text>
      </View>

      {/* Tipo de cambio */}
      <View style={styles.rateBanner}>
        <Ionicons name="swap-horizontal-outline" size={14} color="#6b6b7a" />
        {loadingRate ? (
          <ActivityIndicator size="small" color="#6b6b7a" style={{ marginLeft: 8 }} />
        ) : (
          <Text style={styles.rateText}>
            {exchangeRate
              ? `1 USD = L ${exchangeRate.toFixed(2)}  (tasa de respaldo)`
              : 'Cargando tasa...'}
          </Text>
        )}
        {/* TODO (API): reemplazar tasa de respaldo por ExchangeRate-API real */}
      </View>

      {/* Balances */}
      {balances.length > 0 && (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>⚖️ Balance actual</Text>
          {balances.map((b: Balance) => (
            <View key={b.participantName} style={styles.balanceRow}>
              <Text style={styles.balanceName}>{b.participantName}</Text>
              <Text style={[styles.balanceAmount, b.owes > 0 ? styles.owes : styles.owed]}>
                {b.owes > 0
                  ? `Debe L ${b.owes.toFixed(2)}`
                  : `Le deben L ${Math.abs(b.owes).toFixed(2)}`}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Botón mostrar/ocultar formulario */}
      <CustomButton
        title={showForm ? '✕ Cancelar' : '➕ Agregar gasto'}
        onPress={() => setShowForm(!showForm)}
        variant={showForm ? 'secondary' : 'primary'}
      />

      {/* Formulario nuevo gasto */}
      {showForm && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuevo gasto</Text>

          <Text style={styles.label}>Descripción</Text>
          <CustomInput
            value={description}
            placeholder='Ej: "Cena", "Taxi", "Hotel"'
            onChangeText={setDescription}
            error={descError}
          />

          <Text style={styles.label}>Monto (L)</Text>
          <CustomInput
            value={amount}
            placeholder="Monto en Lempiras"
            onChangeText={setAmount}
            type="number"
            error={amountError}
          />

          <Text style={styles.label}>¿Quién pagó?</Text>
          <Text style={styles.hint}>
            Participantes: {group.participants.map((p: Participant) => p.name).join(', ')}
          </Text>
          <CustomInput
            value={paidBy}
            placeholder="Nombre exacto del participante"
            onChangeText={setPaidBy}
            error={paidByError}
          />

          <CustomButton
            title="Guardar gasto"
            onPress={handleAddExpense}
            variant="primary"
            disabled={!isFormValid}
          />
        </View>
      )}

      {/* Lista de gastos */}
      <Text style={styles.sectionTitle}>
        {expenses.length === 0 ? 'Sin gastos aún' : `${expenses.length} gasto${expenses.length !== 1 ? 's' : ''}`}
      </Text>

      {expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💰</Text>
          <Text style={styles.emptyText}>Agrega el primer gasto del grupo.</Text>
        </View>
      ) : (
        expenses.map((expense: Expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            exchangeRate={exchangeRate}
            onSettle={() => settleExpense(expense.id)}
            onDelete={() => deleteExpense(expense.id)}
          />
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header:       { marginBottom: 16 },
  groupName:    { fontSize: 24, fontWeight: '800', color: '#f0eee8' },
  participants: { fontSize: 13, color: '#6b6b7a', marginTop: 4 },
  rateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1c1c26',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a38',
    borderStyle: 'dashed',
  },
  rateText: { fontSize: 12, color: '#6b6b7a' },
  balanceCard: {
    backgroundColor: '#1c1c26',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a38',
  },
  balanceTitle: { fontSize: 15, fontWeight: '700', color: '#f0eee8', marginBottom: 10 },
  balanceRow:   { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  balanceName:  { fontSize: 14, color: '#f0eee8' },
  balanceAmount:{ fontSize: 14, fontWeight: '600' },
  owes:         { color: '#FF5B5B' },
  owed:         { color: '#2dd4bf' },
  card: {
    backgroundColor: '#1c1c26',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#2a2a38',
  },
  cardTitle:    { fontSize: 16, fontWeight: '700', color: '#f0eee8', marginBottom: 8 },
  label:        { fontSize: 13, fontWeight: '600', color: '#6b6b7a', marginTop: 10, marginBottom: 2 },
  hint:         { fontSize: 11, color: '#3a3a4a', marginBottom: 4 },
  sectionTitle: { fontSize: 14, color: '#6b6b7a', marginTop: 8, marginBottom: 4 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon:    { fontSize: 40, marginBottom: 12 },
  emptyText:    { fontSize: 14, color: '#3a3a4a', textAlign: 'center' },
});
