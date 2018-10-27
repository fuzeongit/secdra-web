<template>
  <section class="container">
    <div>
      <button @click="click">测试</button>
      <button @click="$router.push(`/user/123`)">跳转</button>
      <button @click="remove">删除</button>
    </div>
  </section>
</template>

<script>

  import {mapActions} from "vuex"
  import Cookie from 'js-cookie'
  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}){
      await $axios.get("/api/user/getInfo")
    },
    components: {

    },
    data() {
      return {
      }
    },
    mounted() {

    },
    methods: {
      ...mapActions("user", ["AGetInfo"]),
      async click(){
        let result = await this.AGetInfo({phone: "13760029486", password: "123456"});
      },
      remove(){
        Cookie.remove("token");
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
