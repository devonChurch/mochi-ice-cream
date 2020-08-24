/**
 * `shell.ts` mimics the Micro Front-end experience but ONLY loads in the application
 * associated to this build.
 *
 * In that regard, this file is never used in the "full" Micro Front-end experience
 * and instead is a convenient hook to look at this specific application in isolation
 * while still adhering to the SingleSPA context.
 */

import * as singleSpa from "single-spa";
import "bootstrap/dist/css/bootstrap.css";

const { registerApplication, start } = singleSpa;

registerApplication({
    name: "appOne",
    app: async () => import("appOne/Wrapper"),
    activeWhen: () => true,
});

start();