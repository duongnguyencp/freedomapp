import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { colors, radius } from '@/constants/theme';

type GlassSurfaceProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 'light' = frosted white (default), 'dark' = frosted ink (primary buttons). */
  tone?: 'light' | 'dark';
  intensity?: number;
  borderRadius?: number;
};

// Shared "glass" (frosted) surface: a real blur of whatever sits behind it,
// plus a translucent tint and a bright top-edge border to sell the glass
// read. Used for the tab bar, buttons and the what-if slider's track.
export function GlassSurface({
  children,
  style,
  tone = 'light',
  intensity = 40,
  borderRadius = radius.pill,
}: GlassSurfaceProps) {
  const fill = tone === 'dark' ? colors.glassInkFill : colors.glassFill;
  const border = tone === 'dark' ? colors.glassInkBorder : colors.glassBorder;

  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, style]}>
      <BlurView
        intensity={intensity}
        tint={tone === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: fill, borderWidth: 1, borderColor: border, borderRadius },
        ]}
      />
      {children}
    </View>
  );
}
