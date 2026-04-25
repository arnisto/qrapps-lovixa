import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className,
  ].join(' ');

  return (
    <button className={buttonClasses} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <div className={styles.spinner} /> : children}
    </button>
  );
};
