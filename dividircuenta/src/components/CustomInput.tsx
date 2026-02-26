// ============================================
// Componente reutilizable: CustomInput
// ============================================
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
}

export default function CustomInput({
  value,
  placeholder,
  onChangeText,
  type = 'text',
  error,
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getKeyboardType = (): KeyboardTypeOptions => {
    if (type === 'email') return 'email-address';
    if (type === 'number') return 'numeric';
    return 'default';
  };

  const isSecure = type === 'password' && !showPassword;

  return (
    <>
      <View style={[styles.wrapper, error ? styles.wrapperError : styles.wrapperNormal]}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          keyboardType={getKeyboardType()}
          secureTextEntry={isSecure}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          placeholderTextColor="#4a4a5a"
        />
        {type === 'password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eye}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6b6b7a" />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#1c1c26',
    marginVertical: 6,
  },
  wrapperNormal: { borderColor: '#2a2a38' },
  wrapperError:  { borderColor: '#FF5B5B' },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#f0eee8',
  },
  eye:   { padding: 4 },
  error: { color: '#FF5B5B', fontSize: 12, marginLeft: 4, marginBottom: 4 },
});