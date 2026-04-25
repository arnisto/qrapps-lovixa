import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  style,
}) => {
  const isPrimary = variant === 'primary';

  const containerStyle = [
    styles.button,
    variant !== 'primary' && styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const content = isLoading ? (
    <ActivityIndicator color={isPrimary ? 'white' : theme.colors.text} />
  ) : (
    <Text style={[styles.text, variant === 'ghost' && styles.textGhost]}>
      {children}
    </Text>
  );

  if (isPrimary && !disabled) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isLoading || disabled}
        style={[fullWidth && styles.fullWidth]}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={containerStyle}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={isLoading || disabled}
      style={containerStyle}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  textGhost: {
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.surface,
  },
});
