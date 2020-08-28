import * as angular from "angular";

angular.module("appTwo", []).component("wrapper", {
  template: `
    <div class="alert alert-success">
      <h4 class="alert-heading">Application Two</h4>
      <ul>
        <li>Environment: <strong>{{ vm.applicationMode }}</strong></li>
        <li>Framework: <strong>AngularJS</strong></li>
        <li class="border border-success rounded pt-2 px-3 mt-2">
          Parcel: <strong>Application Three</strong>
          <div class="mt-2" data-parcel="app-three"></div>    
        </li>
      </ul>
    </div>
  `,
  controllerAs: "vm",
  controller: ["$scope", "$element", function($scope, $element) {
    const vm = this;
    vm.applicationMode = process.env.MODE;
    vm.$onInit = () => setTimeout(async () => {
      const domElement = $element[0].querySelector(`[data-parcel="app-three"]`);
      const parcelProps = { domElement };
      const parcelConfig = await import("appThree/Wrapper");
      const { mountParcel } = $scope.$root.singleSpaProps;

      this.parcel = mountParcel(parcelConfig, parcelProps);
    }, 0);

    this.$onDestroy = async () => {
      await this.parcel.unmount();
    };
  }],
});
