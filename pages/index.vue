<template>
  <div class="page">
    <div
      class="user-bk cover flex-box"
      :style="{ backgroundImage: `url(${$img.back(user.background)})` }"
    >
      <SearchBox></SearchBox>
    </div>
    <br />
    <div class="content-grid">
      <div class="left-box">
        <div class="card image-card ">
          <h3 class="title">
            发现
            <Btn round flat small color="primary" to="/find"> 更多>></Btn>
          </h3>
          <div class="image-grid-row">
            <div v-for="(draw, index) in likeList" :key="index" class="item">
              <div class="img-box">
                <nuxt-link v-ripple :to="`/draw/${draw.id}`" :title="draw.name">
                  <img
                    :src="$img.secdra(draw.url, 'specifiedWidth')"
                    class="cover"
                  />
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @follow="follow"></UserCard>
                  <nuxt-link
                    slot="reference"
                    v-ripple
                    :to="`/draw/${draw.id}`"
                    class="head-image"
                    :title="draw.user.name"
                  >
                    <img :src="$img.head(draw.user.head, 'small50')" />
                  </nuxt-link>
                </Popper>
                <Btn flat icon small title="浏览">
                  <i class="icon ali-icon-attention"></i>
                </Btn>
                <span>{{ draw.viewAmount }}</span>
                <Btn
                  flat
                  icon
                  :color="
                    draw.focus === $enum.CollectState.CONCERNED.key
                      ? `primary`
                      : `default`
                  "
                  small
                  title="收藏"
                  @click.stop="collection(draw)"
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
            </div>
          </div>
        </div>
        <div class="card image-card " style="margin-top: 20px;">
          <h3 class="title">
            最新
            <Btn round flat small color="primary" to="/new"> 更多>></Btn>
          </h3>
          <div class="image-grid-row">
            <div v-for="(draw, index) in newList" :key="index" class="item">
              <div class="img-box">
                <nuxt-link v-ripple :to="`/draw/${draw.id}`" :title="draw.name">
                  <img
                    :src="$img.secdra(draw.url, 'specifiedWidth')"
                    class="cover"
                  />
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @follow="follow"></UserCard>
                  <nuxt-link
                    slot="reference"
                    v-ripple
                    :to="`/draw/${draw.id}`"
                    class="head-image"
                    :title="draw.user.name"
                  >
                    <img :src="$img.head(draw.user.head, 'small50')" />
                  </nuxt-link>
                </Popper>
                <Btn flat icon small title="浏览">
                  <i class="icon ali-icon-attention"></i>
                </Btn>
                <span>{{ draw.viewAmount }}</span>
                <Btn
                  flat
                  icon
                  :color="
                    draw.focus === $enum.CollectState.CONCERNED.key
                      ? `primary`
                      : `default`
                  "
                  small
                  title="收藏"
                  @click.stop="collection(draw)"
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
            <Btn
              v-for="(tag, index) in tagList"
              :key="index"
              :to="`/draw/search/${encodeURIComponent(tag)}`"
              color="primary"
              outline
              small
              >{{ tag }}
            </Btn>
          </div>
        </div>
      </div>
    </div>
    <p class="center" style="margin: 30px;">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank"
        >粤ICP备18144953号-1</a
      >
    </p>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { Pageable } from "../assets/script/model"
import UserCard from "../components/pages/shared/UserCard"
import SearchBox from "../components/pages/shared/SearchBox"
import stompMixin from "../assets/script/mixin/stompMixin"

export default {
  components: {
    SearchBox,
    UserCard
  },
  mixins: [stompMixin],
  computed: {
    ...mapState("user", ["user"])
  },
  // 在这里不能使用httpUtil
  async asyncData({ store, $axios }) {
    store.commit("menu/MChangeName", "home")
    const taskList = []
    taskList.push($axios.get(`/tag/listTagTop30`))
    taskList.push(
      $axios.get(`/draw/pagingByRecommend`, { params: new Pageable(0, 12) })
    )
    taskList.push(
      $axios.get(`/draw/paging`, {
        params: new Pageable(0, 12, "createDate,desc")
      })
    )
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    return {
      tagList: resultList[0].data,
      likeList: resultList[1].data.content,
      newList: resultList[2].data.content
    }
  },
  methods: {
    ...mapActions("draw", ["ACollection"]),
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
    follow({ userId, focus }) {
      this.likeList.forEach((item) => {
        if (item.user.id === userId) {
          item.user.focus = focus
        }
      })
      this.newList.forEach((item) => {
        if (item.user.id === userId) {
          item.user.focus = focus
        }
      })
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
          display: block;
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
