window.browserbench=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function r(e,t,n,r,o,u,i){try{var c=e[u](i),f=c.value}catch(e){return void n(e)}c.done?t(f):Promise.resolve(f).then(r,o)}function o(e){return function(){var t=this,n=arguments;return new Promise((function(o,u){var i=e.apply(t,n);function c(e){r(i,o,u,c,f,"next",e)}function f(e){r(i,o,u,c,f,"throw",e)}c(void 0)}))}}Object.defineProperty(t,"__esModule",{value:!0}),t.isBenchmarking=c,t.startBenchmarking=f,t.getBenchmarkText=l,t.default=void 0;let u=!1,i="PENDING!";function c(){return u}function f(){return a.apply(this,arguments)}function a(){return(a=o((function*(){u||(u=!0,i="EXECUTING FOO",setTimeout(()=>{u=!1,i="FINISHED EXECUTING FOO"},2500))}))).apply(this,arguments)}function l(){return i}var s={startBenchmarking:f,getBenchmarkText:l,isBenchmarking:c};t.default=s}]);