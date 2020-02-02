<template>
  <div>
    <div
      v-lazy:background-image="$img.backLazy(user.background)"
      class="user-bk cover"
    >
      <div class="user-bk-content">
        <div class="tool">
          <Btn v-tooltip="`上传背景`" icon big type="file" @change="uploadBack">
            <i class="icon ali-icon-upload"></i>
          </Btn>
          <Btn
            v-tooltip="`编辑`"
            icon
            big
            style="margin-left: 15px;"
            @click="editShow = true"
          >
            <i class="icon ali-icon-edit"></i>
          </Btn>
        </div>
      </div>
    </div>
    <div class="content card">
      <div class="head-box">
        <label v-ripple class="upload-head">
          <input type="file" style="display: none" @change="uploadHead" />
          <img
            v-lazy="$img.headLazy(user.head)"
            :onerror="
              `this.src='${require('../../../assets/image/svg/default-head.svg')}'`
            "
          />
        </label>
        <div class="info-box">
          <p class="name">
            {{ user.name }}
            <i
              class="icon"
              :class="{
                'ali-icon-female': user.gender === 'FEMALE',
                'ali-icon-male': user.gender === 'MALE'
              }"
            ></i>
          </p>
          <p class="introduction">
            {{ user.introduction || "这人很懒，什么都没有留下" }}
          </p>
        </div>
      </div>
      <div class="picture-box">
        <div v-loading="worksLoading" class="works-box">
          <h3 class="line center">
            <span>我的作品</span>
          </h3>
          <div v-if="worksList.length" class="picture-list">
            <nuxt-link
              v-for="(picture, index) in worksList"
              :key="index"
              v-ripple
              class="picture-item flex-box"
              :to="`/picture/${picture.id}`"
            >
              <img
                v-lazy="$img.secdraLazy(picture.url, `specifiedWidth`)"
                :style="{
                  height: getProportion(picture) >= 1 ? `100%` : ``,
                  width: getProportion(picture) <= 1 ? `100%` : ``
                }"
              />
            </nuxt-link>
          </div>
          <p v-if="worksList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/works/${user.id || ''}`"
              >查看更多>></Btn
            >
          </p>
          <img
            v-if="!worksLoading && !worksList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
        <div v-loading="collectionLoading" class="collection-box">
          <h3 class="line center">
            <span>我的收藏</span>
          </h3>
          <div v-if="collectionList.length" class="picture-list">
            <nuxt-link
              v-for="(picture, index) in collectionList"
              :key="index"
              v-ripple
              class="picture-item flex-box"
              :to="`/picture/${picture.id}`"
            >
              <img
                v-lazy="$img.secdraLazy(picture.url, `specifiedWidth`)"
                :style="{
                  height: getProportion(picture) >= 1 ? `100%` : ``,
                  width: getProportion(picture) <= 1 ? `100%` : ``
                }"
              />
            </nuxt-link>
          </div>
          <p v-if="collectionList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/collection/${user.id || ''}`"
              >查看更多>></Btn
            >
          </p>
          <img
            v-if="!collectionLoading && !collectionList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
      </div>
    </div>
    <Dialog
      v-model="tailoringHeadShow"
      v-loading="uploadHeadLoading"
      title="剪切"
      persistent
    >
      <div class="edit-dialog-content" style="width: 500px;height: 50vh">
        <img ref="tailoringHeadImage" :src="tailoringHeadImage" />
      </div>
      <Btn block color="primary" @click="saveHead">保存</Btn>
    </Dialog>
    <Dialog
      v-model="tailoringBackShow"
      v-loading="uploadBackLoading"
      title="剪切"
      persistent
    >
      <div class="edit-dialog-content" style="width: 700px;height: 70vh">
        <img ref="tailoringBackImage" :src="tailoringBackImage" />
      </div>
      <Btn block color="primary" @click="saveBack">保存</Btn>
    </Dialog>
    <Dialog v-model="editShow" v-loading="editLoading" title="编辑" persistent>
      <ScrollBox
        class="edit-dialog-content"
        style="width: 500px;height: 450px;"
      >
        <div class="input-group">
          <h5 class="sub-name">名称：</h5>
          <Field v-model="userForm.name" block color="primary"></Field>
        </div>
        <div class="input-group">
          <h5 class="sub-name">简介：</h5>
          <Field
            v-model="userForm.introduction"
            block
            color="primary"
            type="textarea"
          ></Field>
        </div>
        <div class="input-group">
          <h5 class="sub-name">性别：</h5>
          <RadioGroup v-model="userForm.gender">
            <Radio
              v-for="item in $enum.Gender"
              :key="item.key"
              :value="item.key"
              :label="item.value"
              color="primary"
              style="margin-right: 10px"
            ></Radio>
          </RadioGroup>
        </div>
        <div class="input-group">
          <h5 class="sub-name">生日：</h5>
          <DateInput
            v-model="userForm.birthday"
            block
            color="primary"
            :max="new Date()"
          ></DateInput>
        </div>
      </ScrollBox>
      <Btn block color="primary" @click="update">保存</Btn>
    </Dialog>
  </div>
</template>

<script>
import Cropper from "cropperjs"
import { mapActions, mapMutations, mapState } from "vuex"
import ioUtil from "../../../assets/script/util/ioUtil"
import { Pageable, Result } from "../../../assets/script/model"

