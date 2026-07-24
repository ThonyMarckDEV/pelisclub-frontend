self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // No hace falta cachear nada para que el navegador considere el sitio "instalable" —
  // basta con que exista un SW registrado y controlando la página.
});