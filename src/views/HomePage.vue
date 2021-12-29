<template>
  <div class="home">
    <div class="custom-shape-divider-top-1640363362">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
      </svg>
    </div>
    <div class="description">
      <h1 class="title">SPOTTREND</h1>
      <p class="content">This is a small application where you can see which songs are currently trending in different countries around the world!</p>
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
        <b class="footer-content">
          <a href="https://github.com/MatheusAL/spottrend">
            <v-icon>
              mdi-github
            </v-icon>
          </a>
        </b>
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
        //window.location.href ='https://backend-spottrend.herokuapp.com/login';
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
.custom-shape-divider-top-1640363362 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-top-1640363362 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 110px;
}

.custom-shape-divider-top-1640363362 .shape-fill {
    fill: #00E676;
}
</style>>
