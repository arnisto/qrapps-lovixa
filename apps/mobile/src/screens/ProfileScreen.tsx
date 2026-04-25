import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.logo}>Lovixa</Text>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarTextMini}>JD</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Settings</Text>
          <Text style={styles.subtitle}>Manage your personal information and preferences.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.profileHero}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarTextLarge}>JD</Text>
            </View>
            <View style={styles.heroActions}>
              <Button onPress={() => {}} style={styles.smallButton}>Change Avatar</Button>
              <Button variant="ghost" onPress={() => {}} style={styles.smallButton}>Remove</Button>
            </div>
          </View>

          <Input label="Full Name" defaultValue="John Doe" />
          <Input label="Email Address" defaultValue="john@example.com" editable={false} />
          <Input 
            label="Bio" 
            placeholder="Tell your group a bit about yourself..."
            defaultValue="I'm always down for a good rooftop bar or a cozy coffee spot."
            multiline
            numberOfLines={3}
          />

          <View style={styles.actions}>
            <Button onPress={() => {}} fullWidth>Save Changes</Button>
            <Button variant="outline" onPress={() => {}} fullWidth style={styles.marginTop}>Discard</Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <View style={styles.securityRow}>
            <View>
              <Text style={styles.securityLabel}>Password</Text>
              <Text style={styles.securityValue}>Last changed 3 months ago</Text>
            </View>
            <Button variant="secondary" onPress={() => {}} style={styles.miniBtn}>Change</Button>
          </View>
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Text style={styles.dangerText}>Once you delete your account, there is no going back.</Text>
          <Button variant="outline" onPress={() => {}} fullWidth style={styles.deleteBtn}>Delete Account</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  avatarMini: {
    width: 36,
    height: 36,
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextMini: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileHero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarTextLarge: {
    color: 'white',
    fontSize: 40,
    fontWeight: '800',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actions: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  marginTop: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  securityLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  securityValue: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  miniBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dangerZone: {
    marginTop: 40,
    padding: 24,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    marginBottom: 40,
  },
  dangerTitle: {
    color: theme.colors.error,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  dangerText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: 24,
  },
  deleteBtn: {
    borderColor: theme.colors.error,
  },
});
