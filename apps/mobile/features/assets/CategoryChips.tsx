import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/theme';

type Category = { value: string; label: string };

type CategoryChipsProps = {
  categories: Category[];
  selected: string;
  onSelect: (value: string) => void;
};

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {categories.map((category) => {
        const isSelected = category.value === selected;
        return (
          <Pressable
            key={category.value}
            onPress={() => onSelect(category.value)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.accent,
  },
  chipLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
