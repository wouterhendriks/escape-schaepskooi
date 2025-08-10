<template>
  <div
    class="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden relative"
  >
    <!-- Fullscreen background image -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/bg.jpg')"
    ></div>

    <!-- Dark overlay voor contrast -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Vignette effect voor focus -->
    <div
      class="absolute inset-0"
      style="
        background: radial-gradient(
          circle at center,
          transparent 0%,
          rgba(0, 0, 0, 0.4) 50%,
          rgba(0, 0, 0, 0.8) 100%
        );
      "
    ></div>

    <!-- Lightning flash effects -->
    <div class="lightning-container absolute inset-0 pointer-events-none">
      <div class="lightning-flash"></div>
      <div class="lightning-flash-delayed"></div>
    </div>

    <!-- Initial audio enable screen -->
    <div
      v-if="!audioEnabled"
      class="relative z-10 w-full h-full flex flex-col items-center justify-center px-12"
    >
      <div
        class="backdrop-blur-xl bg-black/60 rounded-3xl px-20 py-20 border border-white/20 shadow-2xl text-center"
      >
        <h2 class="text-5xl md:text-6xl font-bold text-red-500 mb-8">
          Welkom bij de Escape Room
        </h2>
        <p class="text-gray-300 text-2xl mb-12">
          Klik om de ervaring te starten met geluid en effecten
        </p>
        <button
          @click="enableAudio"
          class="px-20 py-8 bg-gradient-to-r from-green-700 to-green-600 text-white text-4xl font-bold uppercase tracking-wider border-4 border-green-500 hover:from-green-600 hover:to-green-500 transition-all duration-300 hover:scale-105 transform rounded-xl"
        >
          <span class="flex items-center gap-4">
            <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clip-rule="evenodd"
              />
            </svg>
            Start
          </span>
        </button>
      </div>
    </div>

    <!-- Start scherm - verschijnt na audio enable -->
    <div
      v-else-if="!experienceStarted"
      class="relative z-10 w-full h-full flex flex-col items-center justify-center px-12 gap-12"
    >
      <!-- Glass effect container voor titel - met VEEL meer ruimte -->
      <div
        class="bbg-black/40 rounded-3xl px-20 py-16 border border-white/10 shadow-2xl"
      >
        <!-- Creepy titel met schaduw effecten - VEEL GROTER -->
        <h1
          class="text-8xl md:text-9xl font-bold mb-20 text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-2xl animate-flicker"
        >
          De Schaepskooi
        </h1>
      </div>

      <!-- Gloeiende start knop - met VEEL meer ruimte erboven via gap-32 -->
      <div class="relative inline-block">
        <div
          class="absolute inset-0 bg-red-600 blur-2xl animate-pulse opacity-50"
        ></div>
        <button
          @click="startExperience"
          class="relative px-24 py-10 bg-gradient-to-r from-red-900 to-red-800 text-white text-5xl font-bold uppercase tracking-wider border-4 border-red-600 hover:from-red-800 hover:to-red-700 transition-all duration-300 hover:scale-105 transform hover:-translate-y-2"
        >
          <span class="relative z-10">Start Ervaring</span>
        </button>
      </div>
    </div>

    <!-- Content container - verschijnt na klikken op Start Ervaring -->
    <div v-else class="relative z-10 max-w-7xl px-16">
      <!-- Stop Audio knop - rechtsonder -->
      <button
        v-if="isNarrating"
        @click="stopNarration"
        class="fixed bottom-8 right-8 z-50 px-8 py-4 bg-red-900 bg-opacity-90 text-white text-2xl font-bold rounded-xl hover:bg-red-800 transition-all duration-300 hover:scale-105 transform flex items-center gap-3 shadow-2xl border-2 border-red-700"
      >
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
        Stop Audio
      </button>
      <!-- Creepy verhaal container met glass effect - GROTER -->
      <div
        class="backdrop-blur-xl bg-black/60 p-20 rounded-2xl border-2 border-white/20 shadow-2xl"
      >
        <!-- Audio indicator - GROTER -->
        <div
          v-if="isNarrating"
          class="flex items-center gap-4 text-amber-500 mb-12 justify-center"
        >
          <svg
            class="w-12 h-12 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-2xl uppercase tracking-wider"
            >Verteller spreekt...</span
          >
        </div>

        <!-- Verhaal tekst - VEEL GROTER -->
        <div class="space-y-10 text-left">
          <p
            class="text-white/90 text-3xl leading-relaxed opacity-0 animate-fadeIn font-serif"
            style="animation-delay: 0.5s; animation-fill-mode: forwards"
          >
            <span
              class="text-6xl float-left mr-4 mt-2 text-red-500 drop-shadow-2xl"
              >H</span
            >et is 2025. Jullie hebben een brief ontvangen van notaris Van der
            Berg uit Voorthuizen. De familie Van Heugten heeft jullie
            uitgenodigd om een weekend door te brengen in hun vakantiehuis De
            Schaepskooi. Maar dit is geen gewone uitnodiging...
          </p>
          <p
            class="text-white/80 text-3xl leading-relaxed opacity-0 animate-fadeIn font-serif italic"
            style="animation-delay: 1.5s; animation-fill-mode: forwards"
          >
            "Beste gasten,
          </p>
          <p
            class="text-white/70 text-3xl leading-relaxed opacity-0 animate-fadeIn font-serif"
            style="animation-delay: 2.5s; animation-fill-mode: forwards"
          >
            In 1985 heeft mijn vader tijdens de renovatie van De Schaepskooi
            iets ontdekt. Hij sprak over een erfenis van de mysterieuze heer
            Prins uit 1900, maar stierf voordat hij het geheim kon onthullen. We
            weten alleen dat hij een ingenieus systeem van aanwijzingen heeft
            achtergelaten door het hele huis.
          </p>
          <p
            class="text-white/70 text-3xl leading-relaxed opacity-0 animate-fadeIn font-serif"
            style="animation-delay: 3.5s; animation-fill-mode: forwards"
          >
            Volgens zijn aantekeningen bevat het huis 10 verborgen locaties met
            puzzels. Alleen door ze allemaal op te lossen, kunnen jullie het
            familiegeheim ontrafelen. Jullie hebben 2 uur de tijd. Succes!
          </p>
          <p
            class="text-red-400 text-3xl leading-relaxed opacity-0 animate-fadeIn font-serif italic"
            style="animation-delay: 4.5s; animation-fill-mode: forwards"
          >
            Familie Van Heugten"
          </p>
        </div>
      </div>

      <!-- Start escape room knop - VEEL GROTER -->
      <div class="text-center mt-20">
        <div class="relative inline-block">
          <div
            class="absolute inset-0 bg-red-600 blur-3xl animate-pulse opacity-40"
          ></div>
          <button
            @click="startEscapeRoom"
            class="relative opacity-0 animate-fadeIn px-24 py-10 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white text-4xl font-bold uppercase tracking-wider border-4 border-red-600 hover:from-red-800 hover:via-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 transform shadow-2xl"
            style="animation-delay: 4.5s; animation-fill-mode: forwards"
          >
            <span class="flex items-center gap-6">
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"
                />
              </svg>
              Betreed de Escape Room
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Audio elementen -->

    <audio ref="clickSound" preload="auto">
      <source src="/audio/click-sound.mp3" type="audio/mpeg" />
    </audio>

    <audio ref="thunderSound" preload="auto">
      <source src="/audio/thunder.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { azureSpeech } from "../services/azureSpeech";
