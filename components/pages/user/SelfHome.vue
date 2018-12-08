<template>
  <div>
    <div class="user-bk cover"
         :style="{transform: `translateY(${scrollTop*.5}px)`,backgroundImage: `url(${$img.back(user.background)})`}">
      <div class="user-bk-content"></div>
    </div>
    <div class="content card" :style="{marginTop:`-100px`}">
      <div class="head-box">
        <label class="upload-head">
          <input type="file" style="display: none" @change="uploadHead">
          <img :src="$img.head(user.head)"
               :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`">
        </label>
        <label class="btn is-suspend upload-back" style="">
          <input type="file" style="display: none" @change="uploadBack">
          <i class="icon s-bianji" style="color:white;opacity: .7"></i>
        </label>
      </div>
      <div style="height: 3000px">
        <input type="text" class="input" title="" v-model="url" placeholder="url">
        <input type="text" class="input" title="" v-model="name" placeholder="name">
        <input type="text" class="input" title="" v-model="desc" placeholder="desc">
        <button class="btn" @click="add">增加</button>
        <input type="text" class="input" title="" v-model="tag.name" :key="index" placeholder="tag"
               v-for="(tag,index)  in tagList">
        <button class="btn" @click="click">发送</button>
        <Checkbox v-model="isPrivate"></Checkbox>
      </div>
    </div>
    <Dialog v-model="isShowTailoringHead" title="剪切" v-loading="uploadHeadLoading">
      <div class="edit-dialog-content" style="margin: 10px 0;width: 500px;height: 50vh">
        <img :src="tailoringHeadImage" ref="tailoringHeadImage">
      </div>
      <button class="btn block" @click="saveHead">保存</button>
    </Dialog>
    <Dialog v-model="isShowTailoringBack" title="剪切" v-loading="uploadBackLoading">
      <div class="edit-dialog-content" style="margin: 10px 0;width: 700px;height: 70vh">
        <img :src="tailoringBackImage" ref="tailoringBackImage">
      </div>
      <button class="btn block" @click="saveBack">保存</button>
    </Dialog>
  </div>
</template>

<script>
  import Cropper from "cropperjs"
  import ioUtil from '../../../assets/js/util/ioUtil'
  import {mapActions} from "vuex"
  import {Result} from "../../../assets/js/model/base";
  import config from "../../../assets/js/config";

  export default {
    data() {
      return {
        url: "",
        desc: '',
        name: '',
        isPrivate: false,
        tagList: [],
        isShowTailoringHead: false,
        isShowTailoringBack: false,
        tailoringHeadImage: "",
        tailoringBackImage: "",
        headCropper: {},
        backCropper: {},
        uploadHeadLoading: false,
        uploadBackLoading: false
      }
    },
    watch: {
      tailoringHeadImage(newVal, oldVal) {
        if (oldVal) {
          URL.revokeObjectURL(oldVal);
        }
      },
      tailoringBackImage(newVal, oldVal) {
        if (oldVal) {
          URL.revokeObjectURL(oldVal);
        }
      }
    },
    computed: {
      uploadToken() {
        return this.$store.state.user.uploadToken || ""
      },
      user() {
        return this.$store.state.user.user || {}
      },
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    },
    mounted() {
      this.headCropper = new Cropper(this.$refs["tailoringHeadImage"]._isVue ? this.$refs["tailoringHeadImage"].$el : this.$refs["tailoringHeadImage"], {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        zoomable: false
      });
      this.backCropper = new Cropper(this.$refs["tailoringBackImage"]._isVue ? this.$refs["tailoringBackImage"].$el : this.$refs["tailoringBackImage"], {
        aspectRatio: 2,
        viewMode: 1,
        background: false,
        zoomable: false
      });
    },
    methods: {
      ...mapActions("draw", ["ASave"]),
      ...mapActions("user", ["AUpdateBack", "AUpdateHead"]),
      add() {
        this.tagList.push({name: ""});
      },
      async click() {
        let result = await this.ASave({
          url: this.url,
          desc: this.desc,
          name: this.name,
          isPrivate: this.isPrivate,
          tagList: this.tagList.map(item => item.name),
        });
      },
      uploadHead($event) {
        let file = $event.target.files[0];
        if (!file) {
          return false;
        }
        if (!ioUtil.isImage(file)) {
          this.$notify({message: "请上传图片"});
          return false;
        }
        this.tailoringHeadImage = URL.createObjectURL(file);
        this.headCropper.replace(this.tailoringHeadImage);
        this.isShowTailoringHead = true;
        $event.target.value = "";
      },
      async saveHead() {
        let file = ioUtil.dataURLtoFile(ioUtil.getRoundedCanvas(this.headCropper.getCroppedCanvas(),400,400).toDataURL());
        this.user.head = URL.createObjectURL(file);
        this.uploadHeadLoading = true;
        let result = await this.upload(file, "head");
        this.uploadHeadLoading = false;
        console.log(result);
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return;
        }
        this.isShowTailoringHead = false;
      },
      uploadBack($event) {
        let file = $event.target.files[0];
        if (!file) {
          return false;
        }
        if (!ioUtil.isImage(file)) {
          this.$notify({message: "请上传图片"});
          return false;
        }
        this.tailoringBackImage = URL.createObjectURL(file);
        this.backCropper.replace(this.tailoringBackImage);
        this.isShowTailoringBack = true;
        $event.target.value = "";
      },
      async saveBack() {
        let file = ioUtil.dataURLtoFile(this.backCropper.getCroppedCanvas().toDataURL());
        this.user.background = URL.createObjectURL(file);
        this.uploadBackLoading = true;
        let result = await this.upload(file, "back");
        this.uploadBackLoading = false;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return;
        }
        this.isShowTailoringBack = false;
      },
      async upload(file, type) {
        let form = new FormData();
        form.append("token", this.uploadToken);
        form.append("file", file);

        let qiniuResult = (await this.$axios.post(config.qiniuUploadAddress, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })).data;
        if (!qiniuResult.hash) {
          return new Result(500, null, "上传失败");
        }
        if (type === "back") {
          return await this.AUpdateBack({url: qiniuResult.hash});
        } else if (type === "head") {
          return await this.AUpdateHead({url: qiniuResult.hash});
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";

  .user-bk {
    width: 100%;
    margin-top: -@herder-height;
    height: @window-min-width / 2;
    /*background-image: url("../../../assets/image/bk/login-bk.jpg");*/
    .user-bk-content {
      padding-top: @herder-height;
      width: 100%;
      height: 100%;
    }
  }

  @media-width-1: 1529px;
  @media-width-2: 1276px;

  @media only screen and (min-width: @media-width-1) {
    .user-bk {
      height: @media-width-1 / 2;
    }
  }

  @media only screen and (max-width: @media-width-1) and (min-width: @media-width-2) {
    .user-bk {
      height: @media-width-2 / 2;
    }
  }

  @media screen and (max-width: @media-width-2) {
    .user-bk {
      height: @window-min-width / 2;
    }
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    @head-img-height: 150px;
    @head-img-border: 2px;
    transform: translateY(0);

    .head-box {
      padding: 0 100px 20px;
      .upload-head {
        cursor: pointer;
      }
      .upload-back {
        float: right;
        line-height: 45px;
        transform: translateY(-75px);
        border: none;
        background-color: rgba(0, 0, 0, .3);
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
      }
      img {
        transform: translateY(-(@head-img-height+@head-img-border)/2);
        height: @head-img-height;
        width: @head-img-height;
        border: @head-img-border solid @white;
        border-radius: 50%;
      }
    }
  }
</style>
