import { DEFAULT_RULES } from "./seed";
import type { Rules } from "@auction/core";
import type { RulesService } from "@auction/api-contracts/admin";

function cloneRules(rules: Rules): Rules {
  return {
    ...rules,
    channels: { ...rules.channels },
    paymentMethods: { ...rules.paymentMethods },
  };
}

export function createRulesService(initialRules: Rules = DEFAULT_RULES): RulesService {
  let current = cloneRules(initialRules);

  return {
    async get() {
      return cloneRules(current);
    },

    async update(rules) {
      current = cloneRules(rules);
      return cloneRules(current);
    },
  };
}