import { useTimer } from "../composables/useTimer";

const router = useRouter();
const { start: startTimer } = useTimer();
const backgroundMusic = ref(null);
const clickSound = ref(null);
const thunderSound = ref(null);
const isNarrating = ref(false);
const experienceStarted = ref(false);
const audioEnabled = ref(true); // Direct true voor Chrome met --autoplay-policy flag

// Het complete verhaal dat voorgelezen wordt
const storyText = `Het is 2025. Jullie hebben een brief ontvangen van notaris Van der Berg uit Voorthuizen. De familie Van Heugten heeft jullie uitgenodigd om een week door te brengen in hun vakantiehuis De Schaepskooi. Maar dit is geen gewone uitnodiging...

"Beste gasten,
In 1985 heeft mijn vader tijdens de renovatie van De Schaepskooi iets ontdekt. Hij sprak over een erfenis van de mysterieuze heer Prins uit 1900, maar stierf voordat hij het geheim kon onthullen. We weten alleen dat hij een ingenieus systeem van aanwijzingen heeft achtergelaten door het hele huis.

Volgens zijn aantekeningen bevat het huis 8 verborgen locaties met puzzels. Alleen door ze allemaal op te lossen, kunnen jullie het familiegeheim ontrafelen. Jullie hebben 2 uur de tijd. Succes!
Familie Van Heugten"`;

