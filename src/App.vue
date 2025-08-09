<template>
  <RouterView />
  <GameOver />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import GameOver from './components/GameOver.vue'

// Check for special parameters on mount
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  
  // Check for reset parameter
  if (urlParams.get('reset') === 'true') {
    // Clear all localStorage data
    localStorage.clear()
    
    // Remove the reset parameter from URL and redirect
    const url = new URL(window.location.href)
    url.searchParams.delete('reset')
    window.location.href = url.toString()
  }
  
  // Check for alloweverycode parameter
  if (urlParams.get('alloweverycode') === 'true') {
    // Store flag in localStorage
    localStorage.setItem('allowEveryCode', 'true')
    
    // Remove the parameter from URL and redirect
    const url = new URL(window.location.href)
    url.searchParams.delete('alloweverycode')
    window.location.href = url.toString()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
  max-width: none;
  margin: 0;
  padding: 0;
}
</style>