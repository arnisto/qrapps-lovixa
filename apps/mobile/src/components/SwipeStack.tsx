import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { theme } from '../theme';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

interface Card {
  id: string;
  title: string;
  description: string;
}

interface SwipeStackProps {
  cards: Card[];
  onSwipe: (cardId: string, direction: 'left' | 'right') => void;
  onAllSwiped: () => void;
}

export const SwipeStack: React.FC<SwipeStackProps> = ({ cards, onSwipe, onAllSwiped }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const currentCard = cards[currentIndex];

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    onSwipe(currentCard.id, direction);
    translateX.value = 0;
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onAllSwiped();
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width, {}, () => {
          runOnJS(handleSwipeComplete)('right');
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width, {}, () => {
          runOnJS(handleSwipeComplete)('left');
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` }
      ],
    };
  });

  const yesOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const noOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  if (!currentCard) return null;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.imagePlaceholder}>
            <Animated.View style={[styles.indicator, styles.yesIndicator, yesOpacity]}>
              <Text style={styles.indicatorText}>YES</Text>
            </Animated.View>
            <Animated.View style={[styles.indicator, styles.noIndicator, noOpacity]}>
              <Text style={styles.indicatorText}>NO</Text>
            </Animated.View>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{currentCard.title}</Text>
            <Text style={styles.description}>{currentCard.description}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 450,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.85,
    height: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  imagePlaceholder: {
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  indicator: {
    position: 'absolute',
    top: 40,
    borderWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  yesIndicator: {
    left: 20,
    borderColor: theme.colors.success,
    transform: [{ rotate: '-15deg' }],
  },
  noIndicator: {
    right: 20,
    borderColor: theme.colors.error,
    transform: [{ rotate: '15deg' }],
  },
  indicatorText: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
  },
});
