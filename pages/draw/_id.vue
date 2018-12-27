<template>
  <div class="page">
    <div class="content row">
      <div class="left-box">
        <div class="card img-card flex-box">
          <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
             :style="{color:draw.focus?`red`:`gray`}" title="收藏"
             @click.stop="collection(draw)"></a>
          <img :src="$img.secdra(draw.url)"
               :style="{height:proportion>=1?`100%`:`auto`,width:proportion<=1?`100%`:`auto`}">
        </div>
      </div>
      <div class="right-box">
        <div class="card user-card ">
          <div class="user-bk cover"
               :style="{backgroundImage: `url(${$img.back(draw.user.background,`backCard`)})`}">
          </div>
          <div style="padding: 15px">
            <div class="flex-box">
              <nuxt-link :to="`/user/${draw.user.id}`" class="head-box center">
                <img :src="$img.head(draw.user.head)">
              </nuxt-link>
              <div class="user-info-box">
                <p class="nickname">
                  <nuxt-link :to="`/user/${draw.user.name}`" class="head-box">
                    {{draw.user.name}}
                  </nuxt-link>
                </p>
                <p class="introduction" :title="draw.user.introduction">
                  {{draw.user.introduction}}
                </p>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <button class="btn block" v-if="draw.user.id===user.id" @click="isShowEdit=true">
                编辑
              </button>
              <button class="btn block" v-else @click="follow(draw.user.id)">
                {{draw.user.focus?`已关注`:`关注`}}
              </button>
            </div>
          </div>
        </div>
        <br>
        <div class="card info-card">
          <h3 class="name"><strong>{{draw.name}}</strong></h3>
          <p class="introduction">{{draw.introduction}}</p>
          <div class="row">
            <div class="col-15">
              <i class="icon s-eye"></i>
              <span>{{draw.viewAmount}}</span>
            </div>
            <div class="col-15">
              <i class="icon s-heart"></i>
              <span>{{draw.likeAmount}}</span>
            </div>
            <div class="col-30" style="margin-top: 5px">
              创建于：{{draw.createDate|date}}
            </div>
          </div>
        </div>
        <br>
        <div class="card tag-card">
          <div class="tag-list">
            <Popper trigger="hover" placement="top" @show="showTagPopper(tag.id)" v-for="tag in draw.tagList"
                    :key="tag.id">
              <TagCard :ref="tag.id" :tag="tag.name"></TagCard>
              <nuxt-link class="btn is-plain" :to="`/draw/search/${tag.name}`" slot="reference">
                {{tag.name}}
              </nuxt-link>
            </Popper>
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model="isShowEdit" title="编辑" v-loading="editLoading">
      <div class="edit-dialog-content" >
        <div>
          <div class="input-group">
            <h5 class="sub-name">修改名称：</h5>
            <input type="text" title="name" v-model="drawForm.name" class="input block">
          </div>
          <div class="input-group">
            <h5 class="sub-name">修改简介：</h5>
            <textarea v-model="drawForm.introduction" class="input block" title="introduction" rows="3"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">修改私密：</h5>
            <RadioGroup v-model="drawForm.isPrivate">
              <Radio :value="true" label="隐藏"></Radio>
              <Radio :value="false" label="显示" style="margin-left: 10px"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">修改标签：</h5>
            <input type="text" title="name" v-model="inputTag" class="input block" @keyup.enter="addTag">
            <h5 class="sub-name">*回车添加一个标签</h5>
          </div>
          <div style="margin-bottom: 10px">
            <Tag v-for="(tagName,index) in drawForm.tagList" @close="removeTag" :content="tagName" :key="tagName"
                 :value="index"></Tag>
          </div>
        </div>
      </div>
      <div class="input-group" style="text-align: center;">
        <button class="btn" @click="save">保存</button>
        <button class="btn is-plain" @click="reset">重置</button>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import config from "../../assets/js/config";
  import TagCard from "../../components/pages/shared/TagCard";
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "";
      let id = route.params.id;
      let res = await $axios.get(`${config.host}/draw/get`, {
        params: {id}
      });
      let result = res.data;
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      let drawForm = Object.assign({}, result.data);
      drawForm.tagList = drawForm.tagList.map(item => item.name);
      drawForm.isPrivate = drawForm.private;
      return {
        draw: result.data,
        drawForm
      }
    },
    data() {
      return {
        isShowEdit: false,
        editLoading: false,
        inputTag: ""
      }
    },
    components: {
      TagCard
    },
    computed: {
      proportion() {
        return this.draw.height / this.draw.width
      },
      user() {
        return this.$store.state.user.user
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions("draw", ["ACollection", "AUpdate"]),
      ...mapActions("user", ["AFollow"]),
      showTagPopper(refId) {
        let ref = this.$refs[refId];
        if (ref === null) {
          return
        }
        if (ref instanceof Array) {
          ref = ref[0]
        }
        if (ref && ref.draw === null) {
          ref.load();
        }
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
      async follow(id) {
        let result = await this.AFollow({
          followerId: id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.draw.user.focus = result.data
      },
      addTag() {
        if (this.inputTag === null || this.inputTag === "") {
          this.inputTag = "";
          return
        }
        if (this.drawForm.tagList.indexOf(this.inputTag) !== -1) {
          this.inputTag = "";
          this.$message({
            message: "不能重复添加"
          });
          return
        }
        this.drawForm.tagList.push(this.inputTag);
        this.inputTag = "";
      },
      removeTag({value}) {
        this.drawForm.tagList.removeIndex(value)
      },
      async save() {
        this.editLoading = true;
        let result = await this.AUpdate(this.drawForm);
        this.editLoading = false;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.$notify({message: `修改成功`});
        this.isShowEdit = false;
        this.draw = result.data;
        this.reset();
      },
      reset() {
        let drawForm = Object.assign({}, this.draw);
        drawForm.tagList = drawForm.tagList.map(item => item.name);
        drawForm.isPrivate = drawForm.private;
        this.drawForm = drawForm
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .page {
    padding: 24px 0;
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    .left-box {
      width: 850px;
      float: left;
      .img-card {
        position: relative;
        height: 850px;
        .like {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: @big-font-size;
        }
      }
    }
    .right-box {
      @width: 250px;
      width: @width;
      float: right;
      .user-card {
        .user-bk {
          height: @width / 2;
          background-color: @border-color;
        }
        @head-img-height: 80px;
        @head-img-border: 2px;
        .head-box {
          img {
            height: @head-img-height;
            width: @head-img-height;
            border: @head-img-border solid @white;
            border-radius: 50%;
          }
        }
        .user-info-box {
          width: calc(100% - @head-img-height);
          padding: 0 0 0 10px;
          .nickname {
            .ellipsis()
          }
          .introduction {
            font-size: @small-font-size;
            margin-top: 10px;
            .ellipsis()
          }
        }
      }
      .info-card {
        padding: 10px 20px;
        font-size: @default-font-size;
        .name {
          .ellipsis()
        }
        .introduction {
          margin-top: 10px;
          font-size: @small-font-size;
          color: @gray;
        }
        .row {
          margin-top: 10px;
          font-size: @small-font-size;
          color: @gray;
          i {
            font-size: @small-font-size;
            color: @gray;
          }
          span {
            margin-left: 10px;
            vertical-align: baseline;
          }
        }
      }
      .tag-card {
        @spacing: 10px;
        padding: @spacing 20px;

        .tag-list {
          margin-bottom: -@spacing;
          .btn {
            margin-right: @spacing;
            margin-bottom: @spacing;
            line-height: 25px;
            padding: 0 1em;
          }
        }
      }
    }
  }

  .edit-dialog-content {
    width: 600px;
    margin-top: 15px;
    overflow: auto;
    height: 500px;
    .sub-name {
      line-height: 25px;
      margin-bottom: 5px;
    }
  }
</style>
