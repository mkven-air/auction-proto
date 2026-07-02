import type { ColorTokenId } from "@auction/core";
import { T } from "../theme";

export type { ColorTokenId };

export const colorToken = (id: ColorTokenId): string => T[id];
