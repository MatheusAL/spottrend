<template>
    <div v-if="!playerReady">
        <v-progress-circular
            :size="90"
            :width="7"
            color="green"
            indeterminate
        ></v-progress-circular>
    </div>
    <div v-else class="player">
        <div class="track-image mx-auto my-8">
            <v-img
                :src="track.album.images[0].url"
                width="250px"
                height="250px"
            ></v-img>
        </div>
        
        <div class="player-info mx-auto">
            <h1>{{ track.name }}</h1>
            <h3>{{ track.artists[0].name }}</h3>
             <div class="player-controls">
                <v-icon 
                    large
                    class="px-3"
                    @click="prevTrack"
                >
                    mdi-skip-previous
                </v-icon>
                <v-icon 
                    size="60"
                    class="px-3"
                    @click="play"
                >
                    {{ isPlaying ? 'mdi-pause' : 'mdi-play' }}
                </v-icon>
                <v-icon 
                    large
                    class="px-3"
                    @click="nextTrack"
                >
                    mdi-skip-next
                </v-icon>
            </div>
        </div>
        <div class="player-time">
            <p>{{ msToTime(progress) }} </p>
            <p>{{ msToTime(track.duration_ms) }}</p>
        </div>
        <div class="player-progress">
            <v-progress-linear
                value="0"
                class="player-progress"
                color="black"
                background-color="grey"
            >
            </v-progress-linear>
        </div>

       
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: 'Player',
    props: {
        track:{
            type: Object,
        },
        playlistURL: {
            type: String,
        }
    },
    created(){
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        const token = localStorage.getItem('access_token');
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            this.player = player;

            this.player.addListener('ready', ({ device_id }) => {
                this.transferPlayback(device_id);
                this.device_id = device_id;
                this.playerReady = true;
                console.log('Ready with Device ID', device_id);
            });

            this.player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            this.player.addListener('player_state_changed', ({
                position,
                duration,
                track_window: { current_track }
            }) => {
                
                console.log('Currently Playing', current_track);
                console.log('Position in Song', position);
                console.log('Duration of Song', duration);
            });


            this.player.connect();

        };
    },
    computed:{
        token(){
            return localStorage.getItem('access_token');
        }
    },
    data () {
        return{
            playerReady: false,
            isPlaying: false,
            progress: 0,
            player: null,
            device_id: '',
            songPlayingId: '',
        }
    },
    watch: {
        track:{
            deep: true,
            handler(){
                if(this.playerReady){
                    //if(this.isPlaying)
                        this.play();
                    
                    console.log(this.track);
                }
            }
        }
    },
    methods: {
        async transferPlayback(device_id){
            const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
            body: {
                device_ids: [device_id],
                play: false,
            }
            });
            if(response.status == '204'){
                console.log('Playback alterado');
            }
            
        },
        play () {
            if(!this.isPlaying) {
                //this.player.togglePlay();
                this.playMusic();
            }else{
                this.pause();
            }
        },
        async playMusic(){
            const uris = JSON.stringify({
                context_uri: this.playlistURL,
                offset: {
                    uri: this.track.uri,
                },
            });
            axios({
                url: `https://api.spotify.com/v1/me/player/play?device_id=${this.device_id}`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
                data: uris,
            })
            this.isPlaying = true;
            //this.songPlayingId = this.track.id;
        },
        async pause() {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${this.device_id}`,{},{ 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                
                }
            });
            console.log(response);
            this.isPlaying = false;
        },
        prevTrack(){
            this.player.getCurrentState().then(state => {
                if (!state) {
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                }

                this.songPlayingId = state.track_window.previous_tracks[0].id;
                console.log(state.track_window.previous_tracks);
                this.player.previousTrack();
                this.$emit('songChanged', this.songPlayingId);

            });
            
        },
        nextTrack(){
            this.player.getCurrentState().then(state => {
                if (!state) {
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                }

                this.songPlayingId = state.track_window.next_tracks[0].id;
                console.log(state.track_window.previous_tracks);
                this.player.nextTrack();
                this.$emit('songChanged', this.songPlayingId);
            });
            
            //this.$emit('songChanged', this.songPlayingId);
        },
        msToTime(duration) {
            var seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60);

            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return minutes + ":" + seconds;
        },
    },
}
</script>

<style scoped>
.player{
    border-radius: 20px;
    background-color: white;
    overflow-y: hidden;
    min-height: 65vh;
    color:grey;
}
.track-image {
    display: flex;
    align-items: center;
    width: 250px;
    height: 250px;
}
.player-info{
    display: flex;
    align-items: center;
    flex-direction: column;
}
.player-time{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 20px;
    margin-right: 20px;
}
.player-progress{
    display: flex !important;
    align-self: center;
    width: 98%;
    margin-left: 10px;
    margin-right: 10px;
}

</style>