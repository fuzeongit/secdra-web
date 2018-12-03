<template>
  <div style="background-color: white;height: 100vh">
    <label>
      <span class="btn">测试</span>
      <input type="file" value="上传" style="display: none" @change="changeImage">
    </label>
    <button class="btn" @click="implement">剪裁</button>

    <div style="width: 700px">
      <img :src="imageUrl" ref="image" style="width: 100%"/>
    </div>
    <img :src="imageUrl2">
  </div>
</template>

<script>
  import Cropper from "cropperjs"
  import ioUtil from "../assets/js/util/ioUtil"

  export default {
    layout: 'login',
    data() {
      return {
        imageUrl: "",
        imageUrl2: "",
      }
    },
    mounted() {
      this.cropper = new Cropper(this.$refs["image"]._isVue ? this.$refs["image"].$el : this.$refs["image"], {
        aspectRatio: 1/3,
        viewMode: 1,
        background: false,
        zoomable: false,
        ready: function () {

        }
      });
    },
    methods: {
      changeImage($event) {
        let file = $event.target.files[0];
        console.log(file);
        this.imageUrl = URL.createObjectURL(file);
        this.cropper.replace(this.imageUrl)
      },
      async implement() {
        this.imageUrl2 = URL.createObjectURL(ioUtil.dataURLtoFile(ioUtil.getRoundedCanvas(this.cropper.getCroppedCanvas()).toDataURL()));
        console.log(await ioUtil.getOffset(this.imageUrl2));
      }
    }
  }
</script>
<style scoped>

</style>
