import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { formatVND } from '@/services/format';
import { chiToVND, fetchGoldPrice, type GoldPrice } from '@/services/goldPrice';

type Status = 'idle' | 'loading' | 'error';

type GoldPriceHelperProps = {
  /** Called with the computed VND value when the user applies it to the form. */
  onApply: (vndValue: number) => void;
};

// Opt-in helper shown only for Gold assets: fetch today's SJC price and
// compute VND from "số chỉ" instead of requiring the user to know/type
// the raw VND value themselves. Network is never required — on failure
// this just shows an error and the regular VND field above still works.
export function GoldPriceHelper({ onApply }: GoldPriceHelperProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [price, setPrice] = useState<GoldPrice | null>(null);
  const [chi, setChi] = useState('');

  async function handleFetch() {
    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await fetchGoldPrice();
      setPrice(result);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setPrice(null);
      setErrorMessage(error instanceof Error ? error.message : 'Không lấy được giá vàng.');
    }
  }

  const parsedChi = Number(chi.replace(',', '.'));
  const suggestedValue =
    price && Number.isFinite(parsedChi) && parsedChi > 0
      ? Math.round(chiToVND(parsedChi, price.sellPerLuong))
      : null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Tính theo giá vàng {price ? price.name : 'SJC'} hôm nay (không bắt buộc)</Text>

      {price ? (
        <Text style={styles.caption}>Giá bán: {formatVND(price.sellPerLuong)}/lượng</Text>
      ) : (
        <Button
          label={status === 'loading' ? 'Đang lấy giá…' : 'Lấy giá vàng hôm nay'}
          variant="secondary"
          onPress={handleFetch}
          loading={status === 'loading'}
        />
      )}

      {status === 'error' ? (
        <Text style={styles.error}>{errorMessage} Bạn vẫn có thể nhập tay giá trị VNĐ ở trên.</Text>
      ) : null}

      {price ? (
        <>
          <FormField
            label="Số chỉ vàng"
            value={chi}
            onChangeText={setChi}
            keyboardType="numeric"
            placeholder="0"
          />
          {suggestedValue !== null ? (
            <Button
              label={`Áp dụng ${formatVND(suggestedValue)}`}
              variant="secondary"
              onPress={() => onApply(suggestedValue)}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.warmSoft,
    borderRadius: radius.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  error: {
    ...typography.caption,
    color: colors.warm,
  },
});
