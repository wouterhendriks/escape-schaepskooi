<template>
  <div
    class="min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-start overflow-hidden relative pt-8 md:pt-12 lg:pt-16 pb-10"
  >
    <!-- Achtergrond textuur -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90"
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
    <div class="relative z-10 max-w-7xl w-full px-8 md:px-16 lg:px-24 xl:px-32">
      <!-- Audio indicator - GROTER -->
      <div
        v-if="isNarrating"
        class="flex items-center gap-4 text-amber-500 mb-8 lg:mb-10 justify-center"
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
        class="text-5xl md:text-7xl font-bold text-amber-500 mb-8 md:mb-12 lg:mb-16 text-center animate-pulse"
      >
        Kamers Overzicht
      </h2>

      <!-- Progress bar -->
      <div
        class="bg-gray-800 rounded-2xl p-6 md:p-8 lg:p-10 mb-12 md:mb-16 lg:mb-20"
      >
        <div class="flex justify-between items-center mb-6">
          <span class="text-2xl text-gray-300">Voortgang</span>
          <span class="text-2xl text-amber-400 font-bold"
            >{{ completedRooms }} / 10 kamers</span
          >
        </div>
        <div class="w-full bg-gray-700 rounded-full h-5 lg:h-6">
          <div
            class="bg-gradient-to-r from-green-600 to-green-400 h-5 lg:h-6 rounded-full transition-all duration-500"
            :style="`width: ${(completedRooms / 10) * 100}%`"
          ></div>
        </div>
      </div>

      <!-- Kamers grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-14">
        <!-- De Bar -->
        <div
          @click="goToRoom('bar')"
          class="bg-gray-800 bg-opacity-50 rounded-2xl p-6 md:p-10 lg:p-12 shadow-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 transform"
          :class="
            getRoomStatus('bar')
              ? 'border-green-500 bg-green-900/20'
              : 'border-amber-600 hover:bg-amber-900/20'
          "
        >
          <div class="flex justify-between items-start mb-4 md:mb-6 lg:mb-8">
            <h3
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400"
            >
              🍺 De Bar
            </h3>
            <span
              v-if="getRoomStatus('bar')"
              class="text-green-400 text-xl md:text-2xl"
              >✅</span
            >
          </div>
          <p
            class="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 md:mb-6"
          >
            De bar was het domein van oude heer Prins...
          </p>
          <div class="text-base md:text-lg lg:text-xl text-gray-400">
            Items: 5 | Code: 5 cijfers
          </div>
        </div>

        <!-- De Keuken -->
        <div
          @click="goToRoom('keuken')"
          class="bg-gray-800 bg-opacity-50 rounded-2xl p-6 md:p-10 lg:p-12 shadow-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 transform"
          :class="
            getRoomStatus('keuken')
              ? 'border-green-500 bg-green-900/20'
              : canAccessKeuken
              ? 'border-blue-600 hover:bg-blue-900/20'
              : 'border-gray-600 opacity-50 cursor-not-allowed'
          "
        >
          <div class="flex justify-between items-start mb-4 md:mb-6 lg:mb-8">
            <h3
              class="text-3xl md:text-4xl lg:text-5xl font-bold"
              :class="canAccessKeuken ? 'text-blue-400' : 'text-gray-500'"
            >
              🍽️ De Keuken
            </h3>
            <span
              v-if="getRoomStatus('keuken')"
              class="text-green-400 text-xl md:text-2xl"
              >✅</span
            >
            <span
              v-else-if="!canAccessKeuken"
              class="text-gray-500 text-xl md:text-2xl"
              >🔒</span
            >
          </div>
          <p
            class="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 md:mb-6"
            :class="!canAccessKeuken && 'opacity-50'"
          >
            In de keukenkast bewaarde de familie Van Heugten...
          </p>
          <div
            class="text-base md:text-lg lg:text-xl"
            :class="canAccessKeuken ? 'text-gray-400' : 'text-gray-600'"
          >
            Items: 4 | Code: 5 cijfers
          </div>
          <div
            v-if="!canAccessKeuken"
            class="mt-4 md:mt-6 lg:mt-8 text-red-400 text-base md:text-lg lg:text-xl"
          >
            ⚠️ Voltooi eerst De Bar
          </div>
        </div>

        <!-- Slaapkamer Beneden -->
        <div
          @click="goToRoom('slaapkamer')"
          class="bg-gray-800 bg-opacity-50 rounded-2xl p-6 md:p-10 lg:p-12 shadow-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 transform"
          :class="
            getRoomStatus('slaapkamer')
              ? 'border-green-500 bg-green-900/20'
              : canAccessSlaapkamer
              ? 'border-purple-600 hover:bg-purple-900/20'
              : 'border-gray-600 opacity-50 cursor-not-allowed'
          "
        >
          <div class="flex justify-between items-start mb-4 md:mb-6 lg:mb-8">
            <h3
              class="text-3xl md:text-4xl lg:text-5xl font-bold"
              :class="canAccessSlaapkamer ? 'text-purple-400' : 'text-gray-500'"
            >
              🛏️ Slaapkamer Beneden
            </h3>
            <span
              v-if="getRoomStatus('slaapkamer')"
              class="text-green-400 text-xl md:text-2xl"
              >✅</span
            >
            <span
              v-else-if="!canAccessSlaapkamer"
              class="text-gray-500 text-xl md:text-2xl"
              >🔒</span
            >
          </div>
          <p
            class="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 md:mb-6"
            :class="!canAccessSlaapkamer && 'opacity-50'"
          >
            De dochter van heer Prins verbleef hier. Haar geheim ligt verborgen...
          </p>
          <div
            class="text-base md:text-lg lg:text-xl"
            :class="canAccessSlaapkamer ? 'text-gray-400' : 'text-gray-600'"
          >
            Items: 4 briefjes | Code: 8 cijfers
          </div>
          <div
            v-if="!canAccessSlaapkamer"
            class="mt-4 md:mt-6 lg:mt-8 text-red-400 text-base md:text-lg lg:text-xl"
          >
            ⚠️ Voltooi eerst De Keuken
          </div>
        </div>

        <!-- De Tuin - Buitenhuisje -->
        <div
          @click="goToRoom('tuin')"
          class="bg-gray-800 bg-opacity-50 rounded-2xl p-6 md:p-10 lg:p-12 shadow-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 transform"
          :class="
            getRoomStatus('tuin')
              ? 'border-green-500 bg-green-900/20'
              : canAccessTuin
              ? 'border-green-600 hover:bg-green-900/20'
              : 'border-gray-600 opacity-50 cursor-not-allowed'
          "
        >
          <div class="flex justify-between items-start mb-4 md:mb-6 lg:mb-8">
            <h3
              class="text-3xl md:text-4xl lg:text-5xl font-bold"
              :class="canAccessTuin ? 'text-green-400' : 'text-gray-500'"
            >
              🏡 De Tuin - Buitenhuisje
            </h3>
            <span
              v-if="getRoomStatus('tuin')"
              class="text-green-400 text-xl md:text-2xl"
              >✅</span
            >
            <span
              v-else-if="!canAccessTuin"
              class="text-gray-500 text-xl md:text-2xl"
              >🔒</span
            >
          </div>
          <p
            class="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 md:mb-6"
            :class="!canAccessTuin && 'opacity-50'"
          >
            Het buitenhuisje was ooit de schuilplaats tijdens de oorlog...
          </p>
          <div
            class="text-base md:text-lg lg:text-xl"
            :class="canAccessTuin ? 'text-gray-400' : 'text-gray-600'"
          >
            Items: Jeu de boule patroon | Code: 4 cijfers
          </div>
          <div
            v-if="!canAccessTuin"
            class="mt-4 md:mt-6 lg:mt-8 text-red-400 text-base md:text-lg lg:text-xl"
          >
            ⚠️ Voltooi eerst Slaapkamer
          </div>
        </div>

        <!-- Meer kamers komen later -->
        <div
          class="md:col-span-2 bg-gray-800/30 rounded-2xl p-10 md:p-14 lg:p-16 border-2 border-gray-700"
        >
          <p class="text-gray-500 text-center text-xl md:text-2xl">
            🚧 Meer kamers komen binnenkort...
          </p>
        </div>
      </div>

      <!-- Tijdelijke terugknop - GROTER -->
      <div class="text-center mt-12 md:mt-16 lg:mt-20">
        <button
          @click="goBack"
          class="px-8 md:px-12 lg:px-16 py-4 md:py-6 lg:py-8 bg-gray-700 text-gray-300 text-xl md:text-2xl lg:text-3xl rounded-xl hover:bg-gray-600 transition-all duration-300 hover:scale-105 transform"
        >
          ← Terug naar intro
        </button>
      </div>
    </div>

    <!-- Audio elementen voor achtergrondmuziek -->
    <audio ref="backgroundMusic" loop preload="auto">
      <source src="/audio/room1-ambient.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const backgroundMusic = ref(null);
