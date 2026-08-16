import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormField } from '@/components/FormField';
import { spacing } from '@/constants/theme';

import { CategoryChips } from './CategoryChips';

type Category = { value: string; label: string };

export type EntryFormValues = {
  name: string;
  category: string;
  value: number;
};

type EntryFormProps = {
  categories: Category[];
  initialName?: string;
  initialCategory?: string;
  initialValue?: number;
  onSave: (values: EntryFormValues) => void;
  onDelete?: () => void;
  onCancel: () => void;
};

// Shared inline add/edit form for both assets and liabilities — same
// shape (name, category, value), different category list.
export function EntryForm({
  categories,
  initialName = '',
  initialCategory,
  initialValue,
  onSave,
  onDelete,
  onCancel,
}: EntryFormProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory ?? categories[0]?.value ?? '');
  const [value, setValue] = useState(initialValue !== undefined ? String(initialValue) : '');

  const parsedValue = Number(value.replace(',', '.'));
  const isValid = name.trim().length > 0 && Number.isFinite(parsedValue) && parsedValue >= 0;

  function handleSave() {
    if (!isValid) {
      return;
    }
    onSave({ name: name.trim(), category, value: parsedValue });
  }

  return (
    <Card style={styles.card}>
      <FormField label="Tên" value={name} onChangeText={setName} placeholder="vd: Vietcombank" />
      <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      <FormField
        label="Giá trị"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        placeholder="0"
        suffix="VND"
      />
      <View style={styles.actions}>
        {onDelete ? (
          <View style={styles.actionFlex}>
            <Button label="Xoá" variant="danger" onPress={onDelete} />
          </View>
        ) : null}
        <View style={styles.actionFlex}>
          <Button label="Huỷ" variant="secondary" onPress={onCancel} />
        </View>
        <View style={styles.actionFlex}>
          <Button label="Lưu" onPress={handleSave} disabled={!isValid} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionFlex: {
    flex: 1,
  },
});
