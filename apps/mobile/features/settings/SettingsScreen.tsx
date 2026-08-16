import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useProfileStore } from '@/stores/profileStore';

// Settings only edits the assumptions the FI calculation depends on — see
// prompt.md section "12. NAVIGATION": "Settings: Financial assumptions".
export function SettingsScreen() {
  const status = useProfileStore((state) => state.status);
  const profile = useProfileStore((state) => state.profile);
  const load = useProfileStore((state) => state.load);
  const save = useProfileStore((state) => state.save);

  const [age, setAge] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlySpending, setMonthlySpending] = useState('');
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState('');
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      load();
    }
  }, [status, load]);

  useEffect(() => {
    if (!profile) return;
    setAge(String(profile.age));
    setMonthlyIncome(String(profile.monthlyIncome));
    setMonthlySpending(String(profile.monthlySpending));
    setExpectedAnnualReturn(String(profile.expectedAnnualReturn * 100));
    setSafeWithdrawalRate(String(profile.safeWithdrawalRate * 100));
  }, [profile]);

  if (status !== 'ready' || !profile) {
    return (
      <Screen>
        <SectionHeader title="Cài đặt" />
      </Screen>
    );
  }

  const parsedAge = toNumber(age);
  const parsedIncome = toNumber(monthlyIncome);
  const parsedSpending = toNumber(monthlySpending);
  const parsedReturn = toNumber(expectedAnnualReturn);
  const parsedSwr = toNumber(safeWithdrawalRate);

  const isValid =
    parsedAge !== null &&
    parsedAge > 0 &&
    parsedIncome !== null &&
    parsedIncome >= 0 &&
    parsedSpending !== null &&
    parsedSpending >= 0 &&
    parsedReturn !== null &&
    parsedSwr !== null &&
    parsedSwr > 0;

  async function handleSave() {
    if (!isValid || !profile) return;
    setSaving(true);
    try {
      await save({
        ...profile,
        age: parsedAge!,
        monthlyIncome: parsedIncome!,
        monthlySpending: parsedSpending!,
        expectedAnnualReturn: parsedReturn! / 100,
        safeWithdrawalRate: parsedSwr! / 100,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <SectionHeader title="Cài đặt" subtitle="Giả định tài chính" />

      <Card style={styles.card}>
        <FormField label="Tuổi hiện tại" value={age} onChangeText={setAge} keyboardType="number-pad" />
        <FormField
          label="Thu nhập hàng tháng"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
          keyboardType="numeric"
          suffix="VND"
        />
        <FormField
          label="Chi tiêu hàng tháng"
          value={monthlySpending}
          onChangeText={setMonthlySpending}
          keyboardType="numeric"
          suffix="VND"
        />
        <FormField
          label="Lợi nhuận đầu tư kỳ vọng/năm"
          value={expectedAnnualReturn}
          onChangeText={setExpectedAnnualReturn}
          keyboardType="numeric"
          suffix="%"
        />
        <FormField
          label="Tỷ lệ rút an toàn (SWR)"
          value={safeWithdrawalRate}
          onChangeText={setSafeWithdrawalRate}
          keyboardType="numeric"
          suffix="%"
        />
      </Card>

      <Button
        label={saved ? 'Đã lưu' : 'Lưu thay đổi'}
        onPress={handleSave}
        disabled={!isValid}
        loading={saving}
      />
      <Text style={styles.hint}>Đơn vị tiền tệ: {profile.currency}</Text>
    </Screen>
  );
}

function toNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