const isNarrating = ref(false);
const completedRoomsData = ref({});

// De tekst die voorgelezen wordt
const roomTitle = "Kamers Overzicht";
const roomDescription = `Welkom in het Geheim van De Schaepskooi. Je hebt 10 locaties om te onderzoeken.
Begin met De Bar en ontsluit langzaam alle geheimen van dit mysterieuze huis...`;

// Load completed rooms from localStorage
const loadProgress = () => {
  const saved = localStorage.getItem("escapeRoomProgress");
  if (saved) {
    completedRoomsData.value = JSON.parse(saved);
  }
};

// Computed property voor aantal voltooide kamers
const completedRooms = computed(() => {
  return Object.values(completedRoomsData.value).filter(
    (status) => status === true
  ).length;
});

// Check of een kamer is voltooid
const getRoomStatus = (roomId) => {
  return completedRoomsData.value[roomId] === true;
};

// Check of keuken toegankelijk is (bar moet eerst voltooid zijn)
const canAccessKeuken = computed(() => {
  return getRoomStatus("bar");
});

// Check of slaapkamer toegankelijk is (keuken moet eerst voltooid zijn)
const canAccessSlaapkamer = computed(() => {
  return getRoomStatus("keuken");
});

// Check of tuin toegankelijk is (slaapkamer moet eerst voltooid zijn)
const canAccessTuin = computed(() => {
  return getRoomStatus("slaapkamer");
});

