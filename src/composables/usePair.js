// Function 1: สร้างลิสต์ผู้เล่น
// Pure Function - รับค่า n และคืนค่าเป็น array ใหม่ ไม่เปลี่ยนแปลงค่าภายนอก
function createPlayers(n) {
  if (n <= 0) {
    return [];
  }
  return Array.from({ length: n }, (_, i) => i + 1);
}

// Function 2: ปรับจำนวนผู้เล่นให้หารด้วยจำนวนคู่ได้ลงตัว
// Pure Function - รับค่า n และ pair และคืนค่าใหม่ ไม่เปลี่ยนแปลงค่าภายนอก
function adjustPlayerCount(n, pair) {
  if (pair <= 0) {
    return n;
  }
  let adjustedCount = n;
  while (adjustedCount % pair !== 0) {
    adjustedCount++;
  }
  return adjustedCount;
}

// Function 3: หมุนลิสต์ผู้เล่นสำหรับรอบถัดไป
// Pure Function - รับ array และคืน array ใหม่ที่หมุนแล้ว ไม่เปลี่ยนแปลง array เดิม
function rotatePlayers(players) {
  if (players.length <= 1) {
    return [...players];
  }
  const lastPlayer = players[players.length - 1];
  const rest = players.slice(0, players.length - 1);
  return [lastPlayer, ...rest];
}

// Function 4: สร้างคู่ในแต่ละรอบ
// Pure Function - รับ array และคืน array ใหม่ของคู่ที่สร้างขึ้น
function createPairs(players) {
  const pairs = [];
  const n = players.length;
  for (let i = 0; i < n / 2; i++) {
    const player1 = players[i];
    const player2 = players[n - 1 - i];
    pairs.push([player1, player2]);
  }
  return pairs;
}

// Function 5: สร้างตารางการแข่งขันทั้งหมด
// Pure Function - ใช้ฟังก์ชันย่อยอื่น ๆ เพื่อสร้าง schedule ที่สมบูรณ์
function generateSchedule(n) {
  if (n % 2 !== 0) {
    throw new Error("Number of players must be even.");
  }
  const players = createPlayers(n);
  const _players = [...players];
  const fixedPlayer = _players.pop();
  let rotatingPlayers = _players;
  const schedule = [];

  const numRounds = n - 1;
  for (let i = 0; i < numRounds; i++) {
    // สร้างคู่สำหรับรอบปัจจุบัน
    const currentPairs = [[fixedPlayer, rotatingPlayers[0]]];
    const remainingPlayers = rotatingPlayers.slice(1);
    currentPairs.push(...createPairs(remainingPlayers));

    schedule.push(currentPairs);

    // หมุนผู้เล่นสำหรับรอบถัดไป
    rotatingPlayers = rotatePlayers(rotatingPlayers);
  }

  return { schedule, players };
}

// --- ตัวอย่างการใช้งาน ---
export default function useCreateTeamPair() {
  const playersPerPair = 2;
  return {
    getSet(numberOfPlayers) {
      const n = adjustPlayerCount(numberOfPlayers, playersPerPair);
      const schedule = generateSchedule(n);
      return schedule;
    },
  };
}
