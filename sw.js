// Bé Vui Chơi — service worker: chơi offline + tự cập nhật ngầm
const CACHE = 'bevui-v4';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './apple-touch-icon-180.png', './icon-192.png', './icon-512.png', './favicon-32.png', './favicon.ico', './audio/bgmusic.mp3', './img/animals/dog.jpg', './img/animals/cat.jpg', './img/animals/cow.jpg', './img/animals/chicken.jpg', './img/animals/duck.jpg', './img/animals/pig.jpg', './img/vehicles/car.jpg', './img/vehicles/train.jpg', './img/vehicles/airplane.jpg', './img/vehicles/firetruck.jpg', './img/vehicles/bus.jpg', './img/vehicles/bicycle.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: mở ngay từ bộ nhớ đệm, đồng thời tải bản mới cho lần mở sau
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request).then(res => {
      if (res && (res.ok || res.type === 'opaque') && res.status !== 206) cache.put(e.request, res.clone()).catch(() => {});
      return res;
    }).catch(() => cached);
    return cached || network;
  }));
});
