import { View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { colors, spacing } from '@/constants/theme';

type MiniLineChartProps = {
  labels: string[];
  values: number[];
  color?: string;
  height?: number;
  /** Formats each y-value for the segment labels, e.g. "28%" or "₫1.7B". */
  formatValue?: (value: number) => string;
};

// Wraps react-native-chart-kit with the app's theme. One shared component
// so Home ("Your progress") and History (net worth / FI progress) render
// identically. Single-series line — no legend needed (the card title
// already names it).
export function MiniLineChart({
  labels,
  values,
  color = colors.accent,
  height = 180,
  formatValue,
}: MiniLineChartProps) {
  const { width: windowWidth } = useWindowDimensions();
  // Screen padding (spacing.lg each side) + Card padding (spacing.lg each side).
  const chartWidth = windowWidth - spacing.lg * 4;

  return (
    <View>
      <LineChart
        data={{ labels, datasets: [{ data: values }] }}
        width={chartWidth}
        height={height}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={labels.length <= 6}
        withHorizontalLabels={false}
        withShadow={false}
        withDots={values.length <= 12}
        bezier
        formatYLabel={formatValue ? (value) => formatValue(Number(value)) : undefined}
        chartConfig={{
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => hexToRgba(color, opacity),
          labelColor: () => colors.textMuted,
          propsForDots: { r: '3', strokeWidth: '0' },
          propsForBackgroundLines: { stroke: colors.border },
        }}
        style={{ borderRadius: 0, marginLeft: -spacing.lg }}
      />
    </View>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const parsed = hex.replace('#', '');
  const r = parseInt(parsed.substring(0, 2), 16);
  const g = parseInt(parsed.substring(2, 4), 16);
  const b = parseInt(parsed.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
