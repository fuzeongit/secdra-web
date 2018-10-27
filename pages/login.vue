<template>
  <div class="container bk cover">
    <form style="width: 400px" class="card padding-50" @submit.prevent="login">
      <div class="row input-group">
        <label class="col-5">
          <i class="fa fa-mobile-phone"></i>
        </label>
        <div class="col-25">
          <input type="text" class="input-blue is-plain block" title="手机" v-model="form.phone">
        </div>
      </div>
      <div class="row input-group">
        <label class="col-5">
          <i class="fa fa-lock"></i>
        </label>
        <div class="col-25">
          <input type="password" class="input-blue is-plain block" title="密码" v-model="form.password">
        </div>
      </div>
      <br>
      <br>
      <button type="submit" class="btn-blue is-plain block" :disabled="loginLoading">{{!loginLoading?`登录`:`登录中...`}}
      </button>
    </form>
  </div>
</template>
<script>
  import {mapActions} from "vuex"

  export default {
    name: "login",
    data() {
      return {
        loginLoading: false,
        form: {
          phone: "",
          password: ""
        }
      }
    },
    methods: {
      ...mapActions("user", ["ALogin", "ARegister", "AGetInfo"]),
      async login() {
        this.loginLoading = true;
        let result = await this.ALogin({phone: "13760029486", password: "123456"});
        if (result.status === 200) {
          this.$router.replace("/");
        } else {
          this.loginLoading = false;
          this.$alert({message: result.message})
        }
      },
      async register() {
        let result = await this.ARegister({phone: "13760029486", password: "123456"});
        if (result.status === 200) {
          this.$router.replace("/");
        } else {
          this.$alert({message: result.message})
        }
      },
      async getInfo() {
        let result = await this.AGetInfo({phone: "13760029486", password: "123456"});
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";

  .bk {
    background-image: url("../assets/image/bk/login-bk.jpg");
  }

  .card {
    z-index: 1;
    position: relative;
    background-size: cover;
    background: transparent center top;
    box-shadow: 0 0 10px -1px @gray;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.1);
      z-index: -1;

    }
  }

  .input-group {
    label {
      i {
        font-size: 25px;
        color: @border-color
      }
    }
    input {
      color: @white
    }
  }
</style>
