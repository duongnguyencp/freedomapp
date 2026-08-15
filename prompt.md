You are a senior React Native product engineer.

Build an MVP mobile application called "FreedomPath".

PRODUCT IDEA
============

FreedomPath is a Financial Independence / FIRE progress tracker.

The app has one core purpose:

"Help users understand how close they are to financial independence."

This is NOT an expense management app.

This is NOT a banking app.

This is NOT an investment trading app.

The MVP must be extremely simple.

The user enters their financial situation and the application calculates:

1. Current net worth
2. Financial Independence (FI) number
3. FI progress
4. Estimated time to FI
5. Monthly/annual financial progress

The user can then see their progress visually through charts.

==================================================
MVP SCOPE
==================================================

ONLY implement these features:

1. Financial profile
2. Assets
3. Liabilities
4. FI calculation
5. Dashboard
6. Net worth history
7. FI progress chart
8. Basic what-if calculation

Do NOT implement yet:

- Authentication
- AWS
- Lambda
- API Gateway
- DynamoDB
- Cognito
- AI
- Push notifications
- Bank integration
- Investment APIs
- Ads
- Payments
- Social features
- Cloud synchronization

The first version must work completely offline.

==================================================
TECH STACK
==================================================

React Native
Expo
TypeScript
Expo Router

State:
Zustand

Local persistence:
SQLite or AsyncStorage

Charts:
Use a lightweight React Native chart library.

UI:
Use a clean modern component library if useful, otherwise build reusable components yourself.

Package manager:
pnpm

The application must run on Windows using Expo.

The developer does NOT need a Mac for normal development.

==================================================
CORE USER FLOW
==================================================

The complete MVP flow should be:

Open app
   ↓
Setup financial profile
   ↓
Enter assets
   ↓
Enter liabilities
   ↓
Enter monthly spending
   ↓
Enter expected investment return
   ↓
Calculate FI
   ↓
Show dashboard
   ↓
User periodically updates financial values
   ↓
App creates a financial snapshot
   ↓
Charts show progress over time

Keep this flow extremely simple.

==================================================
1. ONBOARDING
==================================================

Create a simple onboarding screen.

Ask only:

Current age
Monthly income
Monthly spending
Current assets
Current liabilities
Expected annual investment return
Safe withdrawal rate

Defaults:

Safe withdrawal rate = 4%

Expected annual return = 7%

Currency = VND

Allow the user to change the values.

Do not ask unnecessary questions.

==================================================
2. ASSETS
==================================================

Users can create simple assets.

Asset categories:

- Cash
- Bank
- Gold
- Stocks
- ETF
- Crypto
- Real Estate
- Other

Each asset has:

id
name
category
value

The user can:

- Add
- Edit
- Delete

Do NOT implement price APIs.

The user manually enters the current value.

Example:

Gold
Value: 120,000,000 VND

Bank
Value: 170,000,000 VND

Stocks
Value: 80,000,000 VND

==================================================
3. LIABILITIES
==================================================

Keep this simple.

Users can add:

- Loan
- Credit Card
- Mortgage
- Other

Each liability:

id
name
value

Allow:

- Add
- Edit
- Delete

==================================================
4. FINANCIAL CALCULATIONS
==================================================

Create a separate package:

packages/financial-engine

The financial engine must NOT depend on:

React Native
Expo
AWS
React
Zustand

It must be pure TypeScript.

Implement:

calculateTotalAssets()

calculateTotalLiabilities()

calculateNetWorth()

calculateFINumber()

calculateSavingsRate()

calculateFIProgress()

calculateFutureValue()

calculateProjectedFIDate()

calculateYearsToFI()

calculateWhatIf()

==================================================
FI NUMBER
==================================================

Use:

FI Number = Annual Spending / Safe Withdrawal Rate

Example:

Monthly spending = 20,000,000 VND

Annual spending:

20M × 12 = 240M

SWR:

4%

FI Number:

240M / 0.04 = 6,000M

Therefore:

FI Number = 6 billion VND

==================================================
FI PROGRESS
==================================================

Basic formula:

FI Progress =
Current Net Worth / FI Number × 100

Example:

Net Worth = 1.5B

FI Number = 6B

Progress = 25%

Cap the displayed progress at 100%.

