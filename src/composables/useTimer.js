import { ref, computed, onUnmounted } from 'vue';

// Global timer state - shared across all components
const totalSeconds = ref(null);
const isRunning = ref(false);
const timerInterval = ref(null);
const startTime = ref(null);

// Initialize timer state from localStorage if available
const initializeTimer = () => {
  const savedTimer = localStorage.getItem(`escapeRoomTimer`);
  if (savedTimer) {
    const data = JSON.parse(savedTimer);
    totalSeconds.value = data.totalSeconds;
    startTime.value = data.startTime;
    
    // If timer was running, calculate elapsed time
    if (data.isRunning && data.startTime) {
      const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
      totalSeconds.value = Math.max(0, data.totalSeconds - elapsed);
      
      // Restart timer if there's time left
      if (totalSeconds.value > 0) {
        start();
      }
    }
  } else {
    // Default to 2 hours (120 minutes)
    totalSeconds.value = 120 * 60;
  }
};

// Save timer state to localStorage
const saveTimer = () => {
  localStorage.setItem(`escapeRoomTimer`, JSON.stringify({
    totalSeconds: totalSeconds.value,
    isRunning: isRunning.value,
    startTime: startTime.value
  }));
};

// Start the timer
const start = () => {
  if (!isRunning.value && totalSeconds.value > 0) {
    isRunning.value = true;
    startTime.value = Date.now();
    
    timerInterval.value = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--;
        saveTimer();
        
        // Check if time is up
        if (totalSeconds.value === 0) {
          stop();
          // Trigger game over event
          window.dispatchEvent(new CustomEvent(`timeUp`));
        }
      }
    }, 1000);
    
    saveTimer();
  }
};

// Stop the timer
const stop = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  isRunning.value = false;
  startTime.value = null;
  saveTimer();
};

// Reduce timer by minutes (for hints)
const reduceTime = (minutes) => {
  const secondsToReduce = minutes * 60;
  totalSeconds.value = Math.max(0, totalSeconds.value - secondsToReduce);
  saveTimer();
  
  if (totalSeconds.value === 0) {
    stop();
    window.dispatchEvent(new CustomEvent(`timeUp`));
  }
};

// Reset timer to default
const reset = () => {
  stop();
  totalSeconds.value = 120 * 60; // 2 hours
  saveTimer();
};

// Format time for display
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return {
    hours: String(hours).padStart(2, `0`),
    minutes: String(minutes).padStart(2, `0`),
    seconds: String(secs).padStart(2, `0`),
    formatted: `${String(hours).padStart(2, `0`)}:${String(minutes).padStart(2, `0`)}:${String(secs).padStart(2, `0`)}`
  };
};

// Composable function
export function useTimer() {
  // Initialize on first use
  if (totalSeconds.value === null) {
    initializeTimer();
  }
  
  // Computed properties
  const timeLeft = computed(() => totalSeconds.value);
  const timeFormatted = computed(() => formatTime(totalSeconds.value));
  const isTimeRunning = computed(() => isRunning.value);
  const timePercentage = computed(() => {
    const maxTime = 120 * 60; // 2 hours in seconds
    return ((maxTime - totalSeconds.value) / maxTime) * 100;
  });
  
  // Check for critical time (less than 10 minutes)
  const isCriticalTime = computed(() => totalSeconds.value < 600);
  
  // Listen for hint usage
  const handleHintUsed = (event) => {
    if (event.detail && event.detail.minutes) {
      reduceTime(event.detail.minutes);
    }
  };
  
  // Add event listener for hints
  window.addEventListener(`useHint`, handleHintUsed);
  
  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener(`useHint`, handleHintUsed);
  });
  
  return {
    // State
    timeLeft,
    timeFormatted,
    isTimeRunning,
    timePercentage,
    isCriticalTime,
    
    // Methods
    start,
    stop,
    reduceTime,
    reset
  };
}