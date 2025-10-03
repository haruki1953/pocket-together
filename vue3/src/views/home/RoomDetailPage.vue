<template>
  <div>
    <h1>Room Detail Page</h1>
    <p v-if="route.params.id">Room ID: {{ route.params.id }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