==================================================
PROJECTED FI DATE
==================================================

Use a deterministic compound-growth calculation.

Inputs:

Current net worth
Monthly investment
Expected annual return
FI number

Estimate when the user's projected wealth reaches the FI number.

Clearly document assumptions.

If the calculation cannot reach FI under the current assumptions, show:

"FI date cannot be estimated with current assumptions."

Do not let AI calculate this.

==================================================
5. DASHBOARD
==================================================

This is the most important screen.

The user should understand their financial situation within 5 seconds.

Design:

--------------------------------

FINANCIAL FREEDOM

        28.4%

██████░░░░░░░░░░░░░

₫1.7B / ₫6B

You need:

₫4.3B more

Estimated FI:

2038

--------------------------------

NET WORTH

₫1.7B

+₫35M this month

--------------------------------

SAVINGS RATE

42%

--------------------------------

MONTHLY INVESTMENT

₫20M

--------------------------------

Then show:

"Your progress"

with a line chart.

Do not overload the dashboard.

==================================================
6. NET WORTH HISTORY
==================================================

Users should be able to record a financial snapshot.

Example:

January
₫800M

February
₫850M

March
₫920M

April
₫980M

May
₫1.1B

Show a line chart.

Chart:

X axis:
Month

Y axis:
Net Worth

Use smooth but readable visualization.

==================================================
7. FI PROGRESS CHART
==================================================

Create a second chart.

Example:

January   12%
February  14%
March     16%
April     19%
May       22%

Show:

"Financial Independence Progress"

Use a line chart.

The chart should visually communicate progress toward 100%.

==================================================
8. ASSET ALLOCATION
==================================================

Create one simple visualization showing where the user's net worth is stored.

Example:

Bank       40%
Gold       25%
Stocks     20%
Cash       10%
Other       5%

Use a pie/donut chart.

Do not build complicated portfolio analytics.

==================================================
9. BASIC WHAT-IF
==================================================

Create a simple calculator.

Title:

"What if I invest more?"

Inputs:

Current monthly investment

Slider:

+0 → +50M VND

Show:

Current FI date:
2038

New FI date:
2035

Difference:

3 years earlier

Also support changing:

Expected annual return

Do not build a complex financial planning system.

==================================================
10. SNAPSHOTS
==================================================

When the user records a financial update, save:

date
totalAssets
totalLiabilities
netWorth
fiNumber
fiProgress

Example:

{
  date: "2026-08-15",
  totalAssets: 520000000,
  totalLiabilities: 50000000,
  netWorth: 470000000,
  fiNumber: 3000000000,
  fiProgress: 15.67
}

These snapshots power the charts.

==================================================
11. LOCAL STORAGE
==================================================

Everything must work offline.

Persist:

UserProfile
Assets
Liabilities
Snapshots

Create a small repository/data-access layer so storage implementation is not mixed with UI.

For example:

repositories/
    profileRepository.ts
    assetRepository.ts
    liabilityRepository.ts
    snapshotRepository.ts

==================================================
12. NAVIGATION
==================================================

Only 4 main sections:

Home
Assets
History
Settings

Do NOT create more navigation items.

Home:
Financial progress

Assets:
Assets and liabilities

History:
Charts and snapshots

Settings:
Financial assumptions

==================================================
13. UI DESIGN
==================================================

The UI should feel:

- Premium
- Minimal
- Calm
- Modern
- Financial
- Easy to understand

Avoid:

- excessive gradients
- excessive animations
- too many cards
- complicated dashboards
- tiny text
- unnecessary icons

The most important number on the Home screen should be:

"How close am I to financial independence?"

Use large typography.

Use good spacing.

Support dark mode if it is easy, but do not let it delay the MVP.

==================================================
14. DATA MODEL
==================================================

Create TypeScript interfaces.

UserProfile:

id
age
monthlyIncome
monthlySpending
expectedAnnualReturn
safeWithdrawalRate
currency

Asset:

id
name
category
value
createdAt
updatedAt

Liability:

id
name
category
value
createdAt
updatedAt

FinancialSnapshot:

id
date
totalAssets
totalLiabilities
netWorth
fiNumber
fiProgress

==================================================
15. PROJECT STRUCTURE
==================================================

