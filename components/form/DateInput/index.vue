<template>
  <div style="display: inline-flex">
    <Popper trigger="click" offset="-50px">
      <DatePicker v-model="date"></DatePicker>
      <div class="input" slot="reference"></div>
    </Popper>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        date: new Date()
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
