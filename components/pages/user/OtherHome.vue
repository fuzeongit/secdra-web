<template>
  <div>
    <div class="user-bk cover"
         :style="{transform: `translateY(${scrollTop*.5}px)`,backgroundImage: `url(${$img.back(user.background)})`}">
      <div class="user-bk-content">
        <div class="tool">
          <button class="btn" @click="$emit('follow')">
            <span>{{user.focus?"已关注":"关注"}}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="content card">
      <div class="head-box">
        <img :src="$img.head(user.head)"
             :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`">
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
            <span>{{user.gender==='FEMALE'?"她":"他"}}的作品</span>
          </h3>
          <div class="draw-list row">
            <div class="card draw-item" v-for="(draw ,index) in worksList" :key="index">
              <nuxt-link style="width: 100%;height: 230px;" class="flex-box" :to="`/draw/${draw.id}`">
                <img :src="$img.secdra(draw.url,`specifiedWidth`)"
                     :style="{height:getProportion(draw)>=1?`100%`:`auto`,width:getProportion(draw)<=1?`100%`:`auto`}">
              </nuxt-link>
            </div>
          </div>
          <p class="move" v-if="worksList.length===8">
            <nuxt-link :to="`/works/${user.id||''}`">查看更多>></nuxt-link>
          </p>
          <img src="../../../assets/image/default/not.png" class="is-not" v-if="!worksLoading&&!worksList.length">
        </div>
        <div class="collection-box" v-loading="collectionLoading">
          <h3 class="line center">
            <span>{{user.gender==='FEMALE'?"她":"他"}}的收藏</span>
          </h3>
          <div class="draw-list row">
            <div class="card draw-item" v-for="(draw ,index) in collectionList" :key="index">
              <nuxt-link style="width: 100%;height: 230px;" class="flex-box" :to="`/draw/${draw.id}`">
                <img :src="$img.secdra(draw.url,`specifiedWidth`)"
                     :style="{height:getProportion(draw)>=1?`100%`:`auto`,width:getProportion(draw)<=1?`100%`:`auto`}">
              </nuxt-link>
            </div>
          </div>
          <p class="move" v-if="collectionList.length===8">
            <nuxt-link :to="`/collection/${user.id||''}`">查看更多>></nuxt-link>
          </p>
          <img src="../../../assets/image/default/not.png" class="is-not" v-if="!collectionLoading&&!collectionList.length">
        </div>
        <div class="following-box" v-loading="followingLoading">
          <h3 class="line center">
            <span>{{user.gender==='FEMALE'?"她":"他"}}的关注</span>
          </h3>
          <div class="following-list row">
            <div class="card following-item" v-for="(item ,index) in followingList" :key="index">
              <div class="cover"
                   :style="{backgroundImage: `url(${$img.back(item.background,`backCard`)})`}">
              </div>
              <div class="center">
                <nuxt-link :to="`/user/${item.id}`" class="following-head-box">
                  <img :src="$img.head(item.head,'small200')">
                </nuxt-link>
              </div>
              <div class="user-info-box center ">
                <p class="nickname">
                  {{item.name}}
                </p>
                <p class="introduction" :title="item.introduction">
                  {{item.introduction}}
                </p>
              </div>
            </div>
          </div>
          <p class="move" v-if="followingList.length===8">
            <nuxt-link :to="`/following/${user.id||''}`">查看更多>></nuxt-link>
          </p>
          <img src="../../../assets/image/default/not.png" class="is-not" v-if="!followingLoading&&!followingList.length">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  import {Pageable} from "../../../assets/js/model/base";

  export default {
    props: ["user"],
    data() {
      return {
        worksLoading: true,
        worksList: [],
        collectionLoading: true,
        collectionList: [],
        followingLoading: true,
        followingList: []
      }
    },
    computed: {
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    }, mounted() {
      this.pagingWorks();
      this.pagingCollection();
      this.pagingFollower();
    },
    methods: {
      ...mapActions("user", ["APagingFollowing"]),
      ...mapActions("draw", ["APagingCollection", "APagingByUserId"]),
      getProportion(draw) {
        return draw.height / draw.width
      },
      async pagingWorks() {
        this.worksLoading = true;
        let result = await this.APagingByUserId(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.worksLoading = false;
        this.worksList = result.data.content;
      },
      async pagingCollection() {
        this.collectionLoading = true;
        let result = await this.APagingCollection(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.collectionLoading = false;
        this.collectionList = result.data.content;
      },
      async pagingFollower() {
        this.followingLoading = true;
        let result = await this.APagingFollowing(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.followingLoading = false;
        this.followingList = result.data.content;
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

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
          line-height: 45px;
          border: none;
          background-color: rgba(0, 0, 0, .3);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
          border-radius: 30px;
          width: 100px;
          .center();
          span {
            font-size: @medium-font-size;
            color: white;
            opacity: .7
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
      img {
        margin-top: -(@head-img-height+@head-img-border)/2;
        display: inline-block;
        position: absolute;
        height: @head-img-height;
        width: @head-img-height;
        border: @head-img-border solid @white;
        border-radius: 50%;
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
          font-size: @small-font-size;
        }
      }
    }

    .draw-box {
      margin-top: 30px;
      padding: 0 50px;
      .line {
        width: 100%;
        border-bottom: 1px dashed @border-color;
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
        .is-not{
          display: block;
          margin: 0 auto;
        }
      }
      .collection-box {
        margin-top: 30px;
        padding-bottom: 24px;
        min-height: 250px;
        .is-not{
          display: block;
          margin: 0 auto;
        }
      }
      .following-box{
        margin-top: 30px;
        padding-bottom: 24px;
        min-height: 250px;
        .is-not{
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
      .following-list {
        .following-item {
          @size: 230px;
          @margin: 20px;
          float: left;
          margin-top: @margin;
          margin-right: @margin;
          transition: @default-animate-time;
          overflow: hidden;
          width: @size;
          box-shadow: 0 0 20px rgba(150, 150, 150, 0.55);
          &:nth-child(4n+1) {
            margin-left: @margin;
          }
          .cover {
            height: @size /2;
            width: @size;
            transition: @default-animate-time;
          }
          .following-head-box{
            padding: 10px;
            display: block;
            img {
              border-radius: 50%;
              width: 80px;
              border: 2px solid @white;
              transition: @default-animate-time;
            }
          }
          .user-info-box {
            padding: 0 20px 20px 20px;
            transition: @default-animate-time;
            .nickname {
              .ellipsis()
            }
            .introduction {
              font-size: @small-font-size;
              margin-top: 10px;
              .ellipsis()
            }
          }
          &:hover {
            .cover {
              filter: blur(60px);
            }
            .following-head-box {
              img {
                transform: translateY(-25px) scale(2);
              }
            }
            .user-info-box {
              opacity: 0;
              transform: translateY(25px);
            }
            transform: translateY(-1px);
            box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
          }
        }
      }
    }
  }
</style>
