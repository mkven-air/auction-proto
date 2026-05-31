import { CURRENT_LOCALE, TXT } from "../i18n";
import { F, T } from "../theme";
import { useEntities } from "../queries/useEntities";

function isLocalizedString(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every((v) => typeof v === "string")
  );
}

function renderCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (isLocalizedString(value)) {
    return value[CURRENT_LOCALE] ?? value.en ?? Object.values(value)[0] ?? "";
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
  const { data, isLoading, isError } = useEntities();

  if (isLoading) {
    return <div style={{ color: T.textMuted }}>{TXT.entities.states.loading}</div>;
  }
  if (isError || !data) {
    return <div style={{ color: T.statusDangerFg }}>{TXT.entities.states.loadError}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary }}>
          {TXT.entities.title}
        </div>
        <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>
          {TXT.entities.subtitle}
        </div>
      </div>
      {data.map((entity) => {
        const columns = collectColumns(entity.rows);
        return (
          <section
            key={entity.name}
            style={{
              background: T.surfaceCard,
              border: `0.5px solid ${T.borderDefault}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                background: T.surfaceElevated,
                borderBottom: `0.5px solid ${T.borderDefault}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary }}>
                {entity.name}
              </span>
              <span style={{ fontSize: 12, color: T.textMuted }}>
                {entity.rows.length} {TXT.entities.countSuffix}
              </span>
            </div>
            {entity.rows.length === 0 ? (
              <div style={{ padding: 14, fontSize: 12, color: T.textMuted }}>
                {TXT.entities.empty}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                    fontFamily: F.mono,
                  }}
                >
                  <thead>
                    <tr style={{ background: T.surfaceElevated }}>
                      {columns.map((col) => (
                        <th
                          key={col}
                          style={{
                            textAlign: "left",
                            padding: "8px 12px",
                            fontWeight: 600,
                            color: T.textSecondary,
                            borderBottom: `0.5px solid ${T.borderDefault}`,
                            whiteSpace: "nowrap",
                          }}
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
                        style={{
                          borderBottom: `0.5px solid ${T.borderDefault}`,
                        }}
                      >
                        {columns.map((col) => (
                          <td
                            key={col}
                            style={{
                              padding: "7px 12px",
                              color: T.textPrimary,
                              verticalAlign: "top",
                              whiteSpace: "nowrap",
                              maxWidth: 320,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {renderCell((row as Record<string, unknown>)[col])}
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
