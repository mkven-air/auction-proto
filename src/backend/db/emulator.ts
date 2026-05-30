export type DbScalar = string | number | boolean | null;

export type DbRow = Record<string, unknown>;

export type DbFilter = {
  field: string;
  op: "eq" | "contains" | "in";
  value: DbScalar | DbScalar[];
};

export type DbQuery = {
  search?: string;
  searchFields?: string[];
  filters?: DbFilter[];
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type DbQueryResult<TRow> = {
  items: TRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type DbEmulator = {
  list: <TRow extends DbRow>(table: string) => TRow[];
  query: <TRow extends DbRow>(table: string, query: DbQuery) => DbQueryResult<TRow>;
  queryAll: <TRow extends DbRow>(
    table: string,
    query: Omit<DbQuery, "page" | "pageSize">,
  ) => TRow[];
  findOne: <TRow extends DbRow>(
    table: string,
    predicate: (row: TRow) => boolean,
  ) => TRow | undefined;
  updateOne: <TRow extends DbRow>(
    table: string,
    predicate: (row: TRow) => boolean,
    updater: (row: TRow) => TRow,
  ) => TRow | undefined;
  updateMany: <TRow extends DbRow>(
    table: string,
    predicate: (row: TRow) => boolean,
    updater: (row: TRow) => TRow,
  ) => number;
};

function cloneRow<TRow extends DbRow>(row: TRow): TRow {
  return { ...row };
}

function toComparableString(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

function matchesFilter(row: DbRow, filter: DbFilter): boolean {
  const fieldValue = row[filter.field];

  if (filter.op === "eq") {
    return String(fieldValue) === String(filter.value);
  }

  if (filter.op === "contains") {
    return toComparableString(fieldValue).includes(toComparableString(filter.value));
  }

  if (!Array.isArray(filter.value)) return false;
  return filter.value.map((v) => String(v)).includes(String(fieldValue));
}

function applyQuery<TRow extends DbRow>(rows: TRow[], query: DbQuery): DbQueryResult<TRow> {
  const search = (query.search ?? "").trim().toLowerCase();
  const searchFields = query.searchFields ?? [];
  const filters = query.filters ?? [];
  const sortBy = query.sortBy;
  const sortDir = query.sortDir ?? "asc";
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? (rows.length || 1));

  const filtered = rows
    .filter((row) => {
      const filtersOk = filters.every((filter) => matchesFilter(row, filter));
      if (!filtersOk) return false;
      if (!search) return true;
      if (searchFields.length === 0) return false;
      return searchFields.some((field) => toComparableString(row[field]).includes(search));
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const va = a[sortBy];
      const vb = b[sortBy];

      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }

      const sa = toComparableString(va);
      const sb = toComparableString(vb);
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });

  const total = filtered.length;
  const offset = (page - 1) * pageSize;
  const items = filtered.slice(offset, offset + pageSize).map(cloneRow);

  return { items, total, page, pageSize };
}

export function createDbEmulator(seed: Record<string, DbRow[]>): DbEmulator {
  const tables = new Map<string, DbRow[]>();
  for (const [name, rows] of Object.entries(seed)) {
    tables.set(
      name,
      rows.map((row) => cloneRow(row)),
    );
  }

  const readTable = (table: string): DbRow[] => {
    const rows = tables.get(table);
    if (rows) return rows;
    const empty: DbRow[] = [];
    tables.set(table, empty);
    return empty;
  };

  const api: DbEmulator = {
    list: <TRow extends DbRow>(table: string) => {
      return readTable(table).map((row) => cloneRow(row)) as TRow[];
    },

    query: <TRow extends DbRow>(table: string, query: DbQuery) => {
      const rows = readTable(table) as TRow[];
      return applyQuery(rows, query);
    },

    queryAll: <TRow extends DbRow>(table: string, query: Omit<DbQuery, "page" | "pageSize">) => {
      const rows = readTable(table) as TRow[];
      const result = applyQuery(rows, {
        ...query,
        page: 1,
        pageSize: Math.max(1, rows.length || 1),
      });
      return result.items;
    },

    findOne: <TRow extends DbRow>(table: string, predicate: (row: TRow) => boolean) => {
      const rows = readTable(table) as TRow[];
      const found = rows.find(predicate);
      return found ? (cloneRow(found as DbRow) as TRow) : undefined;
    },

    updateOne: <TRow extends DbRow>(
      table: string,
      predicate: (row: TRow) => boolean,
      updater: (row: TRow) => TRow,
    ) => {
      const rows = readTable(table) as TRow[];
      const idx = rows.findIndex(predicate);
      if (idx === -1) return undefined;
      const current = rows[idx] as TRow;
      const next = updater(cloneRow(current as DbRow) as TRow);
      rows[idx] = cloneRow(next as DbRow) as TRow;
      return cloneRow(next as DbRow) as TRow;
    },

    updateMany: <TRow extends DbRow>(
      table: string,
      predicate: (row: TRow) => boolean,
      updater: (row: TRow) => TRow,
    ) => {
      const rows = readTable(table) as TRow[];
      let count = 0;
      for (let i = 0; i < rows.length; i += 1) {
        const current = rows[i] as TRow;
        if (!predicate(current)) continue;
        const next = updater(cloneRow(current as DbRow) as TRow);
        rows[i] = cloneRow(next as DbRow) as TRow;
        count += 1;
      }
      return count;
    },
  };

  return api;
}
