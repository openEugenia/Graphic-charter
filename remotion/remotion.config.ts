// Remotion CLI configuration: https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// The documentation assets (sample hero photo…) are served with staticFile().
Config.setPublicDir("../docs");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Remotion's Chrome Headless Shell crashes on recent macOS ("icudtl.dat not
// found in bundle", GPU process exit 6) and the render then waits forever.
// Use the installed Google Chrome instead when there is one.
const SYSTEM_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (process.platform === "darwin" && existsSync(SYSTEM_CHROME)) {
  Config.setBrowserExecutable(SYSTEM_CHROME);
  Config.setChromeMode("chrome-for-testing");
}
