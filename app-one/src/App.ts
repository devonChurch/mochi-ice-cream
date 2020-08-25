import * as angular from "angular";

angular.module("appOne", []).component("wrapper", {
  template: `
    <div class="alert alert-info">
      <h4 class="alert-heading">Application One</h4>
      <ul>
        <li>Environment: <strong>{{ vm.mode }}</strong></li>
        <li>Framework: <strong>AngularJS</strong></li>
        <li>Has Feature:
            <strong>
                <span ng-if="vm.hasFeature">Yes 👍</span>    
                <span ng-if="!vm.hasFeature">No 👎</span>    
            </strong>
        </li>
      </ul>
    </div>
    `,
  controllerAs: "vm",
  controller($scope) {
    const vm = this;
    vm.mode = process.env.MODE;
    vm.hasFeature = false;
    vm.$onInit = async () => {
      console.log("Angular mounting!", vm, $scope);
      const { checkHasFeature } = await import("utilities/core");
      const response = await checkHasFeature("test-one");
      console.log("feature config", response);
      vm.hasFeature = response;
      $scope.$digest();
    };
  },
});
