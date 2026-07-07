import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Customer: a
    .model({
      email: a.string().required(),
      fullName: a.string().required(),
      omBankAccountId: a.string().required(),
      idNumber: a.string().required(),
      phoneNumber: a.string(),
      isEligible: a.boolean().default(true),
    })
    .authorization((allow) => [allow.owner()]),

  Wallet: a
    .model({
      customerId: a.string().required(),
      balance: a.float().default(0),
      totalCashbackEarned: a.float().default(0),
      totalPremiumsCovered: a.float().default(0),
      monthlyEarnings: a.float().default(0),
      monthlyCap: a.float().default(150),
      lastResetDate: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Transaction: a
    .model({
      customerId: a.string().required(),
      merchantName: a.string().required(),
      merchantCategory: a.string().required(),
      amount: a.float().required(),
      cashbackAmount: a.float().default(0),
      cashbackApplied: a.boolean().default(false),
      transactionDate: a.string().required(),
      isParticipatingRetailer: a.boolean().default(false),
    })
    .authorization((allow) => [allow.owner()]),

  WalletTransaction: a
    .model({
      walletId: a.string().required(),
      type: a.enum(["CASHBACK_CREDIT", "PREMIUM_DEBIT", "GROCERY_DEBIT", "MANUAL_CREDIT"]),
      amount: a.float().required(),
      description: a.string().required(),
      balanceAfter: a.float().required(),
    })
    .authorization((allow) => [allow.owner()]),

  Policy: a
    .model({
      customerId: a.string().required(),
      policyNumber: a.string().required(),
      policyType: a.enum(["LIFE", "FUNERAL", "SAVINGS", "RETIREMENT", "DISABILITY"]),
      monthlyPremium: a.float().required(),
      premiumDueDate: a.integer().required(),
      status: a.enum(["ACTIVE", "LAPSED", "PAID_UP", "CANCELLED"]),
      nextDueDate: a.string().required(),
      coverAmount: a.float().required(),
      riskScore: a.float().default(0),
    })
    .authorization((allow) => [allow.owner()]),

  InsightAlert: a
    .model({
      customerId: a.string().required(),
      alertType: a.enum(["PREMIUM_AT_RISK", "LOW_BALANCE_WARNING", "CASHBACK_MILESTONE", "WALLET_COVER_APPLIED", "SPENDING_PATTERN_CHANGE"]),
      severity: a.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
      title: a.string().required(),
      message: a.string().required(),
      policyId: a.string(),
      actionTaken: a.boolean().default(false),
      isRead: a.boolean().default(false),
    })
    .authorization((allow) => [allow.owner()]),

  Retailer: a
    .model({
      name: a.string().required(),
      code: a.string().required(),
      cashbackPercentage: a.float().default(10.0),
      isActive: a.boolean().default(true),
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
