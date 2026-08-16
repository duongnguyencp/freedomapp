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
| 4     | Dashboard nối dữ liệu thật             | ✅ |
| 5     | Snapshots + charts (net worth, FI)     | ✅ |
| 6     | What-if calculator                     | ✅ |
| 7     | Polish UI + motion design              | ✅ |

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

**Trạng thái:** ✅ Done — 2026-08-15

### Mục tiêu
Dashboard tính từ `financial-engine` + dữ liệu thật trong store/repository,
không còn mock.

### Đã implement
- `features/dashboard/useDashboardData.ts` — hook duy nhất chạm vào engine cho Home:
  load profile + assets + liabilities (nếu chưa load), rồi tính `totalAssets`,
  `totalLiabilities`, `netWorth`, `fiNumber` (annual spending / SWR), `fiProgress`,
  `savingsRate`, `monthlyInvestment` (= income − spending), và `projectedFIDate`
  (`calculateProjectedFIDate` với `fromDate = new Date()` thật).
- `DashboardScreen` xoá hoàn toàn `mockData.ts`, hiện loading spinner trong lúc 3 store
  chưa `ready`, hiển thị đúng câu **"FI date cannot be estimated with current assumptions."**
  khi `projectedFIDate` là `null` (không đạt FI trong 100 năm).
- Bỏ dòng "+X this month" ở Net Worth card — **không fake số liệu**: chưa có snapshot
  lịch sử (Phase 5) nên chưa có gì để so sánh "tháng này" một cách trung thực.

### Files chính
```
apps/mobile/features/dashboard/useDashboardData.ts
apps/mobile/features/dashboard/DashboardScreen.tsx     (viết lại, bỏ mockData.ts)
```

### Cách chạy
```bash
pnpm mobile
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export --platform android` bundle thành công, không lỗi.
- Demo thật: vào tab Assets, thêm/sửa một khoản (vd Bank +50,000,000) → quay lại Home →
  FI %, Net Worth, "You need X more" cập nhật đúng công thức ngay lập tức (không cần
  reload app, vì Zustand store dùng chung giữa 2 màn).
- Test edge case thật: tạo profile với thu nhập = chi tiêu (savings rate 0%, monthly
  investment 0) → Home hiện đúng "FI date cannot be estimated with current assumptions."
  thay vì crash hay hiện NaN/Infinity.

### Việc còn lại (chuyển sang Phase 5+)
- Chưa có snapshot lịch sử → chưa có "+X this month" ở Net Worth, chưa có chart nào.
- "Your progress" (line chart) trên Home vẫn chưa tồn tại — đúng phạm vi Phase 5.

---

## Phase 5 — Snapshots + Charts

**Trạng thái:** ✅ Done — 2026-08-15

### Mục tiêu
Ghi snapshot tài chính; line chart Net Worth History; line chart FI Progress;
donut chart Asset Allocation.

### Đã implement
- **Chart library:** `react-native-chart-kit` + `react-native-svg` (nhẹ, thuần SVG, không cần
  Skia — đúng yêu cầu "lightweight"; Skia để dành cho animation ở Phase 7).
- **Snapshot:** `repositories/snapshotRepository.ts` (AsyncStorage, upsert theo `date` để ghi
  2 lần cùng ngày không tạo điểm trùng trên chart) + `stores/snapshotsStore.ts`.
- **Refactor:** tách `hooks/useFinancialSummary.ts` — 1 nguồn tính `totalAssets/
  totalLiabilities/netWorth/fiNumber/fiProgress` dùng chung giữa Dashboard và History (trước
  đây logic này nằm rải rác, giờ không lặp code).
- **History screen:** nút "Record snapshot" (ghi snapshot từ số liệu thật hiện tại) + 2 line
  chart (Net Worth, FI Progress) khi có ≥2 điểm dữ liệu + donut asset allocation (group theo
  category, tính % trực tiếp từ assets hiện có, không cần snapshot).
