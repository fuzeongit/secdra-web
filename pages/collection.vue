<template>

</template>

<script>
    export default {
      async asyncData({store, req, redirect, route, $axios}) {
        store.state.menu.name = "collection";
      }
    }
</script>

<style type="text/less" lang="less" scoped>

</style>
