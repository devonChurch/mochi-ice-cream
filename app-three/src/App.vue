<script>
export default {
  data() {
    return {
      applicationMode: process.env.MODE,
      counter: 0
    };
  },
  async mounted() {
    const domElement = this.$refs["app-three-parel"];
    const parcelProps = { domElement };
    const parcelConfig = await import("appOne/Wrapper");
    const { mountRootParcel } = this.$vnode.context.singleSpa;

    this.parcel = mountRootParcel(parcelConfig, parcelProps);
  },
  async beforeDestroy() {
    await this.parcel.unmount();
  },
  methods: {
    handleCount() {
      this.counter += 1;
    }
  }
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
        <li class="my-2">Counter: 
          <button type="button" class="btn btn-secondary btn-sm" @click="handleCount()">Add #{{ counter }}</button>
        </li>
      <li class="border border-secondary rounded pt-2 px-3 mt-2">
        Parcel: <strong>Application One</strong>
        <div class="mt-2" ref="app-three-parel"></div>
      </li>
    </ul>
  </div>
</template>
