<template>
  <div class="page">
    <div class="card upload-content">
      <div
        class="card upload-card"
        @dragover.prevent="(_) => {}"
        @drop.prevent="upload($event, 'drop')"
      >
        <div class="image-box flex-box">
          <div v-if="!drawUrl" class="upload-box">
            <Btn type="file" color="primary" @change="upload($event, 'button')"
              >上传图片</Btn
            >
            <h3>拖拽一个图片到这里上传</h3>
            <p>支持jpg、png、jpeg格式</p>
          </div>
          <div v-if="drawUrl" class="view-box">
            <label class="flex-box">
              <img
                :src="drawUrl"
                :style="{
                  height: proportion >= 1 ? `100%` : `auto`,
                  width: proportion <= 1 ? `100%` : `auto`
                }"
              />
              <input
                type="file"
                style="display: none"
                @change="upload($event, 'button')"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="card form-content">
      <div class="input-group">
        <h5 class="sub-name">名称：</h5>
        <Field v-model="form.name" block color="primary"></Field>
      </div>
      <div class="input-group">
        <h5 class="sub-name">描述：</h5>
        <Field
          v-model="form.introduction"
          block
          color="primary"
          type="textarea"
          :rows="3"
        ></Field>
      </div>
      <div class="input-group">
        <h5 class="sub-name">私密：</h5>
        <RadioGroup v-model="form.privacy">
          <Radio
            v-for="item in $enum.PrivacyState"
            :key="item.key"
            :value="item.key"
            :label="item.value"
            color="primary"
            style="margin-right: 10px"
          ></Radio>
        </RadioGroup>
      </div>
      <div class="input-group">
        <h5 class="sub-name">添加标签：</h5>
        <Field v-model="inputTag" block color="primary"></Field>
        <h5 class="sub-name">*标签以空格分隔为一个</h5>
      </div>
      <div style="margin-bottom: 10px;text-align: right">
        <Btn color="primary" :disabled="!drawUrl" @click="send">发送</Btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import ioUtil from "../assets/script/util/ioUtil"
import { enumObjectList } from "../assets/script/constant"

export default {
  name: "Upload",
  data() {
    return {
      drawUrl: "",
      height: 0,
      width: 0,
      file: null,
      inputTag: "",
      form: {
        url: "",
        name: "",
        introduction: "",
        privacy: enumObjectList.PrivacyState.PUBLIC.key,
        tagList: []
      }
    }
  },
  computed: {
    ...mapState("user", ["user", "uploadToken"]),
    proportion() {
      return this.height / this.width
    }
  },
  watch: {
    drawUrl(newVal, oldVal) {
      if (oldVal) {
        URL.revokeObjectURL(oldVal)
      }
    }
  },
  async asyncData({ store, req, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "upload")
    const res = await $axios.get(`/qiniu/getUploadToken`)
    const result = res.data || {}
    if (result.status !== 200) {
      throw new Error(result)
    }
    store.commit("user/MSetUploadToken", result.data)
  },
  methods: {
    ...mapActions("draw", ["ASave"]),
    async upload($event, type) {
      let file
      if (type === "button") {
        file = $event.target.files[0]
      } else if (type === "drop") {
        file = $event.dataTransfer.files[0]
      }
      if (!file) {
        return false
      }
      if (!ioUtil.isImage(file)) {
        this.$notify({ message: "请上传图片" })
        return false
      }
      const url = URL.createObjectURL(file)
      const { width, height } = await ioUtil.getOffset(url)
      this.file = file
      this.width = width
      this.height = height
      this.drawUrl = url
    },
    async send() {
      const form = new FormData()
      form.append("token", this.uploadToken)
      form.append("file", this.file)
      const loading = this.$loading()
      let qiniuResult
      try {
        qiniuResult = (await this.$axios.post(
          process.env.qiniuUploadAddress,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )).data
      } catch (e) {
        loading.close()
        this.$notify({ message: `上传失败` })
        return
      }
      if (!qiniuResult.hash) {
        loading.close()
        this.$notify({ message: `上传失败` })
        return
      }
      this.form.url = qiniuResult.hash
      const tagList = this.inputTag.split(" ").filter((item) => item !== "")
      this.form.tagList = [...new Set(tagList)]
      const result = await this.ASave(this.form)
      loading.close()
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.$confirm({
        title: `上传成功`,
        message: `转到我的作品？`,
        okCallback: () => {
          this.$router.push(`/works/${this.user.id || ""}`)
        },
        noCallback: () => {
          this.form.url = ""
          this.form.privacy = enumObjectList.PrivacyState.PUBLIC.key
          this.form.name = ""
          this.form.introduction = ""
          this.form.tagList.clear()
          this.drawUrl = ""
        }
      })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";
@import "../assets/style/mixin";

.page {
  padding: 24px 0;
  .upload-content {
    @size: 500px;
    width: @visual-width;
    padding: 24px;
    margin: 0 auto;
    .upload-card {
      background-color: #f6f6f6;
      box-shadow: none;
      .image-box {
        height: @size;
        width: @size;
        margin: 0 auto;
        .upload-box {
          h3 {
            margin-top: 25px;
            line-height: 35px;
          }
          p {
            font-size: @small-font-size;
          }
        }
        .view-box {
          label {
            cursor: pointer;
            width: @size;
            height: @size;
          }
        }
      }
    }
  }
  .form-content {
    width: @visual-width;
    padding: 24px;
    margin: 24px auto 0;
  }
}
</style>
