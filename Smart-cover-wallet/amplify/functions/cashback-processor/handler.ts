/**
 * Cashback Processor Lambda
 * 
 * Processes grocery transactions and calculates 1% cashback.
 * Rules:
 * - 1% cashback on grocery purchases at participating retailers
 * - Monthly cap of R20 per customer
 * - Automatically credits the Smart Cover Wallet
 * - Resets monthly cap on the 1st of each month
 */

interface TransactionEvent {
  customerId: string;
  walletId: string;
  transactionId: string;
  merchantName: string;
  merchantCategory: string;
  amount: number;
  transactionDate: string;
  isParticipatingRetailer: boolean;
}

interface CashbackResult {
  cashbackAmount: number;
  applied: boolean;
  reason: string;
  newWalletBalance: number;
  monthlyTotalAfter: number;
  capReached: boolean;
}

// Participating retailers (would be from DynamoDB in production)
const PARTICIPATING_RETAILERS = [
  "Pick n Pay",
  "Checkers",
  "Shoprite",
  "Woolworths Food",
  "Spar",
  "Food Lover's Market",
  "Makro",
  "Game",
  "OK Foods",
  "Boxer",
];

const MONTHLY_CAP = parseFloat(process.env.MONTHLY_CASHBACK_CAP || "20.00");
const CASHBACK_RATE = parseFloat(process.env.CASHBACK_PERCENTAGE || "1.0") / 100;

export const handler = async (event: TransactionEvent): Promise<CashbackResult> => {
  console.log("Processing cashback for transaction:", JSON.stringify(event));

  const {
    customerId,
    walletId,
    transactionId,
    merchantName,
    amount,
    isParticipatingRetailer,
  } = event;

  // Validate participating retailer
  if (!isParticipatingRetailer) {
    return {
      cashbackAmount: 0,
      applied: false,
      reason: `${merchantName} is not a participating retailer`,
      newWalletBalance: 0,
      monthlyTotalAfter: 0,
      capReached: false,
    };
  }

  // Calculate raw cashback (1% of transaction amount)
  let cashbackAmount = amount * CASHBACK_RATE;

  // In production: Query DynamoDB for current monthly earnings
  // For hackathon demo, we simulate this
  const currentMonthlyEarnings = 0; // Would come from wallet record

  // Check monthly cap
  const remainingCap = MONTHLY_CAP - currentMonthlyEarnings;
  
  if (remainingCap <= 0) {
    return {
      cashbackAmount: 0,
      applied: false,
      reason: "Monthly cashback cap of R20 reached",
      newWalletBalance: 0,
      monthlyTotalAfter: currentMonthlyEarnings,
      capReached: true,
    };
  }

  // Apply cap limit
  if (cashbackAmount > remainingCap) {
    cashbackAmount = remainingCap;
  }

  // Round to 2 decimal places
  cashbackAmount = Math.round(cashbackAmount * 100) / 100;

  const newMonthlyTotal = currentMonthlyEarnings + cashbackAmount;
  const capReached = newMonthlyTotal >= MONTHLY_CAP;

  console.log(`Cashback calculated: R${cashbackAmount} for R${amount} purchase at ${merchantName}`);
  console.log(`Monthly total: R${newMonthlyTotal}/${MONTHLY_CAP} | Cap reached: ${capReached}`);

  // In production: Update DynamoDB wallet balance and create WalletTransaction record
  // For hackathon, return the calculated result

  return {
    cashbackAmount,
    applied: true,
    reason: `1% cashback on R${amount} grocery purchase at ${merchantName}`,
    newWalletBalance: cashbackAmount, // Would add to existing balance
    monthlyTotalAfter: newMonthlyTotal,
    capReached,
  };
};
