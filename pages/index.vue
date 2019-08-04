<template>
  <div class="page">
    <div class="user-bk cover flex-box"
         :style="{backgroundImage: `url(${$img.back(user.background)})`}">
      <div class="user-bk-content">
        <input type="search" title="搜索" class="input primary-color" placeholder="请输入标签搜索" @search="search"
               v-model="tag">
        <Btn color="primary" class="btn" @click="search">搜&nbsp;&nbsp;&nbsp;&nbsp;索</Btn>
      </div>
    </div>
    <br>
    <div class="content-grid">
      <div class="left-box">
        <div class="card image-card ">
          <h3 class="title">
            发现
            <Btn round flat small color="primary" to="/find"> 更多>></Btn>
          </h3>
          <div class="image-grid-row">
            <div v-for="(draw,index) in likeList" class="item" :key="index">
              <div class="img-box">
                <nuxt-link :to="`/draw/${draw.id}`" v-ripple :title="draw.name">
                  <img :src="$img.secdra(draw.url,'specifiedWidth')" class="cover">
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @follow="follow"></UserCard>
                  <nuxt-link :to="`/draw/${draw.id}`" v-ripple class="head-image" slot="reference"
                             :title="draw.user.name">
                    <img :src="$img.head(draw.user.head,'small50')">
                  </nuxt-link>
                </Popper>
                <Btn flat icon small title="浏览">
                  <i class="icon s-eye"></i>
                </Btn>
                <span>{{draw.viewAmount}}</span>
                <Btn flat icon :color="draw.focus===$enum.CollectState.CONCERNED.key?`primary`:`default`"
                     @click.stop="collection(draw)" small title="收藏">
                  <i class="icon"
                     :class="{'s-heart':draw.focus===$enum.CollectState.CONCERNED.key,'s-hearto':draw.focus!==$enum.CollectState.CONCERNED.key}"></i>
                </Btn>
                <span>{{draw.likeAmount}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card image-card " style="margin-top: 20px;">
          <h3 class="title">
            最新
            <Btn round flat small color="primary" to="/new"> 更多>></Btn>
          </h3>
          <div class="image-grid-row">
            <div v-for="(draw,index) in newList" class="item" :key="index">
              <div class="img-box">
                <nuxt-link :to="`/draw/${draw.id}`" v-ripple :title="draw.name">
                  <img :src="$img.secdra(draw.url,'specifiedWidth')" class="cover">
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @follow="follow"></UserCard>
                  <nuxt-link :to="`/draw/${draw.id}`" v-ripple class="head-image" slot="reference"
                             :title="draw.user.name">
                    <img :src="$img.head(draw.user.head,'small50')">
                  </nuxt-link>
                </Popper>
                <Btn flat icon small title="浏览">
                  <i class="icon s-eye"></i>
                </Btn>
                <span>{{draw.viewAmount}}</span>
                <Btn flat icon :color="draw.focus===$enum.CollectState.CONCERNED.key?`primary`:`default`"
                     @click.stop="collection(draw)" small title="收藏">
                  <i class="icon"
                     :class="{'s-heart':draw.focus===$enum.CollectState.CONCERNED.key,'s-hearto':draw.focus!==$enum.CollectState.CONCERNED.key}"></i>
                </Btn>
                <span>{{draw.likeAmount}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="card tag-card">
          <h3 class="title">
            热门推荐
          </h3>
          <div class="tag-list">
            <Btn v-for="(tag,index) in tagList" :to="`/draw/search/${encodeURIComponent(tag.name)}`" color="primary"
                 outline small
                 :key="index">{{tag.name}}
            </Btn>
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
  import {Pageable} from "../assets/script/model";
  import UserCard from "../components/pages/shared/UserCard";
  import {mapActions, mapState} from "vuex"
  import stompMixin from "../assets/script/mixin/stompMixin";

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "home");
      let taskList = [];
      taskList.push($axios.get(`/tag/listTagOrderByLikeAmount`));
      taskList.push($axios.get(`/draw/pagingByRecommend`, {params: new Pageable(0, 12)}));
      taskList.push($axios.get(`/draw/paging`, {params: new Pageable(0, 12, "createDate,desc")}));
      let resultList = (await Promise.all(taskList)).map(item => item.data);
      return {
        tagList: resultList[0].data,
        likeList: resultList[1].data.content,
        newList: resultList[2].data.content,
        tag: ''
      }
    },
    mixins: [stompMixin],
    components: {
      UserCard
    },
    computed: {
      ...mapState('user', ['user'])
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
      async search() {
        this.$router.push(`/draw/search/${encodeURIComponent(this.tag)}`)
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
        font-size: @small-font-size;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        border-right: 0;
      }
      .btn {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        font-size: @small-font-size;
      }
    }
  }

  .content-grid {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 850px 250px;
    width: @visual-width;
    margin: 0 auto;
    .card {
      .title {
        font-size: 16px;
        line-height: 28px;
        margin-bottom: 10px;
        a {
          float: right;
        }
      }
    }
    .image-card {
      padding: 10px;
      .image-grid-row {
        @img-size: 200px;
        display: grid;
        width: 100%;
        margin: 0 auto;
        justify-content: space-between;
        grid-template-columns: repeat(4, @img-size);
        grid-gap: 10px;

        .img-box {
          position: relative;
          a {
            width: @img-size;
            height: @img-size;
            display: block
          }
          .cover {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .draw-name {
          text-align: center;
          font-size: @small-font-size;
          font-weight: 600;
          margin-bottom: 0;
          .ellipsis();
          a {
            color: @font-color-dark;
          }
        }
        .tool {
          margin: 10px 0;
          text-align: right;
          .head-image {
            @head-size: 28px;
            width: @head-size;
            height: @head-size;
            border-radius: 50%;
            overflow: hidden;
            display: inline-block;
            float: left;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
    }
    .tag-card {
      @spacing: 10px;
      padding: @spacing;
      .tag-list {
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
</style>
