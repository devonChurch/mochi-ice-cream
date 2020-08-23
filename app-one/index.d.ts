type Bootstrap = (props: unknown) => unknown;
type Mount = (props: unknown) => unknown;
type Unmount = (props: unknown) => unknown;

interface Lifecycles {
    bootstrap: Bootstrap;
    mount: Mount;
    unmount: Unmount;
}

type SingleSpaAngularJS = (props: unknown) => Lifecycles;

declare module "single-spa-angularjs" {
    const singleSpaAngularJS: SingleSpaAngularJS;
    export default singleSpaAngularJS;
}
