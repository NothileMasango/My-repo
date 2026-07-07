/**
 * Cashback Processor Lambda
 * Triggered when a new Transaction is created.
 * Calculates 1% cashback, checks monthly R20 cap, and credits the wallet.
 */

interface CashbackEvent {
  transactionId: string;
  customerId: string;
  walletId: string;
  merchantName: string;
  amount: number;
  isParticipatingRetailer: boolean;
  currentMonthlyEarnings: number;
  currentBalance: number;
}

interface CashbackResult {
  cashbackAmount: number;
  applied: boolean;
  reason: string;
  newBalance: number;
  newMonthlyTotal: number;
  capReached: boolean;
}

const MONTHLY_CAP = parseFloat(process.env.MONTHLY_CASHBACK_CAP || "20.00");
const CASHBACK_RATE = parseFloat(process.env.CASHBACK_PERCENTAGE || "1.0") / 100;

export const handler = async (event: CashbackEvent): Promise<CashbackResult> => {
  console.log("Processing cashback:", JSON.stringify(event));

  if (!event.isParticipatingRetailer) {
    return {
      cashbackAmount: 0,
      applied: false,
      reason: `${event.merchantName} is not a participating retailer`,
      newBalance: event.currentBalance,
      newMonthlyTotal: event.currentMonthlyEarnings,
      capReached: false,
    };
  }

  let cashbackAmount = event.amount * CASHBACK_RATE;
  const remainingCap = MONTHLY_CAP - event.currentMonthlyEarnings;

  if (remainingCap <= 0) {
    return {
      cashbackAmount: 0,
      applied: false,
      reason: "Monthly cashback cap of R20 reached",
      newBalance: event.currentBalance,
      newMonthlyTotal: event.currentMonthlyEarnings,
      capReached: true,
    };
  }

  if (cashbackAmount > remainingCap) {
    cashbackAmount = remainingCap;
  }

  cashbackAmount = Math.round(cashbackAmount * 100) / 100;
  const newMonthlyTotal = event.currentMonthlyEarnings + cashbackAmount;
  const newBalance = event.currentBalance + cashbackAmount;

  return {
    cashbackAmount,
    applied: true,
    reason: `1% cashback on R${event.amount} at ${event.merchantName}`,
    newBalance,
    newMonthlyTotal,
    capReached: newMonthlyTotal >= MONTHLY_CAP,
  };
};
