import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useWindowDimensions } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/theme';
import { formatPercent } from '@/services/format';

export type PieSlice = {
  name: string;
  value: number;
  color: string;
};

type MiniPieChartProps = {
  slices: PieSlice[];
  height?: number;
};

// react-native-chart-kit's own legend doesn't show percentages and isn't
// styleable, so we disable it and render our own — colored swatch + label
// + percent, never color alone (per the categorical-color rule).
export function MiniPieChart({ slices, height = 160 }: MiniPieChartProps) {
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - spacing.lg * 4;
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <View>
      <PieChart
        data={slices.map((slice) => ({
          name: slice.name,
          population: slice.value,
          color: slice.color,
          legendFontColor: colors.textSecondary,
          legendFontSize: 12,
        }))}
        width={chartWidth}
        height={height}
        chartConfig={{ color: () => colors.textPrimary }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        hasLegend={false}
      />
      <View style={styles.legend}>
        {slices.map((slice) => (
          <View key={slice.name} style={styles.legendRow}>
            <View style={[styles.swatch, { backgroundColor: slice.color }]} />
            <Text style={styles.legendLabel}>{slice.name}</Text>
            <Text style={styles.legendValue}>
              {total > 0 ? formatPercent((slice.value / total) * 100, 0) : '0%'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
  },
  legendLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
  legendValue: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
