import singleSpaAngularJS from "single-spa-angularjs";
import * as angular from "angular";
import "./App";

interface Props {
    [key: string]: unknown
}

const angularLifecycles = singleSpaAngularJS({
  angular: angular,
  mainAngularModule: "appOne",
  uiRouter: true,
  preserveGlobal: false,
  template: `<wrapper />`,
});

export function bootstrap(props: Props) {
  return angularLifecycles.bootstrap(props);
}

export function mount(props: Props) {
  return angularLifecycles.mount(props);
}

export function unmount(props: Props) {
  return angularLifecycles.unmount(props);
}
