import { type ReactNode } from 'react';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';

type AnimatedEntranceProps = {
  index?: number;
  children: ReactNode;
};

const STAGGER_DELAY_MS = 70;
const DURATION_MS = 420;

// opacity 0->1, translateY 12->0, small staggered delay per card — per
// prompt.md's "Card Entrance Animation". Deliberately subtle: no bounce,
// no cards flying across the screen.
export function AnimatedEntrance({ index = 0, children }: AnimatedEntranceProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(DURATION_MS)
        .delay(index * STAGGER_DELAY_MS)
        .easing(Easing.out(Easing.cubic))
        .withInitialValues({ opacity: 0, transform: [{ translateY: 12 }] })}
    >
      {children}
    </Animated.View>
  );
}
