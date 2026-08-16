import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

type CardProps = ViewProps & {
  /** Soft violet wash instead of a plain white surface — reserve for one hero moment per screen. */
  tinted?: boolean;
};

export function Card({ style, tinted, ...rest }: CardProps) {
  return <View style={[styles.card, tinted && styles.tinted, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tinted: {
    backgroundColor: colors.surfaceTinted,
    borderColor: colors.surfaceTinted,
  },
});
