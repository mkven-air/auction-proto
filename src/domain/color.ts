import { T } from "../theme";

export type ColorTokenId = keyof typeof T;

export const colorToken = (id: ColorTokenId): string => T[id];
