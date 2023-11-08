// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as _arcServer from "arc-server";

import type { Plugin } from "vite";
import { pluginServe } from "./plugins/serve";
import { pluginBuildWeb } from "./plugins/build-web";
import { pluginBuildSSR } from "./plugins/build-ssr";
import { type Options, getInternalPluginOptions } from "./utils/options";

export { createFlagSets, hasFlags } from "./utils/flags";

export default function arcVite(options: Options): Plugin[] {
  const pluginOptions = getInternalPluginOptions(options);
  return ([] as Plugin[]).concat(
    pluginServe(pluginOptions),
    pluginBuildWeb(pluginOptions),
    pluginBuildSSR(pluginOptions),
  );
}

declare module "arc-server" {
  export function getAssets(
    entry: string,
    options?: { base?: string; injectAttrs?: string },
  ): {
    "head-prepend"?: string;
    head?: string;
    "body-prepend"?: string;
    body?: string;
  };
}
