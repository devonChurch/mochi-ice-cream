import * as angular from "angular";

angular.module("appOne", []).component("wrapper", {
  template: `
    <div class="alert alert-info">
      <h4 class="alert-heading">Application One</h4>
      <ul>
        <li>Environment: <strong>{{ vm.applicationMode }}</strong></li>
        <li>Framework: <strong>AngularJS</strong></li>
        <li class="my-2">Counter: 
          <button type="button" class="btn btn-info btn-sm" ng-click="vm.handleCount()">Add #{{ vm.counter }}</button>
        </li>
        <li>Has Feature:
            <strong>
                <ng-container ng-if="!vm.isLoadingFeaure">
                    <span ng-if="vm.hasFeature">{{ vm.featureMode }} 👍</span>    
                    <span ng-if="!vm.hasFeature">{{ vm.featureMode }} 👎</span>
                </ng-container>
                <ng-container ng-if="vm.isLoadingFeaure">
                    Loading ⏱️
                </ng-container>
            </strong>
        </li>
      </ul>
    </div>
    `,
  controllerAs: "vm",
  controller: ["$scope", function($scope) {
    const vm = this;
    
    vm.applicationMode = process.env.MODE;
    vm.hasFeature = false;
    vm.featureMode = "";
    vm.isLoadingFeaure = true;
    vm.counter = 0;

    vm.$onInit = async () => {
      const { checkHasFeature } = await import("utilities/core");
      const feature = await checkHasFeature("test-one") as FeatureFlag;
      vm.hasFeature = feature.isActive;
      vm.featureMode = feature.mode;
      vm.isLoadingFeaure = false;
      $scope.$digest();
    };

    vm.handleCount = () => {
      vm.counter += 1;
    };
  }],
});
