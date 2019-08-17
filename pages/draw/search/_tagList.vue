<template>
  <div class="page">
    <DrawList :page="page" :list="list" :pageLoading="pageLoading" @paging="paging" @collection="collection"
              @follow="follow"></DrawList>
    <CornerButtons>
      <Popper placement="top-end" trigger="click" offset="0,20px" positionFixed>
        <div class="filter-box">
          <div class="input-group">
            <h5 class="sub-name">精准搜索：</h5>
            <Checkbox is-switch v-model="filterForm.precise"  color="primary"></Checkbox>
          </div>
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <Field block color="primary" v-model="filterForm.name"></Field>
          </div>
          <div class="input-group center">
            <Btn @click="filter" color="primary">筛选</Btn>
            <Btn @click="reset" color="primary">重置</Btn>
          </div>
        </div>
        <Btn icon big shadow color="white" slot="reference">
          <i class="icon s-filter"></i>
        </Btn>
      </Popper>
    </CornerButtons>
  </div>
</template>

<script>
  import {FliterForm, Pageable} from "../../../assets/script/model";
  import {mapActions} from "vuex"
  import DrawList from "../../../components/pages/shared/DrawList"
  import CornerButtons from "../../../components/pages/shared/CornerButtons"

  export default {
    components: {
      DrawList,
      CornerButtons
    },
    watchQuery: true,
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "tag");
      let pageable = new Pageable();
      pageable.size = 16;
      pageable.sort = "likeAmount,desc";
      let filterForm = new FliterForm(
        !!route.query.precise,
        route.query.name,
        route.query.startDate,
        route.query.endDate,
      );
      let {data: result} = await $axios.get(`/draw/paging`, {
        params: Object.assign({
          tagList: route.params.tagList
        }, pageable, filterForm)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        page: result.data,
        list: result.data.content,
        pageable,
        filterForm
      }
    },
    data() {
      return {
        pageLoading: false
      }
    },
    methods: {
      ...mapActions("draw", ["APaging", "ACollection"]),
      ...mapActions("user", ["AFollow"]),
      /**
       * 获取分页数据
       * @returns {Promise<void>}
       */
      async paging() {
        if (this.pageLoading || this.page.last) {
          return
        }
        let sourcePage = ++this.pageable.page;
        this.pageLoading = true;
        let result = await this.APaging(Object.assign({
            tagList: this.$route.params.tagList
          }, this.pageable, this.filterForm)
        );
        this.pageLoading = false;
        let data = result.data;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          this.pageable.page = sourcePage;
          return
        }
        this.page = data;
        this.list.merge(data.content)
      },
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
      },
      async filter() {
        this.$router.replace({
          path: `/draw/search/${encodeURIComponent(this.$route.params.tagList)}`, query: {
            precise: this.filterForm.precise ? 1 : undefined,
            name: this.filterForm.name,
            startDate: this.filterForm.startDate,
            endDate: this.filterForm.endDate
          }
        });
      },
      reset() {
        this.$router.replace(`/draw/search/${encodeURIComponent(this.$route.params.tagList)}`);
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .filter-box {
    width: 300px;
    padding: 15px;
  }
</style>
