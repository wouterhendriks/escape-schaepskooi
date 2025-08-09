<template>
  <div class="room-badkamer">
    <div class="room-header">
      <h1>De Badkamer</h1>
      <p class="room-subtitle">De Verdwenen Tegelzetter</p>
    </div>

    <div v-if="!showStory" class="story-intro">
      <p>Je staat in een oude badkamer met prachtige nieuwe tegels...</p>
      <button @click="showStory = true" class="story-button">
        Lees het verhaal
      </button>
    </div>

    <div v-else-if="!puzzleStarted" class="story-content">
      <div class="story-text">
        <p>
          Tijdens de renovatie van 1985 gebeurde er iets vreemds. Tegelzetter Johannes werkte weken aan deze badkamer. Op zijn laatste dag liet hij een briefje achter voor zijn opdrachtgever:
        </p>
        <p class="note">
          "De nieuwe tegels zijn prachtig, maar wat ik achter de oude vond… dat heb ik voor de zekerheid op vijf plekken verstopt. Zoek mijn aanwijzingen en volg ze precies op. Het getal dat je vindt, onthult waar mijn ontdekking ligt."
        </p>
        <p>
          Johannes werd nooit meer gezien. De familie vond zijn gereedschapskist, maar niet zijn briefjes. Tot vandaag…
        </p>
        <p>
          <strong>Zoek de vijf briefjes die Johannes achterliet. Samen vormen ze een opdracht die naar de code leidt.</strong>
        </p>
      </div>
      <button @click="puzzleStarted = true" class="start-button">
        Begin met zoeken
      </button>
    </div>

    <div v-else class="puzzle-area">
      <div class="notes-section">
        <h2>Verstopte Briefjes</h2>
        <p class="hint">Klik op verschillende plekken in de badkamer om briefjes te vinden</p>
        
        <div class="bathroom-grid">
          <div 
            v-for="location in hidingSpots" 
            :key="location.id"
            @click="searchLocation(location.id)"
            :class="['hiding-spot', location.found ? 'found' : '']"
          >
            {{ location.name }}
          </div>
        </div>

        <div v-if="foundNotes.length > 0" class="found-notes">
          <h3>Gevonden briefjes:</h3>
          <div v-for="note in foundNotes" :key="note.id" class="note-item">
            <span class="note-number">Briefje {{ note.id }}:</span>
            <span class="note-text">{{ note.text }}</span>
          </div>
        </div>

        <div v-if="foundNotes.length === 5" class="complete-message">
          <h3>Alle briefjes gevonden!</h3>
          <p>De opdracht is compleet: {{ getCompleteInstruction() }}</p>
          
          <div class="counting-section">
            <p>Tel de tegels volgens de instructies:</p>
            <div class="tile-counts">
              <div class="tile-row">
                <label>Zwarte tegels op de vloer:</label>
                <input v-model="tileCounts.black" type="number" min="0" />
              </div>
              <div class="tile-row">
                <label>Witte tegels boven de wastafel:</label>
                <input v-model="tileCounts.white" type="number" min="0" />
              </div>
              <div class="tile-row">
                <label>Blauwe tegels in de douchehoek:</label>
                <input v-model="tileCounts.blue" type="number" min="0" />
              </div>
              <div class="tile-row">
                <label>Gebroken tegels achter het toilet:</label>
                <input v-model="tileCounts.broken" type="number" min="0" />
              </div>
            </div>
            <button @click="checkCounts" class="check-button">
              Controleer totaal
            </button>
            
            <div v-if="showResult" class="result">
              <p v-if="isCorrect" class="success">
                Correct! Het totaal is inderdaad {{ totalCount }}. Dit is de code!
              </p>
              <p v-else class="error">
                Het totaal {{ totalCount }} klopt niet. Tel de tegels nog eens goed...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!codeFound" class="code-input-section">
        <h3>Voer de code in:</h3>
        <input 
          v-model="enteredCode" 
          type="text" 
          placeholder="4 cijfers"
          maxlength="4"
          @keyup.enter="checkCode"
        />
        <button @click="checkCode" class="submit-button">
          Controleer
        </button>
        <p v-if="wrongCode" class="error-message">
          Dat is niet de juiste code. Zoek verder!
        </p>
      </div>

      <div v-else class="success-section">
        <h2>🎉 Gefeliciteerd!</h2>
        <p>Je hebt het geheim van Johannes ontdekt!</p>
        <p class="final-message">
          Achter de losse tegel vind je een oud dagboek van de vorige bewoner...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showStory = ref(false)
const puzzleStarted = ref(false)
const enteredCode = ref('')
const wrongCode = ref(false)
const codeFound = ref(false)
const foundNotes = ref([])
const showResult = ref(false)
const isCorrect = ref(false)

const tileCounts = ref({
  black: '',
  white: '',
  blue: '',
  broken: ''
})

const totalCount = computed(() => {
  return (parseInt(tileCounts.value.black) || 0) +
         (parseInt(tileCounts.value.white) || 0) +
         (parseInt(tileCounts.value.blue) || 0) +
         (parseInt(tileCounts.value.broken) || 0)
})

