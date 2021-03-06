type Bootstrap = (props: unknown) => unknown;
type Mount = (props: unknown) => unknown;
type Unmount = (props: unknown) => unknown;

interface Lifecycles {
    bootstrap: Bootstrap;
    mount: Mount;
    unmount: Unmount;
}

interface Props {
    [key: string]: unknown
}

type SingleSpaAngularJS = (props: Props) => Lifecycles;

declare module "single-spa-angularjs" {
    const singleSpaAngularJS: SingleSpaAngularJS;
    export default singleSpaAngularJS;
}

declare module "single-spa" {
    export function registerApplication(props: Props): undefined;
    export function start(): undefined;
}

declare module "appOne/Wrapper" {}
declare module "utilities/core" {
    export function checkHasFeature(id: string): unknown;
}

interface FeatureFlag {
    feature: string;
    isActive: boolean;
    mode: string;
}
