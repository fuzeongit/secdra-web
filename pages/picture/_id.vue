<template>
  <div class="page">
    <template v-if="status === 200">
      <div class="content-grid">
        <div class="left-box">
          <div class="card img-card flex-box">
            <img
              v-lazy="$img.secdraLazy(picture.url)"
              :style="{
                height: proportion >= 1 ? `100%` : ``,
                width: proportion <= 1 ? `100%` : ``
              }"
            />
          </div>
          <Comment
            :user-id="picture.user.id"
            :picture-id="picture.id"
          ></Comment>
        </div>
        <div class="right-box">
          <div class="card user-card ">
            <div
              v-lazy:background-image="
                $img.backLazy(picture.user.background, `backCard`)
              "
              class="user-bk cover"
            ></div>
            <div style="padding: 15px">
              <div class="flex-box">
                <nuxt-link
                  v-ripple
                  :to="`/user/${picture.user.id}`"
                  class="head-box center"
                >
                  <img v-lazy="$img.headLazy(picture.user.head, 'small100')" />
                </nuxt-link>
                <div class="user-info-box">
                  <p class="nickname">
                    <nuxt-link
                      :to="`/user/${picture.user.id}`"
                      class="primary-hover"
                      >{{ picture.user.name }}</nuxt-link
                    >
                  </p>
                  <p
                    v-tooltip:150="picture.user.introduction"
                    class="introduction"
                  >
                    {{ picture.user.introduction }}
                  </p>
                </div>
              </div>
              <div style="margin-top: 20px;">
                <div
                  v-if="picture.user.focus === $enum.FollowState.SElF.key"
                  style="text-align: right"
                >
                  <Btn
                    v-tooltip="'编辑'"
                    color="primary"
                    icon
                    @click="editShow = true"
                  >
                    <i class="icon ali-icon-edit"></i>
                  </Btn>
                  <Btn
                    v-tooltip="'删除'"
                    outline
                    color="primary"
                    icon
                    @click="remove"
                  >
                    <i class="icon ali-icon-delete"></i>
                  </Btn>
                </div>
                <Btn
                  v-else
                  block
                  color="primary"
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
          <div class="card info-card">
            <h3 class="name">
              <strong>{{ picture.name }}</strong>
            </h3>
            <p class="introduction">{{ picture.introduction }}</p>
            <div class="row tool-btn-group" style="margin-top: 5px;">
              <div class="col-15 flex-text">
                <Btn v-tooltip="`浏览`" flat icon small>
                  <i class="icon ali-icon-attention"></i>
                </Btn>
                <span>{{ picture.viewAmount }}</span>
              </div>
              <div class="col-15 flex-text">
                <Btn
                  v-tooltip="
                    picture.focus === $enum.CollectState.CONCERNED.key
                      ? `取消收藏`
                      : `收藏`
                  "
                  flat
                  icon
                  small
                  :color="
                    picture.focus === $enum.CollectState.CONCERNED.key
                      ? `red`
                      : `default`
                  "
                  @click="collection(picture)"
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
                <span>{{ picture.likeAmount }}</span>
              </div>
              <div class="col-30">
                创建于：{{ picture.createDate | date("YYYY-MM-DD hh:mm") }}
              </div>
            </div>
          </div>
          <div v-if="picture.tagList.length" class="card tag-card">
            <div class="tag-list">
              <Popper
                v-for="(tag, index) in picture.tagList"
                :key="index"
                trigger="hover"
                placement="top"
                @show="showTagPopper(`tag-ref-${index}`)"
              >
                <TagCard :ref="`tag-ref-${index}`" :tag="tag"></TagCard>
                <template #reference>
                  <Btn
                    outline
                    small
                    color="primary"
                    :to="`/picture/search/${encodeURIComponent(tag)}`"
                  >
                    {{ tag }}
                  </Btn>
                </template>
              </Popper>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        v-model="editShow"
        v-loading="editLoading"
        title="编辑"
        persistent
      >
        <ScrollBox class="edit-dialog-content">
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
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">标签：</h5>
            <TagInput v-model="inputTag" block color="primary"></TagInput>
          </div>
        </ScrollBox>
        <div class="input-group" style="text-align: center;">
          <Btn color="primary" @click="save">保存</Btn>
          <Btn outline color="primary" @click="reset">重置</Btn>
        </div>
      </Dialog>
    </template>
    <template v-else-if="status === 403">
      <div class="card empty">
        <img src="../../assets/image/svg/default-picture.svg" />
      </div>
    </template>
    <template v-else-if="status === 404">
      <div class="card empty">
        <img src="../../assets/image/svg/default-picture.svg" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import TagCard from "../../components/pages/shared/TagCard"
