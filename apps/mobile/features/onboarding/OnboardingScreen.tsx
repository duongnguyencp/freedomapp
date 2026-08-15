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
  const [saving, setSaving] = useState(false);

  const parsed = useMemo(
    () => ({
      age: toNumber(age),
      monthlyIncome: toNumber(monthlyIncome),
      monthlySpending: toNumber(monthlySpending),
      currentAssets: toNumber(currentAssets),
      currentLiabilities: toNumber(currentLiabilities),
      expectedAnnualReturn: toNumber(expectedAnnualReturn),
      safeWithdrawalRate: toNumber(safeWithdrawalRate),
    }),
    [
      age,
      monthlyIncome,
      monthlySpending,
      currentAssets,
      currentLiabilities,
      expectedAnnualReturn,
      safeWithdrawalRate,
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
    parsed.safeWithdrawalRate > 0;

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
      });

      if (parsed.currentAssets! > 0) {
        await addAsset({
          name: 'Starting assets',
          category: 'other',
          value: parsed.currentAssets!,
        });
      }
      if (parsed.currentLiabilities! > 0) {
        await addLiability({
          name: 'Starting liabilities',
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
        title="Let's set up your plan"
        subtitle="A few numbers, then you're in. You can change all of this later."
      />

      <Card style={styles.card}>
        <FormField
          label="Current age"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="30"
        />
        <FormField
          label="Monthly income"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
          keyboardType="numeric"
          placeholder="0"
          suffix="VND"
        />
        <FormField
          label="Monthly spending"
          value={monthlySpending}
          onChangeText={setMonthlySpending}
          keyboardType="numeric"
          placeholder="0"
          suffix="VND"
        />
        <FormField
          label="Current assets"
          value={currentAssets}
          onChangeText={setCurrentAssets}
          keyboardType="numeric"
          placeholder="0"
          suffix="VND"
        />
        <FormField
          label="Current liabilities"
          value={currentLiabilities}
          onChangeText={setCurrentLiabilities}
          keyboardType="numeric"
          placeholder="0"
          suffix="VND"
        />
        <FormField
          label="Expected annual return"
          value={expectedAnnualReturn}
          onChangeText={setExpectedAnnualReturn}
          keyboardType="numeric"
          suffix="%"
        />
        <FormField
          label="Safe withdrawal rate"
          value={safeWithdrawalRate}
          onChangeText={setSafeWithdrawalRate}
          keyboardType="numeric"
          suffix="%"
        />
      </Card>

      <View style={styles.footer}>
        <Button label="Continue" onPress={handleContinue} disabled={!isValid} loading={saving} />
        <Text style={styles.hint}>Currency is set to VND for now.</Text>
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
});
