# FreedomPath — Development Log

Nhật ký phát triển theo từng phase, bám sát kế hoạch trong [prompt.md](./prompt.md).
Mỗi phase phải: **chạy được**, **verify được**, **demo được** trước khi sang phase kế tiếp.

Quy ước trạng thái: ✅ Done · 🔄 In progress · ⬜ Not started

## Tổng quan tiến độ

| Phase | Nội dung                              | Trạng thái |
|-------|----------------------------------------|:----------:|
| 1     | Project scaffold, navigation, mock UI  | ✅ |
| 2     | financial-engine + unit tests          | ⬜ |
| 3     | Onboarding, assets, liabilities (CRUD) | ⬜ |
| 4     | Dashboard nối dữ liệu thật             | ⬜ |
| 5     | Snapshots + charts (net worth, FI)     | ⬜ |
| 6     | What-if calculator                     | ⬜ |
| 7     | Polish UI + motion design              | ⬜ |

---

## Infra

**Trạng thái:** ✅ Done — 2026-08-15

- Git repo riêng cho `freedomapp/` (trước đó repo bị lẫn ở thư mục home), branch mặc định `main`.
- `.gitignore` đầy đủ cho monorepo pnpm/Expo: `node_modules`, `.expo/`, native folders,
  `.env*`, coverage, editor/OS files.
- CI (`.github/workflows/ci.yml`, chạy trên push/PR vào `main`):
  - **typecheck-mobile** — `tsc --noEmit` cho `apps/mobile`.
  - **build-check-mobile** — `expo export --platform android`, fail nếu có lỗi
    module/runtime khi bundle (tương đương smoke test).
  - **test-financial-engine** — chạy `pnpm --filter financial-engine test`; tự động
    bỏ qua (không fail) cho tới khi package đó được tạo ở Phase 2.
- Cách verify: push lên GitHub, xem tab Actions → cả 3 job phải xanh (job thứ 3 sẽ
  hiện "skip" cho tới Phase 2).

---

## Phase 1 — Project scaffold, navigation, mock UI

**Trạng thái:** ✅ Done — 2026-08-15

### Mục tiêu
"Open the app and immediately see a beautiful Financial Freedom dashboard."

### Đã implement
- Monorepo pnpm: `pnpm-workspace.yaml`, root `package.json` (`apps/*`, `packages/*`).
- Expo app TypeScript (`apps/mobile`) chuyển sang Expo Router.
- Bottom tab navigation: Home, Assets, History, Settings (`app/_layout.tsx`).
- Design system tối giản: `constants/theme.ts` (color, spacing, radius, typography).
- 4 component tái sử dụng: `Card`, `SectionHeader`, `FinancialMetric`, `ProgressIndicator`.
- Home screen dùng **mock data** (`features/dashboard/mockData.ts`) hiển thị đúng layout
  FI % / progress bar / net worth / savings rate / monthly investment như trong prompt.
- Assets / History / Settings: placeholder có ghi chú "Coming in Phase X".
- Thư mục rỗng cho các phase sau: `repositories/`, `stores/`, `services/`.

### Files chính
```
apps/mobile/app/_layout.tsx          tab navigation
apps/mobile/app/{index,assets,history,settings}.tsx
apps/mobile/constants/theme.ts
apps/mobile/components/{Card,SectionHeader,FinancialMetric,ProgressIndicator}.tsx
apps/mobile/features/dashboard/{DashboardScreen,mockData}.tsx
apps/mobile/features/{assets,history,settings}/*Screen.tsx
```

### Cách chạy
```bash
pnpm install
pnpm mobile            # mở Expo dev server — quét QR bằng Expo Go
pnpm mobile:android     # hoặc mở thẳng Android emulator/thiết bị
```

### Cách verify / demo
1. `pnpm exec tsc --noEmit` trong `apps/mobile` → không lỗi.
2. `pnpm exec expo export --platform android` → bundle thành công, không lỗi module.
3. Mở app bằng Expo Go trên Android: thấy 4 tab (Home / Assets / History / Settings),
   Home hiển thị vòng tiến độ FI 28.4%, net worth ₫1.7B / ₫6B, savings rate 42%,
   monthly investment ₫20M — đúng theo mock trong prompt.

