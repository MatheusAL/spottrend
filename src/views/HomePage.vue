<template>
  <div class="home">
    <div class="description">
      <h1 class="title">SPOTTREND</h1>
      <p class="content">This is an app where you can see what songs are currently trending in different countries around the world</p>
      <v-btn
        class="ma-2 btn"
        block
        depressed
        x-large
        elevation="2"
        outlined
        dark
        @click="Login"
      >Join the party!</v-btn>
    </div> 
    <v-footer app bottom elevation="2" color="#00E676" height="35" padless fixed>
      <div class="footer">
        <b class="footer-content">Link pro github e dale</b>
      </div>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data: function () {
    return{
      token: '',
    }
  },
  methods: {
    Login() {
       window.location.href ='http://localhost:8888/login';
    }
  },
  mounted() {
    this.token = localStorage.getItem('access_token');
    if(this.token !== null){
      console.log(this.token);
    }
    console.log(this.token);
  }
}
</script>

<style scoped>
  .home{
    background-color: black;
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    
  }
  .description{
    color: white;
    place-items: center;
  }
  .title{
    color: #00E676;
    font-size: 12vh;
    display: flex;
    justify-content: center;
  }
  .content{
    margin: 25px;
  }
  .footer{
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
</style>>
