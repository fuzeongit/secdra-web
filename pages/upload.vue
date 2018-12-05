<template>
  <div class="page">
    <label class="btn">
      测试
      <input type="file" value="上传" style="display: none" @change="changeImage">
    </label>
    <div style="width: 700px">
      <img :src="imageUrl" ref="image" style="width: 100%"/>
    </div>
    <button class="btn" @click="implement">剪裁</button>
    <img :src="imageUrl2">
  </div>
</template>

<script>
  import config from "../assets/js/config";
  import Cropper from "cropperjs"

  export default {
    name: "upload",
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "upload";
      let res = await $axios.get(`${config.host}/qiniu/getUploadToken`);
      let result = res.data || {};
      if (result.status !== 200) {
        throw new Error(result)
      }
      return {
        postData:{
          token:result.data
        }
      }
    },
    data() {
      return {
        imageUrl: "",
        imageUrl2: "",
        actionPath: "http://upload-z2.qiniup.com",
        cropper: {},
      }
    },
    mounted() {
      this.cropper = new Cropper(this.$refs["image"]._isVue ? this.$refs["image"].$el : this.$refs["image"], {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        zoomable: false
      });
    },
    methods: {
      changeImage($event) {
        let file = $event.target.files[0];
        this.imageUrl = URL.createObjectURL(file);
        this.cropper.replace(this.imageUrl)
      },
      getRoundedCanvas(sourceCanvas) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        let width = sourceCanvas.width;
        let height = sourceCanvas.height;
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = "destination-in";
        context.beginPath();
        context.fill();
        return canvas;
      },
      implement() {
        this.getRoundedCanvas(this.cropper.getCroppedCanvas()).toBlob(blobObj => {
          this.imageUrl2 = URL.createObjectURL(blobObj);
        })
      }
    }
  }
</script>

<style scoped>

</style>
