<template>
  <div class="page">
    <div class="upload-content"></div>
  </div>
</template>

<script>
  import config from "../assets/js/config";

  export default {
    name: "upload",
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "upload";
      let res = await $axios.get(`${config.host}/qiniu/getUploadToken`);
      let result = res.data || {};
      if (result.status !== 200) {
        throw new Error(result)
      }
      store.state.user.uploadToken = result.data;
    },
    data() {
      return {}
    },
    computed: {
      uploadToken() {
        return this.$store.state.user.uploadToken || ""
      },
    },
    methods: {}
  }
</script>

<style type="text/less" lang="less" scoped>
  .upload-content {

  }
</style>
