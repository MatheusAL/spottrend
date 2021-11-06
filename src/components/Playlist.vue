<template>
     <div class="playlist">
        <div class="playlist-header">
            <div class="playlist-title">
              <p>{{ playlist.name }}</p>
            </div>
            <div class="playlist-flag">
              <img ref="img" :src="getImgUrl(country)" height="50px" width="100px" alt="flag" />
            </div>
        </div>
        <v-spacer></v-spacer>
        <v-list class="ma-3 tracklist" two-line>
            <v-list-item
            v-for="track in playlist.tracks.items"
            :key="track.track.id"
            >
            <v-list-item-avatar>
              <v-img :src="track.track.album.images[0].url"></v-img>
            </v-list-item-avatar>
            <v-list-item-content class="track-info mx-3">
              <v-list-item-title v-text="track.track.name"></v-list-item-title>
              <v-list-item-subtitle v-text="track.track.artists[0].name"></v-list-item-subtitle>
            </v-list-item-content>
            
            <v-list-item-action>
                <v-list-item-action-text v-text="msToTime(track.track.duration_ms)"></v-list-item-action-text>
              </v-list-item-action>

            </v-list-item>
        </v-list>
    </div>
</template>
<script>
const { getPaletteFromURL } = require('color-thief-node');

export default {
  props: {
    playlist: Object,
    country: {
      type: String,
      default: 'Franca'
    }
  },
  data: function () {
    return {
      palette: [],
    }
  },
  watch: {
    country() {
      this.getColorPalette();
    }
  },
  mounted (){
    this.$nextTick(() => {
      (async () => {
          this.palette = await getPaletteFromURL(this.$refs.img.src);
          //console.log('emiti no filho', this.palette);
          console.log(this.palette);
          this.$emit('changeBackground', this.palette);
      })();
    })
  },
  methods:{
    msToTime(duration) {
      var seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60);

      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return minutes + ":" + seconds;
    },
    getImgUrl(pet) {
      var images = require.context('../assets/', false, /\.png$/)
      return images('./' + pet + ".png")
    },
    async getColorPalette() {
      this.palette = await getPaletteFromURL(this.$refs.img.src);
      this.$emit('changeBackground', this.palette);
      console.log('emiti no filho', this.palette);
    },
    convertColor(r, g, b){
      const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')

    }
  }
}
</script>

<style  scoped>

.playlist{
  border-radius: 20px;
  background-color: white;
  overflow-y: scroll;
  max-height: 65vh;
}

.playlist::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.playlist {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.playlist-header{
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 24px;
}

.playlist-title{
  font-weight: bold;
  font-size: calc(0.7rem + 0.5vw);;
  color: black;
  display: flex;
  align-items: center;
  width: 50%;
}

.playlist-flag{
  justify-content: flex-end;
  display: flex;
  width: 50%;
}
.track-info{
  margin-left: 8px;
}

.tracklist{

}
</style>