import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { AnimatedEntrance } from '@/components/AnimatedEntrance';
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
      <SectionHeader title="Lịch sử" />

      <AnimatedEntrance index={0}>
        <Card style={styles.recordCard}>
          <FinancialMetric label="Tài sản ròng hôm nay" value={formatCompactVND(summary.netWorth)} />
          <Button
            label={recording ? 'Đang lưu…' : 'Ghi lại số liệu'}
            onPress={handleRecord}
            loading={recording}
          />
        </Card>
      </AnimatedEntrance>

      {snapshots.length === 0 ? (
        <AnimatedEntrance index={1}>
          <Card>
            <Text style={styles.empty}>
              Chưa có số liệu nào. Ghi lại ở trên để bắt đầu theo dõi tiến độ theo thời gian.
            </Text>
          </Card>
        </AnimatedEntrance>
      ) : (
        <>
          <AnimatedEntrance index={1}>
            <Card>
              <Text style={styles.chartTitle}>Tài sản ròng</Text>
              {hasTrend ? (
                <MiniLineChart labels={labels} values={netWorthValues} formatValue={formatCompactVND} />
              ) : (
                <Text style={styles.empty}>Ghi thêm 1 lần nữa để thấy xu hướng.</Text>
              )}
            </Card>
          </AnimatedEntrance>

          <AnimatedEntrance index={2}>
            <Card>
              <Text style={styles.chartTitle}>Tiến độ Tự do Tài chính</Text>
              {hasTrend ? (
                <MiniLineChart
                  labels={labels}
                  values={fiProgressValues}
                  color={colors.success}
                  formatValue={(value) => formatPercent(value, 0)}
                />
              ) : (
                <Text style={styles.empty}>Ghi thêm 1 lần nữa để thấy xu hướng.</Text>
              )}
            </Card>
          </AnimatedEntrance>
        </>
      )}

      {allocation.length > 0 ? (
        <AnimatedEntrance index={3}>
          <Card>
            <Text style={styles.chartTitle}>Phân bổ tài sản</Text>
            <MiniPieChart slices={allocation} />
          </Card>
        </AnimatedEntrance>
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
