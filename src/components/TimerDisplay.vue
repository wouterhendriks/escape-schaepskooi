<template>
  <div 
    class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    :class="{'animate-pulse': isCriticalTime}"
  >
    <div 
      class="bg-gray-900/90 backdrop-blur-md rounded-2xl px-8 py-4 border-2 shadow-2xl"
      :class="timerBorderClass"
    >
      <!-- Timer icon en label -->
      <div class="flex items-center justify-center gap-4 mb-2">
        <svg 
          class="w-6 h-6"
          :class="timerTextClass"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span 
          class="text-lg uppercase tracking-wider font-semibold"
          :class="timerTextClass"
        >
          Tijd Resterend
        </span>
      </div>
      
      <!-- Timer display -->
      <div 
        class="text-5xl font-mono font-bold text-center tracking-wider"
        :class="timerTextClass"
      >
        {{ timeFormatted.formatted }}
      </div>
      
      <!-- Progress bar -->
      <div class="mt-3 w-64">
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-1000"
            :class="progressBarClass"
            :style="`width: ${100 - timePercentage}%`"
          ></div>
        </div>
      </div>
      
      <!-- Warning message -->
      <div 
        v-if="isCriticalTime" 
        class="mt-2 text-center text-sm font-bold animate-pulse"
        :class="timerTextClass"
      >
        ⚠️ TIJD RAAKT OP! ⚠️
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTimer } from '../composables/useTimer';

const { timeFormatted, timePercentage, isCriticalTime } = useTimer();

// Dynamic classes based on time remaining
const timerBorderClass = computed(() => {
  if (isCriticalTime.value) {
    return `border-red-500`;
  } else if (timePercentage.value > 50) {
    return `border-amber-500`;
  } else {
    return `border-green-500`;
  }
});

const timerTextClass = computed(() => {
  if (isCriticalTime.value) {
    return `text-red-400`;
  } else if (timePercentage.value > 50) {
    return `text-amber-400`;
  } else {
    return `text-green-400`;
  }
});

const progressBarClass = computed(() => {
  if (isCriticalTime.value) {
    return `bg-gradient-to-r from-red-600 to-red-400`;
  } else if (timePercentage.value > 50) {
    return `bg-gradient-to-r from-amber-600 to-amber-400`;
  } else {
    return `bg-gradient-to-r from-green-600 to-green-400`;
  }
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>