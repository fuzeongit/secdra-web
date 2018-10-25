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
          @click="test"
          target="_blank"
          class="button--green">Documentation</a>
        <a

          target="_blank"
          class="button--grey" @click="click">GitHub</a>
      </div>
    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import axios from 'axios'
  export default {
    components: {
      Logo
    },
    data(){
      return {
        socket:null
      }
    },
    mounted() {
      console.log(this.$socket)
    },
    methods:{
      test(){
        axios.get("/api/user/get")
      },
      click(){
        this.$socket.emit('messageEvent', "fuck");
        this.$socket.on('send',(data)=>{
          console.log(data)
        })
      }
    }
  }
</script>

<style>


  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
  }
</style>
