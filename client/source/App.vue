<template>
    <h1>{{title}}</h1>
</template>

<script lang="ts">
import Vue from 'vue'

interface AppData {
    title: string;
}

export default Vue.extend({
    
    data(): AppData {
        return {
            title: "Title"
        }
    }
})
</script>

<style>
</style>
