<script>
export default {
  data() {
    return {
      applicationMode: process.env.MODE,
    };
  },
  async mounted() {
    const parcelContainer = this.$refs["app-three-parel"];
    const domElement = document.createElement("div");

    parcelContainer.appendChild(domElement);

    const parcelProps = { domElement };
    const parcelConfig = await import("appOne/Wrapper");
    const { mountRootParcel } = this.$vnode.context.singleSpa;

    this.parcel = mountRootParcel(parcelConfig, parcelProps);
  },
  async beforeDestroy() {
    await this.parcel.unmount();
  },
};
</script>

<template>
  <div class="alert alert-secondary">
    <h4 class="alert-heading">Application Three</h4>
    <ul>
      <li>
        Environment: <strong>{{ applicationMode }}</strong>
      </li>
      <li>Framework: <strong>Vue JS</strong></li>
      <li class="border border-secondary rounded pt-2 px-3 mt-2">
        Parcel: <strong>Application One</strong>
        <div class="mt-2" ref="app-three-parel"></div>
      </li>
    </ul>
  </div>
</template>
