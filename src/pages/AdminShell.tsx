import { EMAIL_TEMPLATE_TYPE } from "../types";
import type { EmailTemplateType, MainTab } from "../types";
import { T } from "../theme";
import { Pill } from "../primitives";
import { TXT } from "../i18n";

type NavItem = {
  id: MainTab;
  label: string;
};

type AdminHeaderProps = {
  navItems: NavItem[];
  activeTab: MainTab;
  activeFlightsText: string;
  bidsText: string;
  onSelectTab: (tab: MainTab) => void;
};

export function AdminHeader({
  navItems,
  activeTab,
  activeFlightsText,
  bidsText,
  onSelectTab,
}: AdminHeaderProps) {
  return (
    <div
      style={{
        borderBottom: `0.5px solid ${T.borderDefault}`,
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
            background: T.brandPrimary,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              color: T.onBrandPrimarySoft,
              letterSpacing: 0.5,
            }}
          >
            HY
          </span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, letterSpacing: 0.5 }}>
          {TXT.admin.title}
        </span>
      </div>
      {navItems.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "14px 14px",
            fontSize: 13,
            fontWeight: 600,
            color: activeTab === tab.id ? T.brandPrimary : T.textMuted,
            borderBottom:
              activeTab === tab.id ? `2px solid ${T.brandPrimary}` : "2px solid transparent",
            marginBottom: -1,
            letterSpacing: 0.3,
          }}
        >
          {tab.label}
        </button>
      ))}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <Pill color={T.statusSuccessFg} bg={T.statusSuccessBg}>
          {activeFlightsText}
        </Pill>
        <Pill color={T.brandPrimaryFg} bg={T.brandPrimaryBg}>
          {bidsText}
        </Pill>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: T.brandPrimaryBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: T.brandPrimaryFg,
          }}
        >
          OP
        </div>
      </div>
    </div>
  );
}

type EmailTemplateTabsProps = {
  activeTab: EmailTemplateType;
  onChange: (tab: EmailTemplateType) => void;
};

const EMAIL_TABS: Array<[EmailTemplateType, string]> = [
  [EMAIL_TEMPLATE_TYPE.pte, TXT.emailTemplates.pte],
  [EMAIL_TEMPLATE_TYPE.chaser, TXT.emailTemplates.chaser],
  [EMAIL_TEMPLATE_TYPE.win, TXT.emailTemplates.win],
];

export function EmailTemplateTabs({ activeTab, onChange }: EmailTemplateTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        marginBottom: 20,
        borderBottom: `0.5px solid ${T.borderDefault}`,
      }}
    >
      {EMAIL_TABS.map(([id, label]) => (
        <button
          type="button"
          key={id}
          onClick={() => onChange(id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 600,
            color: activeTab === id ? T.textPrimary : T.textMuted,
            borderBottom:
              activeTab === id ? `2px solid ${T.brandPrimary}` : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function EmptyFlightState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0", color: T.textMuted }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>✈</div>
      <div style={{ fontSize: 14 }}>{TXT.admin.emptyFlightPrompt}</div>
    </div>
  );
}
