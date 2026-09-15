import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Leaderboard() {
  const user = await getCurrentUser(); if(!user) redirect("/login");
  const gw = await db.gameweek.findFirst({where:{status:{in:["OPEN","LIVE"]}},orderBy:{fplGameweekId:"desc"}});
  const rows = gw ? await db.gameweekScore.findMany({where:{gameweekId:gw.id},include:{user:true},orderBy:{points:"desc"}}) : [];
  return <main className="container"><h1>Global leaderboard</h1><p className="muted">Current gameweek only. Points reset every gameweek.</p>
  <div className="card"><table><thead><tr><th>Rank</th><th>Player</th><th>Points</th></tr></thead><tbody>{rows.map((r,i)=><tr key={r.id}><td>{i+1}</td><td>{r.user.name}</td><td>{r.points}</td></tr>)}</tbody></table></div></main>;
}