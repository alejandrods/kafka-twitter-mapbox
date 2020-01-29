/*jshint esversion: 6 */
(function () {
    'use strict';

    window.madb = window.madb || {};

    const
        breath = s =>{
            const phs = document.querySelectorAll(s);
            phs.forEach(ph=>{
                const t = ph.textContent;
                ph.innerHTML = '';
                ph.append(...[...t].map((l, i) => {
                    const n = document.createElement('span');
                    n.textContent = l;
                    n.style.display = 'inline-block';
                    return n;
                }));
            });
        },
        init = () => {
            //#region MAP INIT
            madb.day = new mapboxgl.Map({
                container: 'day',
                style: madb.style.day,
                antialias: true,
                minZoom: 11,
                maxZoom: 19,
                maxBounds: [
                    [-3.883845, 40.318194],
                    [-3.518623, 40.636983]
                ]
            });

            madb.night = new mapboxgl.Map({
                container: 'night',
                style: madb.style.night,
                antialias: true,
                minZoom: 11,
                maxZoom: 19,
                maxBounds: [
                    [-3.883845, 40.318194],
                    [-3.518623, 40.636983]
                ]
            });
            madb.night.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
            document.querySelector('.zoomcontrol').appendChild(document.querySelector('.mapboxgl-ctrl-group'));

            madb.map = new mapboxgl.Compare(madb.day, madb.night, {});
            //#endregion

            //#region MAP EVENTS
            const spin = () =>{
                let spinners = document.querySelectorAll('.container-loader .loader');
                spinners.forEach(k => { k.classList.add('is-visible'); });
            };
            madb.day.on('load', e => {
                madb.day.on('idle', newdata);
                newdata(e);
            });
            madb.day.on('movestart', spin);
            madb.day.on('boxzoomstart', spin);
            madb.day.on('zoomend', e =>{
                if (!madb.night.isZooming()) pitcher(e.target);
            });
            madb.night.on('zoomend', e =>{
                if (!madb.day.isZooming()) pitcher(e.target);
            });
            madb.day.on('click', getbuilding);
            madb.night.on('click', getbuilding);
            madb.day.on('error', e => console.log(e.error));
            madb.night.on('error', e => console.log(e.error));
            document.querySelector('#switcher-1').addEventListener('change', e => {
                madb.style.exposed = e.target.checked;
                madb.style.change();
            });
            document.querySelector('#switcher-2').addEventListener('change', e => {
                madb.style.inner = !e.target.checked;
                madb.style.change();
            });
            //#endregion

            //#region DIALOGS
            madb.dialog = document.createElement('dialog');
            dialogPolyfill.registerDialog(madb.dialog);
            window.addEventListener('click', function(e){
                let a = document.querySelector('dialog .dcontent');
                if (a == void 0 || !a.contains(e.target)){
                  madb.dialog.close();
                }
              });
            document.body.appendChild(madb.dialog);
            _addinfo('.residesc', '.info-residesc');
            _addinfo('#vis1', '.info-vis1');
            _addinfo('.noisedesc', '.info-noisedesc');
            _addinfo('#vis2', '.info-vis2');
            _addinfo('.as-yo', '.info-yo', '.egoname');
            _addinfo('.sharer', '.info-share');
            _addinfo('.method', '.info-method');
            _addinfo('.attrib', '.info-attrib');
            _addinfo('.justi', '.info-justi');
            //#endregion

            document.querySelector('.as-search').addEventListener('click', _lookup);
            document.querySelector('#lookup').addEventListener('keyup', function(e) {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  _lookup();
                }
            });

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('assets/scripts/sw.js');
            }

        };

    madb.init = init;
    madb.getrisks = getrisks;

})();