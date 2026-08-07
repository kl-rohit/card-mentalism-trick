/* Screen — cache-first service worker. Precache everything, zero runtime network. */
const CACHE = "screen-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(function(cache){
      // add individually so one miss (e.g. file://) doesn't fail the whole install
      return Promise.all(ASSETS.map(function(url){
        return cache.add(url).catch(function(){});
      }));
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function(hit){
      if(hit) return hit;
      // network only as a last resort; cache the result for next time (offline)
      return fetch(event.request).then(function(resp){
        if(resp && resp.ok && resp.type === "basic"){
          const copy = resp.clone();
          caches.open(CACHE).then(function(c){ c.put(event.request, copy); });
        }
        return resp;
      }).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
