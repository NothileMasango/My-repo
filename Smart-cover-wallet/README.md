# Bread Winners - Premium Wallet by OM Bank

> One product. Two safety nets. Every grocery shop not only helps put food on the table today but also helps protect what matters most tomorrow.

## Overview

**Bread Winners** is an intelligent Premium Wallet benefit within the OM Bank app, exclusively available to customers who have both an OM Bank account and at least one active Old Mutual policy.

### Key Features

- **1% Grocery Cashback** - Earn cashback on purchases at participating retailers (Pick n Pay, Checkers, Shoprite, Woolworths Food, Spar, etc.)
- **R20 Monthly Cap** - Up to R20 cashback per month, automatically deposited into your Premium Wallet
- **AI-Driven Insights** - Continuously monitors payment patterns to identify customers at risk of missing insurance premiums
- **Auto-Cover Protection** - When sufficient funds are available, the wallet automatically covers missed premiums to prevent policy lapses
- **Financial Resilience** - Transforms everyday spending into long-term financial protection

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: AWS Amplify Gen 2
- **Authentication**: Amazon Cognito
- **Database**: Amazon DynamoDB (via Amplify Data)
- **Functions**: AWS Lambda (TypeScript)
  - Cashback Processor - Calculates and applies 1% cashback
  - AI Insights Engine - Risk scoring and auto-cover logic
- **Hosting**: AWS Amplify Hosting

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                  │
│  Dashboard | Wallet | Policies | AI Insights         │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────┐
│              AWS Amplify Gen 2                        │
├───────────────────────┼─────────────────────────────┤
│                       │                              │
│  ┌──────────┐  ┌─────┴─────┐  ┌──────────────┐    │
│  │  Cognito │  │  AppSync  │  │   Lambda     │    │
│  │   Auth   │  │   (API)   │  │  Functions   │    │
│  └──────────┘  └─────┬─────┘  └──────┬───────┘    │
│                       │               │             │
│                  ┌────┴────┐    ┌─────┴──────┐     │
│                  │DynamoDB │    │ AI Insights│     │
│                  │ Tables  │    │   Engine   │     │
│                  └─────────┘    └────────────┘     │
└─────────────────────────────────────────────────────┘
```

## Data Model

| Entity | Description |
|--------|-------------|
| Customer | OM Bank customer linked to Old Mutual policies |
| PremiumWallet | Cashback wallet with balance & monthly tracking |
| Transaction | Grocery purchase records with cashback calculation |
| WalletTransaction | Ledger of wallet credits/debits |
| Policy | Old Mutual insurance policies with AI risk scores |
| InsightAlert | AI-generated alerts & recommendations |
| ParticipatingRetailer | Approved grocery merchants |

## Deployment Instructions

### Prerequisites

1. An AWS Account with Amplify access
2. AWS CLI configured with appropriate credentials
3. Node.js 18+ installed locally
4. Git installed

### Step 1: Push to GitHub

```bash
cd bread-winners
git init
git add .
git commit -m "Initial commit - Bread Winners Premium Wallet"
git remote add origin https://github.com/YOUR_USERNAME/bread-winners.git
git push -u origin main
```

### Step 2: Deploy with AWS Amplify Console

1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** > **"Host web app"**
3. Select **GitHub** as source provider
4. Authorize AWS Amplify to access your GitHub repo
5. Select the `bread-winners` repository and `main` branch
6. Amplify will auto-detect the `amplify.yml` build settings
7. Click **"Save and deploy"**

### Step 3: Alternative - CLI Deployment

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Navigate to project
cd bread-winners

# Install dependencies
npm install

# Deploy backend (creates Cognito, DynamoDB, Lambda)
npx ampx sandbox

# For production deployment
npx ampx pipeline-deploy --branch main
```

### Step 4: Configure Amplify Outputs

After deployment, Amplify generates `amplify_outputs.json` with your:
- Cognito User Pool ID
- API endpoint
- Region configuration

This file is auto-generated during build.

## Local Development

```bash
# Install dependencies
npm install

# Start Amplify sandbox (backend)
npx ampx sandbox

# Start Next.js dev server (in another terminal)
npm run dev
```

## Business Logic

### Cashback Rules
- 1% cashback on qualifying grocery purchases
- Monthly cap: R20 per customer
- Resets on the 1st of each month
- Only at participating retailers

### AI Risk Scoring Factors
| Factor | Weight | Description |
|--------|--------|-------------|
| Spending Ratio | 25% | Monthly spending vs income |
| Payment History | 30% | Late payment track record |
| Days Until Due | 20% | Urgency based on proximity to due date |
| Balance Coverage | 15% | Can current balance cover premium? |
| Consecutive Missed | 10% | Pattern of missed payments |

### Auto-Cover Trigger
- Risk score > 75% (High)
- Premium due within 2 days
- Wallet balance sufficient to cover premium
- Customer has opted in to auto-cover

## Hackathon Team

Built for the Old Mutual / OM Bank Hackathon 2026.

---

*Bread Winners transforms everyday spending into financial resilience - rewarding customers while safeguarding their financial future.*
