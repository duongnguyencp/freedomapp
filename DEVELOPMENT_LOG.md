# FreedomPath — Development Log

Nhật ký phát triển theo từng phase, bám sát kế hoạch trong [prompt.md](./prompt.md).
Mỗi phase phải: **chạy được**, **verify được**, **demo được** trước khi sang phase kế tiếp.

Quy ước trạng thái: ✅ Done · 🔄 In progress · ⬜ Not started

## Tổng quan tiến độ

| Phase | Nội dung                              | Trạng thái |
|-------|----------------------------------------|:----------:|
| 1     | Project scaffold, navigation, mock UI  | ✅ |
| 2     | financial-engine + unit tests          | ✅ |
| 3     | Onboarding, assets, liabilities (CRUD) | ✅ |
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

**Trạng thái:** ✅ Done — 2026-08-15

### Mục tiêu
Package `packages/financial-engine` — pure TypeScript, không phụ thuộc
React/React Native/Expo/Zustand/AWS.

### Đã implement
- 10 hàm tính toán theo đúng spec: `calculateTotalAssets`, `calculateTotalLiabilities`,
  `calculateNetWorth`, `calculateFINumber`, `calculateSavingsRate`, `calculateFIProgress`,
  `calculateFutureValue`, `calculateYearsToFI`, `calculateProjectedFIDate`, `calculateWhatIf`.
- Domain types dùng chung (`UserProfile`, `Asset`, `Liability`, `FinancialSnapshot`) —
  đặt trong engine vì không phụ thuộc framework, Phase 3 sẽ tái sử dụng cho repositories.
- Projection (`calculateFutureValue`/`calculateYearsToFI`/`calculateProjectedFIDate`) dùng
  **mô phỏng compound theo tháng, xác định (deterministic)** — không dùng AI, có ghi rõ
  giả định (monthly compounding, không tính lạm phát/thuế) ngay trong code comment.
  Trả về `null` khi không đạt FI trong `maxYears` (mặc định 100 năm) → tầng UI hiển thị
  "FI date cannot be estimated with current assumptions."
- FI Progress cap ở 100%, Savings Rate không cap (có thể âm nếu chi > thu).
- 33 unit test (`vitest`), gồm cả các ví dụ đối chiếu số liệu trong prompt.md và edge case
  (chia cho 0, SWR âm/0, không đạt FI trong horizon, net worth âm...).

### Files chính
```
packages/financial-engine/src/{types,totals,fiNumber,savingsRate,fiProgress,projection,whatIf,index}.ts
packages/financial-engine/tests/*.test.ts
packages/financial-engine/package.json      (build/test scripts)
```

### Cách chạy
```bash
pnpm --filter financial-engine build   # biên dịch ra dist/ (dùng cho Phase 3/4)
```

### Cách verify / demo
```bash
pnpm --filter financial-engine test
```
Kết quả: **6 test file, 33/33 test pass**. Bao gồm đúng 2 ví dụ trong prompt.md:
- Annual spending 240M, SWR 4% → FI number = 6B ✓
- Net worth 1.5B, FI number 6B → FI progress = 25% ✓

`pnpm --filter financial-engine build` chạy sạch, không lỗi type — CI job
`test-financial-engine` giờ chạy test thật thay vì skip.

### Việc còn lại (chuyển sang Phase 3+)
- Chưa có UI nào gọi tới engine này — Home vẫn dùng mock data (Phase 4 mới nối thật).
- Chưa có repository/store để lấy input thật (assets/liabilities/profile) cho engine.
- Ví dụ đối chiếu số liệu trong prompt.md:
  - Annual spending 240M, SWR 4% → FI number = 6B.
  - Net worth 1.5B / FI number 6B → FI progress = 25%.

---

## Phase 3 — Onboarding, Assets, Liabilities

**Trạng thái:** ✅ Done — 2026-08-15

### Mục tiêu
Nhập được hồ sơ tài chính; thêm/sửa/xóa asset và liability; lưu offline
(SQLite/AsyncStorage) qua `repositories/`.

