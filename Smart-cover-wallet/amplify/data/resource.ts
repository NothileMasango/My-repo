import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Smart Cover Wallet Data Schema
 * 
 * Core entities:
 * - Customer: OM Bank customer linked to Old Mutual policies
 * - PremiumWallet: The cashback wallet with balance tracking
 * - Transaction: Grocery purchase transactions with cashback
 * - Policy: Old Mutual insurance policies
 * - InsightAlert: AI-generated risk alerts for premium payments
 * - CashbackRule: Participating retailer rules
 */
const schema = a.schema({
  // Customer profile linked to OM Bank account and Old Mutual policies
  Customer: a
    .model({
      email: a.string().required(),
      fullName: a.string().required(),
      omBankAccountId: a.string().required(),
      idNumber: a.string().required(),
      phoneNumber: a.string(),
      isEligible: a.boolean().default(false),
      eligibilityStatus: a.enum(["PENDING", "ELIGIBLE", "INELIGIBLE"]),
      wallet: a.hasOne("PremiumWallet", "customerId"),
      policies: a.hasMany("Policy", "customerId"),
      transactions: a.hasMany("Transaction", "customerId"),
      insights: a.hasMany("InsightAlert", "customerId"),
    })
    .authorization((allow) => [allow.owner()]),

  // Smart Cover Wallet - stores cashback balance
  PremiumWallet: a
    .model({
      customerId: a.id().required(),
      customer: a.belongsTo("Customer", "customerId"),
      balance: a.float().default(0),
      totalCashbackEarned: a.float().default(0),
      totalPremiumsCovered: a.float().default(0),
      monthlyEarnings: a.float().default(0),
      monthlyCapReached: a.boolean().default(false),
      lastResetDate: a.string(),
      status: a.enum(["ACTIVE", "SUSPENDED", "CLOSED"]),
      walletTransactions: a.hasMany("WalletTransaction", "walletId"),
    })
    .authorization((allow) => [allow.owner()]),

  // Grocery purchase transactions
  Transaction: a
    .model({
      customerId: a.id().required(),
      customer: a.belongsTo("Customer", "customerId"),
      merchantName: a.string().required(),
      merchantCategory: a.string().required(),
      amount: a.float().required(),
      cashbackAmount: a.float().default(0),
      cashbackApplied: a.boolean().default(false),
      transactionDate: a.string().required(),
      cardLast4: a.string(),
      status: a.enum(["PENDING", "COMPLETED", "DECLINED", "REVERSED"]),
      isParticipatingRetailer: a.boolean().default(false),
    })
    .authorization((allow) => [allow.owner()]),

  // Wallet movement ledger (credits and debits)
  WalletTransaction: a
    .model({
      walletId: a.id().required(),
      wallet: a.belongsTo("PremiumWallet", "walletId"),
      type: a.enum(["CASHBACK_CREDIT", "PREMIUM_DEBIT", "GROCERY_DEBIT", "MANUAL_CREDIT", "REVERSAL"]),
      amount: a.float().required(),
      description: a.string().required(),
      referenceId: a.string(),
      balanceAfter: a.float().required(),
      createdAt: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // Old Mutual insurance policies
  Policy: a
    .model({
      customerId: a.id().required(),
      customer: a.belongsTo("Customer", "customerId"),
      policyNumber: a.string().required(),
      policyType: a.enum(["LIFE", "FUNERAL", "SAVINGS", "RETIREMENT", "DISABILITY"]),
      monthlyPremium: a.float().required(),
      premiumDueDate: a.integer().required(), // day of month
      status: a.enum(["ACTIVE", "LAPSED", "PAID_UP", "CANCELLED"]),
      lastPaidDate: a.string(),
      nextDueDate: a.string().required(),
      coverAmount: a.float().required(),
      riskScore: a.float().default(0), // AI-calculated risk of lapse
    })
    .authorization((allow) => [allow.owner()]),

  // AI-generated insights and alerts
  InsightAlert: a
    .model({
      customerId: a.id().required(),
      customer: a.belongsTo("Customer", "customerId"),
      alertType: a.enum(["PREMIUM_AT_RISK", "LOW_BALANCE_WARNING", "CASHBACK_MILESTONE", "WALLET_COVER_APPLIED", "SPENDING_PATTERN_CHANGE"]),
      severity: a.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
      title: a.string().required(),
      message: a.string().required(),
      policyId: a.string(),
      actionTaken: a.boolean().default(false),
      actionDescription: a.string(),
      isRead: a.boolean().default(false),
      expiresAt: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // Participating grocery retailers
  ParticipatingRetailer: a
    .model({
      name: a.string().required(),
      merchantCodes: a.string().array(),
      cashbackPercentage: a.float().default(1.0),
      isActive: a.boolean().default(true),
      logoUrl: a.string(),
      category: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
