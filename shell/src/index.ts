import * as singleSpa from "single-spa";
import "bootstrap/dist/css/bootstrap.css";

const { registerApplication, start } = singleSpa;
const customProps = {};

registerApplication({
  name: "appOne",
  app: async () => import("appOne/Wrapper"),
  activeWhen: () => true,
  customProps,
});

registerApplication({
  name: "appTwo",
  app: async () => import("appTwo/Wrapper"),
  activeWhen: () => true,
  customProps,
});

start();
