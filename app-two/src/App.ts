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
      // AngularJS, by default, does not load nested AngularJS Parcel inside of
      // an already Bootstrapped AngularJS application. There is an unsupported
      // solution (see below) that works in this smaller scoped context and may
      // prove useful in a lager scale implementations.
      // 
      // @see Angular Error | https://code.angularjs.org/1.5.8/docs/error/ng/btstrpd?p0=%26lt;div%20id%3D%22randomId%22%26gt;
      // @see SingleSPA Issue | https://github.com/single-spa/single-spa-angularjs/issues/49
      // @see Solution | https://www.linkedin.com/pulse/inception-one-angularjs-application-inside-another-m%C3%A1rquez-soto/
      $element.data("$injector", "");

      const parcelContainer = $element[0].querySelector(`[data-parcel="app-three"]`);
      const domElement = document.createElement("div");
      
      parcelContainer.appendChild(domElement);

      const parcelProps = { domElement };
      const parcelConfig = await import("appThree/Wrapper");
      const { mountParcel } = $scope.$root.singleSpaProps;

      this.parcel = mountParcel(parcelConfig, parcelProps);
    }, 0);

    this.$onDestroy = async () => {
      await this.parcel.unmount();
    }
  }],
});
