// กำหนดชื่อ Cache
const CACHE_NAME = "offline-logic-cache-v1";

// กำหนดรายการไฟล์ที่จะแคชล่วงหน้า
const urlsToCache = [
  "/", // หน้าแรก
  "/index.html",
  "/assets/index-xxxxxxxx.js", // ชื่อไฟล์ JavaScript ที่ถูก build (ต้องใส่ชื่อที่ถูกต้อง)
  "/assets/index-xxxxxxxx.css", // ชื่อไฟล์ CSS ที่ถูก build (ต้องใส่ชื่อที่ถูกต้อง)
  "/favicon.svg",
];

// Event: install - เมื่อ Service Worker ถูกติดตั้ง
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Event: fetch - ดักจับคำขอจากเบราว์เซอร์
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // ถ้ามีไฟล์ใน Cache ให้ส่งกลับจาก Cache เลย
      if (response) {
        return response;
      }
      // ถ้าไม่มีใน Cache ให้ไปดึงจากเครือข่าย
      return fetch(event.request);
    })
  );
});
