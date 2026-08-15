import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FinancialMetric } from '@/components/FinancialMetric';
import { MiniLineChart } from '@/components/MiniLineChart';
import { MiniPieChart } from '@/components/MiniPieChart';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { buildAssetAllocation } from '@/features/assets/categories';
import { colors, spacing, typography } from '@/constants/theme';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { formatCompactVND, formatPercent } from '@/services/format';
import { monthLabel, todayISODate } from '@/services/date';
import { useSnapshotsStore } from '@/stores/snapshotsStore';

const MIN_POINTS_FOR_TREND = 2;

export function HistoryScreen() {
  const { status: summaryStatus, summary, assets } = useFinancialSummary();

  const snapshotsStatus = useSnapshotsStore((state) => state.status);
  const snapshots = useSnapshotsStore((state) => state.snapshots);
  const loadSnapshots = useSnapshotsStore((state) => state.load);
  const record = useSnapshotsStore((state) => state.record);

  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (snapshotsStatus === 'idle') {
      loadSnapshots();
    }
  }, [snapshotsStatus, loadSnapshots]);

  const isReady = summaryStatus === 'ready' && snapshotsStatus === 'ready';

  if (!isReady || !summary) {
    return (
      <Screen contentContainerStyle={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  async function handleRecord() {
    if (!summary || recording) return;
    setRecording(true);
    try {
      await record({ date: todayISODate(), ...summary });
    } finally {
      setRecording(false);
    }
  }

  const hasTrend = snapshots.length >= MIN_POINTS_FOR_TREND;
  const labels = snapshots.map((snapshot) => monthLabel(snapshot.date));
  const netWorthValues = snapshots.map((snapshot) => snapshot.netWorth);
  const fiProgressValues = snapshots.map((snapshot) => snapshot.fiProgress);
  const allocation = buildAssetAllocation(assets);

  return (
    <Screen>
      <SectionHeader title="History" />

      <Card style={styles.recordCard}>
        <FinancialMetric label="Today's net worth" value={formatCompactVND(summary.netWorth)} />
        <Button
          label={recording ? 'Recording…' : 'Record snapshot'}
          onPress={handleRecord}
          loading={recording}
        />
      </Card>

      {snapshots.length === 0 ? (
        <Card>
          <Text style={styles.empty}>
            No snapshots yet. Record one above to start tracking your progress over time.
          </Text>
        </Card>
      ) : (
        <>
          <Card>
            <Text style={styles.chartTitle}>Net worth</Text>
            {hasTrend ? (
              <MiniLineChart labels={labels} values={netWorthValues} formatValue={formatCompactVND} />
            ) : (
              <Text style={styles.empty}>Record one more snapshot to see a trend.</Text>
            )}
          </Card>

          <Card>
            <Text style={styles.chartTitle}>Financial Independence Progress</Text>
            {hasTrend ? (
              <MiniLineChart
                labels={labels}
                values={fiProgressValues}
                color={colors.success}
                formatValue={(value) => formatPercent(value, 0)}
              />
            ) : (
              <Text style={styles.empty}>Record one more snapshot to see a trend.</Text>
            )}
          </Card>
        </>
      )}

      {allocation.length > 0 ? (
        <Card>
          <Text style={styles.chartTitle}>Asset allocation</Text>
          <MiniPieChart slices={allocation} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordCard: {
    gap: spacing.md,
  },
  chartTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
  },
});
