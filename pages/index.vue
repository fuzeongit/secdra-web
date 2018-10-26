<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        secdra-web
      </h1>
      <h2 class="subtitle">
        My unreal Nuxt.js project
      </h2>
      <div class="links">
        <a
          target="_blank"
          class="button--green">Documentation</a>
        <a

          target="_blank"
          class="button--grey">GitHub</a>
      </div>
    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue'

  export default {
    components: {
      Logo
    },
    data() {
      return {
      }
    },
    mounted() {
      // console.log(1);
      // console.log(this.$cookieUtil.get(""))
    },
    methods: {}
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
