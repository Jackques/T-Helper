import $ from "jquery";

document.addEventListener('DOMContentLoaded', function () {
    console.log('Popup DOM content loaded');
    $('#activate').on('click', function () {
        console.log('Processing click');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs:chrome.tabs.Tab[]) {
            if(tabs.length > 0 && tabs[0].id){
                console.log('Sending message to content');
                chrome.tabs.sendMessage(tabs[0].id, {type:"Activate"}, function(response){
                    console.log('Do i need a callback?');
                });
            }
            
        });
    });
});
