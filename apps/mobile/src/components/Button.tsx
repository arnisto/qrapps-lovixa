import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { theme } from '../theme';

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  style,
}) => {
  const containerStyle = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    variant === 'outline' && styles.textOutline,
    variant === 'ghost' && styles.textGhost,
    size === 'small' && styles.textSmall,
  ];

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={isLoading || disabled}
      style={containerStyle}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'secondary' ? 'white' : theme.colors.primary} />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
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
  textSmall: {
    fontSize: 14,
  },
  textOutline: {
    color: theme.colors.text,
  },
  textGhost: {
    color: theme.colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
