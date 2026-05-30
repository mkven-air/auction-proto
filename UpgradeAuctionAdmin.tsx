import { useState } from "react";
import type { EmailTemplateType, Flight, MainTab } from "./src/features/auction-admin/types";
import { F, T } from "./src/features/auction-admin/theme";
import { FLIGHTS_DATA } from "./src/features/auction-admin/data";
import { FlightList } from "./src/features/auction-admin/FlightList";
import { FlightDetail } from "./src/features/auction-admin/FlightDetail";
import { GlobalRules } from "./src/features/auction-admin/GlobalRules";
import { EmailPreview } from "./src/features/auction-admin/EmailPreview";
import { PassengerBidUI } from "./src/features/auction-admin/PassengerBidUI";
import {
  AdminHeader,
  EmailTemplateTabs,
  EmptyFlightState,
} from "./src/features/auction-admin/AdminShell";

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
        background: T.surfacePage,
        minHeight: "600px",
        fontFamily: F.sans,
        color: T.textPrimary,
        lineHeight: 1.4,
      }}
    >
      <AdminHeader
        navItems={NAV}
        activeTab={tab}
        totalActive={totalActive}
        totalBids={totalBids}
        onSelectTab={(nextTab) => {
          setTab(nextTab);
          if (nextTab !== "flight") setSelectedFlight(null);
        }}
      />

      <div style={{ padding: "20px 24px" }}>
        {tab === "flights" && <FlightList onSelect={handleSelectFlight} />}
        {tab === "flight" && selectedFlight && (
          <FlightDetail flightId={selectedFlight} onBack={handleBack} />
        )}
        {tab === "flight" && !selectedFlight && <EmptyFlightState />}
        {tab === "rules" && <GlobalRules />}
        {tab === "passenger" && <PassengerBidUI />}
        {tab === "email" && (
          <>
            <EmailTemplateTabs activeTab={emailTab} onChange={setEmailTab} />
            <EmailPreview type={emailTab} />
          </>
        )}
      </div>
    </div>
  );
}
