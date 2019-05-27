<template>
  <div class="page">
    <div class="card upload-content">
      <div class="card upload-card" @dragover.prevent="_=>{}" @drop.prevent="upload($event,'drop')">
        <div class="image-box flex-box">
          <div class="upload-box" v-if="!drawUrl">
            <label class="btn">
              上传图片
              <input type="file" style="display: none" @change="upload($event,'button')">
            </label>
            <h3 style="">拖拽一个图片到这里上传</h3>
            <p>支持jpg、png、jpeg格式</p>
          </div>
          <div class="view-box" v-if="drawUrl">
            <label class="flex-box">
              <img :src="drawUrl" :style="{height:proportion>=1?`100%`:`auto`,width:proportion<=1?`100%`:`auto`}">
              <input type="file" style="display: none" @change="upload($event,'button')">
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="card form-content">
      <div class="input-group">
        <h5 class="sub-name">名称：</h5>
        <input type="text" class="input  block" v-model="form.name" title="name">
      </div>
      <div class="input-group">
        <h5 class="sub-name">描述：</h5>
        <textarea v-model="form.introduction" class="input block" title="introduction" rows="3"></textarea>
      </div>
      <div class="input-group">
        <h5 class="sub-name">私密：</h5>
        <Checkbox v-model="form.isPrivate" style="line-height: 14px;"></Checkbox>
      </div>
      <div class="input-group">
        <h5 class="sub-name">添加标签：</h5>
        <input type="text" title="name" v-model="inputTag" class="input block" @keyup.enter="addTag">
        <h5 class="sub-name">*回车添加一个标签</h5>
      </div>
      <div style="margin-bottom: 10px">
        <Tag v-for="(tagName,index) in form.tagList" @close="removeTag" :content="tagName" :key="tagName"
             :value="index"></Tag>
      </div>
      <div style="margin-bottom: 10px;text-align: right">
        <button class="btn" @click="send" :disabled="!drawUrl">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
  import config from "../assets/script/config";
  import ioUtil from "../assets/script/util/ioUtil";
  import {mapState, mapActions} from "vuex"

  export default {
    name: "upload",
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "upload");
      let res = await $axios.get(`${config.host}/qiniu/getUploadToken`);
      let result = res.data || {};
      if (result.status !== 200) {
        throw new Error(result)
      }
      store.commit('user/MSetUploadToken', result.data);
    },
    data() {
      return {
        drawUrl: "",
        height: 0,
        width: 0,
        file: null,
        inputTag: '',
        form: {
          url: "",
          name: '',
          introduction: '',
          isPrivate: false,
          tagList: [],
        }
      }
    },
    watch: {
      drawUrl(newVal, oldVal) {
        if (oldVal) {
          URL.revokeObjectURL(oldVal);
        }
      }
    },
    computed: {
      ...mapState("user", ["user", "uploadToken"]),
      proportion() {
        return this.height / this.width
      }
    },
    mounted() {

    },
    methods: {
      ...mapActions("draw", ["ASave"]),
      addTag() {
        if (this.inputTag === null || this.inputTag === "") {
          this.inputTag = "";
          return
        }
        if (this.form.tagList.indexOf(this.inputTag) !== -1) {
          this.inputTag = "";
          this.$message({
            message: "不能重复添加"
          });
          return
        }
        this.form.tagList.push(this.inputTag);
        this.inputTag = "";
      },
      removeTag({value}) {
        this.form.tagList.removeIndex(value)
      },
      async upload($event, type) {
        let file;
        if (type === "button") {
          file = $event.target.files[0];
        } else if (type === "drop") {
          file = $event.dataTransfer.files[0]
        }
        if (!file) {
          return false;
        }
        if (!ioUtil.isImage(file)) {
          this.$notify({message: "请上传图片"});
          return false;
        }
        let url = URL.createObjectURL(file);
        let {width, height} = await ioUtil.getOffset(url);
        this.file = file;
        this.width = width;
        this.height = height;
        this.drawUrl = url;
      },
      async send() {
        let form = new FormData();
        form.append("token", this.uploadToken);
        form.append("file", this.file);
        let loading = this.$loading();
        let qiniuResult;
        try {
          qiniuResult = (await this.$axios.post(config.qiniuUploadAddress, form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })).data;
        } catch (e) {
          loading.close();
          this.$notify({message: `上传失败`});
          return;
        }
        if (!qiniuResult.hash) {
          loading.close();
          this.$notify({message: `上传失败`});
          return;
        }
        this.form.url = qiniuResult.hash;
        let result = await this.ASave(this.form);
        loading.close();
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return;
        }
        this.$confirm({
          title: `上传成功`,
          message: `转到我的作品？`,
          okCallback: () => {
            this.$router.push(`/works/${this.user.id || ''}`)
          },
          noCallback: () => {
            this.form.url = "";
            this.form.isPrivate = false;
            this.form.name = "";
            this.form.introduction = "";
            this.form.tagList.clear();
            this.drawUrl = ""
          }
        });
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
              line-height: 35px
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
