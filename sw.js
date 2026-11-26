// Bé Vui Chơi — service worker: chơi offline + luôn lấy code mới khi có mạng
// __BUILD__ được scripts/build.mjs thay bằng mã băm nội dung → mỗi lần deploy có code mới,
// sw.js đổi byte → trình duyệt cài SW mới và xoá cache cũ. Không cần tăng số bằng tay.
const CACHE = 'bevui-__BUILD__';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './apple-touch-icon-180.png', './icon-192.png', './icon-512.png', './favicon-32.png', './favicon.ico', './audio/bgmusic.mp3', './audio/voice/manifest.json', './img/animals/dog.jpg', './img/animals/cat.jpg', './img/animals/cow.jpg', './img/animals/chicken.jpg', './img/animals/duck.jpg', './img/animals/pig.jpg', './img/vehicles/car.jpg', './img/vehicles/train.jpg', './img/vehicles/airplane.jpg', './img/vehicles/firetruck.jpg', './img/vehicles/bus.jpg', './img/vehicles/bicycle.jpg', './img/fruits/apple.jpg', './img/fruits/banana.jpg', './img/fruits/grapes.jpg', './img/fruits/orange.jpg', './img/fruits/watermelon.jpg', './img/fruits/strawberry.jpg'];

self.addEventListener('install', e => {
  // cache: 'reload' để không lấy nhầm bản cũ trong HTTP cache của trình duyệt
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const save = (cache, req, res) => {
  if (res && (res.ok || res.type === 'opaque') && res.status !== 206) cache.put(req, res.clone()).catch(() => {});
  return res;
};

// Trang HTML + file danh sách (manifest): ưu tiên mạng để luôn có code mới;
// mạng chậm quá 4 giây hoặc mất mạng thì dùng bản trong cache để bé vẫn chơi được.
function networkFirst(e, cache) {
  const isPage = e.request.mode === 'navigate';
  const fromCache = () => cache.match(e.request, { ignoreSearch: true })
    .then(r => r || (isPage ? cache.match('./index.html') : undefined));
  const network = fetch(e.request, { cache: 'no-store' }).then(res => save(cache, e.request, res));
  const timeout = new Promise(resolve => setTimeout(resolve, 4000)).then(fromCache);
  return Promise.race([network, timeout.then(r => r || network)])
    .catch(() => fromCache().then(r => r || Response.error()));
}

// Ảnh, âm thanh, giọng đọc: lấy ngay từ cache (nhanh, offline), đồng thời tải bản mới cho lần sau
async function staleWhileRevalidate(e, cache) {
  const cached = await cache.match(e.request, { ignoreSearch: true });
  const network = fetch(e.request).then(res => save(cache, e.request, res)).catch(() => cached);
  return cached || network;
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Let Vercel Analytics / Speed Insights hit the network directly
  if (url.pathname.startsWith('/_vercel/')) return;
  const fresh = e.request.mode === 'navigate' || /\.(html|json|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  e.respondWith(caches.open(CACHE).then(cache => fresh ? networkFirst(e, cache) : staleWhileRevalidate(e, cache)));
});