const enableAudio = () => {
  audioEnabled.value = true;

  // Start achtergrondmuziek meteen
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.2;
    backgroundMusic.value.play().catch((err) => {
      console.log(`Muziek kon niet starten:`, err);
    });
  }
};

const startExperience = () => {
  experienceStarted.value = true;

  // Muziek is al gestart, verhoog alleen volume indien nodig
  if (backgroundMusic.value && backgroundMusic.value.volume < 0.3) {
    backgroundMusic.value.volume = 0.3;
  }

  // Start narration na een korte delay
  setTimeout(() => {
    startNarration();
  }, 1000);
};

onMounted(() => {
  // Start lightning effects met random intervals
  startLightningEffects();

  // Start achtergrondmuziek direct (werkt met Chrome --autoplay-policy flag)
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.1; // Zachter: was 0.2
    backgroundMusic.value.play().catch((err) => {
      console.log(
        `Autoplay niet toegestaan, gebruik Chrome met --autoplay-policy flag:`,
        err
      );
    });
  }
});

const startLightningEffects = () => {
  // Sync thunder met CSS animation timing (11% van 4s = 440ms)
  const playThunderWithLightning = () => {
    // Wacht tot de flits begint (11% van 4000ms)
    setTimeout(() => {
      if (thunderSound.value && audioEnabled.value) {
        thunderSound.value.volume = 0.3;
        thunderSound.value.play().catch((err) => {
          console.log(`Thunder sound kon niet afspelen:`, err);
        });
      }
    }, 440); // Sync met CSS lightning animation
  };

  // Speel om de 4 seconden (sync met eerste lightning animation)
  playThunderWithLightning(); // Start meteen
  setInterval(playThunderWithLightning, 4000); // Herhaal elke 4s

  // Extra thunder voor tweede lightning (elke 6s)
  setTimeout(() => {
    setInterval(() => {
      if (thunderSound.value && audioEnabled.value) {
        thunderSound.value.volume = 0.25;
        thunderSound.value.play().catch((err) => {
          console.log(`Thunder sound 2 kon niet afspelen:`, err);
        });
      }
    }, 6000);
  }, 2660); // 2s delay + 11% van 6000ms
};

onUnmounted(() => {
  // Stop muziek en narration bij verlaten component
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }
  stopNarration();
});

