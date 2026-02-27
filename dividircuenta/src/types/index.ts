// ============================================
// DividirCuenta – Tipos e Interfaces
// ============================================

/** Usuario autenticado */
export type User = {
  id?: string;
  email?: string;
  token?: string;
} | null;

/** Participante dentro de un grupo */
export interface Participant {
  id: string;
  name: string;
}

/** Grupo de gastos compartidos */
export interface Group {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: string;
}

/** Gasto registrado dentro de un grupo */
export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;          // monto en Lempiras (HNL)
  amountUSD?: number;      // monto convertido (de la API)
  paidBy: string;          // nombre del participante que pagó
  settled: boolean;
  createdAt: string;
}

/** Balance calculado por participante */
export interface Balance {
  participantName: string;
  owes: number;            // cuánto debe en total (HNL)
}