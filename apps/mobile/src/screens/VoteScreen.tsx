import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeStack } from '../components/SwipeStack';
import { theme } from '../theme';

const DUMMY_CARDS = [
  { id: '1', title: 'Rooftop Bar', description: 'Great city views and craft cocktails.' },
  { id: '2', title: 'Arcade City', description: 'Retro games and neon lights.' },
  { id: '3', title: 'Secret Garden', description: 'Hidden oasis with live jazz.' },
];

export const VoteScreen = () => {
  const [completed, setCompleted] = useState(false);

  const handleSwipe = (cardId: string, direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on ${cardId}`);
  };

  const handleAllSwiped = () => {
    setCompleted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>4 Active Friends</Text>
        </View>
        <Text style={styles.title}>Make Your Choice</Text>
        <Text style={styles.subtitle}>Swipe right if you're in, left if not.</Text>
      </View>

      {!completed ? (
        <View style={styles.stackWrapper}>
          <SwipeStack 
            cards={DUMMY_CARDS}
            onSwipe={handleSwipe}
            onAllSwiped={handleAllSwiped}
          />
        </View>
      ) : (
        <View style={styles.waitingState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.waitingTitle}>Waiting for Consensus...</Text>
          <Text style={styles.waitingSubtitle}>The rest of the group is still voting.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  stackWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  waitingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginTop: 24,
    marginBottom: 8,
  },
  waitingSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
