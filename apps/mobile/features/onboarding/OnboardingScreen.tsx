import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useAssetsStore } from '@/stores/assetsStore';
import { useLiabilitiesStore } from '@/stores/liabilitiesStore';
import { useProfileStore } from '@/stores/profileStore';
import { generateId } from '@/services/id';

// Ask only what the FI calculation needs — nothing else. See prompt.md
// section "1. ONBOARDING".
export function OnboardingScreen() {
  const router = useRouter();
  const saveProfile = useProfileStore((state) => state.save);
  const addAsset = useAssetsStore((state) => state.add);
  const addLiability = useLiabilitiesStore((state) => state.add);

  const [age, setAge] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlySpending, setMonthlySpending] = useState('');
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState('7');
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState('4');
  const [targetAge, setTargetAge] = useState('');
  const [saving, setSaving] = useState(false);

  const parsed = useMemo(
    () => ({
      // Age and SWR must be explicitly filled in. Everything else can
      // reasonably be 0 — an empty field means "0", not "invalid".
      age: toNumber(age),
      monthlyIncome: toNumberOrZero(monthlyIncome),
      monthlySpending: toNumberOrZero(monthlySpending),
      currentAssets: toNumberOrZero(currentAssets),
      currentLiabilities: toNumberOrZero(currentLiabilities),
      expectedAnnualReturn: toNumberOrZero(expectedAnnualReturn),
      safeWithdrawalRate: toNumber(safeWithdrawalRate),
      // Optional — leave blank to skip the "projected assets at age X" card.
      targetAge: toNumber(targetAge),
    }),
    [
      age,
      monthlyIncome,
      monthlySpending,
      currentAssets,
      currentLiabilities,
      expectedAnnualReturn,
      safeWithdrawalRate,
      targetAge,
    ],
  );

  const isValid =
    parsed.age !== null &&
    parsed.age > 0 &&
    parsed.monthlyIncome !== null &&
    parsed.monthlyIncome >= 0 &&
    parsed.monthlySpending !== null &&
    parsed.monthlySpending >= 0 &&
    parsed.currentAssets !== null &&
    parsed.currentAssets >= 0 &&
    parsed.currentLiabilities !== null &&
    parsed.currentLiabilities >= 0 &&
    parsed.expectedAnnualReturn !== null &&
    parsed.safeWithdrawalRate !== null &&
    parsed.safeWithdrawalRate > 0 &&
    (targetAge.trim() === '' || (parsed.targetAge !== null && parsed.targetAge > 0));

  async function handleContinue() {
    if (!isValid || saving) {
      return;
    }
    setSaving(true);
    try {
      await saveProfile({
        id: generateId(),
        age: parsed.age!,
        monthlyIncome: parsed.monthlyIncome!,
        monthlySpending: parsed.monthlySpending!,
        expectedAnnualReturn: parsed.expectedAnnualReturn! / 100,
        safeWithdrawalRate: parsed.safeWithdrawalRate! / 100,
        currency: 'VND',
        targetAge: parsed.targetAge ?? undefined,
      });

      if (parsed.currentAssets! > 0) {
        await addAsset({
          name: 'Tài sản ban đầu',
          category: 'other',
          value: parsed.currentAssets!,
        });
      }
      if (parsed.currentLiabilities! > 0) {
        await addLiability({
          name: 'Nợ ban đầu',
          category: 'other',
          value: parsed.currentLiabilities!,
        });
      }

      router.replace('/(tabs)');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <SectionHeader
        title="Thiết lập kế hoạch của bạn"
        subtitle="Chỉ vài con số, sau đó bạn đã sẵn sàng. Bạn có thể sửa lại sau."
      />

      <Card style={styles.card}>
        <FormField
          label="Tuổi hiện tại"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="30"
        />
        <FormField
          label="Thu nhập hàng tháng"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
          keyboardType="numeric"
          placeholder="0"
          suffix="VND"
        />
        <FormField
          label="Chi tiêu hàng tháng"
          value={monthlySpending}
          onChangeText={setMonthlySpending}
          keyboardType="numeric"
          placeholder="0"
          suffix="VND"
        />
        <FormField
          label="Tài sản hiện có"
          value={currentAssets}
          onChangeText={setCurrentAssets}
          keyboardType="numeric"
          placeholder="0"
          suffix="VND"
        />
        <FormField
          label="Nợ hiện có"
          value={currentLiabilities}
          onChangeText={setCurrentLiabilities}
          keyboardType="numeric"
          placeholder="0"
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

      <View style={styles.footer}>
        <Button label="Tiếp tục" onPress={handleContinue} disabled={!isValid} loading={saving} />
        {!isValid ? (
          <Text style={styles.error}>
            {describeError(parsed.age, parsed.safeWithdrawalRate, targetAge, parsed.targetAge)}
          </Text>
        ) : null}
        <Text style={styles.hint}>Đơn vị tiền tệ hiện đang là VND.</Text>
      </View>
    </Screen>
  );
}

function toNumber(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function toNumberOrZero(value: string): number | null {
  if (value.trim() === '') {
    return 0;
  }
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function describeError(
  age: number | null,
  swr: number | null,
  targetAgeInput: string,
  parsedTargetAge: number | null,
): string {
  if (age === null || age <= 0) {
    return 'Tuổi hiện tại phải lớn hơn 0.';
  }
  if (swr === null || swr <= 0) {
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
  footer: {
    gap: spacing.sm,
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
});
