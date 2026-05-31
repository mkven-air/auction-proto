import type { DbEmulator, DbFilter, DbQuery, DbQueryResult, DbRow, DbSchema } from "./emulator";

export type { DbEmulator, DbFilter, DbQuery, DbQueryResult, DbRow, DbSchema };

export type EntitySeed = Record<string, DbRow[]>;
