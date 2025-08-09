<template>
  <div v-if="isGameOver" class="game-over-overlay">
    <!-- Flashing red overlay -->
    <div class="flash-overlay"></div>

    <!-- Static noise effect -->
    <div class="noise-overlay"></div>

    <!-- Main panic container -->
    <div class="panic-container">
      <!-- Alarm icons flashing -->
      <div class="alarm-icons">
        <span class="alarm-icon">🚨</span>
        <span class="alarm-icon delay-1">⚠️</span>
        <span class="alarm-icon delay-2">🔴</span>
        <span class="alarm-icon delay-3">⏰</span>
      </div>

      <!-- Main message -->
      <div class="main-message glitch" data-text="TIJD IS OP!">TIJD IS OP!</div>

      <!-- Panic messages -->
      <div class="panic-messages">
        <div class="panic-text shake">GAME OVER</div>
        <div class="panic-text blink">JULLIE HEBBEN GEFAALD!</div>
        <div class="panic-text pulse">DE SCHAEPSKOOI IS VOORGOED VERLOREN</div>
      </div>

      <!-- Warning stripes -->
      <div class="warning-stripes top"></div>
      <div class="warning-stripes bottom"></div>

      <!-- Countdown expired message -->
      <div class="expired-message">
        <span class="expired-time">00:00:00</span>
        <span class="expired-text">TIJD VERSTREKEN</span>
      </div>

      <!-- Restart button -->
      <button @click="restartGame" class="restart-button">
        🔄 OPNIEUW PROBEREN
      </button>

      <!-- Sirene sound effect -->
      <audio ref="sirenSound" loop autoplay>
        <source src="/audio/alarm.mp3" type="audio/mpeg" />
      </audio>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isGameOver = ref(false);
const sirenSound = ref(null);

const handleTimeUp = () => {
  isGameOver.value = true;

  // Start alarm sound
  if (sirenSound.value) {
    sirenSound.value.volume = 0.3;
    sirenSound.value.play().catch((err) => {
      console.log(`Could not play alarm sound:`, err);
    });
  }

  // Add body class for extra effects
  document.body.classList.add("game-over-active");
};

const restartGame = () => {
  // Stop alarm
  if (sirenSound.value) {
    sirenSound.value.pause();
  }

  // Reset all game state
  localStorage.removeItem("escapeRoomTimer");
  localStorage.removeItem("escapeRoomProgress");
  localStorage.removeItem("escapeRoomBar");
  localStorage.removeItem("escapeRoomKeuken");
  localStorage.removeItem("escapeRoomSlaapkamer");
  localStorage.removeItem("escapeRoomTuin");
  localStorage.removeItem("escapeRoomHalletje");

  // Remove body class
  document.body.classList.remove("game-over-active");

  // Navigate to intro
  router.push("/");

  // Reload to reset everything
  window.location.reload();
};

onMounted(() => {
  window.addEventListener("timeUp", handleTimeUp);
});

onUnmounted(() => {
  window.removeEventListener("timeUp", handleTimeUp);
  document.body.classList.remove("game-over-active");

  if (sirenSound.value) {
    sirenSound.value.pause();
  }
});
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  overflow: hidden;
}

.flash-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: red;
  animation: flash 0.5s infinite;
  opacity: 0.3;
  pointer-events: none;
}

.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(255, 0, 0, 0.1) 2px,
    rgba(255, 0, 0, 0.1) 4px
  );
  animation: noise 0.2s infinite;
  pointer-events: none;
}

.panic-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #000000, #1a0000, #000000, #330000);
  animation: bgShift 2s infinite;
}

.alarm-icons {
  position: absolute;
  top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 4rem;
}

.alarm-icon {
  animation: spin 1s infinite linear, flash 0.3s infinite;
}

.alarm-icon.delay-1 {
  animation-delay: 0.1s;
}
.alarm-icon.delay-2 {
  animation-delay: 0.2s;
}
.alarm-icon.delay-3 {
  animation-delay: 0.3s;
}

.main-message {
  font-size: 8rem;
  font-weight: 900;
  color: #ff0000;
  text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000;
  margin-bottom: 2rem;
  position: relative;
  animation: glitchAnim 0.3s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  animation: glitch-1 0.5s infinite;
  color: #00ffff;
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.5s infinite;
  color: #ff00ff;
  z-index: -2;
}

