import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { EMAIL_TEMPLATE_TYPE, MAIN_TAB } from "@auction/core";
import type { EmailTemplateType, MainTab } from "@auction/core";
import { F, T } from "@auction/web-shared";
import { useFlightsSummary } from "./queries/useFlightsSummary";
import { useLocale } from "./locale";
import { FlightList } from "./pages/FlightList";
import { FlightDetail } from "./pages/FlightDetail";
import { GlobalRules } from "./pages/GlobalRules";
import { EmailPreview } from "./pages/EmailPreview";
import { EntitiesPage } from "./pages/EntitiesPage";
import { AdminHeader, EmailTemplateTabs, EmptyFlightState } from "./pages/AdminShell";

function routeToTab(pathname: string): MainTab {
  if (pathname === "/rules") return MAIN_TAB.rules;
  if (pathname === "/email") return MAIN_TAB.email;
  if (pathname === "/entities") return MAIN_TAB.entities;
  if (pathname.startsWith("/flights/")) return MAIN_TAB.flight;
  return MAIN_TAB.flights;
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
    template === EMAIL_TEMPLATE_TYPE.pte ||
    template === EMAIL_TEMPLATE_TYPE.chaser ||
    template === EMAIL_TEMPLATE_TYPE.win
      ? template
      : EMAIL_TEMPLATE_TYPE.pte;

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

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { txt } = useLocale();
  const {
    data: flightsSummary,
    isLoading: isFlightsLoading,
    isError: isFlightsError,
  } = useFlightsSummary();
  const tab = routeToTab(location.pathname);
  const selectedFlight = location.pathname.startsWith("/flights/")
    ? decodeURIComponent(location.pathname.replace("/flights/", ""))
    : null;

  const totalActive = flightsSummary?.active ?? 0;
  const totalBids = flightsSummary?.bids ?? 0;
  const activeFlightsText = isFlightsLoading
    ? txt.admin.states.loading
    : isFlightsError
      ? txt.admin.states.loadError
      : `${totalActive} ${txt.admin.activeFlightsSuffix}`;
  const bidsText = isFlightsLoading
    ? txt.admin.states.loading
    : isFlightsError
      ? txt.admin.states.loadError
      : `${totalBids} ${txt.admin.bidsSuffix}`;

  const navItems = [
    { id: MAIN_TAB.flights, label: txt.nav.flights },
    { id: MAIN_TAB.flight, label: txt.nav.flight, hide: !selectedFlight },
    { id: MAIN_TAB.rules, label: txt.nav.rules },
    { id: MAIN_TAB.email, label: txt.nav.email },
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
          if (nextTab === MAIN_TAB.flights) navigate("/flights");
          if (nextTab === MAIN_TAB.flight)
            navigate(selectedFlight ? `/flights/${selectedFlight}` : "/flights");
          if (nextTab === MAIN_TAB.rules) navigate("/rules");
          if (nextTab === MAIN_TAB.email) navigate("/email");
          if (nextTab === MAIN_TAB.entities) navigate("/entities");
        }}
      />

      <div style={{ padding: "20px 24px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/flights" replace />} />
          <Route path="/flights" element={<FlightsRoute />} />
          <Route path="/flights/:flightId" element={<FlightDetailRoute />} />
          <Route path="/rules" element={<GlobalRules />} />
          <Route path="/email" element={<EmailRoute />} />
          <Route path="/entities" element={<EntitiesPage />} />
          <Route path="*" element={<Navigate to="/flights" replace />} />
        </Routes>
      </div>
      <footer
        style={{
          padding: "16px 24px 24px",
          borderTop: `0.5px solid ${T.borderDefault}`,
          marginTop: 32,
          fontSize: 12,
          color: T.textMuted,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/entities")}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            color: T.brandPrimary,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          {txt.nav.entities}
        </button>
      </footer>
    </div>
  );
}
