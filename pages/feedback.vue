<template>
  <div class="page">
    <div v-loading="loading" class="content card">
      <h1>反馈</h1>
      <div class="form">
        <div class="input-group">
          <h5 class="sub-name">反馈内容：</h5>
          <Field
            v-model="form.content"
            block
            color="primary"
            type="textarea"
            placeholder="必填"
          ></Field>
        </div>
        <div class="input-group">
          <h5 class="sub-name">联系邮箱：</h5>
          <Field
            v-model="form.email"
            block
            color="primary"
            placeholder="选填"
          ></Field>
        </div>
        <div class="input-group" style="margin-top: 60px">
          <Btn color="primary" @click="save">发送</Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  data() {
    return {
      loading: false,
      form: {
        email: "",
        content: ""
      }
    }
  },
  methods: {
    ...mapActions("feedback", ["ASave"]),
    async save() {
      this.loading = true
      const result = await this.ASave(this.form)
      this.loading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.$notify({ message: "发送成功，感谢您的反馈" })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";
@import "../assets/style/mixin";
.page {
  padding: @page-gap 0;
}
.content {
  width: @visual-width;
  margin: 0 auto;
  padding: 20px 30px;
  h1 {
    line-height: 50px;
    font-size: @medium-font-size;
    font-weight: 600;
  }
  .form {
    width: 400px;
  }
}
</style>
