<template>
  <div class="list">
    <div class="not card">
      <img src="../../assets/image/default/not.png">
    </div>
  </div>
</template>

<script>
  export default {
    beforeCreate() {
      this.$parent.type = "follow"
    }
  }
</script>


<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .list {
    height: 100%;
    overflow: scroll;
    .item {
      margin-top: 10px;
      padding: 20px 30px;
      text-align: left;
      &:first-child {
        margin-top: 0;
      }
      .head {
        img {
          border-radius: 50%;
        }
      }
      .desc {
        line-height: 25px;
        .name {
          a {
            font-weight: bold;
            color: @theme-color;
          }
        }
        .time {
          color: darken(@font-color, -30%);
        }
        .tool {
          user-select: none;
          a {
            user-select: none;
            width: 100px;
            display: inline-block;
            color: @theme-color;
            font-size: @default-font-size;
            margin-right: 15px;
            i {
              display: inline-block;
              color: @theme-color;
              margin-right: 3px;
            }
          }
        }
      }
    }
    .not {
      text-align: center;
    }
  }
</style>
