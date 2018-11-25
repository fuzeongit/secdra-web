<template>
  <section class="container bk cover">
    <form class="card padding-50" @submit.prevent="login">
      <img src="../assets/image/logo/logo.svg" width="250px">
      <p class="sub-logo">苟利国家生死以，岂因祸福避趋之</p>
      <div class="row input-group">
        <input type="text" class="input block" title="手机" v-model="form.phone" placeholder="手机号码">
      </div>
      <div class="row input-group">
        <input type="password" class="input block" title="密码" v-model="form.password" placeholder="密码">
      </div>
      <br>
      <button type="submit" class="btn block" :disabled="loginLoading">{{!loginLoading?`登录`:`登录中...`}}
      </button>
    </form>
  </section>
</template>
<script>
  import Cookies from 'js-cookie'
  import {mapActions, mapMutations} from "vuex"

  export default {
    name: "login",
    layout: 'login',
    data() {
      return {
        loginLoading: false,
        form: {
          phone: "",
          password: ""
        }
      }
    },
    mounted() {},
    methods: {
      ...mapActions("user", ["ALogin", "ARegister", "AGetInfo"]),
      ...mapMutations("user", ["MSetUserInfo"]),
      async login() {
        let phone = this.form.phone || "13760029486";
        let password = this.form.password || "123456";
        this.loginLoading = true;
        let result = await this.ALogin({phone, password});
        if (result.status === 200) {
          Cookies.set("user", JSON.stringify(result.data), {expires: 30});
          this.$router.replace("/");
        } else {
          this.loginLoading = false;
          this.$alert({message: result.message})
        }
      },
      // async register() {
      //   let result = await this.ARegister({phone: "13760029486", password: "123456"});
      //   if (result.status === 200) {
      //     this.$router.replace("/");
      //   } else {
      //     this.$alert({message: result.message})
      //   }
      // },
      // async getInfo() {
      //   let result = await this.AGetInfo({phone: "13760029486", password: "123456"});
      // },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";

  .bk {
    background-image: url("../assets/image/bk/login-bk.jpg");
    /*background-image: url("http://ph9jy186h.bkt.clouddn.com/58562464_p0.png");*/
  }

  .card {
    position: relative;
    background-size: cover;
    background: rgba(255, 255, 255, 0.92) center top;
  }

  .sub-logo {
    margin-bottom: 50px;
    font-size: @small-font-size
  }

  .input-group {
    label {
      i {
        font-size: 25px;
        color: @border-color
      }
    }
    input {
      color: @font-color
    }
  }
</style>
