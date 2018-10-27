<template>
  <div>{{$route.params.id}}</div>
</template>

<script>
  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}){
      await $axios.get("/api/user/getInfo")
    },
  }
</script>

<style scoped>

</style>
