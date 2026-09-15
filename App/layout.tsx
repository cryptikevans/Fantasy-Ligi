import "./globals.css";
export const metadata = { title: "Fantasy Ligi", description: "Kenya weekly cash-pool Fantasy Premier League" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><nav className="nav"><strong>Fantasy Ligi</strong><span>Kenya • Weekly FPL Cash Pools</span></nav>{children}</body></html>;
}