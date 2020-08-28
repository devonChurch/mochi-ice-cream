import singleSpaVue from "single-spa-vue";
import Vue, { CreateElement } from "vue";
import App from "./App.vue";

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render: (h: CreateElement) => h(App),
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
