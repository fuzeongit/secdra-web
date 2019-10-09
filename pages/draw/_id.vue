<template>
  <div class="page">
    <template v-if="status === 200">
      <div class="content-grid">
        <div class="left-box">
          <div class="card img-card flex-box">
            <img
              :src="$img.secdra(draw.url)"
              :style="{
                height: proportion >= 1 ? `100%` : `auto`,
                width: proportion <= 1 ? `100%` : `auto`
              }"
            />
          </div>
          <Comment :user-id="draw.user.id" :draw-id="draw.id"></Comment>
        </div>
        <div class="right-box">
          <div class="card user-card ">
            <div
              class="user-bk cover"
              :style="{
                backgroundImage: `url(${$img.back(
                  draw.user.background,
                  `backCard`
                )})`
              }"
            ></div>
            <div style="padding: 15px">
              <div class="flex-box">
                <nuxt-link
                  v-ripple
                  :to="`/user/${draw.user.id}`"
                  class="head-box center"
                >
                  <img :src="$img.head(draw.user.head, 'small100')" />
                </nuxt-link>
                <div class="user-info-box">
                  <p class="nickname">
                    <nuxt-link
                      :to="`/user/${draw.user.id}`"
                      class="primary-hover"
                      >{{ draw.user.name }}</nuxt-link
                    >
                  </p>
                  <p class="introduction">
                    {{ draw.user.introduction }}
                  </p>
                </div>
              </div>
              <div style="margin-top: 20px;">
                <Btn
                  v-if="draw.user.focus === $enum.FollowState.SElF.key"
                  block
                  color="primary"
                  @click="editShow = true"
                  >编辑</Btn
                >
                <Btn v-else block color="primary" @click="follow(draw.user.id)">
                  {{
                    draw.user.focus === $enum.FollowState.CONCERNED.key
                      ? `已关注`
                      : `关注`
                  }}
                </Btn>
              </div>
            </div>
          </div>
          <div class="card info-card">
            <h3 class="name">
              <strong>{{ draw.name }}</strong>
            </h3>
            <p class="introduction">{{ draw.introduction }}</p>
            <div class="row tool-btn-group" style="margin-top: 5px;">
              <div class="col-15 flex-text">
                <Btn flat icon small>
                  <i class="icon ali-icon-attention"></i>
                </Btn>
                <span>{{ draw.viewAmount }}</span>
              </div>
              <div class="col-15 flex-text">
                <Btn
                  flat
                  icon
                  small
                  :color="
                    draw.focus === $enum.CollectState.CONCERNED.key
                      ? `primary`
                      : `default`
                  "
                  @click="collection(draw)"
                >
                  <i
                    class="icon"
                    :class="{
                      'ali-icon-likefill':
                        draw.focus === $enum.CollectState.CONCERNED.key,
                      'ali-icon-like':
                        draw.focus !== $enum.CollectState.CONCERNED.key
                    }"
                  ></i>
                </Btn>
                <span>{{ draw.likeAmount }}</span>
              </div>
              <div class="col-30">创建于：{{ draw.createDate | date }}</div>
            </div>
          </div>
          <div class="card tag-card">
            <div class="tag-list">
              <Popper
                v-for="(tag, index) in draw.tagList"
                :key="index"
                trigger="hover"
                placement="top"
                @show="showTagPopper(`tag-ref-${index}`)"
              >
                <TagCard :ref="`tag-ref-${index}`" :tag="tag"></TagCard>
                <Btn
                  slot="reference"
                  outline
                  small
                  color="primary"
                  :to="`/draw/search/${encodeURIComponent(tag)}`"
                >
                  {{ tag }}
                </Btn>
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
            <Field v-model="drawForm.name" block color="primary"></Field>
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <Field
              v-model="drawForm.introduction"
              block
              color="primary"
              type="textarea"
            ></Field>
          </div>
          <div class="input-group">
            <h5 class="sub-name">私密：</h5>
            <RadioGroup v-model="drawForm.privacy">
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
            <Field v-model="inputTag" block color="primary"></Field>
            <h5 class="sub-name">*标签以空格分隔为一个</h5>
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
        <img src="../../assets/image/svg/default-draw.svg" />
      </div>
    </template>
    <template v-else-if="status === 404">
      <div class="card empty">
        <img src="../../assets/image/svg/default-draw.svg" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import TagCard from "../../components/pages/shared/TagCard"
import Comment from "../../components/pages/draw/Comment"
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
    proportion() {
      return this.draw.height / this.draw.width
    }
  },
  async asyncData({ store, route, $axios }) {
    store.commit("menu/MChangeName", "")
    const id = route.params.id
    const res = await $axios.get(`/draw/get`, {
      params: { id }
    })
    const result = res.data
    let drawForm
    let inputTag
    let commentForm
    if (result.status === 200) {
      drawForm = Object.assign({}, result.data)
      inputTag = drawForm.tagList.join(" ")
      commentForm = new CommentForm(result.data.user.id, result.data.id)
    }
    return {
      status: result.status,
      draw: result.data,
      drawForm,
      inputTag,
      commentForm
    }
  },
  mounted() {
    // 写入足迹
    if (this.status === 200) {
      this.ASaveFootprint({ drawId: this.draw.id })
    }
  },
  methods: {
    ...mapActions("draw", ["ACollection", "AUpdate"]),
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
      if (ref && ref.draw === null) {
        ref.load()
      }
    },
    async collection(draw) {
      const result = await this.ACollection({
        drawId: draw.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      draw.focus = result.data
    },
    async follow(id) {
      const result = await this.AFollow({
        followingId: id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.draw.user.focus = result.data
    },
    async save() {
      this.editLoading = true
      const tagList = this.inputTag.split(" ").filter((item) => item !== "")
      this.drawForm.tagList = [...new Set(tagList)]
      const result = await this.AUpdate(this.drawForm)
      this.editLoading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.$notify({ message: `修改成功` })
      this.editShow = false
      this.draw = result.data
      this.reset()
    },
    reset() {
      this.drawForm = Object.assign({}, this.draw)
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
        background-color: @font-color-dark-line;
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
