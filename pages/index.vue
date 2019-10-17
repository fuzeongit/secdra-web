<template>
  <div class="page">
    <div
      class="user-bk cover flex-box"
      :style="{ backgroundImage: `url(${$img.back(user.background)})` }"
    >
      <SearchBox></SearchBox>
    </div>
    <div class="content-grid">
      <div class="left-box">
        <div class="card image-card">
          <h3 class="title">
            发现
            <Btn round flat small color="primary" to="/find"> 更多>></Btn>
          </h3>
          <div class="image-grid-row">
            <div v-for="(draw, index) in likeList" :key="index" class="item">
              <div class="img-box">
                <nuxt-link v-ripple :to="`/draw/${draw.id}`">
                  <img
                    :src="$img.secdra(draw.url, 'specifiedWidth')"
                    class="cover"
                  />
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @follow="follow"></UserCard>
                  <template #reference>
                    <nuxt-link
                      v-ripple
                      :to="`/user/${draw.user.id}`"
                      class="head-image"
                    >
                      <img :src="$img.head(draw.user.head, 'small50')" />
                    </nuxt-link>
                  </template>
                </Popper>
                <div class="tool-btn-group">
                  <Btn v-tooltip="`浏览`" flat icon small>
                    <i class="icon ali-icon-attention"></i>
                  </Btn>
                  <span>{{ draw.viewAmount }}</span>
                  <Btn
                    v-tooltip="
                      draw.focus === $enum.CollectState.CONCERNED.key
                        ? `取消收藏`
                        : `收藏`
                    "
                    flat
                    icon
                    :color="
                      draw.focus === $enum.CollectState.CONCERNED.key
                        ? `red`
                        : `default`
                    "
                    small
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
        <div class="card image-card">
          <h3 class="title">
            最新
            <Btn round flat small color="primary" to="/new"> 更多>></Btn>
          </h3>
          <div class="image-grid-row">
            <div v-for="(draw, index) in newList" :key="index" class="item">
              <div class="img-box">
                <nuxt-link v-ripple :to="`/draw/${draw.id}`">
                  <img
                    :src="$img.secdra(draw.url, 'specifiedWidth')"
                    class="cover"
                  />
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="draw.user" @follow="follow"></UserCard>
                  <template #reference>
                    <nuxt-link
                      v-ripple
                      :to="`/user/${draw.user.id}`"
                      class="head-image"
                    >
                      <img :src="$img.head(draw.user.head, 'small50')" />
                    </nuxt-link>
                  </template>
                </Popper>
                <div class="tool-btn-group">
                  <Btn v-tooltip="`浏览`" flat icon small>
                    <i class="icon ali-icon-attention"></i>
                  </Btn>
                  <span>{{ draw.viewAmount }}</span>
                  <Btn
                    v-tooltip="
                      draw.focus === $enum.CollectState.CONCERNED.key
                        ? `取消收藏`
                        : `收藏`
                    "
                    flat
                    icon
                    :color="
                      draw.focus === $enum.CollectState.CONCERNED.key
                        ? `red`
                        : `default`
                    "
                    small
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
      </div>
      <div class="right-box">
        <div class="card tag-card">
          <h3 class="title">
            热门推荐
          </h3>
          <Carousel class="tag-draw-carousel" height="200px">
            <CarouselItem
              v-for="(tagDraw, index) in tagDrawList"
              :key="index"
              v-tooltip="tagDraw.tag"
            >
              <nuxt-link
                :to="`/draw/search/${encodeURIComponent(tagDraw.tag)}`"
              >
                <img :src="$img.secdra(tagDraw.url, 'specifiedWidth')" />
              </nuxt-link>
            </CarouselItem>
          </Carousel>
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
    taskList.push($axios.get(`/tag/listTagAndDrawTop30`))
    taskList.push(
      $axios.get(`/draw/pagingByRecommend`, { params: new Pageable(0, 12) })
    )
    taskList.push(
      $axios.get(`/draw/paging`, {
        params: new Pageable(0, 12, "createDate,desc")
      })
    )
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    let tagDrawList = resultList[0].data
    const tagList = tagDrawList
      .filter((_, index) => index >= 4)
      .map((item) => item.tag)
    tagDrawList = tagDrawList.filter((_, index) => index < 4)
    return {
      tagList,
      tagDrawList,
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
  @lift-box-width: 850px;
  @right-box-width: 250px;
  @gap-size: @visual-width - @lift-box-width - @right-box-width;
  display: grid;
  justify-content: space-between;
  grid-template-columns: 850px 250px;
  width: @visual-width;
  margin: 0 auto;
  padding: @page-gap 0;
  .title {
    font-size: 16px;
    line-height: 28px;
    margin-bottom: 10px;
    a {
      float: right;
    }
  }
  .left-box {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: @gap-size;
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
        display: flex;
        align-items: center;
        .head-image {
          @head-size: @small-input-line-height;
          width: @head-size;
          height: @head-size;
          border-radius: 50%;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .tool-btn-group {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          span {
            margin-left: 3px;
            margin-right: 6px;
          }
        }
      }
    }
  }
  .tag-card {
    @spacing: 10px;
    padding: @spacing;
    .tag-draw-carousel {
      margin-bottom: 15px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
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
