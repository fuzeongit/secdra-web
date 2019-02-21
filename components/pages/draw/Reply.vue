<template>
  <div class="reply-list" v-loading="loading">
    <div class="reply-item row" v-for="(item,index) in list" :key="index">
      <div class="col-3 head">
        <nuxt-link :to="`/user/${item.answererId.id}`">
          <img :src="$img.head(item.answererId.head,'small50')">
        </nuxt-link>
      </div>
      <div class="col-27 desc">
        <p class="name">
          <nuxt-link :to="`/user/${item.answererId.id}`">
            {{item.answererId.name}}
          </nuxt-link>
          <i class="icon"
             :class="{'s-xingbie-nv':item.answererId.gender==='FEMALE','s-xingbie-nan':item.answererId.gender==='MALE'}"></i>
        </p>
        <p class="time">{{item.createDate}}</p>
        <p class="content">
          {{item.content}}
        </p>
      </div>
    </div>
    <p class="is-not" v-if="!loading&&!list.length">暂无回复</p>
  </div>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    componentName: "Reply",
    props: {
      commentId: String,
      drawId: String,
      authorId: String,
      criticId: String
    },
    data(){
      return {
        loading:false,
        list:[]
      }
    },
    methods: {
      ...mapActions("reply", ["ASave", "AList"]),
      async listAll() {
        this.loading = true;
        let result = await this.AList({commentId: this.commentId});
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
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

  .reply-list {
    min-height: 130px;
    .reply-item {
      padding: 10px 0 25px;
      border-top: 1px solid darken(@border-color, -7%);
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
          color: darken(@font-color, -30%);
        }
      }
    }
    .is-not {
      line-height: 130px;
      font-size: @default-font-size;
      color: darken(@font-color, -20%);
      .center();
    }
  }
</style>
