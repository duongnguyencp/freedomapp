import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';
import { formatVND } from '@/services/format';

type EntryListItemProps = {
  name: string;
  categoryLabel: string;
  value: number;
  onPress: () => void;
};

export function EntryListItem({ name, categoryLabel, value, onPress }: EntryListItemProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{categoryLabel}</Text>
      </View>
      <Text style={styles.value}>{formatVND(value)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  left: {
    flex: 1,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
  },
  category: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  value: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
