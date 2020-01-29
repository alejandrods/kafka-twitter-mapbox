/*jshint esversion: 6 */
(function () {
    'use strict';

    // no tiene sentido ver esta app en un móvil :(
    if (screen.width < 1280 || screen.height < 740) {
        document.location = "mobile.html";
    }

    console.time('main');

    //#region ENVIRONMENT
    const
        appname = 'madb',
        version = {
            airship: 'v2.1.1',
        },
        resources={
            css:[
                `assets/styles/airship.css`,
//                `assets/styles/mapbox-gl.css`,
//                `assets/styles/mapbox-gl-compare.css`,
                'assets/styles/dialog-polyfill.css',
//                'assets/icofont/icofont.min.css',
                'assets/styles/madb.css'
            ],
            js:[
               /*  `https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-compare/${version.compare}/mapbox-gl-compare.js`,
                `https://cdn.jsdelivr.net/npm/vega-embed@${version.vega[2]}`, */
//                `assets/scripts/mapbox-gl-compare.js`,
//                `assets/scripts/vega-embed.js`,
                'assets/scripts/map.js'/*,
//                'assets/scripts/premonish.js'*/
            ]
        };
    //#endregion

    //#region IMPORT
    const
        embed ={
            js:{
                url: (url, wait = false, defer = true) => {
                    return new Promise((resolve, reject) => {
                        let s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.src = url;
                        s.defer = !!defer;
                        s.async = !!!defer;
                        s.addEventListener('error', () => reject(s), false);
                        if(wait=== true){
                            s.addEventListener('load', () => resolve(s), false);
                            document.head.appendChild(s);
                        }else{
                            document.head.appendChild(s);
                            resolve(s);
                        }
                    });
                },
                urls: (urls, wait = true, defer = true) => {
                    return Promise.all(urls.map(url=>embed.js.url(url, wait, defer)));
                },
                content: (code, defer = false) => {
                    return new Promise((resolve, reject) => {
                        let s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.innerText = code;
                        s.defer = defer;
                        document.head.appendChild(s);
                        resolve(s);
                    });
                }
            },
            css:{
                url: (url) => {
                    return new Promise((resolve, reject) => {
                        let style = document.createElement('link');
                        style.rel = 'stylesheet';
                        style.href = url;
                        document.head.appendChild(style);
                        resolve(style);
                    });
                },
                urls: (urls) => {
                    return Promise.all(urls.map(embed.css.url));
                }
            }
        },
        init = () => {
            embed.css.urls(resources.css);
            embed.js.urls(resources.jscore, false)
            .then(() =>
                embed.js.urls(resources.js, true)
            )
//            .then(() => {
//                if (document.readyState === 'complete') {
//                    madb.init();
//                } else {
//                    document.addEventListener("readystatechange", madb.init);
//                }
//                    document.addEventListener("readystatechange", madb.init);
//            });
        };
    //#endregion

    init();

})();