const hidingSpots = ref([
  { id: 1, name: 'Achter de spiegel', found: false },
  { id: 2, name: 'Onder de wastafel', found: false },
  { id: 3, name: 'In de douchebak', found: false },
  { id: 4, name: 'Achter het toilet', found: false },
  { id: 5, name: 'Boven de deur', found: false },
  { id: 6, name: 'In het medicijnkastje', found: false },
  { id: 7, name: 'Achter de radiator', found: false },
  { id: 8, name: 'Onder het bad', found: false }
])

const notes = [
  { id: 1, text: 'Tel alle zwarte tegels op de vloer' },
  { id: 2, text: 'en de witte tegels boven de wastafel' },
  { id: 3, text: 'plus de blauwe tegels in de douchehoek' },
  { id: 4, text: 'en vergeet de gebroken tegels achter het toilet niet' },
  { id: 5, text: 'Het totaal is je code' }
]

const noteLocations = {
  1: 1,  // Note 1 behind mirror
  3: 2,  // Note 2 under sink
  5: 3,  // Note 3 in shower
  6: 4,  // Note 4 in medicine cabinet
  7: 5   // Note 5 behind radiator
}

function searchLocation(locationId) {
  const spot = hidingSpots.value.find(s => s.id === locationId)
  if (spot.found) return
  
  spot.found = true
  
  const noteId = noteLocations[locationId]
  if (noteId) {
    const note = notes.find(n => n.id === noteId)
    if (note && !foundNotes.value.find(n => n.id === note.id)) {
      foundNotes.value.push(note)
      foundNotes.value.sort((a, b) => a.id - b.id)
    }
  }
}

function getCompleteInstruction() {
  return foundNotes.value.map(n => n.text).join(' ')
}

function checkCounts() {
  showResult.value = true
  // The correct answer is 1900
  // This could be: 500 black + 600 white + 500 blue + 300 broken = 1900
  // Or any combination that adds up to 1900
  isCorrect.value = totalCount.value === 1900
  
  if (isCorrect.value) {
    enteredCode.value = '1900'
  }
}

function checkCode() {
  if (enteredCode.value === '1900') {
    codeFound.value = true
    wrongCode.value = false
    // Save completion to localStorage like other rooms
    const progress = JSON.parse(localStorage.getItem('escapeRoomProgress') || '{}')
    progress.badkamer = true
    localStorage.setItem('escapeRoomProgress', JSON.stringify(progress))
  } else {
    wrongCode.value = true
  }
}
</script>

<style scoped>
.room-badkamer {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.room-header {
  text-align: center;
  margin-bottom: 30px;
}

.room-header h1 {
  font-size: 2.5rem;
  color: #01579b;
  margin-bottom: 10px;
}

.room-subtitle {
  font-size: 1.2rem;
  color: #0277bd;
  font-style: italic;
}

.story-intro {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.story-button, .start-button {
  background: #0288d1;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 20px;
}

.story-button:hover, .start-button:hover {
  background: #0277bd;
}

.story-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.story-text p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 1.1rem;
}

.note {
  background: #fff3e0;
  padding: 15px;
  border-left: 4px solid #ff9800;
  font-style: italic;
  margin: 20px 0;
}

.puzzle-area {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.notes-section h2 {
  color: #01579b;
  margin-bottom: 10px;
}

.hint {
  color: #666;
  margin-bottom: 20px;
  font-style: italic;
}

.bathroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.hiding-spot {
  background: #e1f5fe;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.hiding-spot:hover {
  background: #b3e5fc;
  transform: scale(1.05);
}

.hiding-spot.found {
  background: #c8e6c9;
  border-color: #4caf50;
  cursor: default;
}

.found-notes {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.found-notes h3 {
  color: #01579b;
  margin-bottom: 15px;
}

.note-item {
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  background: white;
  border-radius: 5px;
}

.note-number {
  font-weight: bold;
  color: #0277bd;
  margin-right: 10px;
}

.complete-message {
  background: #e8f5e9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  border: 2px solid #4caf50;
}

.complete-message h3 {
  color: #2e7d32;
  margin-bottom: 10px;
}

.counting-section {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.tile-counts {
  margin: 20px 0;
}

.tile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.tile-row label {
  flex: 1;
  margin-right: 20px;
}

.tile-row input {
  width: 100px;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1.1rem;
  text-align: center;
}

.check-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.check-button:hover {
  background: #45a049;
}

.result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
}

.result.success {
  background: #c8e6c9;
  color: #2e7d32;
}

.result.error {
  background: #ffcdd2;
  color: #c62828;
}

.code-input-section {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.code-input-section h3 {
  color: #01579b;
  margin-bottom: 15px;
}

.code-input-section input {
  padding: 10px;
  font-size: 1.5rem;
  width: 150px;
  text-align: center;
  border: 2px solid #0288d1;
  border-radius: 5px;
  margin-right: 10px;
}

.submit-button {
  background: #0288d1;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background: #0277bd;
}

.error-message {
  color: #d32f2f;
  margin-top: 10px;
}

.success-section {
  text-align: center;
  padding: 30px;
  background: #e8f5e9;
  border-radius: 10px;
  margin-top: 20px;
}

.success-section h2 {
  color: #2e7d32;
  margin-bottom: 20px;
}

.final-message {
  font-size: 1.2rem;
  font-style: italic;
  color: #1b5e20;
  margin-top: 20px;
}

.success {
  color: #2e7d32;
  font-weight: bold;
}

.error {
  color: #c62828;
}
</style>