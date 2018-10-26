<template>
  <div>
    <button @click="login">登录</button>
    <button @click="register">注册</button>
    <button @click="test">测试</button>
  </div>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    name: "login",
    methods: {
      ...mapActions("user", ["ALogin","ARegister"]),
      async login() {
        let result = await this.ALogin({phone: "13760029486", password: "123456"});
          if (result.status === 200) {
          this.$router.replace("/");
        } else {
          this.$alert({message: result.message})
        }
      },
      async register(){
        let result = await this.ARegister({phone: "13760029486", password: "123456"});
        if (result.status === 200) {
          this.$router.replace("/");
        } else {
          this.$alert({message: result.message})
        }
      },
      test(){
        this.$router.replace(`/`)
      }
    }
  }
</script>

<style scoped>

</style>
