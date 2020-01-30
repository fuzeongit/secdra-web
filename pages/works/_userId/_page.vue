<template>
  <div class="page">
    <CheckboxGroup v-model="selectList" class="content">
      <div v-for="(picture, index) in list" :key="index" class="card ">
        <nuxt-link
          v-ripple
          :to="`/picture/${picture.id}`"
          class="img-box flex-box"
        >
          <img
            v-lazy="$img.secdraLazy(picture.url, `specifiedWidth`)"
            :style="{
              height: getProportion(picture) >= 1 ? `100%` : `auto`,
              width: getProportion(picture) <= 1 ? `100%` : `auto`
            }"
          />
        </nuxt-link>
        <div class="tool">
          <Checkbox
            v-if="self"
            v-tooltip="`选择`"
            :value="picture"
            value-key="id"
            small
            color="primary"
          ></Checkbox>
          <Btn
            v-if="!self"
            v-tooltip="
              picture.focus === $enum.CollectState.CONCERNED.key
                ? `取消收藏`
                : `收藏`
            "
            flat
            icon
            :color="
              picture.focus === $enum.CollectState.CONCERNED.key
                ? `red`
                : `default`
            "
            small
            @click.stop="collection(picture)"
          >
            <i
              class="icon"
              :class="{
                'ali-icon-likefill':
                  picture.focus === $enum.CollectState.CONCERNED.key,
                'ali-icon-like':
                  picture.focus !== $enum.CollectState.CONCERNED.key
              }"
            ></i>
          </Btn>
        </div>
        <div v-if="!self" class="flex-box info-box">
          <nuxt-link v-ripple :to="`/user/${picture.user.id}`" class="head-box">
            <img v-lazy="$img.headLazy(picture.user.head, 'small50')" />
          </nuxt-link>
          <div class="user-info-box">
            <p class="nickname">
              {{ picture.user.name }}
            </p>
            <p class="introduction">
              {{ picture.user.introduction }}
            </p>
          </div>
          <div class="follow-box flex-box">
            <Btn
              block
              color="primary"
              :disabled="picture.user.focus === $enum.FollowState.SElF.key"
              @click="follow(picture.user.id)"
            >
              {{
                picture.user.focus === $enum.FollowState.CONCERNED.key
                  ? `已关注`
                  : `关注`
              }}
            </Btn>
          </div>
        </div>
      </div>
    </CheckboxGroup>
    <Pageable
      :total-page="page.totalPages"
      :curr-page="pageable.page"
      @go="paging"
    ></Pageable>
    <CornerButtons :show-go-top="false">
      <Btn
        v-if="self"
        icon
        big
        shadow
        color="white"
        :disabled="selectList.isEmpty()"
        @click="editShow = true"
      >
        <i class="icon ali-icon-edit"></i>
      </Btn>
    </CornerButtons>
    <Dialog
      v-if="self"
      v-model="editShow"
      v-loading="editLoading"
      title="批量操作"
      persistent
    >
      <ScrollBox class="edit-dialog-content">
        <div class="input-group">
          <template v-for="(picture, index) in selectList">
            <Tag
              :key="picture.id"
              :content="picture.name"
              color="primary"
              :value="index"
              @close="removeSelectPicture"
            ></Tag
            >{{ " " }}
          </template>
        </div>
        <div>
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <Field v-model="pictureForm.name" block color="primary"></Field>
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <Field
              v-model="pictureForm.introduction"
              block
              color="primary"
              type="textarea"
            ></Field>
          </div>
          <div class="input-group">
            <h5 class="sub-name">私密：</h5>
            <RadioGroup v-model="pictureForm.privacy">
              <Radio
                v-for="item in $enum.PrivacyState"
                :key="item.key"
                :value="item.key"
                :label="item.value"
                color="primary"
                style="margin-right: 10px"
              ></Radio>
              <Radio
                :value="null"
                label="不作修改"
                color="primary"
                style="margin-left: 10px"
              ></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">添加标签：</h5>
            <TagInput v-model="inputTag" block color="primary"></TagInput>
          </div>
        </div>
      </ScrollBox>
      <div class="input-group" style="text-align: center;">
        <Btn color="primary" @click="save">保存</Btn>
        <Btn outline color="primary" @click="reset">重置</Btn>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { PictureForm, Pageable } from "../../../assets/script/model"
import CornerButtons from "../../../components/pages/shared/CornerButtons"

