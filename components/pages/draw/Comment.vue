<template>
  <div class="card" style="padding: 10px">
    <div class="row send-comment-box">
      <div class="col-23">
        <Field
          v-model="commentForm.content"
          block
          color="primary"
          placeholder="请输入评论"
        ></Field>
      </div>
      <div class="col-3 center">
        <Btn v-tooltip="`表情`" icon color="white">
          <i class="icon ali-icon-emoji"></i>
        </Btn>
      </div>
      <div class="col-4 center">
        <Btn
          block
          color="primary"
          :disabled="commentForm.content === ''"
          @click="send"
          >发送</Btn
        >
      </div>
    </div>
    <div v-loading="loading" class="comment-box">
      <div class="comment-list">
        <div
          v-for="(item, index) in list"
          v-show="!(!isAll && index >= 3)"
          :key="index"
          class="comment-item row"
        >
          <div class="col-3">
            <nuxt-link
              v-ripple
              :to="`/user/${item.critic.id}`"
              class="head-box"
            >
              <img :src="$img.head(item.critic.head, 'small50')" />
            </nuxt-link>
          </div>
          <div class="col-27 desc">
            <p class="name">
              <nuxt-link :to="`/user/${item.critic.id}`" class="primary-hover">
                {{ item.critic.name }}
              </nuxt-link>
              <i
                class="icon"
                :class="{
                  'ali-icon-female': item.critic.gender === 'FEMALE',
                  'ali-icon-male': item.critic.gender === 'MALE'
                }"
              ></i>
            </p>
            <p class="time">{{ item.createDate }}</p>
            <p class="content">
              {{ item.content }}
            </p>
            <p class="tool">
              <Btn
                small
                flat
                round
                color="primary"
                @click="item.replyShow = !item.replyShow"
                ><i class="icon ali-icon-message"></i
                >{{ item.replyShow ? "收起" : "查看回复" }}
              </Btn>
              <Btn
                small
                flat
                round
                color="primary"
                @click="item.replyInputShow = !item.replyInputShow"
                ><i class="icon ali-icon-edit"></i
                >{{ item.replyInputShow ? "收起" : "回复" }}
              </Btn>
            </p>
            <div v-if="item.replyInputShow" class="row send-reply-box">
              <div class="col-23">
                <Field
                  v-model="replyForm[item.id].content"
                  block
                  color="primary"
                  placeholder="请输入回复"
                ></Field>
              </div>
              <div class="col-3 center">
                <Btn icon color="white">
                  <i class="icon ali-icon-emoji"></i>
                </Btn>
              </div>
              <div class="col-4 center">
                <Btn
                  block
                  color="primary"
                  :disabled="replyForm[item.id].content === ''"
                  @click="sendReply(item)"
                  >发送</Btn
                >
              </div>
            </div>
            <Reply
              v-if="item.replyShow"
              :ref="item.id"
              :key="index"
              :comment-id="item.id"
              :draw-id="drawId"
              :author-id="userId"
              :critic-id="item.criticId"
            ></Reply>
          </div>
        </div>
        <Btn
          v-if="!loading && !isAll && list.length >= 4"
          block
          color="primary"
          @click="listAll"
          >查看全部</Btn
        >
        <p v-if="!loading && !list.length" class="is-not">
          <img src="../../../assets/image/default/not.png" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { CommentForm, ReplyForm } from "../../../assets/script/model"
import Reply from "./Reply"

export default {
  componentName: "Comment",
  components: {
    Reply
  },
  props: {
    userId: {
      type: String,
      default: null
    },
    drawId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      commentForm: new CommentForm(this.userId, this.drawId),
      replyForm: {},
      loading: true,
      loadingMore: false,
      list: [],
      isAll: false,
      focusId: ""
    }
  },
  mounted() {
    this.listTop4()
  },
  methods: {
    ...mapActions("comment", ["ASave", "AList", "AListTop4"]),
    ...mapActions("reply", ["ASaveReply"]),
    async send() {
      const result = await this.ASave(this.commentForm)
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.commentForm.content = ""
      this.listAll()
    },
    async listTop4() {
      this.loading = true
      const result = await this.AListTop4({ drawId: this.drawId })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.replyForm = {}
      this.list = result.data.map((item) => {
        this.$set(
          this.replyForm,
          item.id,
          new ReplyForm("", this.drawId, this.userId)
        )
        return Object.assign(item, {
          replyInputShow: false,
          replyShow: false
        })
      })
      this.loading = false
    },
    async listAll() {
      this.loading = true
      const result = await this.AList({ drawId: this.drawId })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.isAll = true
      this.replyForm = {}
      this.list = result.data.map((item) => {
        this.$set(
          this.replyForm,
          item.id,
          new ReplyForm("", this.drawId, this.userId)
        )
        return Object.assign(item, {
          replyInputShow: false,
          replyShow: false
        })
      })
      this.loading = false
    },
    async sendReply(item) {
      this.replyForm[item.id].commentId = item.id
      this.replyForm[item.id].criticId = item.criticId
      const result = await this.ASaveReply(this.replyForm[item.id])
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      if (item.replyShow) {
        let ref = this.$refs[item.id]
        if (!ref) {
          return
        }
        if (Array.isArray(ref)) {
          ref = ref[0]
        }
        ref.listAll()
      } else {
        item.replyShow = true
      }
      item.replyInputShow = false
      this.$set(
        this.replyForm,
        item.id,
        new ReplyForm("", this.drawId, this.userId)
      )
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.send-reply-box {
  margin-top: 8px;
}

.comment-box {
  .comment-list {
    min-height: 130px;
    padding: 20px 50px 0;
    .comment-item {
      padding: 10px 0;
      border-top: 1px solid @font-color-dark-line;
      &:first-child {
        border-top: 0;
      }
      .head-box {
        border-radius: 50%;
        display: inline-block;
        img {
          border-radius: 50%;
        }
      }
      .desc {
        line-height: 25px;
        .name {
          font-weight: bold;
          .icon {
            margin-left: 10px;
            &.ali-icon-female {
              color: @female-color;
            }
            &.ali-icon-male {
              color: @male-color;
            }
          }
        }
        .time {
          color: @font-color-dark-fade;
        }
        .tool {
          user-select: none;
          a {
            user-select: none;
            width: 100px;
            display: inline-block;
            color: @theme-color;
            font-size: @small-font-size;
            margin-right: 15px;
            i {
              display: inline-block;
              color: @theme-color;
              margin-right: 3px;
            }
          }
        }
      }
    }
    .is-not {
      line-height: 130px;
      font-size: @small-font-size;
      color: @font-color-dark-fade;
      text-align: center;
    }
  }
}
</style>
