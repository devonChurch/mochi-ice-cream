type Bootstrap = (props: unknown) => unknown;
type Mount = (props: unknown) => unknown;
type Unmount = (props: unknown) => unknown;

interface Lifecycles {
  bootstrap: Bootstrap;
  mount: Mount;
  unmount: Unmount;
}

interface Props {
  [key: string]: unknown;
}

type SingleSpaVue = (props: Props) => Lifecycles;

declare module "single-spa-vue" {
  const singleSpaVue: SingleSpaVue;
  export default singleSpaVue;
}

declare module "single-spa" {
  export function registerApplication(props: Props): undefined;
  export function start(): undefined;
}

declare module "appThree/Wrapper" {}

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
