<template>
  <div
    class="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden relative"
  >
    <!-- Timer Display -->
    <TimerDisplay />

    <!-- Achtergrond textuur - woonkamer thema -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-red-950 via-gray-900 to-black opacity-90"
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
        class="flex items-center gap-4 text-amber-500 mb-8 justify-center"
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
      <h2 class="text-6xl md:text-7xl font-bold text-red-500 mb-12 text-center">
        🛋️ De Woonkamer
      </h2>

      <!-- Content container -->
      <div
        class="bg-gray-800 bg-opacity-50 rounded-2xl p-12 shadow-2xl border-2 border-red-700/30"
      >
        <h3 class="text-4xl text-red-400 mb-6 text-center font-serif">
          Het Laatste Scrabble Spel
        </h3>

        <p
          class="text-gray-300 text-3xl mb-12 leading-relaxed font-serif"
          v-html="roomDescriptionHtml"
        ></p>

        <!-- Code invoer -->
        <div
          class="bg-gray-900/50 rounded-xl p-8 mb-8 border border-red-600/30"
        >
          <label class="block text-2xl text-red-400 mb-4"
            >Voer de 3-cijferige code in:</label
          >
          <input
            v-model="inputCode"
            type="text"
            inputmode="numeric"
            maxlength="3"
            class="w-full px-6 py-4 text-4xl text-center tracking-widest bg-gray-800 text-white rounded-xl border-2 border-red-600/50 focus:border-red-500 focus:outline-none"
            placeholder="_ _ _"
            @keyup.enter="checkCode"
          />
          <button
            @click="checkCode"
            class="w-full mt-6 px-8 py-4 bg-gradient-to-r from-red-700 to-red-600 text-white text-3xl font-bold rounded-xl hover:from-red-600 hover:to-red-500 transition-all transform hover:scale-105"
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
            :disabled="index > 0 && !hintsUsed[index - 1]"
            :class="[
              'flex-1 px-6 py-4 text-xl rounded-xl transition-all',
              hintsUsed[index]
                ? 'bg-green-900/50 text-green-300'
                : index > 0 && !hintsUsed[index - 1]
                ? 'bg-gray-900/50 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50',
            ]"
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
          ← Terug naar overzicht
        </button>
        <button
          v-if="isCompleted"
          @click="goToNext"
          class="px-12 py-6 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 text-white text-2xl font-bold rounded-xl hover:from-yellow-500 hover:via-green-600 hover:to-blue-600 transition-all duration-300 hover:scale-110 transform animate-bounce shadow-2xl"
        >
          🎉 ESCAPE ROOM VOLTOOID! 🏆
        </button>
      </div>

      <!-- Victory overlay wanneer voltooid -->
      <div v-if="isCompleted" class="fixed inset-0 pointer-events-none z-50">
        <div class="absolute top-20 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
          <h1 class="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-pulse">
            GEFELICITEERD!
          </h1>
          <p class="text-3xl md:text-4xl text-white mt-4 font-bold drop-shadow-2xl">
            Je hebt alle puzzels opgelost! 🎊
          </p>
          <div class="mt-6 bg-black/50 rounded-xl px-8 py-4 backdrop-blur-md">
            <p class="text-2xl text-yellow-400 font-bold">
              ⏱️ Tijd gebruikt: {{ finalTimeDisplay || timeFormatted.formatted }}
            </p>
            <p class="text-xl text-green-400 mt-2">
              De timer is gestopt - geniet van je overwinning!
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio elementen voor achtergrondmuziek -->
    <audio ref="backgroundMusic" loop preload="auto">
      <source src="/audio/garden-ambient.mp3" type="audio/mpeg" />
    </audio>

    <audio ref="successSound" preload="auto">
      <source src="/audio/success.mp3" type="audio/mpeg" />
    </audio>

    <audio ref="errorSound" preload="auto">
      <source src="/audio/error.mp3" type="audio/mpeg" />
    </audio>

    <!-- Extra victory sounds met loop -->
    <audio ref="applauseSound" loop preload="auto">
      <source src="/audio/applause.mp3" type="audio/mpeg" />
    </audio>

    <audio ref="fanfareSound" loop preload="auto">
      <source src="/audio/fanfare.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { azureSpeech } from "../services/azureSpeech";
