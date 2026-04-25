import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { theme } from './src/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'reset' | 'profile'>('login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <LoginScreen />;
      case 'signup': return <SignupScreen />;
      case 'reset': return <ResetPasswordScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <LoginScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {renderScreen()}
        
        {/* Simple Navigation Switcher for Demo */}
        <SafeAreaView style={styles.navBar}>
          <TouchableOpacity onPress={() => setCurrentScreen('login')} style={styles.navItem}>
            <Text style={[styles.navText, currentScreen === 'login' && styles.active]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('signup')} style={styles.navItem}>
            <Text style={[styles.navText, currentScreen === 'signup' && styles.active]}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('reset')} style={styles.navItem}>
            <Text style={[styles.navText, currentScreen === 'reset' && styles.active]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('profile')} style={styles.navItem}>
            <Text style={[styles.navText, currentScreen === 'profile' && styles.active]}>Profile</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  navText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  active: {
    color: theme.colors.primary,
  }
});