import Comment from "../../components/pages/picture/Comment"
import { CommentForm } from "../../assets/script/model"
export default {
  components: {
    TagCard,
    Comment
  },
  data() {
    return {
      editShow: false,
      editLoading: false,
      vibrant: {}
    }
  },
  computed: {
    ...mapState("user", ["user"]),
    signedIn() {
      return this.user && this.user.id
    },
    proportion() {
      return this.picture.height / this.picture.width
    }
  },
  async asyncData({ store, route, $axios }) {
    store.commit("menu/MChangeName", "")
    const id = route.params.id
    const res = await $axios.get(`/picture/get`, {
      params: { id }
    })
    const result = res.data
    let pictureForm
    let inputTag
    let commentForm
    if (result.status === 200) {
      pictureForm = Object.assign({}, result.data)
      inputTag = pictureForm.tagList
      commentForm = new CommentForm(result.data.user.id, result.data.id)
    }
    return {
      status: result.status,
      picture: result.data,
      pictureForm,
      inputTag,
      commentForm
    }
  },
  head() {
    let title = "想你所想 - Secdra"
    if (this.status === 200) {
      title = this.picture.name + " - Secdra"
    } else if (this.status === 403) {
      title = "无权查看该图片"
    } else if (this.status === 404) {
      title = "图片不存在"
    }
    return { title }
  },
  mounted() {
    // 写入足迹
    this.status === 200 &&
      this.signedIn &&
      this.ASaveFootprint({ pictureId: this.picture.id })
  },
  methods: {
    ...mapActions("picture", ["ACollection", "AUpdate", "ARemove"]),
    ...mapActions("footprint", { ASaveFootprint: "ASave" }),
    ...mapActions("user", ["AFollow"]),
    showTagPopper(refId) {
      let ref = this.$refs[refId]
      if (ref === null) {
        return
      }
      if (Array.isArray(ref)) {
        ref = ref[0]
      }
      if (ref && ref.picture === null) {
        ref.load()
      }
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
      this.picture.user.focus = result.data
    },
    remove() {
      this.$confirm({
        message: `你确定删除该图片吗？`,
        okCallback: async () => {
          const result = await this.ARemove({ id: this.picture.id })
          if (result.status === 200) {
            this.$notify({ message: "删除成功" })
            this.$router.back()
            return
          }
          this.$notify({ message: result.message })
        }
      })
    },
    async save() {
      this.editLoading = true
      const tagList = this.inputTag.filterNullOrEmpty()
      this.pictureForm.tagList = [...new Set(tagList)]
      const result = await this.AUpdate(this.pictureForm)
      this.editLoading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.$notify({ message: `修改成功` })
      this.editShow = false
      this.picture = result.data
      this.reset()
    },
    reset() {
      this.pictureForm = Object.assign({}, this.picture)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../assets/style/color";
@import "../../assets/style/config";
@import "../../assets/style/mixin";

.page {
  padding: @page-gap 0;
}

.content-grid {
  @lift-box-width: 850px;
  @right-box-width: 250px;
  @gap-size: @visual-width - @lift-box-width - @right-box-width;
  display: grid;
  justify-content: space-between;
  grid-template-columns: @lift-box-width @right-box-width;
  width: @visual-width;
  margin: 0 auto;
  .left-box {
    display: grid;
    grid-template-columns: repeat(1, 100%);
    grid-template-rows: @lift-box-width auto;
    grid-row-gap: @gap-size;
    .img-card {
      position: relative;
      overflow: hidden;
      .like {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: @big-font-size;
      }
    }
  }
  .right-box {
    > .card {
      margin-bottom: @gap-size;
    }
    .user-card {
      .user-bk {
        height: @right-box-width / 2;
      }
      @head-img-height: 80px;
      @head-img-border: 2px;
      .head-box {
        border-radius: 50%;
        height: @head-img-height;
        width: @head-img-height;
        border: @head-img-border solid white;
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }
      }
      .user-info-box {
        width: calc(100% - @head-img-height);
        padding: 0 0 0 10px;
        .nickname {
          .ellipsis();
        }
        .introduction {
          font-size: @smallest-font-size;
          margin-top: 10px;
          .ellipsis();
        }
      }
    }
    .info-card {
      padding: 10px 20px;
      font-size: @small-font-size;
      .name {
        .ellipsis();
      }
      .introduction {
        margin-top: 10px;
        font-size: @smallest-font-size;
        color: @font-color-dark-fade;
      }
      .tool-btn-group {
        span {
          margin-left: 3px;
          margin-right: 6px;
        }
      }
    }
    .tag-card {
      @spacing: 10px;
      padding: @spacing 20px;

      .tag-list {
        margin-bottom: -@spacing;
        .btn {
          margin-right: @spacing;
          margin-bottom: @spacing;
        }
      }
    }
  }
}

.empty {
  width: @window-min-width;
  margin: 0 auto;
  img {
    width: 100%;
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
