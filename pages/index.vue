<template>
  <div class="page">
    <div class="card">
      <button @click="click" class="btn-blue">测试</button>
      <button @click="$router.push(`/user/123`)" class="btn-blue">跳转</button>
      <button @click="remove" class="btn-blue">删除</button>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"


  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "home"
    },
    data() {

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
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  .page{
    padding-top: 30px;
  }
  .card{
    width: @visual-width;
  }
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

