import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  calculateNetWorth,
  calculateTotalAssets,
  calculateTotalLiabilities,
  type AssetCategory,
  type LiabilityCategory,
} from 'financial-engine';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { formatCompactVND } from '@/services/format';
import { useAssetsStore } from '@/stores/assetsStore';
import { useLiabilitiesStore } from '@/stores/liabilitiesStore';

import { ASSET_CATEGORIES, LIABILITY_CATEGORIES, categoryLabel } from './categories';
import { EntryForm, type EntryFormValues } from './EntryForm';
import { EntryListItem } from './EntryListItem';

type Editing = { kind: 'asset' | 'liability'; id: string | null } | null;

export function AssetsScreen() {
  const assetsStatus = useAssetsStore((state) => state.status);
  const assets = useAssetsStore((state) => state.assets);
  const loadAssets = useAssetsStore((state) => state.load);
  const addAsset = useAssetsStore((state) => state.add);
  const updateAsset = useAssetsStore((state) => state.update);
  const removeAsset = useAssetsStore((state) => state.remove);

  const liabilitiesStatus = useLiabilitiesStore((state) => state.status);
  const liabilities = useLiabilitiesStore((state) => state.liabilities);
  const loadLiabilities = useLiabilitiesStore((state) => state.load);
  const addLiability = useLiabilitiesStore((state) => state.add);
  const updateLiability = useLiabilitiesStore((state) => state.update);
  const removeLiability = useLiabilitiesStore((state) => state.remove);

  const [editing, setEditing] = useState<Editing>(null);

  useEffect(() => {
    if (assetsStatus === 'idle') loadAssets();
    if (liabilitiesStatus === 'idle') loadLiabilities();
  }, [assetsStatus, liabilitiesStatus, loadAssets, loadLiabilities]);

  const totalAssets = calculateTotalAssets(assets);
  const totalLiabilities = calculateTotalLiabilities(liabilities);
  const netWorth = calculateNetWorth(totalAssets, totalLiabilities);

  async function handleSaveAsset(values: EntryFormValues) {
    const input = { ...values, category: values.category as AssetCategory };
    if (editing?.id) {
      await updateAsset(editing.id, input);
    } else {
      await addAsset(input);
    }
    setEditing(null);
  }

  async function handleSaveLiability(values: EntryFormValues) {
    const input = { ...values, category: values.category as LiabilityCategory };
    if (editing?.id) {
      await updateLiability(editing.id, input);
    } else {
      await addLiability(input);
    }
    setEditing(null);
  }

  const editingAsset = editing?.kind === 'asset' && editing.id
    ? assets.find((asset) => asset.id === editing.id)
    : undefined;
  const editingLiability = editing?.kind === 'liability' && editing.id
    ? liabilities.find((liability) => liability.id === editing.id)
    : undefined;

  return (
    <Screen>
      <SectionHeader title="Assets & Liabilities" />

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <SummaryItem label="Assets" value={formatCompactVND(totalAssets)} />
          <SummaryItem label="Liabilities" value={formatCompactVND(totalLiabilities)} />
          <SummaryItem label="Net worth" value={formatCompactVND(netWorth)} emphasize />
        </View>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Assets</Text>
          {editing?.kind !== 'asset' ? (
            <Button
              label="+ Add asset"
              variant="secondary"
              onPress={() => setEditing({ kind: 'asset', id: null })}
            />
          ) : null}
        </View>

        {editing?.kind === 'asset' ? (
          <EntryForm
            categories={ASSET_CATEGORIES}
            initialName={editingAsset?.name}
            initialCategory={editingAsset?.category}
            initialValue={editingAsset?.value}
            onSave={handleSaveAsset}
            onCancel={() => setEditing(null)}
            onDelete={
              editing.id
                ? async () => {
                    await removeAsset(editing.id!);
                    setEditing(null);
                  }
                : undefined
            }
          />
        ) : (
          <Card>
            {assets.length === 0 ? (
              <Text style={styles.empty}>No assets yet. Add your first one above.</Text>
            ) : (
              assets.map((asset) => (
                <EntryListItem
                  key={asset.id}
                  name={asset.name}
                  categoryLabel={categoryLabel(ASSET_CATEGORIES, asset.category)}
                  value={asset.value}
                  onPress={() => setEditing({ kind: 'asset', id: asset.id })}
                />
              ))
            )}
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Liabilities</Text>
          {editing?.kind !== 'liability' ? (
            <Button
              label="+ Add liability"
              variant="secondary"
              onPress={() => setEditing({ kind: 'liability', id: null })}
            />
          ) : null}
        </View>

        {editing?.kind === 'liability' ? (
          <EntryForm
            categories={LIABILITY_CATEGORIES}
            initialName={editingLiability?.name}
            initialCategory={editingLiability?.category}
            initialValue={editingLiability?.value}
            onSave={handleSaveLiability}
            onCancel={() => setEditing(null)}
            onDelete={
              editing.id
                ? async () => {
                    await removeLiability(editing.id!);
                    setEditing(null);
                  }
                : undefined
            }
          />
        ) : (
          <Card>
            {liabilities.length === 0 ? (
              <Text style={styles.empty}>No liabilities. Nice.</Text>
            ) : (
              liabilities.map((liability) => (
                <EntryListItem
                  key={liability.id}
                  name={liability.name}
                  categoryLabel={categoryLabel(LIABILITY_CATEGORIES, liability.category)}
                  value={liability.value}
                  onPress={() => setEditing({ kind: 'liability', id: liability.id })}
                />
              ))
            )}
          </Card>
        )}
      </View>
    </Screen>
  );
}

function SummaryItem({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, emphasize && styles.summaryValueEmphasis]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  summaryValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  summaryValueEmphasis: {
    color: colors.accent,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 18,
    color: colors.textPrimary,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
  },
});
