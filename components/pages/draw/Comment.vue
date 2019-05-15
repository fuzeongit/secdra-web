<template>
  <div class="card" style="padding: 10px">
    <div class="row send-comment-box">
      <div class="col-23">
        <input type="text" title="input" class="input block" placeholder="请输入评论" v-model="commentForm.content">
      </div>
      <div class="col-3 center">
        <a class="icon s-laugh"></a>
      </div>
      <div class="col-4 center">
        <button class="btn block" @click="send" :disabled="commentForm.content===''">发送</button>
      </div>
    </div>
    <div class="comment-box" v-loading="loading">
      <div class="comment-list">
        <div class="comment-item row" v-for="(item,index) in list" :key="index" v-show="!(!isAll&&index>=3)">
          <div class="col-3 head">
            <nuxt-link :to="`/user/${item.critic.id}`">
              <img :src="$img.head(item.critic.head,'small50')">
            </nuxt-link>
          </div>
          <div class="col-27 desc">
            <p class="name">
              <nuxt-link :to="`/user/${item.critic.id}`">
                {{item.critic.name}}
              </nuxt-link>
              <i class="icon"
                 :class="{'s-xingbie-nv':item.critic.gender==='FEMALE','s-xingbie-nan':item.critic.gender==='MALE'}"></i>
            </p>
            <p class="time">{{item.createDate}}</p>
            <p class="content">
              {{item.content}}
            </p>
            <p class="tool">
              <a @click="item.isShowReply = !item.isShowReply"><i class="icon s-pingjia"></i>{{item.isShowReply?'收起':'查看回复'}}</a>
              <a @click="item.isShowReplyInput=!item.isShowReplyInput"><i class="icon s-bianji"></i>{{item.isShowReplyInput?'收起':'回复'}}</a>
            </p>
            <div class="row send-reply-box" v-if="item.isShowReplyInput">
              <div class="col-23">
                <input type="text" title="input" class="input block" placeholder="请输入评论"
                       v-model="replyForm[item.id].content">
              </div>
              <div class="col-3 center">
                <a class="icon s-laugh"></a>
              </div>
              <div class="col-4 center">
                <button class="btn block" @click="sendReply(item)" :disabled="replyForm[item.id].content===''">发送
                </button>
              </div>
            </div>
            <Reply v-if="item.isShowReply" :comment-id="item.id" :draw-id="drawId" :author-id="userId"
                   :critic-id="item.criticId" :ref="item.id" :key="index"></Reply>
          </div>
        </div>
        <button class="btn block more" v-if="!loading&&!isAll&&list.length>=4" @click="listAll">查看全部</button>
        <p class="is-not" v-if="!loading&&!list.length">
          <img src="../../../assets/image/default/not.png">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {CommentForm, ReplyForm} from "../../../assets/script/model/base";
  import {mapActions} from "vuex"
  import Reply from "./Reply"

  export default {
    componentName: "Comment",
    components: {
      Reply
    },
    props: {
      userId: String,
      drawId: String
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
      this.listTop4();
    },
    methods: {
      ...mapActions("comment", ["ASave", "AList", "AListTop4"]),
      ...mapActions("reply", ["ASaveReply"]),
      async send() {
        let result = await this.ASave(this.commentForm);
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.commentForm.content = "";
        this.listAll();
      },
      async listTop4() {
        this.loading = true;
        let result = await this.AListTop4({drawId: this.drawId});
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.replyForm = {};
        this.list = result.data.map(item => {
          this.$set(this.replyForm,item.id, new ReplyForm("", this.drawId, this.userId));
          return Object.assign(item, {isShowReplyInput: false, isShowReply: false})
        });
        this.loading = false;
      },
      async listAll() {
        this.loading = true;
        let result = await this.AList({drawId: this.drawId});
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.isAll = true;
        this.replyForm = {};
        this.list = result.data.map(item => {
          this.$set(this.replyForm,item.id, new ReplyForm("", this.drawId, this.userId));
          return Object.assign(item, {isShowReplyInput: false, isShowReply: false})
        });
        this.loading = false;
      },
      async sendReply(item) {
        this.replyForm[item.id].commentId = item.id;
        this.replyForm[item.id].criticId = item.criticId;
        let result = await this.ASaveReply(this.replyForm[item.id]);
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        if(item.isShowReply){
          let ref = this.$refs[item.id];
          if (!ref) {
            return
          }
          if (ref instanceof Array) {
            ref = ref[0]
          }
          ref.listAll()
        }else{
          item.isShowReply = true;
        }
        item.isShowReplyInput = false;
        this.$set(this.replyForm,item.id, new ReplyForm("", this.drawId, this.userId));
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .send-comment-box, .send-reply-box {
    > div {
      line-height: 35px;
    }
    .icon {
      font-size: 25px;
      color: @icon-color-dark;
    }
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
        .head {
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
              &.s-xingbie-nv {
                color: @female-color;
              }
              &.s-xingbie-nan {
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
      .more {
        background-color: @theme-background-color;
        border-color: @theme-background-color;
        color: @font-color-dark-fade;
        transition: @short-animate-time all;
        &:hover {
          background-color: darken(@theme-background-color,4%);
          border-color: darken(@theme-background-color,4%);
        }
      }
      .is-not {
        line-height: 130px;
        font-size: @small-font-size;
        color: @font-color-dark-fade;
        .center();
      }
    }
  }
</style>
