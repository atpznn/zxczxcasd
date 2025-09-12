<script setup>
import { ref, watch } from "vue";
import useCreateTeamPair from "./composables/usePair";
const pairer = useCreateTeamPair();
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function shuffleInnerArrays(nestedList) {
  if (!Array.isArray(nestedList)) {
    throw new Error("Input must be an array.");
  }
  for (const innerArray of nestedList) {
    if (Array.isArray(innerArray)) {
      shuffle(innerArray);
    }
  }

  return nestedList;
}
function extractWords(text) {
  if (typeof text !== "string") {
    return [];
  }
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
    const nameRegex = /^(?:\d+\.?\s*)?([^\n]+)/;
    let names = [];

    for (const line of lines) {
        const match = line.match(nameRegex);
        if (match && match[1]) {
            const name = match[1].trim();
            if (name.length > 0 && isNaN(parseInt(name))) {
                names.push(name);
            }
        }
    }
  return names;
}
const players = ref([]);
const select = ref([]);
const selectTeamLock = ref([]);
const result = ref([]);
const textLock=  ref( localStorage.getItem('player_lock'))
const text = ref( localStorage.getItem('player'));
processTextPlayer()
procesTextPlaterTeamLock()

const  playerLock = ref([])
function processTextPlayer(){
  players.value = extractWords(text.value);
  localStorage.setItem('player',text.value)
  select.value = players.value;
}
function procesTextPlaterTeamLock(){
  localStorage.setItem('player_lock',textLock.value)
  playerLock.value = extractWords(textLock.value)
  selectTeamLock.value = playerLock.value
}
watch(
  () => text.value,
  () => {
  processTextPlayer()
  }
);
watch(
  () => textLock.value,
  () => {
  procesTextPlaterTeamLock()
  }
);
function checkPlayer(player) {
  if (select.value.some((s) => s == player)) {
    select.value = select.value.filter((x) => x != player);
  } else {
    select.value.push(player);
  }
}
function checkPlayerTeamLock(player) {
  if (selectTeamLock.value.some((s) => s == player)) {
    selectTeamLock.value = selectTeamLock.value.filter((x) => x != player);
  } else {
    selectTeamLock.value.push(player);
  }
}
function pair() {
  result.value = []
  const resultPair = [];
  const { players, schedule } = pairer.getSet(select.value.length);
  const idUserMap = players.map((x, index) => ({
    id: x,
    name: index >= select.value.length ? "" : select.value[index],
  }));
  
  for (const set of schedule) {
    const _set = [];
    for (const team of set) {
      const player = [];
      for (const playerId of team) {
        const playerData = idUserMap.find((x) => x.id == playerId);
        player.push(playerData.name);
      }
      _set.push(player);
    }
    resultPair.push(_set);
  }

  for (const set of resultPair) {
    let resultSet = set 
    for (const lock of selectTeamLock.value) {
      resultSet.push(lock.split(" "))
    }
    result.value.push(resultSet)
  } 
  result.value = shuffleInnerArrays(result.value);
}
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen font-sans text-gray-800">
    <h1 class="text-2xl font-bold mb-4 text-center">ตัวจับคู่ทีม</h1>

    <div class="mb-6">
      <label
        for="players-input"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        ใส่รายชื่อผู้เล่น (คนละบรรทัด)
      </label>
      <textarea
        v-model="text"
        name="players-input"
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        rows="5"
      ></textarea>
       <label
        for="players-input"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        ใส่รายชื่อผู้เล่น (สำหรับล็อคคู่)
      </label>
       <textarea
        v-model="textLock"
        name="players-input"
        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        rows="5"
      ></textarea>
    </div>

    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">เลือกผู้เล่นที่ต้องการจับคู่</h2>
      <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="player in players"
          :key="player"
          class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm"
        >
          <input
            type="checkbox"
            :id="`player-${player}`"
            :checked="select.some((s) => s == player)"
            @change="() => checkPlayer(player)"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            :for="`player-${player}`"
            class="flex-grow text-sm font-medium text-gray-700"
          >
            {{ player }}
          </label>
        </div>
      </div>
       <div class="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 mt-2">
        <div
          v-for="player in playerLock"
          :key="player"
          class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm"
        >
          <input
            type="checkbox"
            :id="`player-${player}`"
            :checked="selectTeamLock.some((s) => s == player)"
            @change="() => checkPlayerTeamLock(player)"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            :for="`player-${player}`"
            class="flex-grow text-sm font-medium text-gray-700"
          >
            {{ player }}
          </label>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <button
        @click="pair"
        class="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        จับคู่
      </button>
    </div>

    <div v-if="result.length > 0">
      <h2 class="text-xl font-semibold mb-2">ผลลัพธ์การจับคู่</h2>
      <div
        v-for="(set, index) in result"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-sm mb-4"
      >
        <div class="font-bold text-lg mb-2">ชุดที่ {{ index + 1 }}</div>
        <div
          v-for="(team, teamIndex) in set"
          :key="teamIndex"
          class="text-gray-700 mb-1"
        >
          - {{ team.filter((x) => x != "").join(" คู่กับ ") }}
          {{ team.filter((x) => x != "").length == 1 ? "(เศษ)" : "" }}
        </div>
      </div>
    </div>
  </div>
</template>
