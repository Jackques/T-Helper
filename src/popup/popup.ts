import $ from "jquery";

document.addEventListener('DOMContentLoaded', function () {
    $('#jack').on('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs:chrome.tabs.Tab[]) {
            if(tabs.length > 0 && tabs[0].id){
                chrome.tabs.sendMessage(tabs[0].id, {type:"Activate"}, function(response){
                    console.log('Do i need a callback?');
                });
            }
            
        });
    });
});