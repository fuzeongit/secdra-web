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
      <p class="is-not" v-if="!loading&&!list.length">暂无评论</p>
      <div class="row comment-list">
        <div class="comment-item" v-for="(item,index) in list" :key="index" v-show="!(!isAll&&index>=3)" >
          <div class="col-5">
            <img :src="$img.head(item.critic.head)" >
          </div>
          <div class="col-20"></div>
          <div class="col-5"></div>
        </div>
        <button class="btn block more" v-if="!loading&&!isAll&&list.length>=4" @click="listAll">查看全部</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {CommentForm} from "../../../assets/js/model/base";
  import {mapActions} from "vuex"

  export default {
    componentName: "Comment",
    props: {
      userId: String,
      drawId: String
    },
    data() {
      return {
        commentForm: new CommentForm(this.userId, this.drawId),
        loading:true,
        loadingMore:false,
        list:[],
        isAll:false
      }
    },
    mounted() {
      this.listTop4();
    },
    methods: {
      ...mapActions("comment", ["ASave", "AList", "AListTop4"]),
      async send() {
        let result = await this.ASave(this.commentForm);
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.listAll();
      },
      async listTop4() {
        this.loading = true;
        let result = await this.AListTop4({drawId: this.drawId});
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.loading = false;
        this.list = result.data
      },
      async listAll(){
        this.loading = true;
        let result = await this.AList({drawId: this.drawId});
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.isAll = true;
        this.loading = false;
        this.list = result.data
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .send-comment-box {
    > div {
      line-height: 35px;
    }
    .icon {
      font-size: 25px;
      color: darken(@font-color, -35%);
    }
  }

  .comment-box {
    min-height: 130px;

    .is-not {
      line-height: 130px;
      font-size: @default-font-size;
      color: darken(@font-color, -20%);
      .center();
    }
    .comment-list{
      padding: 20px 50px 0;
      .comment-item{
        margin-bottom: 15px;
      }
      .more{
        background-color: @theme-background-color;
        border-color: @theme-background-color;
        color:darken(@font-color, -20%);
        &:hover{
          background-color: @border-color;
          border-color: @border-color;
          color:@font-color;
        }
      }
    }
  }
</style>
