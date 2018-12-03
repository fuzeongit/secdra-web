<template>
  <div>
    <div class="user-bk cover"
         :style="{transform: `translateY(${scrollTop*.5}px)`,backgroundImage: `url(${$img.back(user.background)})`}">
      <div class="user-bk-content"></div>
    </div>
    <div class="content card" :style="{marginTop:`-100px`}">
      <div class="head-box">
        <label class="upload">
          <input type="file" style="display: none" @change="uploadFile">
          <img :src="$img.head(user.head)"
               :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`">
        </label>
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
    </div>
    <Dialog  v-model="isShowTailoring" title="剪切">
      <div class="edit-dialog-content" style="width: 300px;margin: 10px 0">
        <img :src="tailoringImg" style="width: 100%" ref="tailoringImg">
      </div>
      <button class="btn block" @click="saveHead">保存</button>
    </Dialog>
  </div>
</template>

<script>
  import Cropper from "cropperjs"
  import ioUtil from '../../../assets/js/util/ioUtil'
  import {mapActions} from "vuex"

  export default {
    data() {
      return {
        url: "",
        desc: '',
        name: '',
        isPrivate: false,
        tagList: [],
        isShowTailoring: false,
        tailoringImg: "",
        cropper: {}
      }
    },
    computed: {
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
    mounted(){
      this.cropper = new Cropper(this.$refs["tailoringImg"]._isVue ? this.$refs["tailoringImg"].$el : this.$refs["tailoringImg"], {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        zoomable: false
      });
    },
    methods: {
      ...mapActions("draw", ["ASave"]),
      test(...a) {
        console.log(a);
      },
      add() {
        this.tagList.push({name: ""});
      },
      async click() {
        console.log({
          url: this.url,
          desc: this.desc,
          name: this.name,
          isPrivate: this.isPrivate,
          tagList: this.tagList.map(item => item.name),
        });
        let result = await this.ASave({
          url: this.url,
          desc: this.desc,
          name: this.name,
          isPrivate: this.isPrivate,
          tagList: this.tagList.map(item => item.name),
        });
      },
      uploadFile($event) {
        let file = $event.target.files[0];
        if(!file){
          return false;
        }
        if (!ioUtil.isImage(file)) {
          this.$notify({message: "请上传图片"});
          return false;
        }
        this.tailoringImg = URL.createObjectURL(file);
        this.cropper.replace(this.tailoringImg);
        this.isShowTailoring = true;
        $event.target.value="";
      },
      saveHead(){
        this.user.head = URL.createObjectURL(ioUtil.dataURLtoFile(ioUtil.getRoundedCanvas(this.cropper.getCroppedCanvas()).toDataURL()));
        URL.revokeObjectURL(this.tailoringImg);
        this.isShowTailoring = false
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
    .upload {
      cursor: pointer;
    }
    .head-box {
      padding: 0 100px 20px;
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
