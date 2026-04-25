import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { theme } from '../theme';

export const VictoryScreen = () => {
  const winner = {
    title: 'Secret Garden',
    description: 'Hidden oasis with live jazz.',
    percentage: 75,
    totalVotes: 4
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>MATCH FOUND 🎉</Text>
          </View>
          <Text style={styles.title}>It's a Vibe!</Text>
          <Text style={styles.subtitle}>The group has spoken. Here's your choice:</Text>
        </View>

        <View style={styles.winnerCard}>
          <View style={styles.imagePlaceholder}>
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageText}>{winner.percentage}% Match</Text>
            </View>
          </View>
          <View style={styles.winnerContent}>
            <Text style={styles.winnerTitle}>{winner.title}</Text>
            <Text style={styles.winnerDescription}>{winner.description}</Text>
          </View>
        </View>

        <Text style={styles.stats}>{winner.totalVotes} friends voted in this session</Text>

        <View style={styles.actions}>
          <Button onPress={() => {}} fullWidth>Let's Go!</Button>
          <Button variant="secondary" onPress={() => {}} fullWidth style={styles.marginTop}>
            Share Location
          </Button>
          <Button variant="ghost" onPress={() => {}} fullWidth style={styles.marginTop}>
            Start New Session
          </Button>
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
  scrollContent: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  matchBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  matchBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  winnerCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: theme.colors.primary,
  },
  percentageBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  percentageText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  winnerContent: {
    padding: 20,
  },
  winnerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  winnerDescription: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  stats: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
  },
  marginTop: {
    marginTop: 12,
  },
});
