import { db } from "@/lib/prisma";
import { holdEntryFee } from "@/lib/wallet";

export async function joinLeague(userId: string, leagueId: string) {
  return db.$transaction(async tx => {
    const league = await tx.league.findUnique({ where:{id:leagueId}, include:{memberships:true} });
    if (!league || league.status !== "OPEN") throw new Error("LEAGUE_NOT_OPEN");
    if (league.memberships.some(m => m.userId === userId)) throw new Error("ALREADY_JOINED");
    if (league.memberships.length >= league.memberCount) throw new Error("LEAGUE_FULL");

    const user = await tx.user.findUnique({where:{id:userId}});
    if (!user || user.walletBalance < league.entryFee) throw new Error("INSUFFICIENT_FUNDS");

    const before = user.walletBalance;
    const updatedUser = await tx.user.update({
      where:{id:userId},
      data:{walletBalance:{decrement:league.entryFee}, reservedBalance:{increment:league.entryFee}}
    });
    await tx.transaction.create({
      data:{
        userId, type:"ENTRY_FEE", amount:-league.entryFee, status:"HELD",
        balanceBefore:before, balanceAfter:updatedUser.walletBalance,
        reservedBefore:user.reservedBalance, reservedAfter:updatedUser.reservedBalance,
        relatedLeagueId:leagueId, description:`Held entry fee for ${leagueId}`
      }
    });
    await tx.leagueMembership.create({data:{userId,leagueId}});
    const count = league.memberships.length + 1;
    await tx.league.update({where:{id:leagueId}, data:{status:count===league.memberCount?"FULL":"OPEN"}});
    return { count };
  });
}