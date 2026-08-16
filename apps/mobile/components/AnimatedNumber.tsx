import { useEffect } from 'react';
import { TextInput, type StyleProp, type TextInputProps, type TextStyle } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type AnimatedNumberProps = {
  value: number;
  formatValue: (value: number) => string;
  style?: StyleProp<TextStyle>;
};

// Counts up from the previous value to the new one. Reserved for the one
// or two numbers that matter most on a screen (net worth, FI progress) —
// per prompt.md: "Do not animate every number on the screen."
export function AnimatedNumber({ value, formatValue, style }: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);
  const hasMounted = useSharedValue(false);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
    hasMounted.value = true;
  }, [value, animatedValue, hasMounted]);

  // `text` is a valid native prop for direct TextInput updates but isn't
  // part of React Native's TextInputProps typings — cast is intentional.
  const animatedProps = useAnimatedProps(
    () =>
      ({
        text: formatValue(animatedValue.value),
      }) as Partial<TextInputProps>,
  );

  return (
    <AnimatedTextInput
      style={style}
      editable={false}
      underlineColorAndroid="transparent"
      defaultValue={formatValue(0)}
      animatedProps={animatedProps}
    />
  );
}
