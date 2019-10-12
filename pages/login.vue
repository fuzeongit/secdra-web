<template>
  <section class="container bk cover">
    <form class="card" @submit.prevent="login">
      <nuxt-link to="/" replace>
        <img src="../assets/image/svg/logo.svg" />
      </nuxt-link>
      <p class="sub-logo">想你所想</p>
      <div class="row input-group">
        <Field
          v-model="form.phone"
          block
          color="primary"
          placeholder="手机号码"
        ></Field>
      </div>
      <div class="row input-group">
        <Field
          v-model="form.password"
          block
          color="primary"
          placeholder="密码"
          type="password"
        ></Field>
      </div>
      <br />
      <Btn block color="primary" :disabled="loginLoading" type="submit">{{
        !loginLoading ? `登录` : `登录中...`
      }}</Btn>
    </form>
  </section>
</template>
<script>
import { mapActions } from "vuex"

const layout = "login"
export default {
  name: "Login",
  layout,
  data() {
    return {
      loginLoading: false,
      form: {
        phone: "",
        password: ""
      },
      r: this.$route.query.r || "/"
    }
  },
  mounted() {
    if (this.$root.layoutName === layout) {
      this.$confirm({
        message: `暂时不开放注册，是否随机账号登录`,
        okCallback: () => {
          this.form.phone = Math.floor(Math.random() * 50).toString()
          this.login()
        }
      })
    }
  },
  methods: {
    ...mapActions("user", ["ASignIn", "ASignUp", "AGet"]),
    async login() {
      const phone = this.form.phone
      const password = this.form.password || "123456"
      this.loginLoading = true
      const result = await this.ASignIn({ phone, password })
      if (result.status === 200) {
        // Cookies.set("user", JSON.stringify(result.data), { expires: 30 })
        this.$router.replace(this.r)
      } else {
        this.loginLoading = false
        this.$notify({ message: result.message })
      }
    }
    // async register() {
    //   let result = await this.ASignUp({phone: "13760029486", password: "123456"});
    //   if (result.status === 200) {
    //     this.$router.replace("/");
    //   } else {
    //     this.$alert({message: result.message})
    //   }
    // },
    // async getInfo() {
    //   let result = await this.AGet({phone: "13760029486", password: "123456"});
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
  font-size: @smallest-font-size;
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
