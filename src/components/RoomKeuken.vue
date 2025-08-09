<template>
  <div
    class="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden relative"
  >
    <!-- Achtergrond textuur - keuken thema -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900 to-black opacity-90"
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
    <div class="relative z-10 max-w-7xl w-full px-16">
      <!-- Audio indicator - GROTER -->
      <div
        v-if="isNarrating"
        class="flex items-center gap-4 text-blue-400 mb-8 justify-center"
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

      <!-- Kamer titel - VEEL GROTER -->
      <h2
        class="text-6xl md:text-7xl font-bold text-blue-400 mb-12 text-center"
      >
        🍽️ De Keuken
      </h2>

      <!-- Content container -->
      <div
        class="bg-gray-800 bg-opacity-50 rounded-2xl p-12 shadow-2xl border-2 border-blue-600/30"
      >
        <p class="text-gray-300 text-3xl mb-12 leading-relaxed font-serif">
          Sinds de renovatie van 1985 gebeuren er vreemde dingen in de keuken.
          Elke ochtend ligt alles anders dan de avond ervoor... <br />
          <br />
          De oude dorpsbewoners fluisteren over heer Prins en zijn heilige
          ochtendritueel. Vijf voorwerpen, altijd in dezelfde volgorde. 'Wie
          mijn ritueel verstoort, vindt nooit rust,' zou hij gezegd hebben.<br /><br />
          Vannacht heeft zijn geest weer huisgehouden. Vijf voorwerpen liggen
          verspreid door de keuken. Vind ze en plaats ze in de juiste volgorde
          op het aanrecht. Let op de geheime markeringen..."
        </p>

        <!-- Voorwerpen-overzicht (fysiek ordenen, geen digitale bediening) -->
        <div
          class="bg-blue-900/20 rounded-xl p-8 mb-10 border border-blue-500/30"
        ></div>

        <!-- Code invoer -->
        <div class="bg-gray-900/50 rounded-xl p-8 mb-8">
          <label class="block text-2xl text-blue-400 mb-4"
            >Voer de 5-cijferige code in:</label
          >
          <input
            v-model="inputCode"
            type="text"
            maxlength="5"
            class="w-full px-6 py-4 text-4xl text-center bg-gray-800 text-white rounded-xl border-2 border-blue-500/50 focus:border-blue-400 focus:outline-none"
            placeholder="_ _ _ _ _"
            @keyup.enter="checkCode"
          />
          <button
            @click="checkCode"
            class="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white text-3xl font-bold rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all transform hover:scale-105"
          >
            Controleer Code
          </button>
        </div>

        <!-- Hints -->
        <div class="flex gap-4 mb-8">
          <button
            v-for="(hint, index) in hints"
            :key="index"
            @click="showHint(index)"
            :disabled="hintsUsed[index]"
            class="flex-1 px-6 py-4 bg-purple-900/50 text-purple-300 text-xl rounded-xl hover:bg-purple-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ hintsUsed[index] ? hint : `Hint ${index + 1} (-5 min)` }}
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
      <div class="flex justify-between mt-12">
        <button
          @click="goBack"
          class="px-12 py-6 bg-gray-700 text-gray-300 text-2xl rounded-xl hover:bg-gray-600 transition-all duration-300 hover:scale-105 transform"
        >
          ← Terug naar De Bar
        </button>
        <button
          v-if="isCompleted"
          @click="goToNext"
          class="px-12 py-6 bg-green-700 text-white text-2xl rounded-xl hover:bg-green-600 transition-all duration-300 hover:scale-105 transform animate-pulse"
        >
          Volgende Kamer →
        </button>
      </div>
    </div>

    <!-- Audio elementen voor achtergrondmuziek -->
    <audio ref="backgroundMusic" loop preload="auto">
      <source src="/audio/kitchen-ambient.mp3" type="audio/mpeg" />
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
import { azureSpeech } from "../services/azureSpeech";

const router = useRouter();
const backgroundMusic = ref(null);
const successSound = ref(null);
const errorSound = ref(null);
const isNarrating = ref(false);

