//Only cache strategy
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1'
const DYNAMIC_CACHE_NAME = 'dinamyc-cache-v1'
const STATIC_PERSONS_NAME='static-person-cache-v1'
const STATIC_CACHE_NAME='static-cache-v1'

self.addEventListener('install',(event)=>{
    console.log("Added")

    const inmutablePromise = caches.open(INMUTABLE_CACHE_NAME)
    .then((cache_inmutable)=>{
        return cache_inmutable.addAll([
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js',

        ])
    })

    
    const staticPromise = caches.open(STATIC_CACHE_NAME)
    .then((cache_static)=>{
        return cache_static.addAll([
            './',
            './index.html',
            './manifest.json',
            './images/imgjpg.jpg',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/webfonts/fa-solid-900.woff2',
            

        ])
    })

    event.waitUntil(Promise.all([inmutablePromise, staticPromise]))
})

self.addEventListener('fetch',(event)=>{
    const responseNetworkCall = caches.match(event.request).then((cacheResponse)=>{
        if(cacheResponse){
            return cacheResponse
        }
    })
    event.respondWith(responseNetworkCall)
})
