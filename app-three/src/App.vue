<script>
export default {
  data() {
    return {
      applicationMode: process.env.MODE,
    };
  },
  mounted() {
    console.log("Dashboard (Landing Page) | mounted", this);
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
    </ul>
  </div>
</template>
