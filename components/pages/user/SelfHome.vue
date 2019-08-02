<template>
  <div>
    <div class="user-bk cover"
         :style="{backgroundImage: `url(${$img.back(user.background)})`}">
      <div class="user-bk-content">
        <div class="tool">
          <Btn icon big type="file" @change="uploadBack">
            <i class="icon s-upload"></i>
          </Btn>
          <Btn icon big style="margin-left: 15px;" @click="isShowEdit = true">
            <i class="icon s-bianji"></i>
          </Btn>
        </div>
      </div>
    </div>
    <div class="content card">
      <div class="head-box">
        <label class="upload-head" v-ripple>
          <input type="file" style="display: none" @change="uploadHead">
          <img :src="$img.head(user.head)"
               :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`">
        </label>
        <div class="info-box">
          <p class="name"> {{user.name}} <i class="icon"
                                            :class="{'s-xingbie-nv':user.gender==='FEMALE','s-xingbie-nan':user.gender==='MALE'}"></i>
          </p>
          <p class="introduction"> {{user.introduction || "这人很懒，什么都没有留下"}}</p>
        </div>
      </div>
      <div class="draw-box">
        <div class="works-box" v-loading="worksLoading">
          <h3 class="line center">
            <span>我的作品</span>
          </h3>
          <div class="draw-list row">
            <div class="draw-item" v-for="(draw ,index) in worksList" :key="index">
              <nuxt-link style="width: 100%;height: 230px;" class="flex-box" :to="`/draw/${draw.id}`" v-ripple>
                <img :src="$img.secdra(draw.url,`specifiedWidth`)"
                     :style="{height:getProportion(draw)>=1?`100%`:`auto`,width:getProportion(draw)<=1?`100%`:`auto`}">
              </nuxt-link>
            </div>
          </div>
          <p class="move" v-if="worksList.length===8">
            <Btn round flat small color="primary" :to="`/works/${user.id||''}`">查看更多>></Btn>
          </p>
          <img src="../../../assets/image/default/not.png" class="is-not" v-if="!worksLoading&&!worksList.length">
        </div>
        <div class="collection-box" v-loading="collectionLoading">
          <h3 class="line center">
            <span>我的收藏</span>
          </h3>
          <div class="draw-list row">
            <div class="draw-item" v-for="(draw ,index) in collectionList" :key="index">
              <nuxt-link style="width: 100%;height: 230px;" class="flex-box" :to="`/draw/${draw.id}`" v-ripple>
                <img :src="$img.secdra(draw.url,`specifiedWidth`)"
                     :style="{height:getProportion(draw)>=1?`100%`:`auto`,width:getProportion(draw)<=1?`100%`:`auto`}">
              </nuxt-link>
            </div>
          </div>
          <p class="move" v-if="collectionList.length===8">
            <Btn round flat small color="primary" :to="`/collection/${user.id||''}`">查看更多>></Btn>
          </p>
          <img src="../../../assets/image/default/not.png" class="is-not"
               v-if="!collectionLoading&&!collectionList.length">
        </div>
      </div>
    </div>
    <Dialog v-model="isShowTailoringHead" title="剪切" v-loading="uploadHeadLoading" persistent>
      <div class="edit-dialog-content" style="width: 500px;height: 50vh">
        <img :src="tailoringHeadImage" ref="tailoringHeadImage">
      </div>
      <Btn block color="primary" @click="saveHead">保存</Btn>
    </Dialog>
    <Dialog v-model="isShowTailoringBack" title="剪切" v-loading="uploadBackLoading" persistent>
      <div class="edit-dialog-content" style="width: 700px;height: 70vh">
        <img :src="tailoringBackImage" ref="tailoringBackImage">
      </div>
      <Btn block color="primary" @click="saveBack">保存</Btn>
    </Dialog>
    <Dialog v-model="isShowEdit" title="编辑" v-loading="editLoading" persistent>
      <div class="edit-dialog-content" style="width: 500px;height: 450px;overflow: auto">
        <div>
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <input type="text" title="name" v-model="userForm.name" class="input block primary-color">
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <textarea v-model="userForm.introduction" class="input block textarea primary-color" title="introduction"
                      rows="3"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">性别：</h5>
            <RadioGroup v-model="userForm.gender">
              <Radio :value="item.key" :label="item.value" color="primary" v-for="item in $enum.CollectState" :key="item.key" style="margin-right: 10px"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">生日：</h5>
            <DateInput v-model="userForm.birthday" block color="primary"></DateInput>
          </div>
        </div>
      </div>
      <Btn block color="primary" @click="update">保存</Btn>
    </Dialog>
  </div>
</template>

<script>
  import Cropper from "cropperjs"
  import ioUtil from '../../../assets/script/util/ioUtil'
  import {mapActions, mapMutations, mapState} from "vuex"
  import {Pageable, Result} from "../../../assets/script/model";

  export default {
    data() {
      return {
        isShowTailoringHead: false,
        isShowTailoringBack: false,
        tailoringHeadImage: "",
        tailoringBackImage: "",
        headCropper: {},
        backCropper: {},
        uploadHeadLoading: false,
        uploadBackLoading: false,

        worksLoading: true,
        worksList: [],
        collectionLoading: true,
        collectionList: [],

        isShowEdit: false,
        userForm: Object.assign({}, this.$store.state.user.user), //需要脱离vuex
        editLoading: false
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
      ...mapState('user', ['user', 'uploadToken'])
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
      this.pagingWorks();
      this.pagingCollection();

    },
    methods: {
      ...mapMutations("user", ["MSetUserInfo", "MSetUserInfoAttr"]),
      ...mapActions("user", ["AUpdateBack", "AUpdateHead", "APagingFollowing", "AUpdate"]),
      ...mapActions("draw", ["APagingCollection", "APagingByUserId"]),
      async pagingWorks() {
        this.worksLoading = true;
        let result = await this.APagingByUserId(new Pageable(0, 8, "createDate,desc"));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.worksLoading = false;
        this.worksList = result.data.content;
      },
      async pagingCollection() {
        this.collectionLoading = true;
        let result = await this.APagingCollection(new Pageable(0, 8, "createDate,desc"));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.collectionLoading = false;
        this.collectionList = result.data.content;
      },
      getProportion(draw) {
        return draw.height / draw.width
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
        let file = ioUtil.dataURLtoFile(ioUtil.getRoundedCanvas(this.headCropper.getCroppedCanvas(), 400, 400).toDataURL());
        this.MSetUserInfoAttr({attr: "head", value: URL.createObjectURL(file)});
        this.uploadHeadLoading = true;
        let result = await this.upload(file, "head");
        this.uploadHeadLoading = false;
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
        this.MSetUserInfoAttr({attr: "background", value: URL.createObjectURL(file)});
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
        let qiniuResult;
        try {
          qiniuResult = (await this.$axios.post(process.env.qiniuUploadAddress, form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })).data;
        } catch (e) {
          return new Result(500, null, "上传失败");
        }
        if (!qiniuResult.hash) {
          return new Result(500, null, "上传失败");
        }
        if (type === "back") {
          return await this.AUpdateBack({url: qiniuResult.hash});
        } else if (type === "head") {
          return await this.AUpdateHead({url: qiniuResult.hash});
        }
      },
      async update() {
        this.editLoading = true;
        let result = await this.AUpdate(this.userForm);
        this.editLoading = false;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.isShowEdit = false;
        this.$notify({message: `修改成功`});
        this.MSetUserInfo(result.data);
        this.userForm = Object.assign({}, this.user);
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
    .user-bk-content {
      padding-top: @herder-height;
      width: @visual-width;
      height: 100%;
      margin: 0 auto;
      position: relative;
      .tool {
        position: absolute;
        bottom: 125px;
        right: 100px;
        text-align: right;
        .btn {
          background-color: rgba(0, 0, 0, .3);
          i {
            color: white;
            opacity: .7;
          }
        }
      }
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
    margin: -100px auto 24px;
    @head-img-height: 150px;
    @head-img-border: 2px;
    transform: translateY(0);

    .head-box {
      padding: 0 100px;
      .upload-head {
        cursor: pointer;
        margin-top: -(@head-img-height+@head-img-border)/2;
        display: inline-block;
        position: absolute;
        border-radius: 50%;
        img {
          height: @head-img-height;
          width: @head-img-height;
          border: @head-img-border solid white;
          border-radius: 50%;
        }
      }
      .info-box {
        margin-left: @head-img-height;
        padding: 20px;
        .name {
          line-height: 30px;
          .icon {
            margin-left: 10px;
            vertical-align: baseline;
            &.s-xingbie-nv {
              color: @female-color;
            }
            &.s-xingbie-nan {
              color: @male-color;
            }
          }

        }
        .introduction {
          font-size: @smallest-font-size;
        }
      }
    }

    .draw-box {
      margin-top: 30px;
      padding: 0 50px;
      .line {
        width: 100%;
        border-bottom: 1px dashed @font-color-dark-line;
        margin-bottom: 18px;
        span {
          background-color: white;
          margin-bottom: -15px;
          display: inline-block;
          padding: 0 15px;
          vertical-align: middle;
        }
      }

      .works-box {
        padding-bottom: 24px;
        min-height: 250px;
        .is-not {
          display: block;
          margin: 0 auto;
        }
      }
      .collection-box {
        margin-top: 30px;
        padding-bottom: 24px;
        min-height: 250px;
        .is-not {
          display: block;
          margin: 0 auto;
        }
      }

      .move {
        margin-top: 24px;
        text-align: right;
        a {
          color: @theme-color;
        }
      }
      .draw-list {
        .draw-item {
          @size: 230px;
          float: left;
          margin-top: 20px;
          margin-right: 20px;
          overflow: hidden;
          transition: @default-animate-time;
          position: relative;
          width: @size;
          &:nth-child(4n+1) {
            margin-left: 20px;
          }
        }
      }
    }
  }

  .edit-dialog-content {
    overflow: hidden;
    margin: 10px 0;
  }
</style>
