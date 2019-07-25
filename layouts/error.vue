<template>
  <div class="page" style="padding: 30px;">
    <!--<img src="../assets/image/error/404.jpg" v-if="error.statusCode===404">-->
    <!--<div  v-else>-->
        <!--{{error}}-->
    <!--</div>-->
    <div>
      <Radio v-model="c" label="123"></Radio>
      <Radio v-model="c" disabled label="132"></Radio>
      <Checkbox v-model="c" label="123" color="primary"></Checkbox>
      <Checkbox v-model="c" disabled label="132" color="primary"></Checkbox>
      <input type="text" class="input">
      <input type="text" class="input disabled">
      <Btn >456</Btn>
      <Btn disabled>456</Btn>
      <Btn flat>456</Btn>
      <Btn flat disabled>456</Btn>
      <Btn outline >456</Btn>
      <Btn outline disabled>456</Btn>
      <Btn icon>45</Btn>
      <Btn disabled icon>45</Btn>
      <Btn flat icon>45</Btn>
      <Btn flat disabled icon>45</Btn>
      <Btn outline icon>45</Btn>
      <Btn outline disabled icon>45</Btn>
    </div>
    <br>
    <div>
      <Radio v-model="c" label="123" big></Radio>
      <Radio v-model="c" disabled label="132" big></Radio>
      <Checkbox v-model="c" label="123" big></Checkbox>
      <Checkbox v-model="c" disabled label="132" big></Checkbox>
      <input type="text" class="input big" >
      <input type="text" class="input disabled big" >
      <Btn  big>456</Btn>
      <Btn disabled big>456</Btn>
      <Btn flat big>456</Btn>
      <Btn flat disabled big>456</Btn>
      <Btn outline  big>456</Btn>
      <Btn outline disabled big>456</Btn>
      <Btn icon big>45</Btn>
      <Btn disabled icon big>45</Btn>
      <Btn flat icon big>45</Btn>
      <Btn flat disabled icon big>45</Btn>
      <Btn outline icon big>45</Btn>
      <Btn outline disabled icon big>45</Btn>
    </div>
    <br>
    <div>
      <Radio v-model="c" label="123" small></Radio>
      <Radio v-model="c" disabled label="132" small></Radio>
      <Checkbox v-model="c" label="123" small></Checkbox>
      <Checkbox v-model="c" disabled label="132" small></Checkbox>
      <input type="text" class="input small">
      <input type="text" class="input disabled small">
      <Btn  small>456</Btn>
      <Btn disabled small>456</Btn>
      <Btn flat small>456</Btn>
      <Btn flat disabled small>456</Btn>
      <Btn outline  small>456</Btn>
      <Btn outline disabled small>456</Btn>
      <Btn icon small>45</Btn>
      <Btn disabled icon small>45</Btn>
      <Btn flat icon small>45</Btn>
      <Btn flat disabled icon small>45</Btn>
      <Btn outline icon small @click="d=new Date('2018/08/08')">45</Btn>
      <Btn outline disabled icon small>45</Btn>

    </div>

    <div style="padding:300px">
    <DateInput v-model="d" color="primary"></DateInput>
  </div>
    <div>
      <DateInput></DateInput>
    </div>
    <br>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    name: "error",
    data(){
      return {
        c:true,
        d:new Date()
      }
    },
    mounted(){
      console.error(this.error)
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";

  .page {
    background-color: @white;
  }
</style>
