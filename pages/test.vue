<template>
  <div style="background-color: white">
    <RadioGroup v-model="a">
      <Radio :value="value1" valueKey="name" :disabled="true"  label="测试1"></Radio>
      <Radio :value="value2" valueKey="name"  label="测试2"></Radio>
    </RadioGroup>
    <CheckboxGroup v-model="b">
      <Checkbox :value="value1" valueKey="name" label="测试1"/>
      <Checkbox :value="value2" valueKey="name" :disabled="true" label="测试2"/>
      <Checkbox :value="value3" valueKey="name"  label="测试3"/>
    </CheckboxGroup>
    <Checkbox v-model="c" label="测试3" />
  </div>
</template>

<script>
  export default {
    layout: 'login',
    data() {
      return {
        value1: {name: "1"},
        value2: {name: "2"},
        value3: {name: "3"},
        a: {name: "1"},
        b: [{name: "2"}],
        c:false
      }
    },
    watch: {
      a(val) {
        console.log(val);
      },
      b(val){
        console.log(val);
      },
      c(val){
        console.log(val);
      }
    }
  }
</script>

<style scoped>

</style>
