<template>
  <div
    class="list-content"
    :style="{
      height: `${listContentOffset.height}px`
    }"
  >
    <div
      v-for="(draw, index) in list"
      :key="index"
      class="item card"
      :style="{
        left: `${offset[index].left}px`,
        top: `${offset[index].top}px`
      }"
    >
      <nuxt-link v-ripple :to="`/draw/${draw.id}`" class="img-box">
        <img
          :src="$img.secdra(draw.url, `specifiedWidth`)"
          :style="{
            width: listConstant.colWidth + `px`,
            height: getHeight(draw) + `px`
          }"
        />
      </nuxt-link>
      <Btn
        v-tooltip="
          draw.focus === $enum.CollectState.CONCERNED.key ? `取消收藏` : `收藏`
        "
        flat
        icon
        :color="
          draw.focus === $enum.CollectState.CONCERNED.key ? `red` : `default`
        "
        class="like"
        @click.stop="$emit(`collection`, draw, index)"
      >
        <i
          class="icon"
          :class="{
            'ali-icon-likefill':
              draw.focus === $enum.CollectState.CONCERNED.key,
            'ali-icon-like': draw.focus !== $enum.CollectState.CONCERNED.key
          }"
        ></i>
      </Btn>

      <div
        class="flex-box info-box"
        :style="{
          width: listConstant.colWidth + `px`,
          height: listConstant.infoHeight + `px`
        }"
      >
        <nuxt-link v-ripple :to="`/user/${draw.user.id}`" class="head-box">
          <img :src="$img.head(draw.user.head, 'small50')" />
        </nuxt-link>
        <div class="user-info-box">
          <p class="nickname">
            {{ draw.user.name }}
          </p>
          <p class="introduction">
            {{ draw.user.introduction }}
          </p>
        </div>
        <div class="follow-box flex-box">
          <Btn
            block
            color="primary"
            :disabled="draw.user.focus === $enum.FollowState.SElF.key"
            @click="$emit(`follow`, draw.user.id)"
          >
            {{
              draw.user.focus === $enum.FollowState.CONCERNED.key
                ? `已关注`
                : `关注`
            }}
          </Btn>
        </div>
      </div>
    </div>
    <div
      v-if="page.last"
      class="item last-card"
      :style="{
        left: `${listContentOffset.lastCardLeft}px`,
        top: `${listContentOffset.lastCardTop}px`,
        width: listConstant.colWidth + `px`
      }"
    >
      <img src="../../../assets/image/error/404.jpg" />
    </div>
  </div>
</template>

<script>
import { listConstant } from "../../../assets/script/constant"
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "DrawList",
  mixins: [windowMixin],
  props: {
    page: {
      type: Object,
      default: null
    },
    list: {
      type: Array,
      default: () => []
    },
    pageLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listConstant: listConstant()
    }
  },
  computed: {
    // 计算偏移
    offset() {
      const o = []
      const colNumberHeight = this.initColNumberHeight(this.listConstant)
      // eslint-disable-next-line no-unused-vars
      for (const draw of this.list) {
        const minTopIndex = colNumberHeight.minIndex()
        const left =
          (1 + minTopIndex) * this.listConstant.widthOffset +
          this.listConstant.colWidth * minTopIndex
        const top =
          colNumberHeight[minTopIndex] +
          this.listConstant.pageGap -
          this.listConstant.gap
        colNumberHeight[minTopIndex] +=
          (draw.height / draw.width) * this.listConstant.colWidth +
          this.listConstant.heightOffset +
          this.listConstant.infoHeight
        o.push({ left, top })
      }
      return o
    },
    // 计算盒子属性
    listContentOffset() {
      const colNumberHeight = this.initColNumberHeight(this.listConstant)
      let minIndex = 0
      // eslint-disable-next-line no-unused-vars
      for (const draw of this.list) {
        colNumberHeight[minIndex] +=
          (draw.height / draw.width) * this.listConstant.colWidth +
          this.listConstant.heightOffset +
          this.listConstant.infoHeight
        minIndex = colNumberHeight.minIndex()
      }
      const offset = {
        height: colNumberHeight.max()
      }
      if (this.page.last) {
        const lastCardHeight = 300
        offset.lastCardLeft =
          (1 + minIndex) * this.listConstant.widthOffset +
          this.listConstant.colWidth * minIndex
        offset.lastCardTop = colNumberHeight.min()
        const h =
          colNumberHeight.min() +
          lastCardHeight +
          this.listConstant.heightOffset
        if (h > offset.height) {
          offset.height = h
        }
        return offset
      } else {
        return offset
      }
    }
  },
  watch: {
    scrollBottom(newVal) {
      if (this.pageLoading) {
        return
      }
      if (newVal > 300) {
        return
      }
      this.$emit("paging")
    }
  },
  methods: {
    // 初始化高度数组
    initColNumberHeight(listConstant) {
      const t = []
      for (let i = 0; i < listConstant.colNumber; i++) {
        t[i] = listConstant.heightOffset
      }
      return t
    },
    getHeight(draw) {
      return (draw.height / draw.width) * this.listConstant.colWidth
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.list-content {
  width: @visual-width;
  margin: 0 auto;
  position: relative;
  height: calc(100vh - @herder-height);
  .item {
    @info-box-height: 80px;
    position: absolute;
    transition: @short-animate-time;

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
    .like {
      position: absolute;
      bottom: @info-box-height + 5px;
      right: 5px;
    }
    .img-box {
      display: block;
      img {
        transition: 0.5s;
        width: 100%;
      }
    }
    .info-box {
      @img-size: 50px;
      @padding-size: 15px;
      padding: @padding-size;
      overflow: hidden;
      .head-box {
        display: block;
        position: relative;
        transition: @default-animate-time;
        border-radius: 50%;
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
          .ellipsis();
        }
        .introduction {
          font-size: @smallest-font-size;
          margin-top: 10px;
          .ellipsis();
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
  .last-card {
    height: 300px;
    img {
      width: 100%;
    }
  }
}
</style>
