import { useLocale } from "../locale";
import { useEntities } from "@auction/web-shared";
import type { LocaleCode, LocalizedString } from "@auction/core";

function isLocalizedString(value: unknown): value is LocalizedString {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every((v) => typeof v === "string")
  );
}

function resolveLocalizedString(value: LocalizedString, locale: LocaleCode): string {
  return value[locale] ?? value.en ?? value.ru ?? Object.values(value)[0] ?? "";
}

function renderCell(value: unknown, locale: LocaleCode): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (isLocalizedString(value)) {
    return resolveLocalizedString(value, locale);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function collectColumns(rows: ReadonlyArray<Record<string, unknown>>): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        ordered.push(key);
      }
    }
  }
  return ordered;
}

export function EntitiesPage() {
  const { txt, locale } = useLocale();
  const { data, isLoading, isError } = useEntities();

  if (isLoading) {
    return <div className="text-text-muted">{txt.entities.states.loading}</div>;
  }
  if (isError || !data) {
    return <div className="text-status-danger-fg">{txt.entities.states.loadError}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[22px] font-bold text-text-primary">{txt.entities.title}</div>
        <div className="mt-1 text-[13px] text-text-muted">{txt.entities.subtitle}</div>
      </div>
      {data.map((entity) => {
        const columns = collectColumns(entity.rows);
        return (
          <section
            key={entity.name}
            className="overflow-hidden rounded-[10px] border-[0.5px] border-border-default bg-surface-card"
          >
            <div className="flex items-center gap-2.5 border-b-[0.5px] border-border-default bg-surface-elevated px-3.5 py-2.5">
              <span className="text-sm font-bold text-text-primary">
                {resolveLocalizedString(entity.title, locale as LocaleCode) || entity.name}
              </span>
              <span className="font-mono text-[11px] text-text-muted">{entity.name}</span>
              <span className="text-xs text-text-muted">
                {entity.rows.length} {txt.entities.countSuffix}
              </span>
            </div>
            {entity.rows.length === 0 ? (
              <div className="p-3.5 text-xs text-text-muted">{txt.entities.empty}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-surface-elevated">
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="border-b-[0.5px] border-border-default px-3 py-2 text-left font-semibold whitespace-nowrap text-text-secondary"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entity.rows.map((row, idx) => (
                      <tr
                        // biome-ignore lint/suspicious/noArrayIndexKey: rows have no stable id at this generic layer
                        key={idx}
                        className="border-b-[0.5px] border-border-default"
                      >
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="max-w-[320px] overflow-hidden px-3 py-[7px] align-top whitespace-nowrap text-ellipsis text-text-primary"
                          >
                            {renderCell((row as Record<string, unknown>)[col], locale)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
