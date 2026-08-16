import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

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
  const [targetAge, setTargetAge] = useState('');
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
    setTargetAge(profile.targetAge !== undefined ? String(profile.targetAge) : '');
  }, [profile]);

  if (status !== 'ready' || !profile) {
    return (
      <Screen>
        <SectionHeader title="Cài đặt" />
      </Screen>
    );
  }

  const parsedAge = toNumber(age);
  // Income/spending/return can legitimately be 0 (no income right now,
  // no spending tracked yet, 0% expected return) — an empty field means
  // "0", not "invalid". Only age and SWR must be explicitly filled in.
  const parsedIncome = toNumberOrZero(monthlyIncome);
  const parsedSpending = toNumberOrZero(monthlySpending);
  const parsedReturn = toNumberOrZero(expectedAnnualReturn);
  const parsedSwr = toNumber(safeWithdrawalRate);
  // Optional — leave blank to skip the "projected assets at age X" card.
  const parsedTargetAge = toNumber(targetAge);

  const isValid =
    parsedAge !== null &&
    parsedAge > 0 &&
    parsedIncome !== null &&
    parsedIncome >= 0 &&
    parsedSpending !== null &&
    parsedSpending >= 0 &&
    parsedReturn !== null &&
    parsedSwr !== null &&
    parsedSwr > 0 &&
    (targetAge.trim() === '' || (parsedTargetAge !== null && parsedTargetAge > 0));

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
        targetAge: parsedTargetAge ?? undefined,
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
        <FormField
          label="Tuổi mục tiêu (không bắt buộc)"
          value={targetAge}
          onChangeText={setTargetAge}
          keyboardType="number-pad"
          placeholder="vd: 35"
        />
      </Card>

      <Button
        label={saved ? 'Đã lưu' : 'Lưu thay đổi'}
        onPress={handleSave}
        disabled={!isValid}
        loading={saving}
      />
      {!isValid ? (
        <Text style={styles.error}>{describeError(parsedAge, parsedSwr, targetAge, parsedTargetAge)}</Text>
      ) : null}
      <Text style={styles.hint}>Đơn vị tiền tệ: {profile.currency}</Text>

      <Link href="/glossary" asChild>
        <Pressable>
          {({ pressed }) => (
            <Card style={[styles.linkCard, pressed && styles.linkCardPressed]}>
              <Text style={styles.linkLabel}>📖 Giải thích các thông số</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Card>
          )}
        </Pressable>
      </Link>
    </Screen>
  );
}

function toNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function toNumberOrZero(value: string): number | null {
  if (value.trim() === '') return 0;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function describeError(
  parsedAge: number | null,
  parsedSwr: number | null,
  targetAgeInput: string,
  parsedTargetAge: number | null,
): string {
  if (parsedAge === null || parsedAge <= 0) {
    return 'Tuổi hiện tại phải lớn hơn 0.';
  }
  if (parsedSwr === null || parsedSwr <= 0) {
    return 'Tỷ lệ rút an toàn (SWR) phải lớn hơn 0%.';
  }
  if (targetAgeInput.trim() !== '' && (parsedTargetAge === null || parsedTargetAge <= 0)) {
    return 'Tuổi mục tiêu không hợp lệ.';
  }
  return 'Vui lòng kiểm tra lại các trường bên trên.';
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
  error: {
    ...typography.caption,
    color: colors.warm,
    textAlign: 'center',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  linkCardPressed: {
    opacity: 0.7,
  },
  linkLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
