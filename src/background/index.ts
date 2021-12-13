// import { requestInterceptor } from "./requestInterceptor";
// console.log('Hey! This code is executed in the background, you will not see it in the browser console...');

import { workers } from "cluster"

// const test = new requestInterceptor();
// console.dir(`jackbg xAuthToken: ${test.xAuthToken}`);

// TODO:
// maybe here i could (use the list from manifest.json) or have a seperate list here of usable websites/apps..
// on which this app workers.. and if it works on said Website
// enable the browserextension for activation?

chrome.webRequest.onCompleted.addListener(
    function(info) {
        console.log("URL intercepted ONCOMPLETED: ");
        console.dir(info);
      },
      // filters
      {
        urls: [
          "<all_urls>"
        ]
      },
      // extraInfoSpec
      ["responseHeaders"]
  )

  chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
      console.log("URL intercepted ONBEFOREREQUEST: ");
      console.dir(info);
    },
    // filters
    {
      urls: [
        "<all_urls>"
      ]
    },
    // extraInfoSpec
    []
  );

  //todo: get body (preferably!)
  //todo: also, read this: https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onCompleted