- **Dashboard:** thêm "Your progress" — mini line chart net worth, chỉ hiện khi có ≥2 snapshot
  (không fake dữ liệu khi chưa đủ).
- **Màu categorical:** dùng palette đã validate sẵn (8 hue, thứ tự cố định, pass CVD/contrast
  check cho cặp liền kề) cho asset allocation — không tự chọn màu tuỳ hứng. Legend tự vẽ
  (swatch + tên + %) vì `react-native-chart-kit` không hỗ trợ % trong legend built-in, và để
  đảm bảo không nhận diện category chỉ bằng màu.

### Files chính
```
apps/mobile/repositories/snapshotRepository.ts
apps/mobile/stores/snapshotsStore.ts
apps/mobile/hooks/useFinancialSummary.ts
apps/mobile/services/date.ts                          todayISODate, monthLabel
apps/mobile/components/{MiniLineChart,MiniPieChart}.tsx
apps/mobile/features/assets/categories.ts              + ASSET_CATEGORY_COLORS, buildAssetAllocation
apps/mobile/features/history/HistoryScreen.tsx          (viết lại)
apps/mobile/features/dashboard/{DashboardScreen,useDashboardData}.tsx
```

### Cách chạy
```bash
pnpm mobile
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export --platform android` bundle thành công (không lỗi
  react-native-svg/chart-kit).
- `pnpm --filter financial-engine test` vẫn 33/33 pass.
- Demo thật: vào tab History, bấm "Record snapshot" hôm nay → thấy "Todays net worth" khớp
  Home. Record thêm ở 1 ngày khác (đổi ngày máy hoặc sửa liệu để test) → 2 line chart (Net
  Worth, FI Progress) xuất hiện. Vào Assets thêm ≥2 loại tài sản khác category → quay lại
  History thấy donut chart + legend % chia đúng theo category.

### Việc còn lại (chuyển sang Phase 6+)
- Chưa có What-if calculator (Phase 6).
- Chưa có animation/motion (progress ring animate, số đếm lên...) — Phase 7.

---

## Design refresh — tham khảo Starpay Figma kit

**Trạng thái:** ✅ Done — 2026-08-15