// Puzzle data
const roomTitle = "De Keuken";
const roomDescription = `In de keukenkast bewaarde de familie Van Heugten de oude serviesset. Maar waarom staan sommige borden en kopjes in een vreemde volgorde?`;
const solution = "68934"; // 5-cijferige code voor deze kamer
const totalItems = 5;
const hints = [
  "Dingen liggen waar ze niet horen",
  "Wouwie krijgt hoofdpijn als ie dit niet heeft",
  "De volgorde staat op de voorwerpen",
];

// State
const itemsFound = ref(0);
const inputCode = ref("");
const hintsUsed = ref([false, false, false]);
const message = ref("");
const messageClass = ref("");
const isCompleted = ref(false);

onMounted(() => {
  // Check if previous room is completed
  const progress = JSON.parse(
    localStorage.getItem("escapeRoomProgress") || "{}"
  );
  if (!progress.bar) {
    // Redirect to previous room if not completed
    router.push("/room/bar");
    return;
  }

  // Load saved progress
  const saved = localStorage.getItem("escaperoom-keuken");
  if (saved) {
    const data = JSON.parse(saved);
    itemsFound.value = data.itemsFound || 0;
    // Zorg ervoor dat hintsUsed altijd correct is (3 hints)
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

  // Check of narration al is afgespeeld in deze sessie
  const narrationPlayed = sessionStorage.getItem("keukenNarrationPlayed");
  
  // Start narration alleen als niet eerder afgespeeld en kamer niet voltooid
  if (!isCompleted.value && !narrationPlayed) {
    setTimeout(() => {
      startNarration();
      // Markeer als afgespeeld voor deze sessie
      sessionStorage.setItem("keukenNarrationPlayed", "true");
    }, 500);
  }
});

onUnmounted(() => {
  // Save progress
  localStorage.setItem(
    "escaperoom-keuken",
    JSON.stringify({
      itemsFound: itemsFound.value,
      hintsUsed: hintsUsed.value,
      isCompleted: isCompleted.value,
    })
  );

  // Stop muziek en narration
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }
  stopNarration();
});

const startNarration = async () => {
  isNarrating.value = true;

  // Fade muziek
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.05;
  }

  const fullText = `${roomTitle}... ${roomDescription}`;

  try {
    await azureSpeech.speak(fullText, {
      style: "whispering",
      rate: "0.9",
      pitch: "-5%",
    });
  } catch (error) {
    // Fallback to browser TTS
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = "nl-NL";
      utterance.rate = 0.9;
      utterance.pitch = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  isNarrating.value = false;

  // Volume terug
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.1;
  }
};

const stopNarration = () => {
  azureSpeech.stop();
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  isNarrating.value = false;
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.1;
  }
};

const increaseItems = () => {
  if (itemsFound.value < totalItems) {
    itemsFound.value++;
  }
};

const decreaseItems = () => {
  if (itemsFound.value > 0) {
    itemsFound.value--;
  }
};

const checkCode = () => {
  if (inputCode.value === solution) {
    // Correct!
    message.value = "✅ Correct! De code is juist!";
    messageClass.value = "bg-green-600 text-white";
    isCompleted.value = true;

    if (successSound.value) {
      successSound.value.play();
    }

    // Save completion
    const progress = JSON.parse(
      localStorage.getItem("escapeRoomProgress") || "{}"
    );
    progress.keuken = true;
    localStorage.setItem("escapeRoomProgress", JSON.stringify(progress));
  } else {
    // Fout
    message.value = "❌ Helaas, probeer opnieuw";
    messageClass.value = "bg-red-600 text-white shake";

    if (errorSound.value) {
      errorSound.value.play();
    }
  }

  // Clear message after 3 seconds
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

const showHint = (index) => {
  if (!hintsUsed.value[index]) {
    hintsUsed.value[index] = true;
    // Hier zou je de timer met 5 minuten kunnen verminderen
    const event = new CustomEvent("useHint", { detail: { minutes: 5 } });
    window.dispatchEvent(event);
  }
};

const goBack = () => {
  stopNarration();
  router.push("/room/bar");
};

const goToNext = () => {
  stopNarration();
  // Voor nu terug naar overzicht
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