// Navigeer naar een kamer
const goToRoom = (roomId) => {
  // Voor keuken: check eerst of bar is voltooid
  if (roomId === "keuken" && !canAccessKeuken.value) {
    // Shake animatie of waarschuwing
    return;
  }
  
  // Voor slaapkamer: check eerst of keuken is voltooid
  if (roomId === "slaapkamer" && !canAccessSlaapkamer.value) {
    // Shake animatie of waarschuwing
    return;
  }

  stopNarration();
  router.push(`/room/${roomId}`);
};

onMounted(() => {
  // Load progress from localStorage
  loadProgress();

  // Start achtergrondmuziek (zacht)
  if (backgroundMusic.value) {
    backgroundMusic.value.volume = 0.2;
    backgroundMusic.value.play().catch((err) => {
      console.log(`Achtergrondmuziek kon niet starten:`, err);
    });
  }

  // Check of narration al is afgespeeld in deze sessie
  const narrationPlayed = sessionStorage.getItem("room1NarrationPlayed");
  
  if (!narrationPlayed) {
    // Start narration na een korte delay
    setTimeout(() => {
      startNarration();
      // Markeer als afgespeeld voor deze sessie
      sessionStorage.setItem("room1NarrationPlayed", "true");
    }, 500);
  }
});

onUnmounted(() => {
  // Stop muziek en narration bij verlaten component
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }
  stopNarration();
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

    // Wacht even om beschikbare stemmen te laden
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      // Zoek naar Nederlandse stemmen
      const preferredVoices = [
        "Google Nederlands",
        "Microsoft Mark - Dutch (Netherlands)",
        "Xander",
        "Claire",
        "nl-NL",
      ];

      let selectedVoice = null;
      for (const preferred of preferredVoices) {
        selectedVoice = voices.find(
          (voice) =>
            voice.name.includes(preferred) || voice.lang.includes("nl-NL")
        );
        if (selectedVoice) break;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Room1 - Gebruikte stem: ${selectedVoice.name}`);
      }
    };

    // Probeer stem te zetten
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

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
        backgroundMusic.value.volume = 0.2;
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      isNarrating.value = false;
      // Zet muziek terug bij error
      if (backgroundMusic.value) {
        backgroundMusic.value.volume = 0.2;
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
    backgroundMusic.value.volume = 0.2;
  }
};

const goBack = () => {
  stopNarration();
  router.push(`/`);
};
</script>