### Nguồn tham khảo
[Starpay Finance App UI Kit](https://uikitfree.com/starpay-free-figma-finance-app-ui-kit-template/)
(uikitfree.com) — không truy cập được file Figma thật (cần đăng nhập), người dùng gửi
screenshot 4 màn hình (Onboarding, Home, Statistic, Transfer) để tham khảo trực tiếp.

### Đã lấy gì, bỏ gì
Lấy **ngôn ngữ thị giác**, bỏ **toàn bộ tính năng thanh toán** (Transfer/Send Money, thẻ
debit/credit) — không liên quan tới FreedomPath (đây không phải app ngân hàng/thanh toán,
theo đúng nguyên tắc sản phẩm trong prompt.md mục 17).

Đã áp dụng:
- Nền tím lavender nhạt (`#F5F3FB`) thay vì xám trung tính.
- Accent chính chuyển từ xanh dương → **tím** (`#7C5CFC`) cho progress ring/bar, chart net
  worth, active tab.
- Thêm accent phụ **cam ấm** (`#F2924D`) cho phần "You need X more" (khoảng cách còn lại) —
  tạo cặp đôi tím/cam giống thẻ debit/credit trong bản gốc, nhưng dùng có chủ đích (semantic:
  tím = tiến độ đã đạt, cam = phần còn thiếu), không phải trang trí ngẫu nhiên.
- Nút chính (Button primary) chuyển sang **đen navy** (`#161528`, token `colors.ink`) dạng
  pill bo tròn hoàn toàn — giống nút "Sign In" trong bản gốc.
- Card hero (Financial Freedom trên Dashboard) có nền tím nhạt (`surfaceTinted`) — 1 khoảnh
  khắc nhấn duy nhất mỗi màn hình, không lạm dụng.
- Bo góc lớn hơn (`radius.lg` 20→24), số liệu hero đậm hơn (`fontWeight` 700→800).
- **Không** copy màu categorical (asset allocation) — giữ nguyên palette 8-hue đã validate ở
  Phase 5 vì đổi sẽ phá kiểm tra CVD/contrast đã chạy.
- **Không** thêm hoạ tiết gradient xoáy trang trí trên card — giữ đúng nguyên tắc gốc "avoid
  excessive gradients", chỉ dùng màu phẳng (flat tint).

### Files chính
```
apps/mobile/constants/theme.ts                 (palette mới)
apps/mobile/components/Card.tsx                 + tinted prop
apps/mobile/components/Button.tsx               primary -> ink, pill radius
apps/mobile/features/dashboard/DashboardScreen.tsx
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export --platform android` bundle thành công.
- `financial-engine` vẫn 33/33 test pass (không đụng logic).
- Demo thật: mở Home — card "Financial Freedom" có nền tím nhạt, progress bar tím, "You need
  X more" màu cam; nút "Continue"/"Save"/"Record snapshot" giờ là pill đen.

---

## Phase 6 — What-if calculator

**Trạng thái:** ✅ Done — 2026-08-15

### Mục tiêu
Slider thay đổi monthly investment (+0 → +50M) và expected annual return,
show current FI date vs new FI date + số năm rút ngắn.

### Đã implement
- `@react-native-community/slider` (RN core đã bỏ Slider, cần package riêng).
- `features/what-if/WhatIfScreen.tsx`: slider +0→+50,000,000 VND (bước 1,000,000), input
  Expected annual return (prefill từ profile, sửa được), dùng thẳng `calculateWhatIf` +
  `calculateProjectedFIDate` (financial-engine, không tính tay trong UI).
- **Không thêm tab thứ 5** (đúng constraint "chỉ 4 tab") — What-if là 1 **pushed screen**
  (`app/what-if.tsx`, `expo-router` Stack route thường, không phải trong `(tabs)`), vào từ
  1 card "What if I invest more? →" ở cuối Dashboard. Không làm nặng Home (đúng "Do not
  overload the dashboard").
- Route `what-if` bật `headerShown: true` riêng ở root `_layout.tsx` (back button tự nhiên
  của native stack) — các route khác vẫn `headerShown: false` như cũ.
- `Screen` component thêm prop `edges` để tắt inset top khi màn đã có header native
  (tránh double-safe-area giữa header và `SafeAreaView`).

### Files chính
```
apps/mobile/app/what-if.tsx
apps/mobile/app/_layout.tsx                      (+ Stack.Screen "what-if" có header)
apps/mobile/features/what-if/WhatIfScreen.tsx
apps/mobile/features/dashboard/DashboardScreen.tsx   (+ entry card)
apps/mobile/components/Screen.tsx                (+ edges prop)
```

### Cách chạy
```bash
pnpm mobile
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export --platform android` bundle thành công.
- `financial-engine` vẫn 33/33 test pass.
- Demo thật: Home → bấm "What if I invest more?" → kéo slider lên +10,000,000 → "New FI
  date" nhỏ hơn "Current FI date", "Difference" hiện đúng số năm sớm hơn — khớp ví dụ trong
  prompt.md (2038 → 2035 → "3 years earlier"). Sửa "Expected annual return" → kết quả cập
  nhật lại theo đúng công thức.

### Việc còn lại (chuyển sang Phase 7)
- Chưa có animation/motion (progress ring animate, số đếm lên, chart drawing animation,
  card entrance stagger, haptic feedback).

---

## Phase 7 — Polish UI + Motion design

**Trạng thái:** ✅ Done — 2026-08-15

### Mục tiêu
Reanimated/Skia: progress ring animate 0→giá trị thật, animated numbers,
chart drawing animation, card entrance stagger, haptic feedback.

### Đã implement
- `react-native-reanimated` (~4.1.1, kèm `react-native-worklets` ~0.5.1 — Reanimated 4 tách
  worklets engine ra package riêng, phải ghim đúng range peer `0.5-0.8` chứ không lấy bản
  "latest" 0.11.4 mà `expo install` gợi ý ban đầu, nếu không app crash lúc chạy dù build
  qua). Thêm `apps/mobile/babel.config.js` với plugin `react-native-reanimated/plugin`
  (bắt buộc đứng cuối danh sách plugin).
- **`ProgressRing`** (`react-native-svg` + Reanimated): vòng tròn animate 0 → % thật trong
  1000ms, easing out-cubic, và **animate lại mỗi khi giá trị đổi** (không chỉ lúc mount) —
  dùng `useEffect` theo dõi prop `progress`, khớp đúng yêu cầu "Progress Updates".
- **`AnimatedNumber`**: đếm số lên bằng kỹ thuật `Animated.createAnimatedComponent(TextInput)`
  + `useAnimatedProps` set `text` trực tiếp (native prop, không có trong type RN nên phải
  cast tường minh). Chỉ dùng cho **2 số quan trọng nhất**: FI % (trong ring) và Net Worth —
  đúng "Do not animate every number on the screen".
- **`AnimatedEntrance`**: card fade-in (opacity 0→1) + trượt lên (translateY 12→0), stagger
  70ms/card, dùng Reanimated `entering` (`FadeInUp` custom initial values) — áp cho toàn bộ
  card Dashboard, và card đầu History/Assets.
- **Button**: scale nhẹ (0.97) khi nhấn qua Reanimated + haptic `impactAsync` (light) khi
  bấm — dùng `expo-haptics`.
- **Giới hạn đã biết (ghi nhận trung thực):** "Chart Drawing Animation" trong prompt.md yêu
  cầu net-worth chart **vẽ trái sang phải** khi vào viewport. `react-native-chart-kit` không
  expose path SVG để animate stroke-dashoffset kiểu đó — đã thay bằng entrance animation
  (fade + trượt nhẹ) cho card chứa chart, không phải animation vẽ đường thật. Nếu cần đúng
  100% behavior này sau MVP, cần thay chart library (vd tự vẽ bằng `react-native-svg` +
  Reanimated) hoặc dùng Skia — không làm trong phase này để tránh phá vỡ những gì Phase 5
  đã ổn định.
- **Bỏ qua Skia:** SVG + Reanimated đã đủ cho ring animation, không cần thêm dependency nặng
  hơn — quyết định phạm vi có chủ đích, không phải bỏ sót.

### Files chính
```
apps/mobile/babel.config.js
apps/mobile/components/{ProgressRing,AnimatedNumber,AnimatedEntrance}.tsx
apps/mobile/components/Button.tsx                      (scale + haptic)
apps/mobile/features/dashboard/DashboardScreen.tsx      (ring, animated numbers, stagger)
apps/mobile/features/history/HistoryScreen.tsx          (+ stagger)
apps/mobile/features/assets/AssetsScreen.tsx            (+ stagger card đầu)
```

### Cách chạy
```bash
pnpm mobile
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export --platform android` bundle thành công (1561 module,
  babel plugin Reanimated hoạt động đúng — không lỗi worklets).
- `financial-engine` vẫn 33/33 test pass.
- Demo thật: mở app → card Dashboard xuất hiện theo thứ tự có stagger nhẹ, vòng tròn FI %
  và số Net Worth đếm lên từ 0 trong khoảng 1 giây. Vào Assets sửa 1 khoản → quay lại Home →
  vòng tròn/số **animate sang giá trị mới** (không snap tức thì). Bấm bất kỳ nút nào (Save,
  Record snapshot, Continue) → thấy scale nhún nhẹ + rung haptic nhẹ trên thiết bị thật (haptic
  không có tác dụng trên emulator không hỗ trợ).

### Việc còn lại
Đây là phase cuối theo kế hoạch prompt.md. Việc còn lại là polish tự do / bugfix phát sinh
khi dùng thật, không còn phase nào được định nghĩa sẵn.

---

## Fix: crash khi animation chạy (Reanimated gọi hàm JS-thread từ worklet)

**Trạng thái:** ✅ Done — 2026-08-15

`AnimatedNumber` gọi `formatValue()` (hàm JS thường, vd `toLocaleString`) **bên trong**
`useAnimatedProps` — callback này chạy trên UI thread của Reanimated, không được phép gọi
hàm JS-thread thường → crash ngay khi animation bắt đầu (đúng lúc dashboard load). Đã viết
lại `AnimatedNumber` chạy hoàn toàn trên JS thread bằng `requestAnimationFrame` thay vì
Reanimated worklet — vẫn đếm số mượt, không còn gọi hàm ngoài từ trong worklet.
`ProgressRing`/`Button`/`AnimatedEntrance` không bị ảnh hưởng (không gọi hàm JS ngoài trong
worklet của chúng).

---

## Localization: hiển thị tiếng Việt

**Trạng thái:** ✅ Done — 2026-08-15

### Quyết định
App chỉ nhắm 1 ngôn ngữ (tiếng Việt) cho MVP — dịch trực tiếp toàn bộ text trong code,
**không** thêm thư viện i18n (i18next...). Đúng tinh thần "MVP đơn giản": không cần chuyển
đổi ngôn ngữ lúc chạy, không cần thêm layer trừu tượng cho việc chưa có nhu cầu.

### Đã dịch
- Toàn bộ label, tiêu đề, placeholder, thông báo rỗng/lỗi trên cả 5 màn hình (Onboarding,
  Home, Assets, History, Settings) + What-if.
- Tên 4 tab (`Trang chủ`, `Tài sản`, `Lịch sử`, `Cài đặt`) và tiêu đề header của route
  `what-if`.
- Danh mục asset/liability (`Tiền mặt`, `Ngân hàng`, `Vàng`, `Cổ phiếu`, `ETF`, `Tiền số`,
  `Bất động sản`, `Khoản vay`, `Thẻ tín dụng`, `Vay thế chấp`, `Khác`).
- Nhãn tháng trên biểu đồ: `Th1`…`Th12` thay vì `Jan`…`Dec`.
- `services/format.ts`: định dạng số kiểu Việt Nam — dấu phẩy (`,`) làm dấu thập phân, dấu
  chấm (`.`) phân cách hàng nghìn (`toLocaleString('vi-VN')`); viết tắt số tiền gọn dùng
  `tỷ`/`triệu` thay vì `B`/`M` (vd `₫1,7 tỷ` thay vì `₫1.7B`).

### Files chính
Gần như toàn bộ `apps/mobile/features/**`, `apps/mobile/app/**/_layout.tsx`,
`apps/mobile/services/{format,date}.ts`.

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export --platform android` bundle thành công.
- `financial-engine` vẫn 33/33 test pass (không đụng logic tính toán, chỉ đổi trình bày).
- Demo thật: mở app — toàn bộ giao diện hiện tiếng Việt, số tiền hiện dạng `₫1,7 tỷ`.

---

## Fix: ô Thu nhập/Chi tiêu để trống bị chặn lưu âm thầm

**Trạng thái:** ✅ Done — 2026-08-15

Onboarding và Settings coi ô trống = `null` (không hợp lệ) → nút Lưu/Tiếp tục bị disable
âm thầm, không giải thích gì. Đã sửa: Thu nhập, Chi tiêu, Tài sản/Nợ ban đầu, Lợi nhuận kỳ
vọng để trống giờ hiểu là 0 (giá trị hợp lệ). Tuổi và SWR vẫn bắt buộc nhập vì bằng 0 sẽ phá
công thức FI. Thêm dòng lỗi hiện rõ dưới nút khi form chưa hợp lệ.

## Fix: hiện 0%/"đã đạt được" mâu thuẫn khi FI Number = 0

**Trạng thái:** ✅ Done — 2026-08-15

Khi Chi tiêu hàng tháng = 0 → FI Number = 0 → Dashboard vừa hiện 0% vừa hiện "Bạn đã đạt
được rồi 🎉" (remaining clamp về 0). Đã thêm guard: khi `fiNumber <= 0`, hiện thông báo rõ
ràng + link vào Cài đặt thay vì số liệu mâu thuẫn.

---

## Tính năng mới: Tài sản dự kiến ở tuổi mục tiêu

**Trạng thái:** ✅ Done — 2026-08-15

### Bối cảnh
Người dùng hỏi "không có chỗ nào ghi tài sản mục tiêu à" — muốn nhập 1 tuổi cố định (vd 35,
không phải tuổi nghỉ hưu — là tuổi muốn có tài sản đảm bảo an toàn tài chính) và xem tài sản
dự kiến sẽ có ở tuổi đó, dựa trên tốc độ đầu tư hiện tại.

### Đã implement
- `financial-engine`: thêm field optional `targetAge?: number` vào `UserProfile` (không đụng
  hàm tính toán nào, không có test nào construct `UserProfile` literal nên không breaking).
- Onboarding + Settings: thêm ô "Tuổi mục tiêu (không bắt buộc)" — để trống thì bỏ qua tính
  năng này hoàn toàn.
- Dashboard: card mới "Tài sản dự kiến ở tuổi X", dùng thẳng `calculateFutureValue` (đã có
  từ Phase 2) với `presentValue = netWorth hiện tại`, `monthlyContribution = đầu tư hàng
  tháng`, `months = (tuổi mục tiêu − tuổi hiện tại) × 12`. Chỉ hiện khi `targetAge` đã đặt và
  lớn hơn tuổi hiện tại.

### Files chính
```
packages/financial-engine/src/types.ts                 + targetAge?: number
apps/mobile/features/onboarding/OnboardingScreen.tsx    + ô Tuổi mục tiêu
apps/mobile/features/settings/SettingsScreen.tsx        + ô Tuổi mục tiêu
apps/mobile/features/dashboard/useDashboardData.ts      + targetAgeProjection
apps/mobile/features/dashboard/DashboardScreen.tsx      + card mới
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export` bundle thành công, `financial-engine` 33/33 test pass.
- Demo thật: Cài đặt → nhập Tuổi mục tiêu 35 → Lưu → Home hiện card "Tài sản dự kiến ở tuổi
  35: ₫X" tính đúng theo tốc độ đầu tư hiện tại. Xoá trống Tuổi mục tiêu → card biến mất.

---

## Đợt tính năng lớn: công thức formula.md, chart lộ trình, glass UI, giá vàng live

**Trạng thái:** ✅ Done — 2026-08-15

Người dùng gửi `formula.md` (prompt FIRE calculator tham khảo) và yêu cầu 5 việc cùng lúc.
Đã hỏi rõ 2 điểm xung đột với nguyên tắc gốc trước khi làm (API giá vàng phá "offline-first";
phạm vi glass UI) — người dùng xác nhận muốn làm cả 2.

### 1. Công thức mới từ formula.md
- `financial-engine`: thêm `calculateCoastFINumber` (Coast FI Number = FI Number ÷
  (1+lợi nhuận)^số năm còn lại) và `calculateAnnualWithdrawal`/`calculateMonthlyWithdrawal`
  (Số tiền rút = Tài sản ròng × SWR). FI Number hiện có (`annualSpending / SWR`) đã tương
  đương công thức `×25` trong file — không cần sửa.
- 7 test mới (`coastFI.test.ts`, `withdrawal.test.ts`) → financial-engine giờ **40/40 test
  pass**.
- **Chưa làm:** bảng 3 kịch bản SWR (3%/3,5%/4%) và Rule of 72 — không nằm trong 5 yêu cầu cụ
  thể của người dùng ở tin nhắn này, để dành nếu cần sau.

### 2. Biểu đồ "Lộ trình đến mục tiêu FI"
- Card mới trên Home, trục ngang = năm (2026, 2027...), trục dọc = tài sản tích luỹ dự kiến
  — khác với chart "Tiến độ của bạn" (dữ liệu lịch sử từ snapshot đã ghi). Đây là **chiếu
  tương lai thuần** dùng `calculateFutureValue` tại từng mốc năm, không cần snapshot nào.
  Giới hạn tối đa 40 năm hiển thị (`MAX_GOAL_CHART_YEARS`), chỉ hiện khi có ≥2 điểm.

### 3. Glass UI (kính mờ) — toàn app
- `expo-blur` + component dùng chung `GlassSurface` (blur thật + lớp phủ trong suốt + viền
  sáng để "bán" hiệu ứng kính).
- Tab bar dưới cùng: `position: absolute`, nền trong suốt + `BlurView` — kính mờ thật (đằng
  sau có nội dung cuộn qua để blur). Tăng `paddingBottom` của `Screen` vì tab bar giờ nổi,
  không chiếm layout.
- `Button` (primary/secondary): nền kính mờ thay màu phẳng; riêng nút `danger` (Xoá) **giữ
  màu đỏ đặc** — không làm kính để không giảm độ rõ ràng của hành động phá huỷ.
- Slider (What-if): bọc trong `GlassSurface`.

### 4. API giá vàng SJC (chấp nhận phá offline-first, đã xác nhận với người dùng)
- `services/goldPrice.ts` gọi `api.vnappmob.com` — **best-effort, opt-in**: chỉ gọi khi người
  dùng bấm "Lấy giá vàng hôm nay", lỗi mạng không chặn gì cả, luôn có thể nhập tay VNĐ như cũ.
- `GoldPriceHelper` — chỉ hiện khi category = Vàng: bấm lấy giá → nhập "Số chỉ" → bấm Áp dụng
  → tự điền vào ô Giá trị (VNĐ).
- **Rủi ro đã ghi nhận:** không kiểm thử được API thật trong sandbox (fetch chạy trên máy
  người dùng, không phải server dev) — nếu response shape khác dự kiến, tính năng chỉ hiện
  lỗi và fallback nhập tay, không crash gì khác.

### 5. Số tiền có thể hưởng ở tuổi mục tiêu
- Card "Tài sản dự kiến ở tuổi X" thêm dòng "Có thể chi tiêu ~₫Y/tháng" (dùng
  `calculateMonthlyWithdrawal`) + khối Coast FI (đã đạt Coast FI chưa, cần bao nhiêu ngay bây
  giờ nếu chưa).

### Files chính
```
packages/financial-engine/src/{projection,withdrawal}.ts   + calculateCoastFINumber, withdrawal
packages/financial-engine/tests/{coastFI,withdrawal}.test.ts
apps/mobile/components/GlassSurface.tsx
apps/mobile/components/{Button,Screen}.tsx                 (glass, padding)
apps/mobile/app/(tabs)/_layout.tsx                          (tab bar glass)
apps/mobile/features/what-if/WhatIfScreen.tsx               (slider glass)
apps/mobile/services/goldPrice.ts
apps/mobile/features/assets/{GoldPriceHelper,EntryForm}.tsx
apps/mobile/features/dashboard/{useDashboardData,DashboardScreen}.tsx
```

### Cách chạy
```bash
pnpm mobile
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export --platform android` bundle thành công.
- `financial-engine` 40/40 test pass (7 test mới).
- Demo thật: Home hiện tab bar kính mờ nổi dưới cùng, thấy nội dung cuộn qua mờ phía sau; các
  nút giờ có nền kính; card "Lộ trình đến mục tiêu FI" (nếu đã có dự kiến đạt FI) hiện chart
  theo năm; Assets → thêm tài sản Vàng → bấm "Lấy giá vàng hôm nay" → nhập số chỉ → Áp dụng →
  giá trị VNĐ tự điền.

---

## Fix: giá vàng API sai đơn vị (lượng vs chỉ)

**Trạng thái:** ✅ Done — 2026-08-15

Test trực tiếp `https://www.vang.today/api/prices` (thay vì đoán) phát hiện giá trả về là
**VNĐ/lượng** (10 chỉ), không phải VNĐ/chỉ như code trước đó giả định — nếu không sửa, giá trị
tài sản vàng sẽ bị tính **gấp 10 lần**. Đã sửa `services/goldPrice.ts` (`fetchGoldPrice` trả
`{buyPerLuong, sellPerLuong}`) + thêm `chiToVND()` quy đổi tường minh, dùng mã `SJL1L10` (SJC
9999). Cũng commit `app.json` phần EAS project linkage (`projectId`/`owner`) do `eas init` tạo.

---

## Hoàn thiện formula.md: Rule of 72, bảng đa kịch bản SWR, cảnh báo rủi ro

**Trạng thái:** ✅ Done — 2026-08-15

### Bối cảnh
Đối chiếu lại với `formula.md`, phần lõi (FI Number, Coast FIRE, thời gian tới FI) đã đúng công
thức nhưng thiếu 4 mục file yêu cầu: Rule of 72, bảng so sánh 3 mức SWR (4%/3,5%/3%) cho cả FI
Number lẫn số tiền rút được, cảnh báo rủi ro (sequence of returns, SWR thấp hơn khi nghỉ hưu
sớm), và disclaimer "công cụ tham khảo, không phải lời khuyên tài chính".

### Đã implement
- `financial-engine`: `calculateRuleOf72Years` (72 ÷ %lợi nhuận) và `calculateFIScenarios`
  (annualSpending, netWorth) → mảng 3 kịch bản `{safeWithdrawalRate, fiNumber,
  annualWithdrawal, monthlyWithdrawal}` ở 4%/3,5%/3%, tái dùng `calculateFINumber` +
  `calculateAnnualWithdrawal`/`calculateMonthlyWithdrawal` đã có — không viết công thức trùng.
  7 test mới, `financial-engine` giờ 47/47.
- **Không đặt ở Dashboard** (tránh "overload the dashboard") — thêm vào cuối màn **What-if**
  (đã là màn "tính toán sâu hơn", đúng chỗ cho nội dung tham khảo này): bảng 3 dòng SWR/Mục
  tiêu FI/Rút được mỗi tháng, dòng Rule of 72, 2 dòng cảnh báo rủi ro, và disclaimer cuối trang.

### Files chính
```
packages/financial-engine/src/{ruleOf72,scenarios}.ts
packages/financial-engine/tests/{ruleOf72,scenarios}.test.ts
apps/mobile/features/what-if/WhatIfScreen.tsx    (+ bảng kịch bản, cảnh báo, disclaimer)
```

### Cách verify / demo
- `tsc --noEmit` sạch, `expo export` bundle thành công, `financial-engine` 47/47 test pass.
- Demo thật: Home → "Nếu đầu tư nhiều hơn?" → cuộn xuống cuối → thấy bảng 3 mức SWR đúng số
  liệu, dòng Rule of 72, cảnh báo rủi ro, và disclaimer.

---

## Ghi chú chung

- Mỗi phase khi hoàn thành: cập nhật bảng tiến độ ở đầu file, tick trạng thái ✅,
  điền đủ 4 mục "Đã implement / Files chính / Cách chạy / Cách verify-demo".
- Không merge/chuyển phase khi phase hiện tại chưa chạy được và chưa demo được.
