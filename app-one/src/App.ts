import * as angular from "angular";

angular.module("appOne", []).component("wrapper", {
    template: `<h1 class="h3">App One</h1>`,
    controllerAs: "vm",
    controller() {
      const vm = this;
    },
});