.panic-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.panic-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffff00;
  text-transform: uppercase;
  background: rgba(255, 0, 0, 0.2);
  padding: 1rem 2rem;
  border: 3px solid #ff0000;
}

.panic-text.shake {
  animation: shake 0.3s infinite;
}

.panic-text.blink {
  animation: blink 0.5s infinite;
}

.panic-text.pulse {
  animation: pulseBig 1s infinite;
}

.warning-stripes {
  position: absolute;
  width: 100%;
  height: 100px;
  background: repeating-linear-gradient(
    -45deg,
    #ff0000,
    #ff0000 20px,
    #ffff00 20px,
    #ffff00 40px
  );
  animation: stripeMove 1s linear infinite;
}

.warning-stripes.top {
  top: 0;
}

.warning-stripes.bottom {
  bottom: 0;
}

.expired-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

.expired-time {
  font-size: 4rem;
  font-family: monospace;
  color: #ff0000;
  font-weight: bold;
  animation: blink 0.5s infinite;
}

.expired-text {
  font-size: 1.5rem;
  color: #ff6666;
  text-transform: uppercase;
  letter-spacing: 0.5rem;
}

.restart-button {
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  color: white;
  border: 3px solid #ffff00;
  border-radius: 10px;
  cursor: pointer;
  text-transform: uppercase;
  animation: pulseBig 1s infinite;
  transition: all 0.3s;
  margin-top: 2rem;
}

.restart-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px #ff0000;
}

/* Animations */
@keyframes flash {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes noise {
  0% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-5%, -5%);
  }
  20% {
    transform: translate(5%, 5%);
  }
  30% {
    transform: translate(-3%, 3%);
  }
  40% {
    transform: translate(3%, -3%);
  }
  50% {
    transform: translate(-5%, 5%);
  }
  60% {
    transform: translate(5%, -5%);
  }
  70% {
    transform: translate(-2%, -2%);
  }
  80% {
    transform: translate(2%, 2%);
  }
  90% {
    transform: translate(-1%, 1%);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes pulseBig {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glitchAnim {
  0% {
    text-shadow: 0.05em 0 0 #00ffff, -0.05em -0.025em 0 #ff00ff,
      0.025em 0.05em 0 #ffff00;
  }
  15% {
    text-shadow: 0.05em 0 0 #00ffff, -0.05em -0.025em 0 #ff00ff,
      0.025em 0.05em 0 #ffff00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #00ffff, 0.025em 0.025em 0 #ff00ff,
      -0.05em -0.05em 0 #ffff00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #00ffff, 0.025em 0.025em 0 #ff00ff,
      -0.05em -0.05em 0 #ffff00;
  }
  50% {
    text-shadow: 0.025em 0.05em 0 #00ffff, 0.05em 0 0 #ff00ff,
      0 -0.05em 0 #ffff00;
  }
  99% {
    text-shadow: 0.025em 0.05em 0 #00ffff, 0.05em 0 0 #ff00ff,
      0 -0.05em 0 #ffff00;
  }
  100% {
    text-shadow: -0.025em 0 0 #00ffff, -0.025em -0.025em 0 #ff00ff,
      -0.025em -0.05em 0 #ffff00;
  }
}

@keyframes glitch-1 {
  0% {
    clip: rect(44px, 9999px, 56px, 0);
    transform: skew(0.5deg);
  }
  5% {
    clip: rect(10px, 9999px, 90px, 0);
    transform: skew(0.8deg);
  }
  10% {
    clip: rect(60px, 9999px, 80px, 0);
    transform: skew(0.2deg);
  }
}

@keyframes glitch-2 {
  0% {
    clip: rect(65px, 9999px, 100px, 0);
    transform: skew(0.3deg);
  }
  5% {
    clip: rect(25px, 9999px, 90px, 0);
    transform: skew(0.6deg);
  }
  10% {
    clip: rect(40px, 9999px, 60px, 0);
    transform: skew(0.1deg);
  }
}

@keyframes stripeMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(40px);
  }
}

@keyframes bgShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>

<style>
/* Global styles when game over is active */
body.game-over-active {
  overflow: hidden !important;
}
</style>
