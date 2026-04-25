import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';

export const ResetPasswordScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!isSubmitted ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                  Enter your email address and we'll send you a link to reset your password.
                </Text>
              </View>

              <View style={styles.form}>
                <Input 
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Button onPress={handleReset} isLoading={isLoading} fullWidth style={styles.marginTop}>
                  Send Reset Link
                </Button>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Remember your password? </Text>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successCheck}>✓</Text>
              </View>
              <Text style={styles.title}>Check your email</Text>
              <Text style={styles.subtitle}>
                We've sent a password reset link to your email address. 
                Please check your inbox (and spam folder).
              </Text>
              
              <Button variant="secondary" onPress={() => setIsSubmitted(false)} fullWidth style={styles.marginTop}>
                Try another email
              </Button>

              <TouchableOpacity style={styles.backToLogin}>
                <Text style={styles.link}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  marginTop: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  link: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successCheck: {
    color: theme.colors.success,
    fontSize: 32,
    fontWeight: '700',
  },
  backToLogin: {
    marginTop: 32,
  },
});
