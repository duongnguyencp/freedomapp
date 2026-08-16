import { ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

type ScreenProps = ScrollViewProps & {
  /**
   * Which edges to inset for the device safe area. Defaults to top only
   * (tab bar already insets the bottom). Pass [] for screens that already
   * have a native header handling the top inset (e.g. a pushed Stack
   * screen with headerShown: true).
   */
  edges?: Edge[];
};

export function Screen({ contentContainerStyle, children, edges = ['top'], ...rest }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
});
