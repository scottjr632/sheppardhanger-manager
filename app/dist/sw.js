var serviceWorkerOption = {
  "assets": [
    "/0.bundle.js",
    "/1.css",
    "/1.bundle.js",
    "/2.bundle.js",
    "/3.bundle.js",
    "/main.css",
    "/bundle.js",
    "/5.css",
    "/5.bundle.js",
    "/6.bundle.js",
    "/7.bundle.js",
    "/8.bundle.js",
    "/9.css",
    "/9.bundle.js",
    "/10.bundle.js",
    "/11.bundle.js",
    "/12.bundle.js",
    "/13.bundle.js",
    "/14.bundle.js",
    "/15.bundle.js",
    "/16.bundle.js",
    "/17.bundle.js",
    "/index.html"
  ]
};
        
        !function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.register=function(e){"serviceWorker"in navigator&&window.addEventListener("load",function(){o?(!function(e,n){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):r(e,n)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}("/sw.js",e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")})):r("/sw.js",e)})},n.unregister=function(){"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})};var o="undefined"!=typeof window&&Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function r(e,n){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),n&&n.onUpdate&&n.onUpdate(e)):(console.log("Content is cached for offline use."),n&&n.onSuccess&&n.onSuccess(e)))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}}]);