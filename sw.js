const CACHE = 'nova-pos-v7';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
// كاش أولاً مع تحديث في الخلفية: يعمل البرنامج أوفلاين بعد أول تحميل (الصفحة + Tailwind + Chart.js + الخطوط)
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(caches.match(e.request).then(hit => {
        const net = fetch(e.request).then(res => {
            if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
            return res;
        }).catch(() => hit);
        return hit || net;
    }));
});
