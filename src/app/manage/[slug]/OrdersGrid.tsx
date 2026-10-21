"use client";

import { useMemo, useState } from "react";
import { AllCommunityModule, ModuleRegistry, themeQuartz, type ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { Order } from "@/lib/shops";

// Sponsor tool: AG Grid — the seller's orders table (sort, filter, quick search).
ModuleRegistry.registerModules([AllCommunityModule]);

export type SellerOrder = Omit<Order, "download_token">;

const CARRIERS = ["USPS", "UPS", "FEDEX", "DHL", "OTHER"] as const;
const theme = themeQuartz.withParams({ fontFamily: "inherit", headerFontWeight: 600, accentColor: "#1f4fd8" });

const fmtAddr = (a: SellerOrder["shipping_address"]) =>
  a ? [a.address_line_1, a.admin_area_2, a.admin_area_1, a.postal_code, a.country_code].filter(Boolean).join(", ") : "";

export function OrdersGrid(props: {
  orders: SellerOrder[];
  physical: boolean;
  onShip(orderId: string, carrier: string, trackingNumber: string, carrierName?: string): Promise<string | null>;
}) {
  const [search, setSearch] = useState("");
  const [shipping, setShipping] = useState<SellerOrder | null>(null);

  const cols = useMemo<ColDef<SellerOrder>[]>(
    () => [
      {
        headerName: "Date",
        field: "paid_at",
        sort: "desc",
        width: 150,
        valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : ""),
      },
      { headerName: "Buyer", valueGetter: (p) => p.data?.buyer_name ?? p.data?.buyer_email, flex: 1, minWidth: 140 },
      { headerName: "Email", field: "buyer_email", flex: 1, minWidth: 160 },
      // The buyer's size/colour when the shop has options.
      { headerName: "Options", valueGetter: (p) => (p.data?.options ? Object.values(p.data.options).join(" / ") : ""), width: 130 },
      // Orders started by an AI agent through the MCP server (/api/mcp), not the shop page.
      { headerName: "Via", field: "channel", width: 100, valueFormatter: (p) => (p.value === "agent" ? "AI agent" : "Shop page") },
      {
        headerName: "Total",
        field: "amount_cents",
        width: 110,
        type: "rightAligned",
        valueFormatter: (p) => `$${((p.value as number) / 100).toFixed(2)}`,
      },
      ...(props.physical
        ? ([
            { headerName: "Ship to", valueGetter: (p) => fmtAddr(p.data?.shipping_address ?? null), flex: 1.4, minWidth: 200 },
            {
              headerName: "Status",
              field: "fulfillment_status",
              width: 170,
              cellRenderer: (p: { data?: SellerOrder }) =>
                p.data?.fulfillment_status === "to_ship" ? (
                  <button className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white" onClick={() => setShipping(p.data!)}>
                    Mark shipped
                  </button>
                ) : (
                  <span title={p.data?.tracking_synced ? "Tracking sent to PayPal" : "Not synced to PayPal"}>
                    Shipped · {p.data?.carrier} {p.data?.tracking_number}
                  </span>
                ),
            },
          ] satisfies ColDef<SellerOrder>[])
        : ([
            { headerName: "Downloads", field: "downloads", width: 120, type: "rightAligned" },
          ] satisfies ColDef<SellerOrder>[])),
      { headerName: "PayPal order", field: "paypal_order_id", width: 170 },
    ],
    [props.physical],
  );

  return (
    <div className="space-y-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search orders…"
        className="w-full max-w-xs rounded-lg border border-line bg-white px-3 py-2 text-sm"
      />
      <div style={{ height: 380 }}>
        <AgGridReact<SellerOrder>
          theme={theme}
          rowData={props.orders}
          columnDefs={cols}
          quickFilterText={search}
          getRowId={(p) => p.data.id}
          overlayNoRowsTemplate="No orders yet — share your shop link to get your first sale."
        />
      </div>
      {shipping && <ShipForm order={shipping} onClose={() => setShipping(null)} onShip={props.onShip} />}
    </div>
  );
}

function ShipForm(props: {
  order: SellerOrder;
  onClose(): void;
  onShip(orderId: string, carrier: string, trackingNumber: string, carrierName?: string): Promise<string | null>;
}) {
  const [carrier, setCarrier] = useState<string>("USPS");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        const error = await props.onShip(props.order.id, carrier, String(f.get("tracking")), String(f.get("carrier_name") ?? ""));
        setBusy(false);
        if (error) setErr(error);
        else props.onClose();
      }}
    >
      <p className="w-full text-sm font-medium">
        Ship to {props.order.buyer_name} — {fmtAddr(props.order.shipping_address)}
      </p>
      <label className="text-sm">
        Carrier
        <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="mt-1 block rounded-lg border border-line px-2 py-2">
          {CARRIERS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      {carrier === "OTHER" && (
        <label className="text-sm">
          Carrier name
          <input name="carrier_name" required className="mt-1 block rounded-lg border border-line px-2 py-2" />
        </label>
      )}
      <label className="text-sm grow">
        Tracking number
        <input name="tracking" required minLength={4} className="mt-1 block w-full rounded-lg border border-line px-2 py-2" />
      </label>
      <button disabled={busy} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
        {busy ? "Saving…" : "Mark shipped"}
      </button>
      <button type="button" onClick={props.onClose} className="px-3 py-2.5 text-sm text-muted">Cancel</button>
      {err && <p className="w-full text-sm text-red-700">{err}</p>}
    </form>
  );
}