Use a simple monorepo:

freedom-path/

├── apps/
│   └── mobile/
│       ├── app/
│       │   ├── index.tsx
│       │   ├── assets.tsx
│       │   ├── history.tsx
│       │   └── settings.tsx
│       │
│       ├── components/
│       ├── features/
│       │   ├── dashboard/
│       │   ├── assets/
│       │   ├── history/
│       │   └── settings/
│       ├── repositories/
│       ├── stores/
│       └── services/
│
├── packages/
│   └── financial-engine/
│       ├── src/
│       └── tests/
│
└── README.md

Keep the architecture simple.

Do not create unnecessary abstractions.

==================================================
16. TESTING
==================================================

The financial-engine must have unit tests.

At minimum test:

1. Total assets
2. Total liabilities
3. Net worth
4. FI number
5. Savings rate
6. FI progress
7. Future value
8. Projected FI date
9. What-if calculation
10. Edge cases

Example:

Annual spending = 240M
SWR = 4%

Expected FI number = 6B

Example:

Net worth = 1.5B
FI number = 6B

Expected FI progress = 25%

==================================================
17. IMPORTANT PRODUCT PRINCIPLE
==================================================

Do NOT turn this into a full personal finance management application.

The MVP has one question:

"How close am I to financial independence?"

Everything must support this question.

If a feature does not help answer that question, leave it out of the MVP.

==================================================
18. FUTURE ARCHITECTURE
==================================================

Do NOT implement this yet.

The future backend will be:

React Native
      ↓
API Gateway
      ↓
Lambda
      ↓
DynamoDB

Infrastructure:

AWS CDK

Authentication:

Cognito

Scheduled tasks:

EventBridge

AI:

Lambda
   ↓
Gemini/OpenAI API

But none of these should be implemented in the first MVP.

The code should be structured so that adding them later is possible without rewriting the financial-engine.

==================================================
DEVELOPMENT PROCESS
==================================================

Do NOT generate the entire application at once.

Work in small phases.

PHASE 1:
Create project
Create Expo app
Create navigation
Create basic UI

PHASE 2:
Create financial-engine
Implement calculations
Write tests

PHASE 3:
Implement onboarding
Implement assets
Implement liabilities

PHASE 4:
Implement dashboard

PHASE 5:
Implement snapshots and charts

PHASE 6:
Implement what-if calculator

PHASE 7:
Polish UI and fix bugs

After every phase:

- Explain what was implemented
- Show files changed
- Explain how to run
- Explain how to test
- List remaining work

Do not start the next phase automatically.

==================================================
FIRST TASK
==================================================

Start ONLY with Phase 1.

Do these things:

1. Initialize the monorepo.
2. Create the Expo React Native TypeScript application.
3. Configure Expo Router.
4. Create the four main screens:
   - Home
   - Assets
   - History
   - Settings
5. Create a simple bottom tab navigation.
6. Create the basic visual design system.
7. Put mock financial data on the Home screen.
8. Create reusable components for:
   - Progress indicator
   - Financial metric
   - Card
   - Section header
9. Make sure the app runs successfully on Android using Expo.

Do NOT implement AWS.

Do NOT implement authentication.

Do NOT implement AI.

Do NOT implement the financial engine yet.

Do NOT implement complex features.

The goal of Phase 1 is simply:

"Open the app and immediately see a beautiful Financial Freedom dashboard."

Keep the implementation small and clean.


ANIMATION & MOTION DESIGN
=========================

The app should have a premium iOS-style motion design inspired by
Apple Fitness and Apple Health.

Animation must be subtle, smooth and purposeful.

Do NOT use excessive animations.

Use:

React Native Reanimated
React Native Skia where appropriate

Main animations:

1. Financial Independence Progress Ring

When dashboard loads, animate progress from 0 to the actual FI progress.

Example:

0 → 28.4%

Duration:
800-1200ms

Use easing/spring appropriately.

2. Animated Financial Numbers

Animate important numbers when the dashboard appears.

Example:

0 → 1,700,000,000 VND

Do not animate every number on the screen.

Only animate important metrics.

3. Chart Drawing Animation

The net-worth line chart should draw from left to right when
the chart enters the viewport.

Duration:
700-1000ms