import TimerDisplay from "./TimerDisplay.vue";
import confetti from 'canvas-confetti';
import { useTimer } from '../composables/useTimer';

const router = useRouter();
const { stop: stopTimer, timeFormatted } = useTimer();
const backgroundMusic = ref(null);
const successSound = ref(null);
const errorSound = ref(null);
const applauseSound = ref(null);
const fanfareSound = ref(null);
const isNarrating = ref(false);

// Puzzle data
const roomTitle = `De Woonkamer - Het Laatste Scrabble Spel`;
const roomDescription = `In de woonkamer hangt al jaren dezelfde foto: acht mensen rond de tafel, gebogen over een spel. Niemand weet meer wanneer deze foto genomen is, of wie deze mensen waren.\n\nMaar oude bewoners fluisteren over 'het spel dat nooit eindigde'. Over letters die belangrijker waren dan woorden. Over een waarde die meer betekende dan punten.\n\nZe hebben iets achtergelaten,' zegt men. 'Verspreid, verstopt, bewaard voor betere tijden. Acht stukjes van een groter geheel. Wie ze vindt en hun werkelijke waarde begrijpt, ontdekt het laatste geheim van De Schaepskooi.\n\nDe foto kijkt zwijgend toe. Acht gezichten, acht geheimen. Het spel wacht nog steeds op zijn laatste beurt...`;

const solutionCode = `144`; // De juiste code
const hints = [
  `Zoek achter en onder meubels`,
  `Tel alle punten van de letters op`,
  `Het totaal is 144`,
];

// Zoeklocaties voor Scrabble letters
const searchLocations = ref([
  { id: 1, name: "Achter de bank", searched: false, hasLetter: true },
  { id: 2, name: "Onder het kleed", searched: false, hasLetter: true },
  { id: 3, name: "In de boekenkast", searched: false, hasLetter: true },
  { id: 4, name: "Achter de schilderij", searched: false, hasLetter: true },
  { id: 5, name: "In de schoorsteenmantel", searched: false, hasLetter: true },
  { id: 6, name: "Onder de salontafel", searched: false, hasLetter: false },
  { id: 7, name: "Achter de gordijnen", searched: false, hasLetter: true },
  { id: 8, name: "In de pianokruk", searched: false, hasLetter: true },
  { id: 9, name: "Op de vensterbank", searched: false, hasLetter: false },
  { id: 10, name: "Achter de TV", searched: false, hasLetter: false },
  { id: 11, name: "In de vaas", searched: false, hasLetter: true },
  { id: 12, name: "Onder de lamp", searched: false, hasLetter: false },
]);

// De 8 Scrabble letters met hun puntenwaarde
const scrabbleLetters = [
  { id: 1, letter: "H", value: 4 }, // H = 4 punten
  { id: 2, letter: "O", value: 1 }, // O = 1 punt
  { id: 3, letter: "O", value: 1 }, // O = 1 punt
  { id: 4, letter: "P", value: 3 }, // P = 3 punten
  { id: 5, letter: "V", value: 4 }, // V = 4 punten
  { id: 6, letter: "R", value: 1 }, // R = 1 punt
  { id: 7, letter: "E", value: 1 }, // E = 1 punt
  { id: 8, letter: "D", value: 2 }, // D = 2 punten
  // Totaal: 4+1+1+3+4+1+1+2 = 17 punten
  // Laten we het aanpassen voor 144
];

// Aangepaste letters voor totaal 144
const actualLetters = [
  { id: 1, letter: "Q", value: 10 }, // Q = 10 punten
  { id: 2, letter: "Z", value: 10 }, // Z = 10 punten
  { id: 3, letter: "X", value: 8 }, // X = 8 punten
  { id: 4, letter: "J", value: 8 }, // J = 8 punten
  { id: 5, letter: "K", value: 5 }, // K = 5 punten
  { id: 6, letter: "W", value: 4 }, // W = 4 punten
  { id: 7, letter: "Y", value: 4 }, // Y = 4 punten
  { id: 8, letter: "F", value: 4 }, // F = 4 punten
  // Totaal: 10+10+8+8+5+4+4+4 = 53
  // Hmm, laten we andere letters nemen
];

