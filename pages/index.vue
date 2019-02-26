<template>
  <div class="page">
    <div class="user-bk cover flex-box"
         :style="{backgroundImage: `url(${$img.back(user.background)})`}">
      <div class="user-bk-content">
        <input type="search" title="input" class="input" placeholder="请输入标签搜索" @search="search" v-model="tag">
        <button class="btn" @click="search">搜&nbsp;&nbsp;&nbsp;&nbsp;索</button>
      </div>
    </div>
    <br>
    <div class="content row">
      <div class="left-box">
        <div class="card image-card ">
          <h3 class="title">
            发现
            <nuxt-link to="/find">
              更多>>
            </nuxt-link>
          </h3>
          <div class="row">
            <div v-for="(draw,index) in likeList" class="item" :key="index">
              <div class="img-box">
                <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                           :style="{backgroundImage: `url(${$img.secdra(draw.url,'specifiedWidth')})`}"
                           style="width: 100%">
                </nuxt-link>
                <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
                   :style="{color:draw.focus?`red`:`gray`}" title="收藏"
                   @click.stop="collection(draw)"></a>
              </div>
              <p class="draw-name center">
                <nuxt-link :to="`/draw/${draw.id}`">
                  {{draw.name}}
                </nuxt-link>
              </p>
              <div class="user-name center">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @focus="follow"></UserCard>
                  <nuxt-link :to="`/user/${draw.userId}`" slot="reference">
                    {{draw.user.name}}
                  </nuxt-link>
                </Popper>
              </div>
            </div>
          </div>
        </div>
        <div class="card image-card " style="margin-top: 20px;">
          <h3 class="title">
            最新
            <nuxt-link to="/new">
              更多>>
            </nuxt-link>
          </h3>
          <div class="row">
            <div v-for="(draw,index) in newList" class="item" :key="index">
              <div class="img-box">
                <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                           :style="{backgroundImage: `url(${$img.secdra(draw.url,'specifiedWidth')})`}"
                           style="width: 100%">
                </nuxt-link>
                <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
                   :style="{color:draw.focus?`red`:`gray`}" title="收藏"
                   @click.stop="collection(draw)"></a>
              </div>
              <p class="draw-name center">
                <nuxt-link :to="`/draw/${draw.id}`">
                  {{draw.name}}
                </nuxt-link>
              </p>
              <div class="user-name center">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @focus="follow"></UserCard>
                  <nuxt-link :to="`/user/${draw.userId}`" slot="reference">
                    {{draw.user.name}}
                  </nuxt-link>
                </Popper>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="card tag-card">
          <h3 class="title">
            推荐标签
          </h3>
          <div class="tag-list">
            <nuxt-link class="btn is-plain" v-for="(tag,index) in tagList" :to="`/draw/search/${tag.name}`"
                       :key="index"> {{tag.name}}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <p class="center" style="margin: 30px;">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备18144953号-1</a>
    </p>
  </div>
</template>

<script>
  import config from "../assets/js/config";
  import {Pageable} from "../assets/js/model/base";
  import UserCard from "../components/pages/shared/UserCard";
  import {mapActions} from "vuex"

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "home";
      let taskList = [];
      taskList.push($axios.get(`${config.host}/tag/listTagOrderByLikeAmount`));
      taskList.push($axios.get(`${config.host}/draw/pagingByRecommend`, {params: new Pageable(0, 10)}));
      taskList.push($axios.get(`${config.host}/draw/paging`, {params: new Pageable(0, 10, "createDate,desc")}));
      let resultList = (await Promise.all(taskList)).map(item => item.data);
      return {
        tagList: resultList[0].data,
        likeList: resultList[1].data.content,
        newList: resultList[2].data.content,
        tag:''
      }
    },
    components: {
      UserCard
    },
    data() {
    },
    computed: {
      user() {
        return this.$store.state.user.user || {}
      },
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions("draw", ["ACollection"]),
      async collection(draw) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        draw.focus = result.data
      },
      follow({userId, focus}) {
        for (let draw of this.likeList) {
          if (draw.user.id === userId) {
            draw.user.focus = focus;
          }
        }
        for (let draw of this.newList) {
          if (draw.user.id === userId) {
            draw.user.focus = focus;
          }
        }
      },
      search() {
        this.$router.push(`/draw/search/${this.tag}`)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .user-bk {
    width: 100%;
    margin-top: -@herder-height;
    height: @window-min-width / 2;
    .user-bk-content {
      font-size: 0;
      .input {
        width: 350px;
        font-size: @default-font-size;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        border-right: 0;
      }
      .btn {
        width: 100px;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        font-size: @default-font-size;
      }
    }
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    transform: translateY(0);
    .card {
      .title {
        font-size: @medium-font-size;
        padding-left: 10px;
        line-height: @medium-font-size;
        border-left: 5px solid @theme-color;
        a {
          line-height: 16px;
          vertical-align: baseline;
          display: inline-block;
          float: right;
          color: @theme-color
        }
      }
    }
    .left-box {
      width: 850px;
      float: left;
      .image-card {
        padding: 10px 9px;
        .row {
          margin-top: 8px;
          .item {
            margin: 12px 8px;
            float: left;
            .img-box {
              position: relative;
              width: 150px;
              height: 150px;
              .cover {
                display: block;
                width: 100%;
                height: 100%;
              }
              .like {
                position: absolute;
                right: 5px;
                bottom: 5px;
                font-size: @medium-font-size
              }
            }
            .draw-name {
              margin-top: 10px;
              font-size: @default-font-size;
              font-weight: 600;
              .ellipsis()
            }
            .user-name {
              font-size: @small-font-size;
              line-height: 20px;
              color: @gray;
              .ellipsis();
            }
          }
        }
      }
    }
    .right-box {
      width: 250px;
      float: right;
      .tag-card {
        @spacing: 10px;
        padding: @spacing;

        .tag-list {
          margin-top: @spacing * 2;
          margin-bottom: -@spacing;
          .btn {
            margin-right: @spacing;
            margin-bottom: @spacing;
            line-height: 25px;
            padding: 0 2em;
          }
        }
      }
    }
  }
</style>
