// ============================================
// Pantalla: CreateGroupScreen – Crear grupo
// ============================================
import { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useGroups } from '../context/GroupContext';
import { Group, Participant } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function CreateGroupScreen({ navigation }: any) {
  const { addGroup } = useGroups();

  const [groupName, setGroupName]           = useState('');
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants]     = useState<Participant[]>([]);
  const [submitted, setSubmitted]           = useState(false);

  // --- Validaciones ---
  const nameError =
    submitted && groupName.trim() === '' ? 'El nombre del grupo es obligatorio' : '';

  const isValid = groupName.trim() !== '' && participants.length >= 2;

  // --- Agregar participante ---
  const handleAddParticipant = () => {
    const name = participantInput.trim();
    if (!name) return;
    const alreadyExists = participants.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (alreadyExists) {
      Alert.alert('Duplicado', 'Ese participante ya está en la lista.');
      return;
    }
    setParticipants((prev) => [...prev, { id: Date.now().toString(), name }]);
    setParticipantInput('');
  };

  // --- Eliminar participante ---
  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  // --- Crear grupo ---
  const handleCreate = () => {
    setSubmitted(true);
    if (!isValid) {
      if (participants.length < 2) {
        Alert.alert('Faltan participantes', 'Agrega al menos 2 participantes.');
      }
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName.trim(),
      participants,
      createdAt: new Date().toLocaleDateString('es-HN', {
        year: 'numeric', month: 'short', day: 'numeric',
      }),
    };

    // TODO (Supabase): insertar grupo en tabla "groups"
    addGroup(newGroup);
    Alert.alert('¡Listo!', 'Grupo creado correctamente.', [
      { text: 'Ver grupo', onPress: () => navigation.replace('GroupDetail', { groupId: newGroup.id }) },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={styles.header}>➕ Nuevo Grupo</Text>
      <Text style={styles.subheader}>Agrega un nombre y al menos 2 participantes.</Text>

      {/* Nombre del grupo */}
      <View style={styles.card}>
        <Text style={styles.label}>Nombre del grupo</Text>
        <CustomInput
          value={groupName}
          placeholder='Ej: "Viaje a Copán", "Cena del viernes"'
          onChangeText={setGroupName}
          error={nameError}
        />
      </View>

      {/* Participantes */}
      <View style={styles.card}>
        <Text style={styles.label}>Participantes</Text>
        <Text style={styles.hint}>Mínimo 2 personas</Text>

        {/* Input + botón agregar */}
        <View style={styles.addRow}>
          <View style={{ flex: 1 }}>
            <CustomInput
              value={participantInput}
              placeholder='Nombre del participante'
              onChangeText={setParticipantInput}
            />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddParticipant}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Lista de participantes */}
        {participants.length === 0 ? (
          <Text style={styles.noParticipants}>Aún no hay participantes</Text>
        ) : (
          <View style={styles.chipList}>
            {participants.map((p) => (
              <View key={p.id} style={styles.chip}>
                <Text style={styles.chipText}>{p.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveParticipant(p.id)}>
                  <Ionicons name="close-circle" size={16} color="#FF5B5B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <CustomButton
        title="Crear Grupo"
        onPress={handleCreate}
        variant="primary"
        disabled={!isValid}
      />

      <CustomButton
        title="Cancelar"
        onPress={() => navigation.goBack()}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header:    { fontSize: 24, fontWeight: '800', color: '#f0eee8', marginBottom: 4 },
  subheader: { fontSize: 13, color: '#6b6b7a', marginBottom: 20 },
  card: {
    backgroundColor: '#1c1c26',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a38',
  },
  label:          { fontSize: 14, fontWeight: '600', color: '#f0eee8', marginBottom: 4 },
  hint:           { fontSize: 12, color: '#6b6b7a', marginBottom: 8 },
  noParticipants: { fontSize: 13, color: '#3a3a4a', textAlign: 'center', paddingVertical: 12 },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#5B8CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#5B8CFF22',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#5B8CFF44',
  },
  chipText: { fontSize: 13, color: '#5B8CFF', fontWeight: '600' },
});
