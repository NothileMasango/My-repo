# Smart Cover Wallet - OM Bank Hackathon

> One product. Two safety nets. Earn cashback on groceries. Protect your insurance premiums.

## Full-Stack App with Real Backend

This is a **fully functional** AWS Amplify Gen 2 application with real authentication, database, and serverless functions.

## Quick Start (Local)

```bash
cd Smart-cover-wallet
npm install

# Start Amplify sandbox (creates real AWS resources)
npx ampx sandbox

# In another terminal - start the frontend
npm run dev
```

Open http://localhost:3000

## How It Works

1. **Sign Up/Sign In** → Real Amazon Cognito authentication
2. **Seed Demo Data** → Visit `/dashboard/seed` after first sign-in
3. **Add Transactions** → Choose a retailer, enter amount, get 1% cashback
4. **View Dashboard** → Real-time wallet balance, transactions, cashback
5. **AI Insights** → Alerts generated based on spending patterns

## Architecture

| Layer | Technology | What it does |
|-------|-----------|--------------|
| **Frontend** | Next.js 14 + Tailwind | Dashboard, wallet, transactions |
| **Auth** | Amazon Cognito | Email/password sign-up & sign-in |
| **Database** | DynamoDB (7 tables) | All app data |
| **API** | AppSync (GraphQL) | Real-time data access |
| **Functions** | AWS Lambda | Cashback processor + AI engine |
| **Hosting** | Amplify Hosting | CDN + SSL |

## Deploy to AWS

```bash
# Option 1: Connect to Amplify Console
# Push to GitHub, then connect at console.aws.amazon.com/amplify

# Option 2: CLI deployment
npx ampx pipeline-deploy --branch main
```

## Business Logic

- **1% cashback** on grocery purchases at 9 participating retailers
- **R20/month cap** - resets on 1st of each month
- **AI risk scoring** - 5-factor model predicts premium payment risk
- **Auto-cover** - wallet automatically pays premiums when at risk
