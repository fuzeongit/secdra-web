<template>
  <section class="container bk cover">
    <form class="card" @submit.prevent="login">
      <img src="../assets/image/svg/logo.svg">
      <p class="sub-logo">想你所想</p>
      <div class="row input-group">
        <input type="text" class="input block primary-color" title="手机" v-model="form.phone" placeholder="手机号码">
      </div>
      <div class="row input-group">
        <input type="password" class="input block primary-color" title="密码" v-model="form.password" placeholder="密码">
      </div>
      <br>
      <Btn block color="primary" :disabled="loginLoading" type="submit">{{!loginLoading?`登录`:`登录中...`}}</Btn>
    </form>
    <p class="center" style="position: fixed;bottom: 30px">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备18144953号-1</a>
    </p>
  </section>
</template>
<script>
  import Cookies from 'js-cookie'
  import {mapActions} from "vuex"

  let layout = 'login';
  export default {
    name: "login",
    layout,
    data() {
      return {
        loginLoading: false,
        form: {
          phone: "",
          password: ""
        }
      }
    },
    mounted() {
      if (this.$root.layoutName === layout) {
        this.$confirm({
          message: `暂时不开放注册，是否随机账号登录`, okCallback: _ => {
            this.form.phone = Math.floor(Math.random() * 50).toString();
            this.login();
          }
        })
      }
    },
    methods: {
      ...mapActions("user", ["ALogin", "ARegister", "AGetInfo"]),
      async login() {
        let phone = this.form.phone;
        let password = this.form.password || "123456";
        this.loginLoading = true;
        let result = await this.ALogin({phone, password});
        if (result.status === 200) {
          Cookies.set("user", JSON.stringify(result.data), {expires: 30});
          this.$router.replace("/");
        } else {
          this.loginLoading = false;
          this.$notify({message: result.message})
        }
      }
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
    img {
      width: 250px;
    }
    padding: 50px;
    position: relative;
    background-size: cover;
    background: rgba(255, 255, 255, 0.9) center top;
  }

  .sub-logo {
    margin-bottom: 50px;
    font-size: @smallest-font-size
  }

  .input-group {
    label {
      i {
        font-size: 25px;
        color: @icon-color-dark;
      }
    }
    input {
      color: @font-color-dark;
    }
  }
</style>
