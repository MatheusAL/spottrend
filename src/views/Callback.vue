<template>
    <v-progress-circular
        :size="70"
        color="green"
        indeterminate
    ></v-progress-circular>
</template>

<script>
export default {
    name: 'Callback',
    mounted() {
        var hashParams = {};
        var e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
        while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        console.log(hashParams);
        // return hashParams;
        const token = hashParams.access_token;
        localStorage.setItem('access_token', token);
        window.location.assign("http://localhost:8080/app");
    }
}
</script>

<style>

</style>