### Việc còn lại (chuyển sang Phase 2+)
- Toàn bộ tính toán tài chính hiện là số liệu giả (mock), chưa có `financial-engine`.
- Assets/History/Settings chưa có chức năng thật.

---

## Phase 2 — financial-engine + unit tests

**Trạng thái:** ⬜ Not started

### Mục tiêu
Package `packages/financial-engine` — pure TypeScript, không phụ thuộc
React/React Native/Expo/Zustand/AWS.

### Cần implement
`calculateTotalAssets`, `calculateTotalLiabilities`, `calculateNetWorth`,
`calculateFINumber`, `calculateSavingsRate`, `calculateFIProgress`,
`calculateFutureValue`, `calculateProjectedFIDate`, `calculateYearsToFI`,
`calculateWhatIf`.

### Cách verify / demo (khi xong)
```bash
pnpm --filter financial-engine test
```
- Test case tối thiểu: total assets, total liabilities, net worth, FI number,
  savings rate, FI progress, future value, projected FI date, what-if, edge cases.
- Ví dụ đối chiếu số liệu trong prompt.md:
  - Annual spending 240M, SWR 4% → FI number = 6B.
  - Net worth 1.5B / FI number 6B → FI progress = 25%.

---

## Phase 3 — Onboarding, Assets, Liabilities

**Trạng thái:** ⬜ Not started

### Mục tiêu
Nhập được hồ sơ tài chính; thêm/sửa/xóa asset và liability; lưu offline
(SQLite/AsyncStorage) qua `repositories/`.

### Cách verify / demo (khi xong)
- Onboarding: nhập age, income, spending, assets, liabilities, expected return,
  SWR → lưu và load lại được sau khi tắt/mở app (test tính bền dữ liệu).
- Assets/Liabilities: thêm 1 asset, sửa giá trị, xóa — list cập nhật đúng ngay lập tức.

---

## Phase 4 — Dashboard nối dữ liệu thật

**Trạng thái:** ⬜ Not started

### Mục tiêu
Dashboard tính từ `financial-engine` + dữ liệu thật trong store/repository,
không còn mock.

### Cách verify / demo (khi xong)
- Đổi 1 asset trong màn Assets → quay lại Home thấy FI % / net worth cập nhật đúng công thức.

---

## Phase 5 — Snapshots + Charts

**Trạng thái:** ⬜ Not started

### Mục tiêu
Ghi snapshot tài chính; line chart Net Worth History; line chart FI Progress;
donut chart Asset Allocation.

### Cách verify / demo (khi xong)
- Tạo ≥3 snapshot ở các thời điểm khác nhau → History hiển thị đúng 2 chart tăng dần.

---

## Phase 6 — What-if calculator

**Trạng thái:** ⬜ Not started

### Mục tiêu
Slider thay đổi monthly investment (+0 → +50M) và expected annual return,
show current FI date vs new FI date + số năm rút ngắn.

### Cách verify / demo (khi xong)
- Kéo slider +10M → FI date mới sớm hơn FI date hiện tại, số liệu khớp `calculateWhatIf`.

---

## Phase 7 — Polish UI + Motion design

**Trạng thái:** ⬜ Not started

### Mục tiêu
Reanimated/Skia: progress ring animate 0→giá trị thật, animated numbers,
chart drawing animation, card entrance stagger, haptic feedback.

### Cách verify / demo (khi xong)
- Mở app: progress ring và số net worth animate từ 0 lên giá trị thật trong 800–1200ms,
  card dashboard xuất hiện có stagger nhẹ, không giật/lag.

---

## Ghi chú chung

- Mỗi phase khi hoàn thành: cập nhật bảng tiến độ ở đầu file, tick trạng thái ✅,
  điền đủ 4 mục "Đã implement / Files chính / Cách chạy / Cách verify-demo".
- Không merge/chuyển phase khi phase hiện tại chưa chạy được và chưa demo được.
