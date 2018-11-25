<template>
  <div class="page">
    <!--<div class="card">-->
      <!--<el-upload-->
        <!--:multiple="false"-->
        <!--:show-file-list="false"-->
        <!--class="avatar-uploader"-->
        <!--:action="actionPath"-->
        <!--accept="image/jpeg,image/gif,image/png,image/bmp"-->
        <!--:data="postData"-->
        <!--:before-upload="beforeAvatarUpload"-->
        <!--:on-progress="progress"-->
        <!--:on-success="handleAvatarSuccess">-->
        <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
        <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
      <!--</el-upload>-->
    <!--</div>-->
  </div>
</template>

<script>

  import config from "../assets/js/config";

  export default {
    name: "upload",
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "upload";
      let res = await $axios.get(`${config.host}/qiniu/getUploadToken`);
      let result = res.data || {};
      if (result.status === 200) {
        store.state.user.uploadToken = result.data
      }
    },
    data() {
      return {
        imageUrl: "",
        actionPath: ""
      }
    },
    computed: {
      postData() {
        return {
          token: this.$store.state.user.uploadToken
        }
      }
    },
    mounted(){
      this.$alert({
        message:`由于没钱开通非法图片鉴定，所以不提供上传！`
      })
    },
    methods: {
      beforeAvatarUpload(file) {
        return true;
      },
      progress(event, file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    }
  }
</script>

<style scoped>

</style>
