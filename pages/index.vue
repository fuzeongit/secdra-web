<template>
  <section class="container ">
    <div>
      <el-upload
        :multiple="false"
        :show-file-list="false"
        class="avatar-uploader"
        :action="actionPath"
        accept="image/jpeg,image/gif,image/png,image/bmp"
        :data="postData"
        :before-upload="beforeAvatarUpload"
        :on-progress="progress"
        :on-success="handleAvatarSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <button @click="click">测试</button>
      <button @click="$router.push(`/user/123`)">跳转</button>
      <button @click="remove">删除</button>
    </div>
  </section>
</template>

<script>

  import {mapActions} from "vuex"
  import Cookie from 'js-cookie'

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      try{
        let res = await $axios.get("/api/qiniu/getUploadToken");
        let result = res.data||{};
        if(result.status === 200){
          store.state.user.uploadToken = result.data
        }
      }catch (e) {

      }
    },
    components: {},
    computed: {
      postData() {
        return {
          token: this.$store.state.user.uploadToken
        }
      }
    },
    data() {
      return {
        imageUrl: "",
        actionPath: ""
      }
    },
    mounted() {

    },
    methods: {
      ...mapActions("user", ["AGetInfo"]),
      async click() {
        let result = await this.AGetInfo({phone: "13760029486", password: "123456"});
      },
      remove() {
        Cookie.remove("token");
      },

      beforeAvatarUpload(file) {
        console.log(file)

        return true;
      },
      progress(event, file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccess(res, file) {
        console.log(res)
        this.imageUrl = URL.createObjectURL(file.raw);
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

