import { notFound } from "next/navigation";
import { StatsView } from "@/components/StatsView";
import { isAdminKey } from "@/lib/ids";
import { getShopStats, getStats, rate } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stats · OneThing", robots: { index: false, follow: false } };

const DAYS = [7, 30, 90];

/** Site-wide visitors and conversion, people vs AI agents. Not linked anywhere; open it with ?key=ADMIN_KEY. */
export default async function AdminStats({ searchParams }: PageProps<"/admin/stats">) {
  const { key, days: d } = await searchParams;
  if (typeof key !== "string" || !isAdminKey(key)) notFound();
  const days = DAYS.includes(Number(d)) ? Number(d) : 30;
  const [stats, shops] = await Promise.all([getStats(null, days), getShopStats(days)]);
  const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Stats</h1>
        <div className="ml-auto flex gap-1 text-sm">
          {DAYS.map((n) => (
            <a
              key={n}
              href={`?key=${encodeURIComponent(key)}&days=${n}`}
              className={`rounded-full px-3 py-1 ${n === days ? "bg-foreground text-background" : "border border-line"}`}
            >
              {n} days
            </a>
          ))}
        </div>
      </div>
      <p className="mt-2 text-muted">Every shop. Revenue adds up amounts as if they were all US dollars.</p>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5">
        <StatsView stats={stats} currency="USD" />
      </div>

      <h2 className="mt-10 text-xl font-semibold">By shop</h2>
      {shops.length ? (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-line">
                <th className="p-3 font-medium">Shop</th>
                <th className="p-3 text-right font-medium">People</th>
                <th className="p-3 text-right font-medium">Agents</th>
                <th className="p-3 text-right font-medium">Checkouts</th>
                <th className="p-3 text-right font-medium">Paid</th>
                <th className="p-3 text-right font-medium">Conversion</th>
                <th className="p-3 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.slug} className="border-b border-line last:border-0">
                  <td className="p-3">
                    <a href={`/${s.slug}`} target="_blank" className="font-medium hover:underline">{s.name}</a>
                    <span className="ml-2 text-xs text-muted">/{s.slug}{s.status !== "live" && " · draft"}</span>
                  </td>
                  <td className="p-3 text-right tabular-nums">{s.web}</td>
                  <td className="p-3 text-right tabular-nums">{s.agent}</td>
                  <td className="p-3 text-right tabular-nums">{s.started}</td>
                  <td className="p-3 text-right tabular-nums">{s.paid}</td>
                  <td className="p-3 text-right tabular-nums">{rate(s.paid, s.web + s.agent)}</td>
                  <td className="p-3 text-right tabular-nums">{s.currency === "USD" ? usd(s.revenueCents) : `${(s.revenueCents / 100).toFixed(2)} ${s.currency}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-muted">No visits or orders in the last {days} days.</p>
      )}
    </main>
  );
}
