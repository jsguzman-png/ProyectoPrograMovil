import { createContext, useContext, useState } from 'react';
import { Group, Expense, Balance } from '../types';

type GroupContextType = {
  groups: Group[];
  addGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  settleExpense: (id: string) => void;
  getExpensesByGroup: (groupId: string) => Expense[];
  calculateBalances: (groupId: string) => Balance[];
  exchangeRate: number | null;
  loadingRate: boolean;
  fetchExchangeRate: () => Promise<void>;
};

// 1. Crear el contexto
const GroupContext = createContext<GroupContextType | null>(null);

// 2. Hook personalizado para consumir el contexto
export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroups debe usarse dentro de GroupProvider');
  return context;
};

// 3. Proveedor del contexto
export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO (Supabase): cargar grupos iniciales desde tabla "groups" en Supabase
  const [groups, setGroups] = useState<Group[]>([]);

  // TODO (Supabase): cargar gastos iniciales desde tabla "expenses" en Supabase
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  // --- Grupos ---
  const addGroup = (group: Group) => {
    // TODO (Supabase): insertar grupo en tabla "groups"
    setGroups((prev) => [group, ...prev]);
  };

  const deleteGroup = (id: string) => {
    // TODO (Supabase): eliminar grupo y sus gastos en Supabase
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setExpenses((prev) => prev.filter((e) => e.groupId !== id));
  };

  // --- Gastos ---
  const addExpense = (expense: Expense) => {
    // TODO (Supabase): insertar gasto en tabla "expenses"
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    // TODO (Supabase): eliminar gasto en Supabase
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const settleExpense = (id: string) => {
    // TODO (Supabase): actualizar campo "settled = true" en Supabase
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, settled: true } : e))
    );
  };

  const getExpensesByGroup = (groupId: string) =>
    expenses.filter((e) => e.groupId === groupId);

  // --- Cálculo de balances por participante ---
  const calculateBalances = (groupId: string): Balance[] => {
    const groupExpenses = getExpensesByGroup(groupId).filter((e) => !e.settled);
    const group = groups.find((g) => g.id === groupId);
    if (!group || groupExpenses.length === 0) return [];

    const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
    const share = totalAmount / group.participants.length;

    return group.participants.map((p) => {
      const paid = groupExpenses
        .filter((e) => e.paidBy === p.name)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        participantName: p.name,
        owes: share - paid, // positivo = debe, negativo = le deben
      };
    });
  };

  // --- API tipo de cambio ---
  const fetchExchangeRate = async () => {
    setLoadingRate(true);
    try {
      // TODO (API): llamar a ExchangeRate-API
      // const res = await fetch('https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/USD');
      // const data = await res.json();
      // setExchangeRate(data.conversion_rates.HNL);
      throw new Error('API pendiente de integración');
    } catch {
      // Tasa de respaldo aproximada (Lempiras por 1 USD)
      setExchangeRate(24.7);
    } finally {
      setLoadingRate(false);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        addGroup,
        deleteGroup,
        expenses,
        addExpense,
        deleteExpense,
        settleExpense,
        getExpensesByGroup,
        calculateBalances,
        exchangeRate,
        loadingRate,
        fetchExchangeRate,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
