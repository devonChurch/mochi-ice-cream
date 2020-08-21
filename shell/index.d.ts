interface Props {
    [key: string]: unknown
}

declare module "single-spa" {
    export function registerApplication(props: Props): undefined;
    export function start(): undefined;
}


declare module "appOne/Wrapper" {}
declare module "appTwo/Wrapper" {}