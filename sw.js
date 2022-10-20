//Only cache strategy
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v2'
const DYNAMIC_CACHE_NAME = 'dinamyc-cache-v1'
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
            './pages/offline.html',
            './manifest.json',
            './images/default.png',            
        ])
    })

    event.waitUntil(Promise.all([inmutablePromise, staticPromise]))
})
// ONLY CACHE
// self.addEventListener('fetch',(event)=>{
//     const responseNetworkCall = caches.match(event.request).then((cacheResponse)=>{
//         if(cacheResponse){
//             return cacheResponse
//         }
//     })
//     event.respondWith(responseNetworkCall)
// })

//update file when manifest is changed
self.addEventListener('activate', (event) => {
    const response = caches.keys().then((items)=>{
        items.forEach((item)=>{
            if(item !== STATIC_CACHE_NAME && key.includes('static')){
                return caches.delete(item)
            }
        })
    })
    event.waitUntil(response)
})

// clean cache
const cleanCache = (cache, limitItems)=>{
    caches.open(cache).then((cache)=>{
        return cache.keys().then((keys)=>{
            if(keys.length >limitItems){
                cache.delete(keys[0]).then(cleanCache(cache,limitItems))
            }
        })
    })
}

// Only cache estrategy
self.addEventListener("fetch",(event)=>{
    const resp = caches.match(event.request).then((resp_cache)=>{
        // cache
        if (resp_cache){
            return resp_cache
        }
        // red
        return fetch(event.request).then((network_resp)=>{
            caches.open(DYNAMIC_CACHE_NAME).then((cache)=>{
                cache.put(event.request,network_resp)
                cleanCache(DYNAMIC_CACHE_NAME,10)
            })    
            return network_resp.clone()
        })
    }).catch(err=>{
        // Return html
        if(event.request.headers.get('accept').includes('text/html')){
            return caches.match("/pages/offline.html")
        }
        // Retun img
        if(event.request.headers.get('accept').includes("image/")){
            return caches.match("./images/default.png")
        }
    })
    event.respondWith(resp)
})