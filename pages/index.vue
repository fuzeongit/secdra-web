<template>
  <div class="page">
    <div
      v-lazy:background-image="$img.backLazy(user.background)"
      class="user-bk cover flex-box"
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
            <div v-for="(picture, index) in likeList" :key="index" class="item">
              <div class="img-box">
                <nuxt-link v-ripple :to="`/picture/${picture.id}`">
                  <img
                    v-lazy="$img.secdraLazy(picture.url, 'specifiedWidth')"
                    class="cover"
                  />
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="picture.user" @follow="follow"></UserCard>
                  <template #reference>
                    <nuxt-link
                      v-ripple
                      :to="`/user/${picture.user.id}`"
                      class="head-image"
                    >
                      <img
                        v-lazy="$img.headLazy(picture.user.head, 'small50')"
                      />
                    </nuxt-link>
                  </template>
                </Popper>
                <div class="tool-btn-group">
                  <Btn v-tooltip="`浏览`" flat icon small>
                    <i class="icon ali-icon-attention"></i>
                  </Btn>
                  <span>{{ picture.viewAmount }}</span>
                  <Btn
                    v-tooltip="
                      picture.focus === $enum.CollectState.CONCERNED.key
                        ? `取消收藏`
                        : `收藏`
                    "
                    flat
                    icon
                    :color="
                      picture.focus === $enum.CollectState.CONCERNED.key
                        ? `red`
                        : `default`
                    "
                    small
                    @click.stop="collection(picture)"
                  >
                    <i
                      class="icon"
                      :class="{
                        'ali-icon-likefill':
                          picture.focus === $enum.CollectState.CONCERNED.key,
                        'ali-icon-like':
                          picture.focus !== $enum.CollectState.CONCERNED.key
                      }"
                    ></i>
                  </Btn>
                  <span>{{ picture.likeAmount }}</span>
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
            <div v-for="(picture, index) in newList" :key="index" class="item">
              <div class="img-box">
                <nuxt-link v-ripple :to="`/picture/${picture.id}`">
                  <img
                    v-lazy="$img.secdraLazy(picture.url, 'specifiedWidth')"
                    class="cover"
                  />
                </nuxt-link>
              </div>
              <div class="tool">
                <Popper placement="top" trigger="hover">
                  <UserCard :user="picture.user" @follow="follow"></UserCard>
                  <template #reference>
                    <nuxt-link
                      v-ripple
                      :to="`/user/${picture.user.id}`"
                      class="head-image"
                    >
                      <img
                        v-lazy="$img.headLazy(picture.user.head, 'small50')"
                      />
                    </nuxt-link>
                  </template>
                </Popper>
                <div class="tool-btn-group">
                  <Btn v-tooltip="`浏览`" flat icon small>
                    <i class="icon ali-icon-attention"></i>
                  </Btn>
                  <span>{{ picture.viewAmount }}</span>
                  <Btn
                    v-tooltip="
                      picture.focus === $enum.CollectState.CONCERNED.key
                        ? `取消收藏`
                        : `收藏`
                    "
                    flat
                    icon
                    :color="
                      picture.focus === $enum.CollectState.CONCERNED.key
                        ? `red`
                        : `default`
                    "
                    small
                    @click.stop="collection(picture)"
                  >
                    <i
                      class="icon"
                      :class="{
                        'ali-icon-likefill':
                          picture.focus === $enum.CollectState.CONCERNED.key,
                        'ali-icon-like':
                          picture.focus !== $enum.CollectState.CONCERNED.key
                      }"
                    ></i>
                  </Btn>
                  <span>{{ picture.likeAmount }}</span>
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
          <Carousel class="tag-picture-carousel" height="200px">
            <CarouselItem
              v-for="(tagPicture, index) in tagPictureList"
              :key="index"
              v-tooltip="tagPicture.tag"
            >
              <nuxt-link
                :to="`/picture/search/${encodeURIComponent(tagPicture.tag)}`"
              >
                <img
                  v-lazy="$img.secdraLazy(tagPicture.url, 'specifiedWidth')"
                />
              </nuxt-link>
            </CarouselItem>
          </Carousel>
          <div class="tag-list">
            <Btn
              v-for="(tag, index) in tagList"
              :key="index"
              :to="`/picture/search/${encodeURIComponent(tag)}`"
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
    taskList.push($axios.get(`/tag/listTagAndPictureTop30`))
    taskList.push(
      $axios.get(`/picture/pagingByRecommend`, { params: new Pageable(0, 12) })
    )
    taskList.push(
      $axios.get(`/picture/paging`, {
        params: new Pageable(0, 12, "createDate,desc")
      })
    )
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    let tagPictureList = resultList[0].data
    const tagList = tagPictureList
      .filter((_, index) => index >= 4)
      .map((item) => item.tag)
    tagPictureList = tagPictureList.filter((_, index) => index < 4)
    return {
      tagList,
      tagPictureList,
      likeList: resultList[1].data.content,
      newList: resultList[2].data.content
    }
  },
  methods: {
    ...mapActions("picture", ["ACollection"]),
    async collection(picture) {
      const result = await this.ACollection({
        pictureId: picture.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      picture.focus = result.data
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
      .picture-name {
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
    .tag-picture-carousel {
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
