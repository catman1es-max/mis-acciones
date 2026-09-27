self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Mis Acciones",
      body: event.data ? event.data.text() : "Alerta de precio"
    };
  }

  const title = data.title || "📈 Mis Acciones";

  const options = {
    body: data.body || "Una acción ha alcanzado tu precio objetivo.",
    data: {
      url: data.url || "./"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url = event.notification.data?.url || "./";

  event.waitUntil(
    clients.openWindow(url)
  );
});
