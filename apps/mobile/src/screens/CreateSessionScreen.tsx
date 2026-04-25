import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';

interface CardDraft {
  title: string;
  description: string;
}

export const CreateSessionScreen = () => {
  const [sessionTitle, setSessionTitle] = useState('');
  const [cards, setCards] = useState<CardDraft[]>([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ]);
  const [isCreating, setIsCreating] = useState(false);

  const updateCard = (index: number, field: keyof CardDraft, value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => setIsCreating(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Live Session</Text>
            <Text style={styles.subtitle}>Define the vibe and select 3 cards.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Session Info</Text>
            <Input 
              label="What are we deciding?"
              placeholder="e.g., Saturday Night Vibe"
              value={sessionTitle}
              onChangeText={setSessionTitle}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Vibe Cards</Text>
            {cards.map((card, index) => (
              <View key={index} style={styles.cardForm}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardBadge}>Card {index + 1}</Text>
                </View>
                <Input 
                  placeholder="Venue or Activity Title"
                  value={card.title}
                  onChangeText={(val) => updateCard(index, 'title', val)}
                />
                <TextInput 
                  style={styles.textarea}
                  placeholder="Brief description (optional)"
                  placeholderTextColor={theme.colors.textMuted}
                  value={card.description}
                  onChangeText={(val) => updateCard(index, 'description', val)}
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>+ Add Image</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <Button onPress={handleCreate} isLoading={isCreating} fullWidth>
              Launch Live Session
            </Button>
            <Text style={styles.disclaimer}>
              A shareable link will be generated instantly.
            </Text>
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
  },
  header: {
    marginBottom: 32,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  cardForm: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardBadge: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  textarea: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    color: 'white',
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  actions: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  disclaimer: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 12,
  },
});