// Meer realistische combinatie voor 144
const finalLetters = [
  { id: 1, letter: "V", value: 20 },
  { id: 2, letter: "R", value: 20 },
  { id: 3, letter: "E", value: 20 },
  { id: 4, letter: "D", value: 20 },
  { id: 5, letter: "E", value: 20 },
  { id: 6, letter: "S", value: 20 },
  { id: 7, letter: "C", value: 12 },
  { id: 8, letter: "H", value: 12 },
  // Totaal: 20+20+20+20+20+20+12+12 = 144
];

// State
const inputCode = ref("");
const hintsUsed = ref([false, false, false]);
const message = ref("");
const messageClass = ref("");
const isCompleted = ref(false);
const hasPlayedNarration = ref(false);
const foundLetters = ref([]);
const finalTimeDisplay = ref('');

// Computed property om te checken of alle letters gevonden zijn
const allLettersFound = computed(() => {
  return foundLetters.value.length === 8;
});

const roomDescriptionHtml = computed(() =>
  roomDescription.replace(/\n/g, "<br>")
);

// Zoek op een locatie
const searchLocation = (locationId) => {
  const location = searchLocations.value.find((loc) => loc.id === locationId);
  if (!location || location.searched) return;

  location.searched = true;

  if (location.hasLetter && foundLetters.value.length < 8) {
    foundLetters.value.push(finalLetters[foundLetters.value.length]);
  }
};

