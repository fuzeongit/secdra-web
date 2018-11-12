<template>

</template>

<script>
  import config from "../../assets/js/config";

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "";
      let id = route.params.id;
      let res = await $axios.get(`${config.host}/draw/get`, {
        params: {drawId: id}
      });
      let rusult = res.data;

    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
