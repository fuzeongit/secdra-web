<template>
  <div>
    <div
      v-lazy:background-image="$img.backLazy(user.background)"
      class="user-bk cover"
    >
      <div class="user-bk-content">
        <div class="tool">
          <Btn big round @click="$emit('follow')">
            <span style="min-width: 4em">
              {{
                user.focus === $enum.FollowState.CONCERNED.key
                  ? "已关注"
                  : "关注"
              }}</span
            >
          </Btn>
        </div>
      </div>
    </div>
    <div class="content card">
      <div class="head-box">
        <img
          v-lazy="$img.headLazy(user.head)"
          :onerror="
            `this.src='${require('../../../assets/image/svg/default-head.svg')}'`
          "
        />
        <div class="info-box">
          <p class="name">
            {{ user.name }}
            <i
              class="icon"
              :class="{
                'ali-icon-female': user.gender === $enum.Gender.FEMALE.key,
                'ali-icon-male': user.gender === $enum.Gender.MALE.key
              }"
            ></i>
          </p>
          <p class="introduction">
            {{ user.introduction || "这人很懒，什么都没有留下" }}
          </p>
        </div>
      </div>
      <div class="picture-box">
        <div v-loading="worksLoading" class="works-box">
          <h3 class="line center">
            <span
              >{{
                user.gender === $enum.Gender.FEMALE.key ? "她" : "他"
              }}的作品</span
            >
          </h3>
          <div v-if="worksList.length" class="picture-list">
            <nuxt-link
              v-for="(picture, index) in worksList"
              :key="index"
              v-ripple
              class="picture-item flex-box"
              :to="`/picture/${picture.id}`"
            >
              <img
                v-lazy="$img.secdraLazy(picture.url, `specifiedWidth`)"
                :style="{
                  height: getProportion(picture) >= 1 ? `100%` : `auto`,
                  width: getProportion(picture) <= 1 ? `100%` : `auto`
                }"
              />
            </nuxt-link>
          </div>
          <p v-if="worksList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/works/${user.id || ''}`"
              >查看更多>>
            </Btn>
          </p>
          <img
            v-if="!worksLoading && !worksList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
        <div v-loading="collectionLoading" class="collection-box">
          <h3 class="line center">
            <span
              >{{
                user.gender === $enum.Gender.FEMALE.key ? "她" : "他"
              }}的收藏</span
            >
          </h3>
          <div v-if="collectionList.length" class="picture-list">
            <nuxt-link
              v-for="(picture, index) in collectionList"
              :key="index"
              v-ripple
              class="picture-item flex-box"
              :to="`/picture/${picture.id}`"
            >
              <img
                v-lazy="$img.secdraLazy(picture.url, `specifiedWidth`)"
                :style="{
                  height: getProportion(picture) >= 1 ? `100%` : `auto`,
                  width: getProportion(picture) <= 1 ? `100%` : `auto`
                }"
              />
            </nuxt-link>
          </div>
          <p v-if="collectionList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/collection/${user.id || ''}`"
              >查看更多>>
            </Btn>
          </p>
          <img
            v-if="!collectionLoading && !collectionList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
        <div v-loading="followingLoading" class="following-box">
          <h3 class="line center">
            <span
              >{{
                user.gender === $enum.Gender.FEMALE.key ? "她" : "他"
              }}的关注</span
            >
          </h3>
          <div v-if="followingList.length" class="following-list">
            <div
              v-for="(item, index) in followingList"
              :key="index"
              class="card following-item"
            >
              <div
                v-lazy:background-image="
                  $img.backLazy(item.background, `backCard`)
                "
                class="cover"
              ></div>
              <div class="center" style="padding: 10px;">
                <nuxt-link
                  v-ripple
                  :to="`/user/${item.id}`"
                  class="following-head-box"
                >
                  <img v-lazy="$img.headLazy(item.head, 'small200')" />
                </nuxt-link>
              </div>
              <div class="user-info-box center ">
                <p class="nickname">
                  {{ item.name }}
                </p>
                <p class="introduction">
                  {{ item.introduction }}
                </p>
              </div>
            </div>
          </div>
          <p v-if="followingList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/following/${user.id || ''}`"
              >查看更多>>
            </Btn>
          </p>
          <img
            v-if="!followingLoading && !followingList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { Pageable } from "../../../assets/script/model"

