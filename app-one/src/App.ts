import * as angular from "angular";
import capitalize from "lodash.capitalize";

angular.module("appOne", []).component("wrapper", {
    template: `
    <div class="alert alert-info">
      <h4 class="alert-heading">Application One</h4>
      <ul>
        <li>Environment: <strong>{{ vm.buildEnv }}</strong></li>
        <li>Framework: <strong>AngularJS</strong></li>
      </ul>
    </div>
    `,
    controllerAs: "vm",
    controller() {
      const vm = this;
      vm.buildEnv = capitalize(process.env.BUILD_ENV);
    },
});