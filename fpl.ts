import { db } from "@/lib/prisma";

const base = process.env.FPL_API_URL || "https://fantasy.premierleague.com/api";

export async function syncFpl() {
  const res = await fetch(`${base}/bootstrap-static/`, { cache:"no-store" });
  if (!res.ok) throw new Error(`FPL API failed: ${res.status}`);
  const data = await res.json();

  for (const p of data.elements ?? []) {
    const positionMap: Record<number,string> = {1:"GK",2:"DEF",3:"MID",4:"FWD"};
    await db.player.upsert({
      where:{id:p.id},
      update:{
        name:`${p.first_name} ${p.second_name}`,
        club:String(p.team),
        position:positionMap[p.element_type] || "MID",
        price:Number(p.now_cost || 0)
      },
      create:{
        id:p.id,
        externalFplId:p.id,
        name:`${p.first_name} ${p.second_name}`,
        club:String(p.team),
        position:positionMap[p.element_type] || "MID",
        price:Number(p.now_cost || 0)
      }
    });
  }
  for (const e of data.events ?? []) {
    await db.gameweek.upsert({
      where:{fplGameweekId:e.id},
      update:{name:e.name, status:e.finished?"COMPLETED":e.is_current?"LIVE":e.is_next?"OPEN":"UPCOMING", deadline:e.deadline_time?new Date(e.deadline_time):null},
      create:{fplGameweekId:e.id,name:e.name,status:e.finished?"COMPLETED":e.is_current?"LIVE":e.is_next?"OPEN":"UPCOMING",deadline:e.deadline_time?new Date(e.deadline_time):null}
    });
  }
  return {players:data.elements?.length ?? 0, gameweeks:data.events?.length ?? 0};
}