export default {
  props: {
    user: { type: Object, default: null }
  },
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
  mounted() {
    this.pagingWorks()
    this.pagingCollection()
    this.pagingFollower()
  },
  methods: {
    ...mapActions("user", ["APagingByFollowerId"]),
    ...mapActions("picture", ["APagingCollection", "APaging"]),
    getProportion(picture) {
      return picture.height / picture.width
    },
    async pagingWorks() {
      this.worksLoading = true
      const result = await this.APaging(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          targetId: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.worksLoading = false
      this.worksList = result.data.content
    },
    async pagingCollection() {
      this.collectionLoading = true
      const result = await this.APagingCollection(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          targetId: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.collectionLoading = false
      this.collectionList = result.data.content
    },
    async pagingFollower() {
      this.followingLoading = true
      const result = await this.APagingByFollowerId(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          id: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.followingLoading = false
      this.followingList = result.data.content
    }
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

      .btn {
        background-color: rgba(0, 0, 0, 0.3);

        span {
          color: @font-color-light-fade;
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
  margin: -100px auto @page-gap;
  @head-img-height: 150px;
  @head-img-border: 2px;
  transform: translateY(0);

  .head-box {
    padding: 0 100px;

    img {
      margin-top: -(@head-img-height+ @head-img-border)/2;
      display: inline-block;
      position: absolute;
      height: @head-img-height;
      width: @head-img-height;
      border: @head-img-border solid white;
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

          &.ali-icon-female {
            color: @female-color;
          }

          &.ali-icon-male {
            color: @male-color;
          }
        }
      }

      .introduction {
        font-size: @smallest-font-size;
      }
    }
  }

  .picture-box {
    @picture-box-padding: 50px;
    padding: 30px @picture-box-padding;

    .line {
      width: 100%;
      border-bottom: 1px dashed @font-color-dark-line;
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
      min-height: 250px;

      .is-not {
        display: block;
        margin: 0 auto;
      }
    }

    .collection-box {
      margin-top: 30px;
      min-height: 250px;

      .is-not {
        display: block;
        margin: 0 auto;
      }
    }

    .following-box {
      margin-top: 30px;
      min-height: 250px;

      .is-not {
        display: block;
        margin: 0 auto;
      }
    }

    .move {
      text-align: right;

      a {
        color: @theme-color;
      }
    }

    .picture-list {
      @column-number: 4;
      @gap: 20px;
      @size: (
          @visual-width - @picture-box-padding * 2 - (@column-number - 1) * @gap
        ) / @column-number;
      display: grid;
      grid-gap: @gap;
      grid-template-columns: repeat(@column-number, @size);
      padding: @gap 0;

      .picture-item {
        overflow: hidden;
        transition: @default-animate-time;
        position: relative;
        height: @size;
      }
    }

    .following-list {
      @column-number: 4;
      @gap: 20px;
      @size: (
          @visual-width - @picture-box-padding * 2 - (@column-number - 1) * @gap
        ) / @column-number;
      display: grid;
      grid-gap: @gap;
      grid-template-columns: repeat(@column-number, @size);
      padding: @gap 0;

      .following-item {
        transition: @default-animate-time;
        overflow: hidden;

        .cover {
          height: @size / 2;
          width: @size;
          transition: @default-animate-time;
        }

        .following-head-box {
          @size: 82px;
          width: @size;
          height: @size;
          border: 2px solid white;
          display: inline-block;
          border-radius: 50%;
          transition: @default-animate-time;

          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }

        .user-info-box {
          padding: 0 20px 20px 20px;
          transition: @default-animate-time;

          .nickname {
            .ellipsis();
          }

          .introduction {
            font-size: @smallest-font-size;
            margin-top: 10px;
            .ellipsis();
          }
        }

        &:hover {
          .cover {
            filter: blur(60px);
          }

          .following-head-box {
            transform: translateY(-25px) scale(2);
          }

          .user-info-box {
            opacity: 0;
            transform: translateY(25px);
          }

          transform: translateY(-1px);
        }
      }
    }
  }
}
</style>
