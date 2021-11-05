import Vue from 'vue';
import App from './App.vue';

new Vue({
  el: '#app',
  render: h => h(App)
});

console.log('popup works');

document.addEventListener('DOMContentLoaded', function () {
  $('#jack').click(function () {
      //alert('hi 2');
      // TODO: ik kan hier bij de ontvanger (in background.js) een check opnemen die checkt of page load rdy is. (OF.. uiteindelijk in content.js)
      // want popup.js is een compleet andere window zo blijkt (dus nee, variabele zetten op window object gaat niet)
      // Maarrr page rdy check kan ik alleen uitvoeren op content.js
      // offf ik kan ook de page is ready in cookie/localstorage zetten. OF in popup een call doen naar bijv. background script.. in background.js een var zetten (of in de gloabl window van bg) en deze teruggeven on respons.
      // Maar dit is misschien ook eerder een leuke EXTR feature? ipv een permanente?
      chrome.runtime.sendMessage({
          url: 'test',
          count: 'jack'
      });
  });
});