const startNarration = async () => {
  // Fade muziek naar heel zacht
  if (backgroundMusic.value) {
    const fadeOut = setInterval(() => {
      if (backgroundMusic.value && backgroundMusic.value.volume > 0.05) {
        backgroundMusic.value.volume -= 0.02;
      } else {
        if (backgroundMusic.value) {
          backgroundMusic.value.volume = 0.05; // Blijf op zeer laag volume
        }
        clearInterval(fadeOut);
      }
    }, 50);
  }

  isNarrating.value = true;

  try {
    // Probeer Azure Speech te gebruiken
    await azureSpeech.speak(storyText, {
      style: "whispering", // Fluisterend voor mysterie
      rate: "0.85",
      pitch: "-10%", // Lagere stem
      volume: "95",
    });

    isNarrating.value = false;

    // Fade muziek weer omhoog na narration
    if (backgroundMusic.value) {
      const fadeIn = setInterval(() => {
        if (backgroundMusic.value && backgroundMusic.value.volume < 0.3) {
          backgroundMusic.value.volume += 0.02;
        } else {
          if (backgroundMusic.value) {
            backgroundMusic.value.volume = 0.3;
          }
          clearInterval(fadeIn);
        }
      }, 50);
    }
  } catch (error) {
    console.log(
      "Azure Speech niet beschikbaar, gebruik browser TTS als fallback"
    );

    // Fallback naar originele browser TTS code
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(storyText);
      utterance.lang = "nl-NL";
      utterance.rate = 0.85;
      utterance.pitch = 0.75;
      utterance.volume = 1.0;

      utterance.onend = () => {
        isNarrating.value = false;
        if (backgroundMusic.value) {
          const fadeIn = setInterval(() => {
            if (backgroundMusic.value && backgroundMusic.value.volume < 0.3) {
              backgroundMusic.value.volume += 0.02;
            } else {
              if (backgroundMusic.value) {
                backgroundMusic.value.volume = 0.3;
              }
              clearInterval(fadeIn);
            }
          }, 50);
        }
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        isNarrating.value = false;
        if (backgroundMusic.value) {
          backgroundMusic.value.volume = 0.3;
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  }
};

const stopNarration = () => {
  // Stop Azure Speech
  azureSpeech.stop();

  // Stop ook browser TTS voor zekerheid
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  isNarrating.value = false;

  // Zet muziek weer op normaal volume
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.3;
  }
};

const startEscapeRoom = () => {
  // Stop narration als die bezig is
  stopNarration();

  // Start de timer voor de escape room
  startTimer();

  // Speel click geluid
  if (clickSound.value) {
    clickSound.value.volume = 0.5;
    clickSound.value.play();
  }

  // Fade out muziek
  if (backgroundMusic.value) {
    const fadeOut = setInterval(() => {
      if (backgroundMusic.value && backgroundMusic.value.volume > 0.05) {
        backgroundMusic.value.volume -= 0.05;
      } else {
        if (backgroundMusic.value) {
          backgroundMusic.value.pause();
        }
        clearInterval(fadeOut);
      }
    }, 100);
  }

  // Navigeer naar eerste kamer na kort moment
  setTimeout(() => {
    router.push(`/room1`);
  }, 500);
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
}

@keyframes mist {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes mist-reverse {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out forwards;
}

.animate-gradient {
  animation: gradient 20s ease infinite;
}

.animate-mist {
  animation: mist 30s linear infinite;
}

.animate-mist-reverse {
  animation: mist-reverse 40s linear infinite;
}

.animate-flicker {
  animation: flicker 3s ease-in-out infinite;
}

/* Particle effect voor stof/as */
.particles span {
  position: absolute;
  display: block;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  animation: float 15s linear infinite;
  bottom: 0;
}

.particles span:nth-child(1) {
  left: 10%;
  animation-duration: 20s;
  animation-delay: 0s;
}

.particles span:nth-child(2) {
  left: 20%;
  animation-duration: 25s;
  animation-delay: 2s;
  width: 3px;
  height: 3px;
}

.particles span:nth-child(3) {
  left: 30%;
  animation-duration: 18s;
  animation-delay: 1s;
}

.particles span:nth-child(4) {
  left: 40%;
  animation-duration: 22s;
  animation-delay: 3s;
}

.particles span:nth-child(5) {
  left: 50%;
  animation-duration: 28s;
  animation-delay: 0.5s;
  width: 4px;
  height: 4px;
}

.particles span:nth-child(6) {
  left: 60%;
  animation-duration: 19s;
  animation-delay: 2.5s;
}

.particles span:nth-child(7) {
  left: 70%;
  animation-duration: 24s;
  animation-delay: 1.5s;
}

.particles span:nth-child(8) {
  left: 80%;
  animation-duration: 21s;
  animation-delay: 0s;
  width: 3px;
  height: 3px;
}

.particles span:nth-child(9) {
  left: 85%;
  animation-duration: 26s;
  animation-delay: 4s;
}

.particles span:nth-child(10) {
  left: 90%;
  animation-duration: 23s;
  animation-delay: 1s;
}

@keyframes float {
  0% {
    bottom: 0;
    opacity: 0;
    transform: translateX(0) rotate(0deg);
  }
  10% {
    opacity: 0.3;
  }
  50% {
    transform: translateX(100px) rotate(180deg);
  }
  90% {
    opacity: 0.3;
  }
  100% {
    bottom: 100vh;
    opacity: 0;
    transform: translateX(-100px) rotate(360deg);
  }
}

/* Lightning effects - korter en vaker */
@keyframes lightning {
  0%,
  100% {
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  11% {
    opacity: 1;
  }
  12% {
    opacity: 0;
  }
  13% {
    opacity: 0.8;
  }
  14% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  21% {
    opacity: 0.6;
  }
  22% {
    opacity: 0;
  }
}

.lightning-flash {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  animation: lightning 4s infinite; /* Was 8s */
  mix-blend-mode: screen;
  pointer-events: none;
}

.lightning-flash-delayed {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at top,
    rgba(200, 200, 255, 0.2) 0%,
    transparent 60%
  );
  opacity: 0;
  animation: lightning 6s infinite; /* Was 12s */
  animation-delay: 2s; /* Was 3s */
  mix-blend-mode: screen;
  pointer-events: none;
}
</style>
