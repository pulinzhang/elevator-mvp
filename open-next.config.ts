import type { OpenNextConfig } from "open-next/types/open-next";

const config: OpenNextConfig = {
  default: {
    override: {
      generateCacheControl: false,
    },
  },
};

export default config;

