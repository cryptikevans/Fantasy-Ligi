import { db } from "../lib/prisma";

async function main() {
  const gw = await db.gameweek.findFirst({where:{status:{in:["OPEN","LIVE"]}},orderBy:{fplGameweekId:"desc"}});
  if (!gw) throw new Error("No open/live gameweek");
  const templates = await db.leagueTemplate.findMany({where:{active:true}});
  for (const t of templates) {
    const existing = await db.league.findFirst({where:{templateId:t.id,gameweekId:gw.id,status:{in:["OPEN","FULL","ACTIVE"]}}});
    if (existing) continue;
    await db.league.create({
      data:{
        templateId:t.id, gameweekId:gw.id, memberCount:t.memberCount,
        entryFee:t.entryFee, prizePool:t.entryFee*t.memberCount,
        joinDeadline:gw.deadline
      }
    });
  }
  console.log("League instances created.");
}
main().finally(()=>db.$disconnect());