4. Card Entrance Animation

Dashboard cards should appear with:

opacity: 0 → 1
translateY: 12 → 0

Use small staggered delays.

Do not make cards fly across the screen.

5. Progress Updates

When the user updates their financial data:

- Animate the FI progress ring to the new value
- Animate the net worth number
- Animate the chart with the new data

The UI should communicate:

"My financial situation is moving."

6. Interaction Feedback

Buttons and interactive elements should have subtle:

- scale
- opacity
- spring
- haptic feedback where appropriate

7. Motion principles

Follow Apple-like principles:

- Fast
- Smooth
- Subtle
- Purposeful
- No unnecessary bouncing
- No excessive gradients
- No excessive particle effects
- No animations longer than necessary

The animation should make financial progress feel rewarding.

The most important animation in the entire app is:

FINANCIAL FREEDOM PROGRESS.

When the user opens the app and sees their progress ring animate,
the experience should immediately communicate:

"You are getting closer to financial freedom."


==================================================
CI/CD
==================================================

The project must have CI/CD from the beginning.

Use:

- GitHub
- GitHub Actions
- Expo EAS
- pnpm

Do NOT use Jenkins.
Do NOT use a self-hosted CI server.
Do NOT create unnecessary infrastructure.

==================================================
CI PIPELINE
==================================================

Every Pull Request must run:

1. Install dependencies
2. TypeScript type checking
3. ESLint
4. Unit tests
5. Financial-engine tests
6. Build validation

Example:

Pull Request
    ↓
GitHub Actions
    ↓
pnpm install
    ↓
pnpm typecheck
    ↓
pnpm lint
    ↓
pnpm test
    ↓
PASS / FAIL

The PR should fail if any required check fails.

==================================================
BRANCH STRATEGY
==================================================

Use:

main
develop
feature/*

Rules:

feature/*
    ↓
Pull Request
    ↓
develop
    ↓
staging

Production releases:

develop
    ↓
Pull Request
    ↓
main
    ↓
production build

Keep the workflow simple.

==================================================
ENVIRONMENTS
==================================================

Create:

development
staging
production

Do not hard-code environment-specific values.

Use environment variables.

Examples:

EXPO_PUBLIC_API_URL
EXPO_PUBLIC_ENV

Never commit:

API keys
AWS credentials
AI API keys
secrets

==================================================
EAS
==================================================

Use Expo EAS Build.

Create:

eas.json

with:

development
preview
production

Development:
Used for local development and internal testing.

Preview:
Used for testers/staging.

Production:
Used for App Store / Google Play release.

==================================================
GITHUB ACTIONS
==================================================

Create:

.github/
└── workflows/
    ├── ci.yml
    └── mobile-build.yml

ci.yml:

Trigger:

- pull_request
- push to develop
- push to main

Run:

pnpm install
pnpm typecheck
pnpm lint
pnpm test

mobile-build.yml:

Trigger:

- manual workflow dispatch initially
- optionally push to main later

Use Expo EAS to build the mobile application.

Do NOT automatically publish to App Store or Google Play yet.

==================================================
FUTURE AWS CI/CD
==================================================

Do NOT implement AWS deployment in the first MVP.

However, structure the repository so this can be added later:

GitHub
    ↓
GitHub Actions
    ↓
AWS CDK
    ↓
Development
    ↓
Staging
    ↓
Production

Future backend deployment:

pnpm cdk deploy

AWS infrastructure will eventually include:

- API Gateway
- Lambda
- DynamoDB
- Cognito
- EventBridge

Do not create these resources yet.

==================================================
QUALITY GATE
==================================================

A Pull Request cannot be considered ready if:

- TypeScript fails
- ESLint fails
- tests fail
- financial calculations fail

The financial-engine tests are especially important.

==================================================
FIRST IMPLEMENTATION
==================================================

For the current MVP, implement only:

1. GitHub Actions CI
2. TypeScript check
3. ESLint
4. Unit tests
5. Expo EAS configuration
6. Development/preview/production environments

Do NOT implement AWS deployment yet.

At the end, provide:

- .github/workflows/ci.yml
- .github/workflows/mobile-build.yml
- eas.json
- required package.json scripts
- README instructions for running CI locally
- GitHub Secrets required for EAS