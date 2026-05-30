import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
  const location = useLocation();

  return (
    <FlightList
      onSelect={(id) =>
        navigate(`/flights/${id}`, {
          state: { from: `${location.pathname}${location.search}` },
        })
      }
    />
  );
}

function FlightDetailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ flightId: string }>();
  const from =
    location.state && typeof location.state === "object" && "from" in location.state
      ? String(location.state.from)
      : "/flights";

  if (!params.flightId) {
    return <EmptyFlightState />;
  }

  return <FlightDetail flightId={params.flightId} onBack={() => navigate(from)} />;
}

function EmailRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const template = searchParams.get("template");
  const emailTab: EmailTemplateType =
    template === "pte" || template === "chaser" || template === "win" ? template : "pte";

  return (
    <>
      <EmailTemplateTabs
        activeTab={emailTab}
        onChange={(tab) => {
          const next = new URLSearchParams(searchParams);
          next.set("template", tab);
          setSearchParams(next, { replace: true });
        }}
      />
      <EmailPreview type={emailTab} />
    </>
  );
}

// ─── Root App ─────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: flights = [], isLoading: isFlightsLoading, isError: isFlightsError } = useFlights();
  const tab = routeToTab(location.pathname);
  const selectedFlight = location.pathname.startsWith("/flights/")
    ? decodeURIComponent(location.pathname.replace("/flights/", ""))
    : null;

  const totalActive = flights.filter((f) => f.status === "active").length;
  const totalBids = flights.reduce((s, f) => s + f.bids, 0);
  const activeFlightsText = isFlightsLoading
    ? TXT.admin.states.loading
    : isFlightsError
      ? TXT.admin.states.loadError
      : `${totalActive} ${TXT.admin.activeFlightsSuffix}`;
  const bidsText = isFlightsLoading
    ? TXT.admin.states.loading
    : isFlightsError
      ? TXT.admin.states.loadError
      : `${totalBids} ${TXT.admin.bidsSuffix}`;

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
        activeFlightsText={activeFlightsText}
        bidsText={bidsText}
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
