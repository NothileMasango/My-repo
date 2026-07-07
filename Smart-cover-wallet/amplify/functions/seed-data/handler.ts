/**
 * Seed Data Script
 * Run after first sign-up to populate demo data for the logged-in user.
 * 
 * Usage: After deploying and signing up, run from the browser console OR
 * call this through a custom mutation/admin action.
 * 
 * This file also serves as documentation for what data the app expects.
 */

export const SEED_WALLET = {
  balance: 156.42,
  totalCashbackEarned: 412.87,
  totalPremiumsCovered: 256.45,
  monthlyEarnings: 14.32,
  monthlyCap: 20,
  lastResetDate: "2026-07-01",
};

export const SEED_POLICIES = [
  {
    policyNumber: "OM-LIFE-2024-5678",
    policyType: "LIFE",
    monthlyPremium: 450.0,
    premiumDueDate: 25,
    status: "ACTIVE",
    nextDueDate: "2026-08-25",
    coverAmount: 500000.0,
    riskScore: 0.23,
  },
  {
    policyNumber: "OM-FUN-2024-9012",
    policyType: "FUNERAL",
    monthlyPremium: 125.0,
    premiumDueDate: 28,
    status: "ACTIVE",
    nextDueDate: "2026-08-28",
    coverAmount: 50000.0,
    riskScore: 0.12,
  },
];

export const SEED_TRANSACTIONS = [
  { merchantName: "Pick n Pay - Sandton", merchantCategory: "Grocery", amount: 1245.67, cashbackAmount: 12.46, cashbackApplied: true, transactionDate: "2026-07-06", isParticipatingRetailer: true },
  { merchantName: "Checkers - Rosebank", merchantCategory: "Grocery", amount: 876.23, cashbackAmount: 8.76, cashbackApplied: true, transactionDate: "2026-07-04", isParticipatingRetailer: true },
  { merchantName: "Woolworths Food", merchantCategory: "Grocery", amount: 432.10, cashbackAmount: 4.32, cashbackApplied: true, transactionDate: "2026-07-02", isParticipatingRetailer: true },
  { merchantName: "Engen Garage", merchantCategory: "Fuel", amount: 950.00, cashbackAmount: 0, cashbackApplied: false, transactionDate: "2026-07-03", isParticipatingRetailer: false },
  { merchantName: "Shoprite - Soweto", merchantCategory: "Grocery", amount: 654.89, cashbackAmount: 5.68, cashbackApplied: true, transactionDate: "2026-06-30", isParticipatingRetailer: true },
];

export const SEED_INSIGHTS = [
  {
    alertType: "WALLET_COVER_APPLIED",
    severity: "MEDIUM",
    title: "Premium Auto-Covered",
    message: "Your Smart Cover Wallet automatically covered your Funeral policy premium of R125.00. Policy remains active.",
    actionTaken: true,
    isRead: true,
  },
  {
    alertType: "CASHBACK_MILESTONE",
    severity: "LOW",
    title: "R400 Cashback Milestone!",
    message: "Congratulations! Your lifetime cashback exceeded R400. Keep shopping to grow your safety net.",
    actionTaken: false,
    isRead: false,
  },
  {
    alertType: "PREMIUM_AT_RISK",
    severity: "LOW",
    title: "Life Premium Coming Up",
    message: "Your Life policy premium of R450.00 is due on 25 August. Wallet balance: R156.42.",
    actionTaken: false,
    isRead: false,
  },
];

/**
 * To seed data after sign-up, paste this into the browser console:
 * 
 * import { generateClient } from 'aws-amplify/data';
 * const client = generateClient();
 * 
 * // Create wallet
 * await client.models.Wallet.create({ customerId: 'YOUR_USER_ID', ...SEED_WALLET });
 * 
 * // Create policies
 * for (const p of SEED_POLICIES) {
 *   await client.models.Policy.create({ customerId: 'YOUR_USER_ID', ...p });
 * }
 * 
 * // Create transactions
 * for (const t of SEED_TRANSACTIONS) {
 *   await client.models.Transaction.create({ customerId: 'YOUR_USER_ID', ...t });
 * }
 * 
 * // Create insights
 * for (const i of SEED_INSIGHTS) {
 *   await client.models.InsightAlert.create({ customerId: 'YOUR_USER_ID', ...i });
 * }
 */

// This handler can be invoked as a Lambda for admin seeding
export const handler = async (event: { userId: string }) => {
  console.log("Seed data handler invoked for user:", event.userId);
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "Use the Amplify client in the browser after sign-up to seed data.",
      seedData: { SEED_WALLET, SEED_POLICIES, SEED_TRANSACTIONS, SEED_INSIGHTS }
    }),
  };
};
