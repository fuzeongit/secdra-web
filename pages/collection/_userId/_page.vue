<template>
  <div class="page">
    <CheckboxGroup class="content row" v-model="selectList">
      <div class="card " v-for="(draw,index) in list" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="img-box flex-box">
          <img :src="$img.secdra(draw.url,`specifiedWidth`)"
               :style="{height:getProportion(draw)>=1?`100%`:`auto`,width:getProportion(draw)<=1?`100%`:`auto`}">
        </nuxt-link>
        <div class="tool">
          <Checkbox small v-if="isSelf" :value="draw" valueKey="id" ></Checkbox>
          <Btn flat icon :color="draw.focus?`primary`:`default`" @click.stop="collection(draw)" small title="收藏">
            <i class="icon" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"></i>
          </Btn>
        </div>
        <div class="flex-box info-box" v-if="draw.user.id">
          <nuxt-link :to="`/user/${draw.user.id}`" class="head-box">
            <img :src="$img.head(draw.user.head,'small50')" :title="draw.user.name">
          </nuxt-link>
          <div class="user-info-box">
            <p class="nickname">
              {{draw.user.name}}
            </p>
            <p class="introduction" :title="draw.user.introduction">
              {{draw.user.introduction}}
            </p>
          </div>
          <div class="follow-box flex-box">
            <button class="btn block" @click="follow(draw.user.id)" :disabled="draw.user.focus===null">
              {{draw.user.focus?`已关注`:`关注`}}
            </button>
          </div>
        </div>
      </div>
    </CheckboxGroup>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
    <br>
    <Btn icon class="go-top" v-if="isSelf" @click="unCollection">
      <i class="icon s-heart" style="color: red"></i>
    </Btn>
  </div>
</template>

<script>
  import config from "../../../assets/script/config";
  import {Pageable} from "../../../assets/script/model/base";
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "collection");
      let pageable = new Pageable(route.params.page * 1 || 0, 16, "createDate,desc");
      let {data: result} = await $axios.get(`${config.host}/collection/paging`, {
        params: Object.assign({
          id: route.params.userId
        }, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        pageable,
        page: result.data,
        list: result.data.content,
        selectList: [],
      }
    },
    computed: {
      isSelf() {
        return this.$store.state.user.user.id === this.$route.params.userId
      }
    },
    methods: {
      ...mapActions("draw", ["ACollection", "AUnCollection"]),
      ...mapActions("user", ["AFollow"]),
      getProportion(draw) {
        return draw.height / draw.width
      },
      paging(page) {
        this.$router.push(`/collection/${this.$route.params.userId}/${page}`);
      },
      async collection(draw) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        draw.focus = result.data;
      },
      unCollection() {
        this.$confirm({
          message: `你确定要取消选中的收藏吗？`,
          okCallback: async () => {
            let result = await this.AUnCollection({
              drawIdList: this.selectList.map(item => item.id)
            });
            if (result.status !== 200) {
              this.$notify({message: result.message});
              return
            }
            for (let id of result.data) {
              let draw = this.list.find(item => item.id === id);
              if (!draw) {
                continue
              }
              draw.focus = false;
            }
            this.$notify({message: `取消收藏成功`});
          }
        });
      },
      async follow(id) {
        let result = await this.AFollow({
          followingId: id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        for (let draw of this.list) {
          if (draw.user.id === id) {
            draw.user.focus = result.data
          }
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  @info-box-height: 80px;
  .content {
    width: @visual-width;
    margin: 0 auto;
    .card {
      @size: 250px;
      float: left;
      margin-top: 24px;
      margin-right: 24px;
      overflow: hidden;
      transition: @default-animate-time;
      position: relative;
      width: @size;
      &:nth-child(4n+1) {
        margin-left: 24px;
      }
      &:hover {
        transform: translateY(-1px);
        .info-box {
          .user-info-box {
            opacity: 0;
            transform: translateY(10px);
          }
          .follow-box {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
      .img-box {
        width: @size;
        height: @size;
      }
      .tool {
        margin: 10px;
        user-select: none;
        padding: 0 10px;
        text-align: right;
        .like {
          vertical-align: middle;
          margin-left: 10px;
        }
      }
      .info-box {
        margin-top: -10px;
        @img-size: 50px;
        @padding-size: 15px;
        padding: @padding-size;
        overflow: hidden;
        .head-box {
          display: block;
          position: relative;
          transition: @default-animate-time;
          img {
            border-radius: 50%;
            width: @img-size;
          }
        }
        .user-info-box {
          width: calc(100% - @img-size);
          padding: 0 30px;
          transition: @default-animate-time;

          .nickname {
            .ellipsis()
          }
          .introduction {
            font-size: @smallest-font-size;
            margin-top: 10px;
            .ellipsis()
          }
        }
        .follow-box {
          position: absolute;
          height: @info-box-height;
          bottom: 0;
          width: calc(100% - @img-size - @padding-size);
          right: 0;
          padding: 15px;
          transition: @default-animate-time;
          opacity: 0;
          transform: translateY(10px);
        }
      }
    }
  }
</style>
