import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import type { EmailTemplateType, MainTab } from "./types";
import { F, T } from "./theme";
import { FlightList } from "./FlightList";
import { FlightDetail } from "./FlightDetail";
import { GlobalRules } from "./GlobalRules";
import { EmailPreview } from "./EmailPreview";
import { PassengerBidUI } from "./PassengerBidUI";
import { AdminHeader, EmailTemplateTabs, EmptyFlightState } from "./AdminShell";
import { TXT } from "./i18n";
import { useFlights } from "./queries/useFlights";

function routeToTab(pathname: string): MainTab {
  if (pathname === "/rules") return "rules";
  if (pathname === "/email") return "email";
  if (pathname === "/passenger") return "passenger";
  if (pathname.startsWith("/flights/")) return "flight";
  return "flights";
}

function FlightsRoute() {
  const navigate = useNavigate();
  return <FlightList onSelect={(id) => navigate(`/flights/${id}`)} />;
}

function FlightDetailRoute() {
  const navigate = useNavigate();
  const params = useParams<{ flightId: string }>();

  if (!params.flightId) {
    return <EmptyFlightState />;
  }

  return <FlightDetail flightId={params.flightId} onBack={() => navigate("/flights")} />;
}

function EmailRoute() {
  const [emailTab, setEmailTab] = useState<EmailTemplateType>("pte");
  return (
    <>
      <EmailTemplateTabs activeTab={emailTab} onChange={setEmailTab} />
      <EmailPreview type={emailTab} />
    </>
  );
}

// ─── Root App ─────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: flights = [] } = useFlights();
  const tab = routeToTab(location.pathname);
  const selectedFlight = location.pathname.startsWith("/flights/")
    ? decodeURIComponent(location.pathname.replace("/flights/", ""))
    : null;

  const totalActive = flights.filter((f) => f.status === "active").length;
  const totalBids = flights.reduce((s, f) => s + f.bids, 0);

  const navItems = [
    { id: "flights", label: TXT.nav.flights },
    { id: "flight", label: TXT.nav.flight, hide: !selectedFlight },
    { id: "rules", label: TXT.nav.rules },
    { id: "email", label: TXT.nav.email },
    { id: "passenger", label: TXT.nav.passenger },
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
          if (nextTab === "flights") navigate("/flights");
          if (nextTab === "flight")
            navigate(selectedFlight ? `/flights/${selectedFlight}` : "/flights");
          if (nextTab === "rules") navigate("/rules");
          if (nextTab === "email") navigate("/email");
          if (nextTab === "passenger") navigate("/passenger");
        }}
      />

      <div style={{ padding: "20px 24px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/flights" replace />} />
          <Route path="/flights" element={<FlightsRoute />} />
          <Route path="/flights/:flightId" element={<FlightDetailRoute />} />
          <Route path="/rules" element={<GlobalRules />} />
          <Route path="/email" element={<EmailRoute />} />
          <Route path="/passenger" element={<PassengerBidUI />} />
          <Route path="*" element={<Navigate to="/flights" replace />} />
        </Routes>
      </div>
    </div>
  );
}
