<template>
  <div
    class="min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-start overflow-hidden relative py-8"
  >
    <TimerDisplay />
    <!-- Achtergrond textuur - tuin thema -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-green-950 via-gray-900 to-black opacity-90"
    ></div>

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

    <!-- Kamer container -->
    <div class="relative z-10 max-w-7xl w-full px-8 md:px-16">
      <!-- Audio indicator -->
      <div
        v-if="isNarrating"
        class="flex items-center gap-4 text-green-400 mb-6 justify-center"
      >
        <svg
          class="w-10 h-10 animate-pulse"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-xl uppercase tracking-wider"
          >Verteller spreekt...</span
        >
      </div>

      <!-- Kamer titel -->
      <h2
        class="text-5xl md:text-6xl font-bold text-green-400 mb-8 text-center"
      >
        <br /><br />
        🏡 De Tuin - Buitenhuisje
      </h2>

      <!-- Content container -->
      <div
        class="bg-gray-800 bg-opacity-50 rounded-2xl p-8 md:p-10 shadow-2xl border-2 border-green-600/30"
      >
        <!-- Verhaal -->
        <div class="mb-8">
          <h3 class="text-3xl text-green-400 mb-4 font-serif">
            Het Geheime Spel
          </h3>
          <div
            class="text-gray-300 text-xl leading-relaxed space-y-4 font-serif"
          >
            <p>
              De familie Van Heugten speelt al generaties lang een mysterieus
              spel in de tuin. Niemand weet precies hoe het werkt, maar oude
              foto's tonen altijd hetzelfde: jeu de boule ballen in vreemde
              patronen.
            </p>
            <p>
              Op een foto uit 1952 staat oude opa Van Heugten trots bij een
              balpatroon. Op een andere uit 1978 poseert de hele familie rond
              dezelfde opstelling. En vorig jaar... was het weer precies
              hetzelfde patroon.
            </p>
            <p>
              Vandaag vonden we een briefje in het buitenhuisje. Daarop staat
              alleen een vreemd patroon getekend. Geen uitleg, geen instructies.
              Alleen het patroon en een vraagteken.
            </p>
            <p class="italic text-green-300">Wat betekent het?</p>
          </div>
        </div>

        <!-- Code invoer -->
        <div class="bg-gray-900/50 rounded-xl p-8 mb-8">
          <label class="block text-2xl text-green-400 mb-4"
            >Voer de 4-cijferige code in:</label
          >
          <input
            v-model="inputCode"
            type="text"
            inputmode="numeric"
            maxlength="4"
            class="w-full px-6 py-4 text-4xl text-center tracking-widest bg-gray-800 text-white rounded-xl border-2 border-green-500/50 focus:border-green-400 focus:outline-none"
            placeholder="_ _ _ _"
            @keyup.enter="checkCode"
          />
          <button
            @click="checkCode"
            class="w-full mt-6 px-8 py-4 bg-gradient-to-r from-green-700 to-green-600 text-white text-3xl font-bold rounded-xl hover:from-green-600 hover:to-green-500 transition-all transform hover:scale-105"
          >
            Controleer Code
          </button>
        </div>

        <!-- Hints -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <button
            v-for="(hint, index) in hints"
            :key="index"
            @click="showHint(index)"
            :disabled="index > 0 && !hintsUsed[index - 1]"
            :class="[
              'px-6 py-4 text-lg rounded-xl transition-all',
              hintsUsed[index]
                ? 'bg-yellow-900/50 text-yellow-300'
                : index > 0 && !hintsUsed[index - 1]
                ? 'bg-gray-900/50 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-green-900/50 text-green-300 hover:bg-green-800/50',
            ]"
          >
            <span v-if="!hintsUsed[index]"
              >Hint {{ index + 1 }}<br />(-5 min)</span
            >
            <div v-else class="text-center">
              <span class="text-green-200 text-2xl font-bold">{{ hint }}</span>
            </div>
          </button>
        </div>

        <!-- Feedback messages -->
        <div
          v-if="message"
          :class="messageClass"
          class="text-center text-3xl font-bold p-6 rounded-xl mb-8"
        >
          {{ message }}
        </div>
      </div>

      <!-- Navigatie knoppen -->
      <div class="flex justify-between mt-8">
        <button
          @click="goBack"
          class="px-8 py-4 bg-gray-700 text-gray-300 text-xl rounded-xl hover:bg-gray-600 transition-all duration-300 hover:scale-105 transform"
        >
          ← Terug naar overzicht
        </button>
        <button
          v-if="isCompleted"
          @click="goToNext"
          class="px-8 py-4 bg-green-700 text-white text-xl rounded-xl hover:bg-green-600 transition-all duration-300 hover:scale-105 transform animate-pulse"
        >
          Volgende Kamer →
        </button>
      </div>
    </div>

    <!-- Audio elementen -->
    <audio ref="backgroundMusic" loop preload="auto">
      <source src="/audio/garden-ambient.mp3" type="audio/mpeg" />
    </audio>

    <audio ref="successSound" preload="auto">
      <source src="/audio/success.mp3" type="audio/mpeg" />
    </audio>

    <audio ref="errorSound" preload="auto">
      <source src="/audio/error.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import TimerDisplay from "./TimerDisplay.vue";

const router = useRouter();
const backgroundMusic = ref(null);
const successSound = ref(null);
const errorSound = ref(null);
const isNarrating = ref(false);

