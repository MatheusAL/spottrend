<template>
    <v-card>
        <v-card-title>Player not authorized</v-card-title>
        <v-card-text>
            The Spotify Player functionality only works for premium users.
        </v-card-text>
        <v-card-actions>
            <v-btn
                @click="$emit('closeModal')"
            >
                Confirm
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'Modal'
}
</script>

<style scoped>

</style>