import * as angular from "angular";

angular.module("appTwo", []).component("wrapper", {
    template: `<h1 class="h3">App Two</h1>`,
    controllerAs: "vm",
    controller() {
      const vm = this;
    },
});