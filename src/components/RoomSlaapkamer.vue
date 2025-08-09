<template>
  <div
    class="min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-start overflow-hidden relative py-8"
  >
    <!-- Achtergrond textuur - slaapkamer thema -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-purple-950 via-gray-900 to-black opacity-90"
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
        class="text-5xl md:text-6xl font-bold text-purple-400 mb-8 text-center"
      >
        🛏️ Slaapkamer Beneden
      </h2>

      <!-- Content container -->
      <div
        class="bg-gray-800 bg-opacity-50 rounded-2xl p-8 md:p-10 shadow-2xl border-2 border-purple-600/30"
      >
        <!-- Verhaal - scrollbaar -->
        <div class="max-h-96 overflow-y-auto mb-8 pr-4">
          <h3 class="text-3xl text-purple-400 mb-4 font-serif">Het Mysterie van Isabella Prins</h3>
          <div class="text-gray-300 text-xl leading-relaxed space-y-4 font-serif">
            <p>
              Isabella Prins werd geboren toen de eerste sneeuw van 1893 viel. Haar moeder stierf bij de bevalling, waardoor ze opgroeide als enig kind van de strenge heer Prins. Men fluisterde dat ze haar moeders blauwe ogen had geërfd, maar haar vaders koppige karakter.
            </p>
            <p>
              Elke ochtend speelde Isabella precies een half uur piano - niet langer, niet korter. Ze begon altijd met vijf toonladders voordat ze aan haar lievelingsstukken begon. Haar vader eiste perfectie: 'Een dame van stand moet vijf talenten beheersen,' zei hij vaak. Isabella beheerste er maar drie: piano, borduren en Frans. Paardrijden en schilderen bleven haar een raadsel.
            </p>
            <p>
              In de zomer dat de oude eik door bliksem werd getroffen, ontmoette Isabella de schaapherder Willem. Hij was de derde zoon van de molenaar, geboren in het jaar dat de grote droogte heerste. Willem beweerde dat hij alle sterrenbeelden kende, maar Isabella betrapte hem toen hij de Grote Beer verwarde met Cassiopeia. 'Er zijn belangrijkere dingen dan sterren,' lachte hij toen.
            </p>
            <p>
              Haar vader had andere plannen. Op Isabella's zeventiende verjaardag kondigde hij aan dat ze zou trouwen met de koopman Van Der Berg, een weduwnaar die twee keer zo oud was als zij. De bruiloft stond gepland voor de eerste volle maan van november.
            </p>
            <p>
              Maar het noodlot sloeg toe. Op een stormachtige oktobernacht hoorde het dienstmeisje de klok driemaal slaan, gevolgd door het geluid van brekend glas. De volgende ochtend was Isabella's kamer leeg. Alleen haar dagboek lag open op bed, met een vreemde som: 'Mijn leeftijd plus zijn geboorte, gedeeld door moeders talenten, minus vaders lessen. Dat is waar jullie ons kunnen vinden.'
            </p>
            <p class="italic text-purple-300">
              Sommigen zeggen dat ze nog steeds door het huis dwaalt, wachtend tot iemand haar raadsel oplost...
            </p>
          </div>
        </div>

        <!-- Info box -->
        <div
          class="bg-purple-900/20 rounded-xl p-6 mb-8 border border-purple-500/30"
        >
          <p class="text-purple-300 text-xl text-center">
            Zoek de 4 briefjes verborgen in deze kamer. Elk briefje bevat een vraag over Isabella's verhaal.
          </p>
        </div>

        <!-- Code invoer -->
        <div class="bg-gray-900/50 rounded-xl p-8 mb-8">
          <label class="block text-2xl text-purple-400 mb-4"
            >Voer de 8-cijferige code in:</label
          >
          <input
            v-model="inputCode"
            type="text"
            inputmode="numeric"
            maxlength="8"
            class="w-full px-6 py-4 text-4xl text-center tracking-widest bg-gray-800 text-white rounded-xl border-2 border-purple-500/50 focus:border-purple-400 focus:outline-none"
            placeholder="_ _ _ _ _ _ _ _"
            @keyup.enter="checkCode"
          />
          <p class="text-gray-400 text-base mt-3 text-center">
            Combineer de antwoorden van de 4 vragen
          </p>
          <button
            @click="checkCode"
            class="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-600 text-white text-3xl font-bold rounded-xl hover:from-purple-600 hover:to-purple-500 transition-all transform hover:scale-105"
          >
            Controleer Code
          </button>
        </div>

        <!-- Hints -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <button
            v-for="(hint, index) in hints"
            :key="index"
            @click="showHint(index)"
            :disabled="hintsUsed[index]"
            class="px-6 py-4 bg-purple-900/50 text-purple-300 text-lg rounded-xl hover:bg-purple-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="!hintsUsed[index]">Hint {{ index + 1 }} (-5 min)</span>
            <div v-else class="text-left">
              <span class="text-purple-400 font-bold">{{ hint.label }}:</span>
              <br />
              <span class="text-purple-200">{{ hint.text }}</span>
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
      <source src="/audio/bedroom-ambient.mp3" type="audio/mpeg" />
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
const solution = "18972175"; // 1897, 2, 17, 5
const hints = [
  {
    label: "Schaapherder geboren",
    text: "Grote droogte = 3 jaar voor nieuwe eeuw (1900)"
  },
  {
    label: "Talenten miste",
    text: "Vader eiste 5 talenten, Isabella beheerste er 3"
  },
  {
    label: "Verschil leeftijd",
    text: "Weduwnaar was twee keer zo oud als de 17-jarige Isabella"
  },
  {
    label: "Muzikale oefeningen",
    text: "Ze begon altijd met toonladders voordat ze echt begon"
  }
];

// State
const inputCode = ref("");
const hintsUsed = ref([false, false, false, false]);
const message = ref("");
const messageClass = ref("");
const isCompleted = ref(false);

onMounted(() => {
  // Check if previous rooms are completed
  const progress = JSON.parse(
    localStorage.getItem("escapeRoomProgress") || "{}"
  );
  
  // Load saved progress for this room
  const saved = localStorage.getItem("escapeRoomSlaapkamer");
  if (saved) {
    const data = JSON.parse(saved);
    if (Array.isArray(data.hintsUsed) && data.hintsUsed.length === 4) {
      hintsUsed.value = data.hintsUsed;
    } else {
      hintsUsed.value = [false, false, false, false];
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
    "escapeRoomSlaapkamer",
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
    message.value = "✅ Correct! Isabella's geheim is ontrafeld!";
    messageClass.value = "bg-green-600 text-white";
    isCompleted.value = true;

    if (successSound.value) {
      successSound.value.play();
    }

    // Save completion
    const progress = JSON.parse(
      localStorage.getItem("escapeRoomProgress") || "{}"
    );
    progress.slaapkamer = true;
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

/* Custom scrollbar voor het verhaal */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
}
</style>