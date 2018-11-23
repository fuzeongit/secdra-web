<template>
  <div class="page">
    <!--<Pageable :totalPage="100" :currPage="currPage" @go="(page)=>{this.currPage = page}"></Pageable>-->
  </div>
</template>

<script>
  import PageableCom from '../../../components/global/Pageable'

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "collection";
    },
    components: {
      Pageable: PageableCom
    },
    data(){
      return{
        currPage:29
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
