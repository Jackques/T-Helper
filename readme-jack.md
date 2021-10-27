# This is my original browser extension made with vanilla JS & Jquery.
 A bit buggy because I do not yet understand everything about the Chrome extension API.
 In here, I made a working demo the requests because;
 1. the extension (apparantly) is in the same domain as I use it exclusively within the tinder webversion
 2. when using it inside the tinder webversion I already have access to the acess_token I need to send valid requests with

# Standalone webapp which utilizes Tinder API or any other is impossible
 I have researched and can confirm that I cannot build a standalone webapp using the Tinder API because Tinder only allows certain domains (their webclient) to make requests to the app. 
 An alternative (but even more buggy option) would be to create an Iframe in which I could use the DOM listening API to automate messages and create extra fields, but again.. CORS does not allow a domain (my website) to control another domain even within an Iframe (e.g. tinder webclient).
 Another alternative which automates the browser altogether would be to find a browser automationtool such as Selenium within Java or Cypress. This would allow me to control the webUI independantly THEREFORE I do not need to use any API's but can work directly with the webinterfaces. But any other option than Cypress will require extensive tutorials/time learning (which is ABSOLUTETLY NO PRIORITY RIGHT NOW) AND will also be very buggy.

# Hence the use of a (Chrome-) browser extension
 Thus the best option is using a browser extension. 
 Besides, using a browser extension (and setting it up correctly);
 1. Will allow me for future grow with the codebase of this extension (thus still learning at least something something; chrome extension API, Angular/Typescript & possibily Vue if i feel like it)
 2. Fastest option, can immediatly start using the Extension Starter
 3. Can work on any webapp because;
    * I can make it work with API's as long as I am in the same domain AND have access to an access token
    * I can utilize both API's (if the app is setup with RESTFULL API) AND controlling the DOM (with the mutation observer) if the latter is not.
    * Luckely; the most popular apps (Tinder, Happn, Bumble) which I might want to utilize make use of RESTFULL API's
4. Can still send data to my personal online server if need be instead of using a export/import .csv/.json option
5. I can (more easily) make use of my VPN!? Did NOT think about this before.. WHY did I NOT THINK ABOUT THIS BEFORE!?