export default {
  data() {
    return {
      tailoringHeadShow: false,
      tailoringBackShow: false,
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

      editShow: false,
      userForm: Object.assign({}, this.$store.state.user.user), // 需要脱离vuex
      editLoading: false
    }
  },
  computed: {
    ...mapState("user", ["user", "uploadToken"])
  },
  watch: {
    tailoringHeadImage(newVal, oldVal) {
      if (oldVal) {
        URL.revokeObjectURL(oldVal)
      }
    },
    tailoringBackImage(newVal, oldVal) {
      if (oldVal) {
        URL.revokeObjectURL(oldVal)
      }
    }
  },
  mounted() {
    this.headCropper = new Cropper(
      this.$refs.tailoringHeadImage._isVue
        ? this.$refs.tailoringHeadImage.$el
        : this.$refs.tailoringHeadImage,
      {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        zoomable: false
      }
    )
    this.backCropper = new Cropper(
      this.$refs.tailoringBackImage._isVue
        ? this.$refs.tailoringBackImage.$el
        : this.$refs.tailoringBackImage,
      {
        aspectRatio: 2,
        viewMode: 1,
        background: false,
        zoomable: false
      }
    )
    this.pagingWorks()
    this.pagingCollection()
  },
  methods: {
    ...mapMutations("user", ["MSetUserInfo", "MSetUserInfoAttr"]),
    ...mapActions("user", [
      "AUpdateBack",
      "AUpdateHead",
      "APagingByFollowerId",
      "AUpdate"
    ]),
    ...mapActions("picture", ["APagingCollection", "APaging"]),
    async pagingWorks() {
      this.worksLoading = true
      const result = await this.APaging(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          targetId: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.worksLoading = false
      this.worksList = result.data.content
    },
    async pagingCollection() {
      this.collectionLoading = true
      const result = await this.APagingCollection(
        new Pageable(0, 8, "createDate,desc")
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.collectionLoading = false
      this.collectionList = result.data.content
    },
    getProportion(picture) {
      return picture.height / picture.width || 1
    },
    uploadHead($event) {
      const file = $event.target.files[0]
      if (!file) {
        return false
      }
      if (!ioUtil.isImage(file)) {
        this.$notify({ message: "请上传图片" })
        return false
      }
      this.tailoringHeadImage = URL.createObjectURL(file)
      this.headCropper.replace(this.tailoringHeadImage)
      this.tailoringHeadShow = true
      $event.target.value = ""
    },
    async saveHead() {
      const file = ioUtil.dataURLtoFile(
        ioUtil
          .getRoundedCanvas(this.headCropper.getCroppedCanvas(), 400, 400)
          .toDataURL()
      )
      this.uploadHeadLoading = true
      const result = await this.upload(file, "head")
      this.uploadHeadLoading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.MSetUserInfoAttr({ attr: "head", value: URL.createObjectURL(file) })
      this.tailoringHeadShow = false
    },
    uploadBack($event) {
      const file = $event.target.files[0]
      if (!file) {
        return false
      }
      if (!ioUtil.isImage(file)) {
        this.$notify({ message: "请上传图片" })
        return false
      }
      this.tailoringBackImage = URL.createObjectURL(file)
      this.backCropper.replace(this.tailoringBackImage)
      this.tailoringBackShow = true
      $event.target.value = ""
    },
    async saveBack() {
      const file = ioUtil.dataURLtoFile(
        this.backCropper.getCroppedCanvas().toDataURL()
      )
      this.uploadBackLoading = true
      const result = await this.upload(file, "back")
      this.uploadBackLoading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.MSetUserInfoAttr({
        attr: "background",
        value: URL.createObjectURL(file)
      })
      this.tailoringBackShow = false
    },
    async upload(file, type) {
      const form = new FormData()
      form.append("token", this.uploadToken)
      form.append("file", file)
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
        return new Result(500, null, "上传失败")
      }
      if (!qiniuResult.hash) {
        return new Result(500, null, "上传失败")
      }
      if (type === "back") {
        return this.AUpdateBack({ url: qiniuResult.hash })
      } else if (type === "head") {
        return this.AUpdateHead({ url: qiniuResult.hash })
      }
    },
    async update() {
      this.editLoading = true
      const result = await this.AUpdate(this.userForm)
      this.editLoading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.editShow = false
      this.$notify({ message: `修改成功` })
      this.MSetUserInfo(result.data)
      this.userForm = Object.assign({}, this.user)
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
        background-color: rgba(0, 0, 0, 0.3);
        i {
          color: @font-color-light-fade;
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
  margin: -100px auto @page-gap;
  @head-img-height: 150px;
  @head-img-border: 2px;
  transform: translateY(0);

  .head-box {
    padding: 0 100px;
    .upload-head {
      cursor: pointer;
      margin-top: -(@head-img-height+ @head-img-border)/2;
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
          &.ali-icon-female {
            color: @female-color;
          }
          &.ali-icon-male {
            color: @male-color;
          }
        }
      }
      .introduction {
        font-size: @smallest-font-size;
      }
    }
  }

  .picture-box {
    @picture-box-padding: 50px;
    padding: 30px @picture-box-padding;

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
      min-height: 250px;
      .is-not {
        display: block;
        margin: 0 auto;
      }
    }
    .collection-box {
      margin-top: 30px;
      min-height: 250px;
      .is-not {
        display: block;
        margin: 0 auto;
      }
    }

    .move {
      text-align: right;
      a {
        color: @theme-color;
      }
    }
    .picture-list {
      @column-number: 4;
      @gap: 20px;
      @size: (
          @visual-width - @picture-box-padding * 2 - (@column-number - 1) * @gap
        ) / @column-number;
      display: grid;
      grid-gap: @gap;
      grid-template-columns: repeat(@column-number, @size);
      padding: @gap 0;

      .picture-item {
        overflow: hidden;
        transition: @default-animate-time;
        position: relative;
        height: @size;
        img {
          object-fit: cover;
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
