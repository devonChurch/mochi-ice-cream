import * as angular from "angular";

angular.module("appOne", []).component("wrapper", {
    template: `
    <div class="alert alert-info">
      <h4 class="alert-heading">Application One</h4>
      <ul>
        <li>Environment: <strong>{{ vm.mode }}</strong></li>
        <li>Framework: <strong>AngularJS</strong></li>
      </ul>
    </div>
    `,
    controllerAs: "vm",
    controller() {
      const vm = this;
      vm.mode = process.env.MODE;
    },
});