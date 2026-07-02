import type { Rules } from "@auction/core";

export type RulesService = {
  get: () => Promise<Rules>;
  update: (rules: Rules) => Promise<Rules>;
};
