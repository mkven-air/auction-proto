import { EMAIL_TEMPLATE_TYPE } from "@auction/core";
import type { EmailTemplateType, MainTab } from "@auction/core";
import { T } from "@auction/web-shared";
import { Pill } from "@auction/web-shared";
import { useLocale } from "../locale";
import type { Locale } from "@auction/web-shared";
import { cn } from "@auction/web-shared";

type Txt = ReturnType<typeof useLocale>["txt"];

const LOCALES: Array<{ code: Locale; label: string }> = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
];

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
  const { locale, setLocale, txt } = useLocale();
  return (
    <div className="flex flex-wrap items-center border-b-[0.5px] border-border-default px-6">
      <div className="mr-6 flex items-center gap-[9px] py-[13px]">
        <img
          src="/favicon.png"
          alt="Uzbekistan Airways"
          width={22}
          height={22}
          className="block rounded"
        />
        <span className="text-xs font-bold tracking-[0.5px] text-text-primary">
          {txt.admin.title}
        </span>
      </div>
      {navItems.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={cn(
            "-mb-px cursor-pointer border-0 border-b-2 bg-transparent px-3.5 py-3.5 text-[13px] font-semibold tracking-[0.3px]",
            activeTab === tab.id
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-text-muted",
          )}
        >
          {tab.label}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-2.5">
        <Pill color={T.statusSuccessFg} bg={T.statusSuccessBg}>
          {activeFlightsText}
        </Pill>
        <Pill color={T.brandPrimaryFg} bg={T.brandPrimaryBg}>
          {bidsText}
        </Pill>
        <div className="flex items-center gap-[3px] rounded-lg border-[0.5px] border-border-default bg-surface-elevated px-1 py-[3px]">
          {LOCALES.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                "rounded-[5px] px-[7px] py-[3px] text-[11px] font-bold cursor-pointer border-none",
                locale === code
                  ? "bg-brand-primary text-on-brand-primary-soft"
                  : "bg-transparent text-text-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary-bg text-[11px] font-bold text-brand-primary-fg">
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

const EMAIL_TABS_FOR = (txt: Txt): Array<[EmailTemplateType, string]> => [
  [EMAIL_TEMPLATE_TYPE.pte, txt.emailTemplates.pte],
  [EMAIL_TEMPLATE_TYPE.chaser, txt.emailTemplates.chaser],
  [EMAIL_TEMPLATE_TYPE.win, txt.emailTemplates.win],
];

export function EmailTemplateTabs({ activeTab, onChange }: EmailTemplateTabsProps) {
  const { txt } = useLocale();
  const emailTabs = EMAIL_TABS_FOR(txt);
  return (
    <div className="mb-5 flex gap-1 border-b-[0.5px] border-border-default">
      {emailTabs.map(([id, label]) => (
        <button
          type="button"
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "-mb-px cursor-pointer border-0 border-b-2 bg-transparent px-3.5 py-2.5 text-[13px] font-semibold",
            activeTab === id
              ? "border-brand-primary text-text-primary"
              : "border-transparent text-text-muted",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function EmptyFlightState() {
  const { txt } = useLocale();
  return (
    <div className="py-[60px] text-center text-text-muted">
      <div className="mb-2.5 text-[28px]">✈</div>
      <div className="text-sm">{txt.admin.emptyFlightPrompt}</div>
    </div>
  );
}
