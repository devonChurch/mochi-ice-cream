import * as singleSpa from "single-spa";

const { registerApplication, start } = singleSpa;
const customProps = {};

registerApplication({
    name: "appOne",
    app: async () => import("appOne/Wrapper"),
    activeWhen: () => true,
    customProps
});

start();
