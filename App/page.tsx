import Link from "next/link";
export default function Home() {
  return <main className="container">
    <div className="card">
      <h1>Fantasy Ligi</h1>
      <p>Pick your Premier League squad, compete every gameweek, and win the weekly cash pool.</p>
      <Link className="btn" href="/register">Create account</Link>{" "}
      <Link className="btn" href="/login">Login</Link>
    </div>
    <div className="grid">
      <div className="card"><h3>Weekly competitions</h3><p>Every gameweek starts fresh. Points and prize pools reset.</p></div>
      <div className="card"><h3>M-Pesa wallet</h3><p>Deposit, enter leagues, win, and withdraw through M-Pesa.</p></div>
      <div className="card"><h3>Transparent ledger</h3><p>Every wallet movement appears in transaction history.</p></div>
    </div>
  </main>;
}