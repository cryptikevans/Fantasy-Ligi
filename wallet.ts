import { TransactionStatus, TransactionType } from "@prisma/client";
import { db } from "@/lib/prisma";

export async function holdEntryFee(userId: string, leagueId: string, amount: number) {
  return db.$transaction(async tx => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.walletBalance < amount) throw new Error("INSUFFICIENT_FUNDS");

    const before = user.walletBalance;
    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        walletBalance: { decrement: amount },
        reservedBalance: { increment: amount }
      }
    });

    return tx.transaction.create({
      data: {
        userId,
        type: TransactionType.ENTRY_FEE,
        amount: -amount,
        status: TransactionStatus.HELD,
        balanceBefore: before,
        balanceAfter: updated.walletBalance,
        reservedBefore: user.reservedBalance,
        reservedAfter: updated.reservedBalance,
        relatedLeagueId: leagueId,
        description: `Held entry fee for league ${leagueId}`
      }
    });
  });
}

export async function creditWallet(userId: string, amount: number, type: TransactionType, description: string, mpesaRef?: string) {
  return db.$transaction(async tx => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("USER_NOT_FOUND");
    const before = user.walletBalance;
    const updated = await tx.user.update({
      where: { id: userId },
      data: { walletBalance: { increment: amount } }
    });
    return tx.transaction.create({
      data: {
        userId, type, amount, status: TransactionStatus.COMPLETED,
        balanceBefore: before, balanceAfter: updated.walletBalance,
        reservedBefore: user.reservedBalance, reservedAfter: user.reservedBalance,
        description, mpesaRef
      }
    });
  });
}