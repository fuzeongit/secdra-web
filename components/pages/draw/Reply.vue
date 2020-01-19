<template>
  <div v-loading="loading" class="reply-list">
    <div v-for="(item, index) in list" :key="index" class="reply-item row">
      <div class="col-3">
        <nuxt-link v-ripple :to="`/user/${item.answerer.id}`" class="head-box">
          <img :src="$img.head(item.answerer.head, 'small50')" />
        </nuxt-link>
      </div>
      <div class="col-27 desc">
        <p class="name">
          <nuxt-link :to="`/user/${item.answerer.id}`" class="primary-hover">
            {{ item.answerer.name }}
          </nuxt-link>
          <span style="font-weight: normal;color: #BBB">回复</span>
          <nuxt-link :to="`/user/${item.critic.id}`" class="primary-hover">
            {{ item.critic.name }}
          </nuxt-link>
        </p>
        <p class="time">{{ item.createDate | ago }}</p>
        <p class="content">
          {{ item.content }}
        </p>
        <p class="tool">
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
              @click="send(item)"
              >发送</Btn
            >
          </div>
        </div>
      </div>
    </div>
    <p v-if="!loading && !list.length" class="is-not">
      <img src="../../../assets/image/default/not.png" />
    </p>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { ReplyForm } from "../../../assets/script/model"

export default {
  componentName: "Reply",
  props: {
    commentId: {
      type: String,
      default: null
    },
    drawId: {
      type: String,
      default: null
    },
    authorId: {
      type: String,
      default: null
    },
    criticId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      replyForm: {}
    }
  },
  mounted() {
    this.listAll()
  },
  methods: {
    ...mapActions("reply", ["ASaveReply", "AList"]),
    async listAll() {
      this.loading = true
      const result = await this.AList({ commentId: this.commentId })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.replyForm = {}
      this.list = result.data.map((item) => {
        this.$set(
          this.replyForm,
          item.id,
          new ReplyForm(this.commentId, this.drawId, this.authorId)
        )
        return Object.assign(item, { replyInputShow: false })
      })
      this.loading = false
    },
    async send(item) {
      this.replyForm[item.id].criticId = item.answerer.id
      const result = await this.ASaveReply(this.replyForm[item.id])
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      item.replyInputShow = false
      this.listAll()
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.send-reply-box {
  margin: 8px 0;
}

.reply-list {
  min-height: 130px;
  padding-top: 8px;
  .reply-item {
    padding: 10px 0 0;
    border-top: 1px solid @font-color-dark-line;
    .head-box {
      display: inline-block;
      border-radius: 50%;
      img {
        @size: 50px;
        width: @size;
        height: @size;
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
</style>
