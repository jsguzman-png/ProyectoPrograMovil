// ============================================
// Componente reutilizable: CustomButton
// ============================================
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}: CustomButtonProps) {
  const buttonStyle: ViewStyle = disabled
    ? styles.disabled
    : variant === 'primary'
    ? styles.primary
    : variant === 'danger'
    ? styles.danger
    : styles.secondary;

  const textStyle: TextStyle =
    variant === 'secondary' && !disabled ? styles.secondaryText : styles.primaryText;

  return (
    <TouchableOpacity
      style={[styles.base, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={[styles.baseText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primary:   { backgroundColor: '#5B8CFF' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#5B8CFF' },
  danger:    { backgroundColor: '#FF5B5B' },
  disabled:  { backgroundColor: '#2a2a38' },
  baseText:     { fontSize: 15, fontWeight: '600' },
  primaryText:  { color: '#FFFFFF' },
  secondaryText:{ color: '#5B8CFF' },
});