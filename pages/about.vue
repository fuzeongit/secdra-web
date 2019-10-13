<template>
  <div class="page">
    <div class="content card">
      <h1 class="center">关于Secdra</h1>
      <p>
        这个网站是一个类似Pixiv（下称P站）的网站，其实这个网站一开始是设计来玩的顺便深入学习，后来慢慢完善，才做成现在这个勉强用于生产的网站吧。
        然而UI方面还是不是很过关，毕竟是自己一个人从需求设计，UI设计，后端开发，服务器部署，前端开发等。网站是是基于Google的Material
        Design的UI设计规范。
      </p>
      <p>
        网站的资源是通过采集采集自日本的插画网站P站（还有一部分图片来源其他网站），网站下的所有图片不用作盈利，若造成侵权，请联系作者删除！
      </p>
      <p>
        目前，网站已经具备正常网站的使用，注册功能已经实现，但是由于作者的资金和时间短缺，对于开放注册后的管理和维护未能够有效的管理，
        因此并不开放注册（同样的功能还有涉及上传等功能）。
      </p>

      <Carousel v-model="m" height="100px">
        <CarouselItem style="background: bisque"></CarouselItem>
        <CarouselItem style="background: aliceblue"></CarouselItem>
        <CarouselItem style="background: darkblue"></CarouselItem>
        <CarouselItem style="background: gainsboro"></CarouselItem>
        <CarouselItem style="background: brown"></CarouselItem>
        <CarouselItem style="background: gold"></CarouselItem>
        <CarouselItem style="background: orangered"></CarouselItem>
      </Carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      m: 2
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";
@import "../assets/style/mixin";
.page {
  padding: @page-gap 0;
}
.content {
  width: @visual-width;
  margin: 0 auto;
  padding: 20px 30px;
  h1 {
    line-height: 70px;
    font-size: @big-font-size;
    color: @font-color-dark-fade;
  }
  p {
    line-height: 36px;
    font-size: @default-font-size;
    color: @font-color-dark-fade;
    text-indent: 2em;
    margin-bottom: 1em;
  }
}
</style>
