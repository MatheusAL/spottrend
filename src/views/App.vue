<template>
  <v-app>
    <!--<div ref="appl" class="application" v-bind:style="{ backgroundImage: bgimg }">!-->
    <div ref="appl" class="application" v-bind:style="{ backgroundImg }">
    <!--<div ref="appl" class="application" v-bind:style="{ backgroundImage: `linear-gradient(to right top, ${this.backgroundColor1}, ${this.backgroundColor2}, ${this.backgroundColor3}, ${this.backgroundColor4})`}">!-->
      <v-container class="app-container">
        <h1 class="app-title">Spottrend</h1>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="countrySearch"
              :items="items"
              color="white"
              solo
              return-object
              label="Search for a country"
              @change="searchPlaylist"
            >
              <template v-slot:prepend-inner>
                <v-icon class="search-icon">
                  mdi-magnify
                </v-icon>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row v-if="loading">
          <v-col cols="12">
            <v-progress-circular
            :size="90"
            :width="7"
            color="green"
            indeterminate
          ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col :elevation="24">
            <Playlist 
              :playlist="playlist" 
              :country="country" 
              v-on:changeBackground="updateBackground"
              @playTrack="sendMusicToPlayer"
            />
          </v-col>
          <v-col >
            <Player :elevation="24" :track="trackComp" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>

import axios from 'axios';
import Playlist from '../components/Playlist.vue'
import Player from '../components/Player.vue';

export default {
  name: 'App',
  components:{
    Playlist,
    Player
  },
  props: {
    msg: String
  },
  data: function () {
    return{
      token: '',
      playlist: [],
      countrySearch: '',
      loading: true,
      items: ['Brasil', 'França', 'Mexico', 'Inglaterra'],
      country: '',
      backgroundColor: [],
      backgroundColor1: "#000000",
      backgroundColor2: "#000000",
      backgroundColor3: "#000000",
      backgroundColor4: "#000000",
      track: {}
    }
  },
  mounted() {
    this.token = localStorage.getItem('access_token');
    if(this.token !== null){
      console.log(this.token);
    }
    this.getPlaylist('37i9dQZEVXbMDoHDwVN2tF');
  },
  computed: {
    backgroundImg: function() {
      console.log('update po');
      return {'background-image': `linear-gradient(to right top, ${this.backgroundColor[0]}, ${this.backgroundColor[1]}, ${this.backgroundColor[2]}, ${this.backgroundColor[3]})`}
    },
    bgimg() {
      return `linear-gradient(to right top, ${this.backgroundColor1}, ${this.backgroundColor2}, ${this.backgroundColor3}, ${this.backgroundColor4})`;
    },
    trackComp(){
      return this.track;
    }
    //track(){
      //return this.playlist.tracks.items[0].track;
    //}
  },
  methods:{
    async getPlaylist(playlistID) {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistID}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      }});
      this.playlist = response.data;
      this.country = this.playlist.name.split(" ").pop();
      this.country = this.country.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      this.loading = false;
    },
    async searchPlaylist() {
      this.loading = true;
      const searchTerm = `Top 50 - ${this.countrySearch}`;
      //console.log(searchTerm);
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=playlist`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      }});
      const playlistID = response.data.playlists.items.filter(playlist => playlist.owner.display_name === 'Spotify' && playlist.name.includes("Top 50 – "))[0].id;
      this.getPlaylist(playlistID);
    },
    updateBackground (palette) {
      //console.log('emitei tudo', palette);
      this.backgroundColor = palette;
      this.backgroundColor = this.backgroundColor.map(([r, g, b]) => ["#", r.toString(16), g.toString(16), b.toString(16)].join(""))
      this.backgroundColor1 = this.backgroundColor[0];
      this.backgroundColor2 = this.backgroundColor[1];
      this.backgroundColor3 = this.backgroundColor[2];
      this.backgroundColor4 = this.backgroundColor[3];
      //console.log(this.bgimg);
      //console.log(this.backgroundImg);
      //console.log(this.$refs.appl.style);
      //console.log('linear-gradient(to right top, '+ this.backgroundColor1+', '+this.backgroundColor2+', '+this.backgroundColor3+', '+this.backgroundColor4+')');
      this.$refs.appl.style.backgroundImage = 'linear-gradient(to right top, '+ this.backgroundColor1+', '+this.backgroundColor2+', '+this.backgroundColor3+', '+this.backgroundColor4+')';
      //console.log(this.$refs.appl.style);
      //his.forceRerender();
    },
    sendMusicToPlayer(track){
      this.track = track;

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.application{
  min-width: 100vw;
  min-height: 100vh;
  padding-top: 2em;
  color:white;
}


.app-title{
  font-size: 5em;
  display: flex;
  justify-content: center;
  margin-top: 18px;
  margin-bottom: 18px;
}
.search-icon{
  color:black !important;
}

.app-container{
  max-width: 1500px !important;
}

</style>
