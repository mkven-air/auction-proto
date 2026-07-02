import type { PassengerConfig } from "@auction/core";
import type { PassengerConfigService } from "@auction/api-contracts/passenger";

const DEFAULT_PASSENGER_CONFIG: PassengerConfig = {
  flightId: "HY 602",
  frame: {
    statusBarTime: "09:41",
    statusBarHost: "uzbekistanairways.uz",
    closingIn: "3ч 20м",
  },
  multiplier: 1.1,
  productSpecs: {
    bc: { icon: "🛋", min: 262, max: 750, defaultVal: 350 },
    ex: { icon: "🦵", min: 32, max: 85, defaultVal: 46 },
    sb: { icon: "🪑", min: 8, max: 45, defaultVal: 18 },
  },
  defaultBids: {
    bc: 350,
    ex: 46,
    sb: 18,
  },
  defaultActive: {
    bc: true,
    ex: true,
    sb: false,
  },
};

function cloneConfig(config: PassengerConfig): PassengerConfig {
  return {
    ...config,
    frame: { ...config.frame },
    productSpecs: {
      bc: { ...config.productSpecs.bc },
      ex: { ...config.productSpecs.ex },
      sb: { ...config.productSpecs.sb },
    },
    defaultBids: { ...config.defaultBids },
    defaultActive: { ...config.defaultActive },
  };
}

export function createPassengerConfigService(
  config: PassengerConfig = DEFAULT_PASSENGER_CONFIG,
): PassengerConfigService {
  return {
    async get() {
      return cloneConfig(config);
    },
  };
}
