import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography } from '@/constants/theme';

type Entry = {
  term: string;
  definition: string;
  formula?: string;
};

type Section = {
  title: string;
  entries: Entry[];
};

// Plain-language explanations matched to this app's actual formulas —
// not generic FIRE definitions copy-pasted from elsewhere. Update this
// alongside financial-engine if a formula's assumptions ever change.
const SECTIONS: Section[] = [
  {
    title: 'Hồ sơ tài chính',
    entries: [
      {
        term: 'Lợi nhuận đầu tư kỳ vọng/năm (danh nghĩa)',
        definition:
          'Mức tăng trưởng trung bình mỗi năm bạn kỳ vọng từ khoản đầu tư của mình (ví dụ chứng khoán, quỹ...) — con số "trên giấy tờ", CHƯA trừ lạm phát. App dùng số này để tính tăng trưởng tài sản theo tháng, chưa tính thuế.',
      },
      {
        term: 'Lạm phát dự kiến/năm',
        definition:
          'Mức giá cả tăng trung bình mỗi năm — làm giảm sức mua thực của tiền theo thời gian. Có thể tự nhập hoặc bấm "Lấy lạm phát VN mới nhất" để lấy số liệu CPI thật từ World Bank. Mặc định 3%/năm nếu để trống.',
      },
      {
        term: 'Lợi suất thực',
        definition:
          'Lợi nhuận đầu tư sau khi đã trừ đi lạm phát — phản ánh đúng sức mua thực sự tăng thêm bao nhiêu, không phải chỉ số tiền tăng thêm bao nhiêu. Đây là số dùng để tính Coast FIRE (vì FI Number đã tính theo sức mua hiện tại).',
        formula: 'Lợi suất thực = (1 + Lợi suất danh nghĩa) ÷ (1 + Lạm phát) − 1',
      },
      {
        term: 'Tỷ lệ rút an toàn (SWR)',
        definition:
          'Phần trăm tài sản bạn có thể rút ra mỗi năm sau khi đạt tự do tài chính mà (về lý thuyết) không bao giờ cạn tiền. Mức phổ biến nhất là 4% ("quy tắc 4%"), dựa trên dữ liệu thị trường Mỹ với thời gian nghỉ hưu ~30 năm. Nghỉ hưu càng sớm, nên dùng tỷ lệ càng thấp (3–3,5%).',
      },
      {
        term: 'Tuổi mục tiêu',
        definition:
          'Một mốc tuổi cố định bạn tự chọn (không nhất thiết là tuổi nghỉ hưu) để xem tài sản dự kiến sẽ có ở tuổi đó. Không bắt buộc — để trống nếu chưa cần theo dõi mốc này.',
      },
    ],
  },
  {
    title: 'Chỉ số trên Trang chủ',
    entries: [
      {
        term: 'Tài sản ròng (Net Worth)',
        definition: 'Tổng tài sản trừ đi tổng nợ — con số phản ánh đúng nhất bạn "có bao nhiêu".',
        formula: 'Tài sản ròng = Tổng tài sản − Tổng nợ',
      },
      {
        term: 'Số tiền mục tiêu FI (FI Number)',
        definition:
          'Tài sản ròng bạn cần có để sống hoàn toàn bằng tiền rút ra hàng năm, không cần đi làm nữa.',
        formula: 'FI Number = Chi tiêu hàng năm ÷ Tỷ lệ rút an toàn',
      },
      {
        term: 'Tự do tài chính (FI Progress)',
        definition: 'Bạn đã đi được bao nhiêu phần trăm quãng đường tới Số tiền mục tiêu FI.',
        formula: 'FI Progress = Tài sản ròng ÷ FI Number × 100%, tối đa 100%',
      },
      {
        term: 'Dự kiến đạt FI',
        definition:
          'Năm bạn dự kiến chạm mốc FI Number, tính từ tài sản hiện tại + đầu tư hàng tháng + lợi nhuận kỳ vọng, mô phỏng tăng trưởng từng tháng một cho tới khi đạt mục tiêu.',
      },
      {
        term: 'Tỷ lệ tiết kiệm (Savings Rate)',
        definition: 'Phần trăm thu nhập hàng tháng bạn không tiêu tới, còn lại để đầu tư/tiết kiệm.',
        formula: 'Tỷ lệ tiết kiệm = (Thu nhập − Chi tiêu) ÷ Thu nhập × 100%',
      },
      {
        term: 'Đầu tư hàng tháng',
        definition: 'Số tiền còn dư mỗi tháng sau chi tiêu — mặc định giả sử toàn bộ số dư này được đầu tư.',
        formula: 'Đầu tư hàng tháng = Thu nhập − Chi tiêu',
      },
      {
        term: 'Lộ trình đến mục tiêu FI',
        definition: 'Biểu đồ dự phóng tài sản ròng từ bây giờ tới năm dự kiến đạt FI, theo từng năm.',
      },
    ],
  },
  {
    title: 'Công cụ nâng cao',
    entries: [
      {
        term: 'What-if (Nếu đầu tư nhiều hơn?)',
        definition:
          'So sánh ngày đạt FI hiện tại với ngày đạt FI nếu bạn đầu tư thêm mỗi tháng và/hoặc đổi lợi nhuận kỳ vọng.',
      },
      {
        term: 'Coast FIRE',
        definition:
          'Số tiền bạn cần có NGAY BÂY GIỜ để, nếu không góp thêm một đồng nào nữa, chỉ riêng tăng trưởng tự nhiên cũng đủ đưa bạn tới FI Number đúng vào Tuổi mục tiêu. Nếu tài sản hiện tại đã vượt mức này, bạn đã "Coast FI" — có thể ngừng góp thêm mà vẫn về đích đúng hẹn. Dùng Lợi suất thực (không phải danh nghĩa) vì FI Number đã tính theo sức mua hiện tại.',
        formula: 'Coast FI Number = FI Number ÷ (1 + Lợi suất thực) ^ Số năm còn lại',
      },
      {
        term: 'Rule of 72',
        definition:
          'Cách nhẩm nhanh: tài sản của bạn sẽ tự nhân đôi sau khoảng bao nhiêu năm, chỉ nhờ tăng trưởng (không tính góp thêm).',
        formula: 'Số năm nhân đôi ≈ 72 ÷ %Lợi nhuận kỳ vọng mỗi năm',
      },
      {
        term: 'Bảng theo tỷ lệ rút an toàn',
        definition:
          'So sánh FI Number và số tiền rút được mỗi tháng ở 3 mức SWR phổ biến (4%, 3,5%, 3%) — SWR càng thấp càng an toàn nhưng cần tài sản càng lớn.',
      },
    ],
  },
];

export function GlossaryScreen() {
  return (
    <Screen edges={[]}>
      <Text style={styles.intro}>
        Giải thích các thông số và công thức app dùng để tính toán — không phải lời khuyên đầu
        tư, chỉ giúp bạn hiểu con số đến từ đâu.
      </Text>

      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Card style={styles.card}>
            {section.entries.map((entry, index) => (
              <View
                key={entry.term}
                style={[styles.entry, index === 0 && styles.entryFirst]}
              >
                <Text style={styles.term}>{entry.term}</Text>
                <Text style={styles.definition}>{entry.definition}</Text>
                {entry.formula ? <Text style={styles.formula}>{entry.formula}</Text> : null}
              </View>
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  card: {
    gap: 0,
  },
  entry: {
    gap: spacing.xs,
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  entryFirst: {
    paddingTop: 0,
    marginTop: 0,
    borderTopWidth: 0,
  },
  term: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  definition: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  formula: {
    ...typography.caption,
    color: colors.accent,
    fontFamily: 'monospace',
  },
});
