// ============================================
// Pantalla: LoginScreen
// ============================================
import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // --- Validaciones ---
  const emailError    = submitted && !email.includes('@') ? 'El correo debe incluir @' : '';
  const passwordError = submitted && password.length < 6  ? 'Mínimo 6 caracteres' : '';
  const isFormValid   = email.includes('@') && password.length >= 6;

  const handleLogin = () => {
    setSubmitted(true);
    if (!isFormValid) return;

    const success = login(email, password);
    // TODO (Supabase): reemplazar login() por supabase.auth.signInWithPassword()
    if (success) {
      navigation.replace('Tabs');
    }
  };

  return (
    <ScreenContainer>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.emoji}>💸</Text>
        <Text style={styles.appName}>DividirCuenta</Text>
        <Text style={styles.tagline}>Divide gastos, no amistades</Text>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Iniciar Sesión</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <CustomInput
          value={email}
          placeholder="tucorreo@universidad.edu"
          onChangeText={setEmail}
          type="email"
          error={emailError}
        />

        <Text style={styles.label}>Contraseña</Text>
        <CustomInput
          value={password}
          placeholder="Mínimo 6 caracteres"
          onChangeText={setPassword}
          type="password"
          error={passwordError}
        />

        <View style={{ marginTop: 8 }}>
          <CustomButton title="Entrar" onPress={handleLogin} variant="primary" />
        </View>

        {/* Error correo sin .edu */}
        {submitted && isFormValid && !email.endsWith('.edu') ? (
          <Text style={styles.errorGeneral}>Solo se permiten correos universitarios (.edu)</Text>
        ) : null}

        <Text style={styles.hint}>Por ahora solo se aceptan correos .edu</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 36,
  },
  emoji:   { fontSize: 60, marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: '800', color: '#f0eee8', letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: '#6b6b7a', marginTop: 6 },
  card: {
    backgroundColor: '#1c1c26',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2a2a38',
  },
  cardTitle:    { fontSize: 20, fontWeight: '700', color: '#f0eee8', marginBottom: 16, textAlign: 'center' },
  label:        { fontSize: 13, fontWeight: '600', color: '#6b6b7a', marginTop: 10, marginBottom: 2 },
  errorGeneral: { color: '#FF5B5B', fontSize: 13, textAlign: 'center', marginTop: 8 },
  hint:         { color: '#3a3a4a', fontSize: 12, textAlign: 'center', marginTop: 16 },
});