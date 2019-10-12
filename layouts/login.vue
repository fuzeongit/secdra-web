<template>
  <div>
    <nuxt />
  </div>
</template>
<script>
export default {
  middleware: ["loginRedirect"]
}
</script>
<style type="text/less" lang="less"></style>
