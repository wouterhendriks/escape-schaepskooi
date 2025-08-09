<template>
  <div
    class="min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-start overflow-hidden relative py-8"
  >
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

    <!-- Kamer container -->
    <div class="relative z-10 max-w-7xl w-full px-8 md:px-16">
      <!-- Kamer titel -->
      <h2
        class="text-5xl md:text-6xl font-bold text-green-400 mb-8 text-center"
      >
        🏡 De Tuin - Buitenhuisje
      </h2>

      <!-- Content container -->
      <div
        class="bg-gray-800 bg-opacity-50 rounded-2xl p-8 md:p-10 shadow-2xl border-2 border-green-600/30"
      >
        <!-- Verhaal -->
        <div class="mb-8">
          <h3 class="text-3xl text-green-400 mb-4 font-serif">Het Geheime Spel</h3>
          <div class="text-gray-300 text-xl leading-relaxed space-y-4 font-serif">
            <p>
              De familie Van Heugten speelt al generaties lang een mysterieus spel in de tuin. Niemand weet precies hoe het werkt, maar oude foto's tonen altijd hetzelfde: jeu de boule ballen in vreemde patronen.
            </p>
            <p>
              Op een foto uit 1952 staat oude opa Van Heugten trots bij een balpatroon. Op een andere uit 1978 poseert de hele familie rond dezelfde opstelling. En vorig jaar... was het weer precies hetzelfde patroon.
            </p>
            <p>
              Vandaag vonden we een briefje in het buitenhuisje. Daarop staat alleen een vreemd patroon getekend. Geen uitleg, geen instructies. Alleen het patroon en een vraagteken.
            </p>
            <p class="italic text-green-300">
              Wat betekent het?
            </p>
          </div>
        </div>

        <!-- Info box -->
        <div
          class="bg-green-900/20 rounded-xl p-6 mb-8 border border-green-500/30"
        >
          <p class="text-green-300 text-xl text-center">
            Zoek het patroon in het buitenhuisje. De jeu de boule ballen vertellen een verhaal...
          </p>
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
            :disabled="hintsUsed[index]"
            class="px-6 py-4 bg-green-900/50 text-green-300 text-lg rounded-xl hover:bg-green-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="!hintsUsed[index]">Hint {{ index + 1 }}<br />(-5 min)</span>
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

const router = useRouter();
const backgroundMusic = ref(null);
const successSound = ref(null);
const errorSound = ref(null);

// Puzzle data
const solution = "8236";
const hints = [
  "goud",
  "voorletter",
  "gooiuhhhh"
];

// State
const inputCode = ref("");
const hintsUsed = ref([false, false, false]);
const message = ref("");
const messageClass = ref("");
const isCompleted = ref(false);

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

  // Stop muziek
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }
});

const checkCode = () => {
  if (inputCode.value === solution) {
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
    // Timer verminderen met 5 minuten
    const event = new CustomEvent("useHint", { detail: { minutes: 5 } });
    window.dispatchEvent(event);
  }
};

const goBack = () => {
  router.push("/room1");
};

const goToNext = () => {
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