export default {
  components: {
    CornerButtons
  },
  computed: {
    self() {
      return (
        !this.$route.params.userId ||
        this.$store.state.user.user.id === this.$route.params.userId
      )
    }
  },
  watch: {
    selectList(newVal) {
      if (newVal.isEmpty()) {
        this.editShow = false
      }
    }
  },
  async asyncData({ store, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "works")
    const myself = store.state.user.user
    const taskList = []
    const pageable = new Pageable(
      route.params.page * 1 || 0,
      16,
      "createDate,desc"
    )
    taskList.push(
      $axios.get(`/user/get`, {
        params: { id: route.params.userId || myself.id }
      })
    )
    taskList.push(
      $axios.get(`/picture/paging`, {
        params: Object.assign(
          {
            targetId: route.params.userId || store.state.user.user.id
          },
          pageable
        )
      })
    )
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    if (resultList[0].status === 401) {
      redirect(`/login?r=${route.fullPath}`)
      return
    }
    const user = resultList[0].data
    const page = resultList[1].data
    if (myself.id === user.id) {
      store.commit("menu/MChangeName", "following")
    } else {
      store.commit("menu/MChangeName", "")
    }
    return {
      user,
      pageable,
      page,
      list: page.content,
      selectList: [],
      editShow: false,
      editLoading: false,
      inputTag: [],
      pictureForm: new PictureForm()
    }
  },
  head() {
    const title = this.self ? "我的作品" : this.user.name + "的作品"
    return { title: title + " - Secdra" }
  },
  mounted() {
    this.$notify({
      message: `说是作品，其实都是从p站下载的，侵删`,
      waitTime: 4000
    })
  },
  methods: {
    ...mapActions("picture", ["ACollection", "ABatchUpdate"]),
    ...mapActions("user", ["AFollow"]),
    getProportion(picture) {
      return picture.height / picture.width
    },
    paging(page) {
      this.$router.push(`/works/${this.user.id}/${page}`)
    },
    async collection(picture) {
      const result = await this.ACollection({
        pictureId: picture.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      picture.focus = result.data
    },
    async follow(id) {
      const result = await this.AFollow({
        followingId: id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.list.forEach((item) => {
        if (item.user.id === id) {
          item.user.focus = result.data
        }
      })
    },
    removeSelectPicture({ value }) {
      this.selectList.removeIndex(value)
    },
    reset() {
      this.inputTag = []
      this.pictureForm = new PictureForm()
    },
    async save() {
      const form = this.pictureForm
      form.idList = this.selectList.map((item) => item.id)
      const tagList = this.inputTag.filter((item) => item !== "")
      form.tagList = [...new Set(tagList)]
      this.editLoading = true
      const result = await this.ABatchUpdate(form)
      this.editLoading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.inputTag = []
      this.selectList.clear()
      this.pictureForm = new PictureForm()
      this.$notify({ message: "批量更新完毕" })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

@info-box-height: 80px;

.page {
  padding: @page-gap 0;
}

.content {
  @column-number: 4;
  @gap: @page-gap;
  @size: (@visual-width - @gap * (@column-number + 1)) / @column-number;
  width: @visual-width;
  margin: 0 auto;
  padding: 0 @gap @gap;
  display: grid;
  grid-template-columns: repeat(@column-number, @size);
  grid-gap: @gap;
  .card {
    overflow: hidden;
    transition: @default-animate-time;
    position: relative;

    &:hover {
      transform: translateY(-1px);
      .info-box {
        .user-info-box {
          opacity: 0;
          transform: translateY(10px);
        }
        .follow-box {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
    .img-box {
      width: @size;
      height: @size;
    }

    .tool {
      margin: 10px;
      user-select: none;
      padding: 0 10px;
      text-align: right;
      .like {
        margin-left: 10px;
      }
    }
    .info-box {
      margin-top: -10px;
      @img-size: 50px;
      @padding-size: 15px;
      padding: @padding-size;
      overflow: hidden;
      .head-box {
        display: block;
        position: relative;
        border-radius: 50%;
        transition: @default-animate-time;
        img {
          border-radius: 50%;
          width: @img-size;
        }
      }
      .user-info-box {
        width: calc(100% - @img-size);
        padding: 0 30px;
        transition: @default-animate-time;

        .nickname {
          .ellipsis();
        }
        .introduction {
          font-size: @smallest-font-size;
          margin-top: 10px;
          .ellipsis();
        }
      }
      .follow-box {
        position: absolute;
        height: @info-box-height;
        bottom: 0;
        width: calc(100% - @img-size - @padding-size);
        right: 0;
        padding: 15px;
        transition: @default-animate-time;
        opacity: 0;
        transform: translateY(10px);
      }
    }
  }
}

.edit-btn {
  position: fixed;
  right: 50px;
  bottom: 50px;
  i {
    color: @font-color-dark;
  }
}

.edit-dialog-content {
  width: 600px;
  margin-top: 15px;
  overflow: auto;
  height: 500px;
  .sub-name {
    line-height: 25px;
    margin-bottom: 5px;
  }
}
</style>