### Đã implement
- **Storage:** `@react-native-async-storage/async-storage`. 3 repository (`profileRepository`,
  `assetRepository`, `liabilityRepository`) — UI/store không bao giờ đụng AsyncStorage trực tiếp.
- **State:** Zustand (`stores/profileStore`, `stores/assetsStore`, `stores/liabilitiesStore`) —
  mỗi store bọc repository tương ứng, giữ state in-memory để UI reactive.
- **Routing gate:** `app/index.tsx` kiểm tra đã có `UserProfile` chưa → `<Redirect>` sang
  `/onboarding` (chưa có) hoặc `/(tabs)` (đã có). Tab navigation cũ chuyển vào group
  `app/(tabs)/`.
- **Onboarding** (`features/onboarding`): 1 màn hình, đúng 7 câu hỏi trong spec (age, income,
  spending, current assets, current liabilities, expected return, SWR), 2 default sẵn
  (SWR 4%, return 7%). Lưu profile + seed 1 asset/liability "Starting..." nếu người dùng nhập
  số dư ban đầu > 0, rồi chuyển sang tabs.
- **Assets & Liabilities** (`features/assets`): CRUD đầy đủ (add/edit/delete) cho cả hai, dùng
  chung 1 form component (`EntryForm`) + category chips. Card tổng hợp Total Assets/
  Total Liabilities/Net Worth — **lần đầu gọi trực tiếp `financial-engine`** trong app.
- **Settings** (`features/settings`): xem & sửa lại giả định tài chính (age/income/spending/
  expected return/SWR) sau onboarding.
- **Monorepo wiring:** `apps/mobile` giờ phụ thuộc `financial-engine` qua
  `"financial-engine": "workspace:*"`; `financial-engine/package.json` trỏ `main`/`types`
  thẳng vào `src/index.ts` (không cần build step) để Metro bundle trực tiếp từ TypeScript
  source; thêm `apps/mobile/metro.config.js` để Metro watch được ra ngoài `apps/mobile`
  vào `packages/financial-engine` (theo đúng pnpm monorepo — **không** bật
  `resolver.disableHierarchicalLookup`, vì nó phá resolution của pnpm's nested
  node_modules).

### Files chính
```
apps/mobile/app/index.tsx                   gate: onboarding vs (tabs)
apps/mobile/app/onboarding.tsx
apps/mobile/app/(tabs)/*                     (di chuyển từ app/*)
apps/mobile/metro.config.js
apps/mobile/repositories/{profile,asset,liability}Repository.ts
apps/mobile/stores/{profile,assets,liabilities}Store.ts
apps/mobile/features/onboarding/OnboardingScreen.tsx
apps/mobile/features/assets/{AssetsScreen,EntryForm,EntryListItem,CategoryChips,categories}.tsx
apps/mobile/features/settings/SettingsScreen.tsx
apps/mobile/components/{FormField,Button}.tsx
```

### Cách chạy
```bash
pnpm install
pnpm mobile
```
Xoá app trong Expo Go (hoặc "Clear data") để test lại từ đầu (không có profile) → thấy
onboarding thay vì dashboard.

### Cách verify / demo
- `tsc --noEmit` sạch (`apps/mobile`).
- `expo export --platform android` bundle **1089 module**, không lỗi — xác nhận Metro
  resolve đúng package `financial-engine` qua workspace.
- `pnpm --filter financial-engine test` vẫn 33/33 pass (không có regression).
- Demo thật trên điện thoại: mở app lần đầu → onboarding → nhập số → Continue → vào
  thẳng Home. Vào tab Assets → thêm 1 asset (vd Bank 170,000,000) → thấy ngay trong list
  và trong card tổng hợp Net Worth. Sửa/xoá asset đó → list cập nhật ngay. Tắt hẳn app,
  mở lại → dữ liệu vẫn còn (AsyncStorage), không quay lại onboarding.

### Việc còn lại (chuyển sang Phase 4+)
- Home dashboard **vẫn dùng mock data** — chưa đọc từ profile/assets/liabilities thật.
  Đó chính xác là việc của Phase 4.
- Chưa có snapshot lịch sử (Phase 5).

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
