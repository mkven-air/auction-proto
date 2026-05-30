import { useState } from "react";
import type { EmailTemplateType, Flight, MainTab } from "./src/features/auction-admin/types";
import { F, T } from "./src/features/auction-admin/theme";
import { FLIGHTS_DATA } from "./src/features/auction-admin/data";
import { Pill } from "./src/features/auction-admin/primitives";
import { FlightList } from "./src/features/auction-admin/FlightList";
import { FlightDetail } from "./src/features/auction-admin/FlightDetail";
import { GlobalRules } from "./src/features/auction-admin/GlobalRules";
import { EmailPreview } from "./src/features/auction-admin/EmailPreview";
import { PassengerBidUI } from "./src/features/auction-admin/PassengerBidUI";

// ─── Root App ─────────────────────────────────────────────────
export default function UpgradeAuctionAdmin() {
  const [tab, setTab] = useState<MainTab>("flights");
  const [emailTab, setEmailTab] = useState<EmailTemplateType>("pte");
  const [selectedFlight, setSelectedFlight] = useState<Flight["id"] | null>(null);

  const handleSelectFlight = (id: Flight["id"]) => {
    setSelectedFlight(id);
    setTab("flight");
  };
  const handleBack = () => {
    setSelectedFlight(null);
    setTab("flights");
  };

  const totalActive = FLIGHTS_DATA.filter((f) => f.status === "active").length;
  const totalBids = FLIGHTS_DATA.reduce((s, f) => s + f.bids, 0);

  const navItems = [
    { id: "flights", label: "Рейсы" },
    { id: "flight", label: "Детали рейса", hide: !selectedFlight },
    { id: "rules", label: "Глобальные правила" },
    { id: "email", label: "Email-шаблоны" },
    { id: "passenger", label: "Интерфейс пассажира" },
  ] satisfies Array<{ id: MainTab; label: string; hide?: boolean }>;
  const NAV = navItems.filter((t) => !t.hide);

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "600px",
        fontFamily: F.sans,
        color: T.text,
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          borderBottom: `0.5px solid ${T.border}`,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 0,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "13px 0",
            marginRight: 24,
          }}
        >
          <div
            style={{
              width: 26,
              height: 17,
              background: T.accent,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ fontSize: 8, fontWeight: 800, color: T.onAccentSoft, letterSpacing: 0.5 }}
            >
              HY
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text, letterSpacing: 0.5 }}>
            Auction Admin
          </span>
        </div>
        {NAV.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id !== "flight") setSelectedFlight(null);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "14px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: tab === t.id ? T.accent : T.textMuted,
              borderBottom: tab === t.id ? `2px solid ${T.accent}` : "2px solid transparent",
              marginBottom: -1,
              letterSpacing: 0.3,
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Pill color={T.greenText} bg={T.greenDim}>
            {totalActive} активных
          </Pill>
          <Pill color={T.accentText} bg={T.accentDim}>
            {totalBids} заявок
          </Pill>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: T.accentDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: T.accentText,
            }}
          >
            OP
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {tab === "flights" && <FlightList onSelect={handleSelectFlight} />}
        {tab === "flight" && selectedFlight && (
          <FlightDetail flightId={selectedFlight} onBack={handleBack} />
        )}
        {tab === "flight" && !selectedFlight && (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.textMuted }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>✈</div>
            <div style={{ fontSize: 14 }}>Выберите рейс из списка</div>
          </div>
        )}
        {tab === "rules" && <GlobalRules />}
        {tab === "passenger" && <PassengerBidUI />}
        {tab === "email" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 20,
                borderBottom: `0.5px solid ${T.border}`,
              }}
            >
              {(
                [
                  ["pte", "Приглашение (PTE)"],
                  ["chaser", "Напоминание"],
                  ["win", "Подтверждение"],
                ] as Array<[EmailTemplateType, string]>
              ).map(([id, lbl]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setEmailTab(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: emailTab === id ? T.text : T.textMuted,
                    borderBottom:
                      emailTab === id ? `2px solid ${T.accent}` : "2px solid transparent",
                    marginBottom: -1,
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <EmailPreview type={emailTab} />
          </>
        )}
      </div>
    </div>
  );
}
