<template>
  <v-app>
    <div ref="appl" class="application" >
      <v-container class="app-container">
        <h1 class="app-title">Spottrend</h1>
        <v-row class="justify-center">
          <v-col cols="6">
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
          <v-col>
            <v-card
              class="rounded-lg bg" 
              :elevation="18"
            >
              <Playlist 
                :playlist="playlist" 
                :country="country" 
                @changeBackground="updateBackground"
                @playTrack="sendMusicToPlayer"
              />
            </v-card>
          </v-col>
          <v-col >
            <v-card
              class="rounded-lg bg"
              :elevation="18" 
            >
              <Player 
                :track="trackComp" 
                :playlistURL="playlist.uri"
                :userStatus="userStatus"
                @songChanged="updateTrack"
              />
            </v-card>
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
      countrySearch: 'Mundo',
      loading: true,
      items: ['Mundo','Brasil', 'França', 'Mexico', 'Estados Unidos', 'Argentina', 'Espanha', 'Chile', 'Peru', 'Paraguai', 'Japao', 'Alemanha', 'Italia', 'Russia'],
      country: '',
      backgroundColor: [],
      backgroundColor1: "#000000",
      backgroundColor2: "#000000",
      backgroundColor3: "#000000",
      backgroundColor4: "#000000",
      track: {},
      userStatus: '',
    }
  },
  mounted() {
    this.token = localStorage.getItem('access_token');
    //if(this.token !== null){
    //}
    this.getPlaylist('37i9dQZEVXbMDoHDwVN2tF');
    this.getUserStatus();
  },
  computed: {
    trackComp(){
      return this.track;
    }
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
      this.country = this.countrySearch;
      
      this.country = this.country.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      this.loading = false;
    },
    async searchPlaylist() {
      this.loading = true;
      const searchTerm = `Top 50 - ${this.countrySearch}`;
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
      this.backgroundColor = palette;
      this.backgroundColor1 = `rgb(${this.backgroundColor[0][0]}, ${this.backgroundColor[0][1]}, ${this.backgroundColor[0][2]})`;
      this.backgroundColor2 = `rgb(${this.backgroundColor[1][0]}, ${this.backgroundColor[1][1]}, ${this.backgroundColor[1][2]})`;
      this.backgroundColor3 = `rgb(${this.backgroundColor[2][0]}, ${this.backgroundColor[2][1]}, ${this.backgroundColor[2][2]})`;
      this.backgroundColor4 = `rgb(${this.backgroundColor[3][0]}, ${this.backgroundColor[3][1]}, ${this.backgroundColor[3][2]})`;
      this.$refs.appl.style.backgroundImage = 'linear-gradient(to right top, '+ this.backgroundColor1+', '+this.backgroundColor2+', '+this.backgroundColor3+', '+this.backgroundColor4+')';
    },
    sendMusicToPlayer(track){
      this.track = track;
    },
    updateTrack(trackID){
      const newTrack = this.playlist.tracks.items.find(tr => tr.track.id === trackID);
      this.track = newTrack.track;
    },
    async getUserStatus(){
      const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      }});
      this.userStatus = response.data.product;
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

.bg{
  background-color: rgba(255,255,255,0.3)  !important;
}

</style>
