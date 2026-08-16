import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, radius, spacing, typography } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  loading,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      scale.value = withTiming(0.97, { duration: 100 });
      onPressIn?.(event);
    },
    [scale, onPressIn],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      scale.value = withTiming(1, { duration: 150 });
      onPressOut?.(event);
    },
    [scale, onPressOut],
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onPress?.(event);
    },
    [onPress],
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...rest}
    >
      <Animated.View
        style={[styles.base, variantStyles[variant], isDisabled && styles.disabled, animatedStyle]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'secondary' ? colors.ink : '#FFFFFF'} />
        ) : (
          <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  labelSecondary: {
    color: colors.ink,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.ink,
  },
  secondary: {
    backgroundColor: colors.accentSoft,
  },
  danger: {
    backgroundColor: '#DC2626',
  },
});
