import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

type ProgressIndicatorProps = {
  /** 0–100. Values outside this range are clamped. */
  progress: number;
  height?: number;
};

export function ProgressIndicator({ progress, height = 10 }: ProgressIndicatorProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, height, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },
});
