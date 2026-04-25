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

export const SignupScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
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
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Lovixa and start making group decisions without the fatigue.
            </Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="Full Name"
              placeholder="John Doe"
            />
            <Input 
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input 
              label="Password"
              placeholder="••••••••"
              secureTextEntry
            />

            <Button onPress={handleSignup} isLoading={isLoading} fullWidth style={styles.marginTop}>
              Get Started
            </Button>
          </View>

          <Text style={styles.terms}>
            By signing up, you agree to our <Text style={styles.linkInline}>Terms</Text> and <Text style={styles.linkInline}>Privacy Policy</Text>.
          </Text>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or join with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialGaps}>
            <Button variant="secondary" onPress={() => {}} fullWidth>
              Google
            </Button>
            <Button variant="secondary" onPress={() => {}} fullWidth style={styles.marginTopSmall}>
              Apple
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
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
  marginTopSmall: {
    marginTop: 12,
  },
  terms: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  linkInline: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textMuted,
    paddingHorizontal: 16,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialGaps: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
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
});