onMounted(() => {
  // Load saved progress
  const saved = localStorage.getItem("escapeRoomWoonkamer");
  if (saved) {
    const data = JSON.parse(saved);
    // Zorg ervoor dat hintsUsed altijd correct is (3 hints)
    if (Array.isArray(data.hintsUsed) && data.hintsUsed.length === 3) {
      hintsUsed.value = data.hintsUsed;
    } else {
      hintsUsed.value = [false, false, false];
    }
    isCompleted.value = data.isCompleted || false;
    foundLetters.value = data.foundLetters || [];
    searchLocations.value = data.searchLocations || searchLocations.value;
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
    "escapeRoomWoonkamer",
    JSON.stringify({
      hintsUsed: hintsUsed.value,
      isCompleted: isCompleted.value,
      foundLetters: foundLetters.value,
      searchLocations: searchLocations.value,
    })
  );

  // Stop alle audio
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }
  if (applauseSound.value) {
    applauseSound.value.pause();
    applauseSound.value.currentTime = 0;
  }
  if (fanfareSound.value) {
    fanfareSound.value.pause();
    fanfareSound.value.currentTime = 0;
  }
  stopNarration();

  // Reset narration flag for next visit
  hasPlayedNarration.value = false;
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

const checkCode = () => {
  // Check if cheat mode is enabled
  const allowEveryCode = localStorage.getItem("allowEveryCode") === "true";

  if (inputCode.value === solutionCode || allowEveryCode) {
    // Correct!
    message.value = "✅ Gefeliciteerd! Je hebt alle kamers opgelost!";
    messageClass.value = "bg-green-600 text-white";
    isCompleted.value = true;

    // Stop de timer - het spel is voltooid!
    stopTimer();
    
    // Sla de eindtijd op
    const finalTime = timeFormatted.value.formatted;
    finalTimeDisplay.value = finalTime;
    localStorage.setItem('escapeRoomFinalTime', finalTime);
    console.log(`🏆 Escape Room voltooid in: ${finalTime}`);
    
    // Start de spectaculaire viering!
    startCelebration();

    // Speel alle victory sounds
    if (successSound.value) {
      successSound.value.play();
    }
    
    // Speel fanfare na 500ms (looped)
    setTimeout(() => {
      if (fanfareSound.value) {
        fanfareSound.value.volume = 0.4;
        fanfareSound.value.loop = true;
        fanfareSound.value.play().catch(err => console.log('Fanfare kon niet starten:', err));
      }
    }, 500);
    
    // Speel applaus na 1 seconde (looped)
    setTimeout(() => {
      if (applauseSound.value) {
        applauseSound.value.volume = 0.3;
        applauseSound.value.loop = true;
        applauseSound.value.play().catch(err => console.log('Applaus kon niet starten:', err));
      }
    }, 1000);

    // Save completion
    const progress = JSON.parse(
      localStorage.getItem("escapeRoomProgress") || "{}"
    );
    progress.woonkamer = true;
    localStorage.setItem("escapeRoomProgress", JSON.stringify(progress));

    // Set game as completed
    localStorage.setItem("escapeRoomCompleted", "true");
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
    // Timer met 5 minuten verminderen
    const event = new CustomEvent("useHint", { detail: { minutes: 5 } });
    window.dispatchEvent(event);
  }
};

const goBack = () => {
  stopNarration();
  // Stop victory sounds als ze spelen
  if (applauseSound.value && !applauseSound.value.paused) {
    applauseSound.value.pause();
    applauseSound.value.currentTime = 0;
  }
  if (fanfareSound.value && !fanfareSound.value.paused) {
    fanfareSound.value.pause();
    fanfareSound.value.currentTime = 0;
  }
  router.push("/room1");
};

const goToNext = () => {
  stopNarration();
  // Stop victory sounds als ze spelen
  if (applauseSound.value && !applauseSound.value.paused) {
    applauseSound.value.pause();
    applauseSound.value.currentTime = 0;
  }
  if (fanfareSound.value && !fanfareSound.value.paused) {
    fanfareSound.value.pause();
    fanfareSound.value.currentTime = 0;
  }
  // Ga naar een eindscherm of terug naar overzicht
  router.push("/");
};

// Spectaculaire viering functie
const startCelebration = () => {
  // Stop achtergrondmuziek definitief
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
    backgroundMusic.value.currentTime = 0;
  }

  // Start een lange confetti show
  const duration = 15 * 1000; // 15 seconden
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  // Functie voor random getallen
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Eerste grote explosie
  confetti({
    ...defaults,
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Daarna continu confetti
  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      // Muziek blijft uit - alleen de loop sounds blijven spelen
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Confetti van de linkerkant
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });

    // Confetti van de rechterkant
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);

  // Vuurwerk effect om de 2 seconden
  let fireworksCount = 0;
  const fireworksInterval = setInterval(() => {
    if (fireworksCount >= 7) {
      clearInterval(fireworksInterval);
      return;
    }
    
    // Vuurwerk explosie
    confetti({
      particleCount: 200,
      spread: 360,
      startVelocity: 45,
      origin: {
        x: randomInRange(0.2, 0.8),
        y: randomInRange(0.2, 0.6)
      },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
      gravity: 0.8,
      scalar: 1.2,
      drift: 0,
      ticks: 100
    });
    
    fireworksCount++;
  }, 2000);

  // Gouden sterren effect
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 360,
      startVelocity: 20,
      decay: 0.95,
      scalar: 1.2,
      colors: ['#FFD700', '#FFA500', '#FF8C00'],
      shapes: ['star'],
      gravity: 0.5,
      drift: 0,
      origin: { x: 0.5, y: 0.3 }
    });
  }, 1000);

  // Emoji confetti na 3 seconden
  setTimeout(() => {
    const scalar = 2;
    const emoji = confetti.shapeFromText({ text: '🎉', scalar });
    const emoji2 = confetti.shapeFromText({ text: '🎊', scalar });
    const emoji3 = confetti.shapeFromText({ text: '🏆', scalar });
    const emoji4 = confetti.shapeFromText({ text: '⭐', scalar });
    
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.96,
      startVelocity: 20,
      shapes: [emoji, emoji2, emoji3, emoji4],
      scalar
    };

    confetti({
      ...defaults,
      particleCount: 30,
      origin: { x: 0.5, y: 0.4 }
    });

    confetti({
      ...defaults,
      particleCount: 20,
      origin: { x: 0.2, y: 0.5 }
    });

    confetti({
      ...defaults,
      particleCount: 20,
      origin: { x: 0.8, y: 0.5 }
    });
  }, 3000);
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
