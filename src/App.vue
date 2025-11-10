<script setup>
import { reactive, ref } from "vue";
import TeamPairerPanel from "./components/TeamPairerPanel.vue";
import { shuffleInnerArrays } from "./share";

const textOriginal = reactive({
  text: localStorage.getItem("player") || "",
  textLock: localStorage.getItem("player_lock") || "",
});
const result = ref([]);

const show = ref(false);
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen font-sans text-gray-800">
    <h1 class="text-2xl font-bold mb-4 text-center">ตัวจับคู่ทีม</h1>
    <TeamPairerPanel
      :text="textOriginal.text"
      :text-lock="textOriginal.textLock"
      @onTeaming="
        (e) => {
          result = e;
          show = true;
        }
      "
    ></TeamPairerPanel>
    <!-- <div v-if="result.length != 0 && show">
      เพิ่มคู่มาทีหลัง
      <TeamPairerPanel
        :text="''"
        :text-lock="''"
        @onTeaming="
          (e) => {
            result = result.map((x) => [x, ...e.flatMap((x) => x)]);
            result = shuffleInnerArrays(result);
            show = false;
          }
        "
      ></TeamPairerPanel>
    </div> -->
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