// Puzzle data
const roomTitle = "De Tuin - Het Geheime Spel";
const roomDescription = `De familie Van Heugten speelt al generaties lang een mysterieus spel in de tuin. Niemand weet precies hoe het werkt, maar oude foto's tonen altijd hetzelfde: jeu de boule ballen in vreemde patronen. Op een foto uit 1952 staat oude opa Van Heugten trots bij een balpatroon. Op een andere uit 1978 poseert de hele familie rond dezelfde opstelling. En vorig jaar... was het weer precies hetzelfde patroon. Vandaag vonden we een briefje in het buitenhuisje. Daarop staat alleen een vreemd patroon getekend. Geen uitleg, geen instructies. Alleen het patroon en een vraagteken.`;
const solution = "8236";
const hints = ["goud", "voorletter", "gooiuhhhh"];

// State
const inputCode = ref("");
const hintsUsed = ref([false, false, false]);
const message = ref("");
const messageClass = ref("");
const isCompleted = ref(false);
const hasPlayedNarration = ref(false);

onMounted(() => {
  // Check if previous rooms are completed
  const progress = JSON.parse(
    localStorage.getItem("escapeRoomProgress") || "{}"
  );

  // Load saved progress for this room
  const saved = localStorage.getItem("escapeRoomTuin");
  if (saved) {
    const data = JSON.parse(saved);
    if (Array.isArray(data.hintsUsed) && data.hintsUsed.length === 3) {
      hintsUsed.value = data.hintsUsed;
    } else {
      hintsUsed.value = [false, false, false];
    }
    isCompleted.value = data.isCompleted || false;
  }

  // Start achtergrondmuziek
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.1;
    backgroundMusic.value.play().catch((err) => {
      console.log(`Achtergrondmuziek kon niet starten:`, err);
    });
  }

  // Start narration alleen als niet eerder afgespeeld tijdens dit bezoek en kamer niet voltooid
  if (!isCompleted.value && !hasPlayedNarration.value) {
    setTimeout(() => {
      startNarration();
      hasPlayedNarration.value = true;
    }, 500);
  }
});

onUnmounted(() => {
  // Save progress
  localStorage.setItem(
    "escapeRoomTuin",
    JSON.stringify({
      hintsUsed: hintsUsed.value,
      isCompleted: isCompleted.value,
    })
  );

  // Stop muziek en narration
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }
  stopNarration();

  // Reset narration flag for next visit
  hasPlayedNarration.value = false;
});

const startNarration = () => {
  // Check of browser text-to-speech ondersteunt
  if ("speechSynthesis" in window) {
    // Fade muziek naar heel zacht tijdens narration
    if (backgroundMusic.value) {
      backgroundMusic.value.volume = 0.05;
    }

    isNarrating.value = true;

    // Combineer titel en beschrijving voor voorlezen
    const fullText = `${roomTitle}... ${roomDescription}`;
    const utterance = new SpeechSynthesisUtterance(fullText);

    // Configureer de stem voor mysterieuze sfeer
    utterance.lang = "nl-NL";
    utterance.rate = 0.9; // Langzamer voor spanning
    utterance.pitch = 0.85; // Iets lagere toon
    utterance.volume = 1.0;

    // Event handlers
    utterance.onend = () => {
      isNarrating.value = false;
      // Volume muziek weer omhoog na narration
      if (backgroundMusic.value) {
        backgroundMusic.value.volume = 0.1;
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      isNarrating.value = false;
      // Zet muziek terug bij error
      if (backgroundMusic.value) {
        backgroundMusic.value.volume = 0.1;
      }
    };

    // Start het voorlezen
    window.speechSynthesis.speak(utterance);
  } else {
    console.log("Text-to-speech wordt niet ondersteund in deze browser");
  }
};

const stopNarration = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isNarrating.value = false;
  }
  // Zet muziek weer op normaal volume
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.1;
  }
};

const checkCode = () => {
  // Check if cheat mode is enabled
  const allowEveryCode = localStorage.getItem("allowEveryCode") === "true";

  if (inputCode.value === solution || allowEveryCode) {
    // Correct!
    message.value = "✅ Correct! Het geheime spel is ontrafeld!";
    messageClass.value = "bg-green-600 text-white";
    isCompleted.value = true;

    if (successSound.value) {
      successSound.value.play();
    }

    // Save completion
    const progress = JSON.parse(
      localStorage.getItem("escapeRoomProgress") || "{}"
    );
    progress.tuin = true;
    localStorage.setItem("escapeRoomProgress", JSON.stringify(progress));
  } else {
    // Fout
    message.value = "❌ Helaas, probeer opnieuw (-2 min)";
    messageClass.value = "bg-red-600 text-white shake";

    if (errorSound.value) {
      errorSound.value.play();
    }

    // Timer met 2 minuten verminderen voor fout antwoord
    const event = new CustomEvent("useHint", { detail: { minutes: 2 } });
    window.dispatchEvent(event);
  }

  // Clear message after 3 seconds
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

const showHint = (index) => {
  // Check if previous hints have been used (sequential requirement)
  if (index > 0 && !hintsUsed.value[index - 1]) {
    return; // Can't use this hint yet
  }

  if (!hintsUsed.value[index]) {
    hintsUsed.value[index] = true;
    // Timer verminderen met 5 minuten
    const event = new CustomEvent("useHint", { detail: { minutes: 5 } });
    window.dispatchEvent(event);
  }
};

const goBack = () => {
  stopNarration();
  router.push("/room1");
};

const goToNext = () => {
  stopNarration();
  router.push("/room1");
};
</script>

<style scoped>
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
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.shake {
  animation: shake 0.5s;
}
</style>
