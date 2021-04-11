---
toc: true
layout: post
description: What are PWAs? How do I create or transform my web app into one? How can I deploy them (freely) via GitHub Pages?
categories: [pwa, til]
title: "TIL: GitHub Pages + Progressive Web App (PWA) = ❤️"
comments: true
author: Hampus Londögård
---

### What
Progressive Web Apps (PWAs) are web applications that are deployed on the Web and available on essentially every platform directly (Android, iOS, Linux, Windows, ... you name it).  
They're coded just as regular Web Apps with the extension of a separate `.js`-file which runs a `serviceWorker` which handles caching among other things, and the `serviceWorker` is really the core of a PWA. 

PWAs allows you to:
- Share logic between all OS:s
- Not have a heavy runtime associated as it's using the browser
	- On Windows/MacOS/Android/iOS the browser is included as part of OS. On Linux not as much, but who has Linux without a browser?
- Use your existing knowledge AND technologies of regular webapps

The performance is good enough for most apps and you can easily cache content to make the app offline-first. Of course native apps are, and will always be, better but this is a good step in the right direction for simple developer to share their work on multiple platforms. 

> A really good example of PWAs is [twitter](http://mobile.twitter.com/) which I'd call perhaps even better than the native version

You can test my PWA that is done in Kotlin with fritz2 targeting JS on [colorkidz.londogard.com](https://colorkidz.londogard.com/). This is a very simple app to create colouring pages out of images. I think it show-case the possibility of creating a MVP fast & easy while being deployed instantly to all platforms.  

> A bonus is that PWAs can be added to Android/Google & Windows App Store, just like a regular app

Please note that it's not OK according to the TOS to deploy a commercial app through GitHub pages. If you wish to do that take a look at the [alternative section](#alternatives).

### How
Building, or transforming, a Web App into a PWA is really easy and has few requirements (depending on browser). The requirements follows:
1. A _web manifest_ file
2. Serve app using HTTPS
3. A Service Worker with a `fetch event` handler
	- Allowing the app to work offline (!) 
4. (not for all browser) a `favicon`/icon

And adding more data makes your PWA even better, like safari/iOS specific icons etc and some further metadata.

This is actually pretty easy requirements to fill and I'll show the two most important, `serviceWorker` and `webmanifest`.

#### ServiceWorker.js
As mentioned the `serviceWorker` allows to app to work cached and handles the installation of the PWA among other things.   
An example of this can be found on my [GitHub](https://github.com/londogard/colorkidz/blob/main/serviceWorker.js), find the code a little bit below.  
A really good guide that goes deeper on the `serviceWorker` and what more they can achieve can be found on both [Mozilla](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers) & [Google](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker).
```js
var CACHE_NAME = 'londogard-colorkidz';
var urlsToCache = [
  "/index.html",
  "/NEW.js",
  "/android-chrome-192x192.png",
  ...
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
    );
  });
self.addEventListener('fetch',() => console.log("fetch"));
```
#### Webmanifest

Further you need to supply a few more things, a `manifest.webmanifest` which looks like the following:
```json
{
  "short_name": "ColorKidz",
  "name": "ColorKidz",
  "description": "Turn your images into Colouring Pages",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    ...
  ],
  "start_url": "/",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#FFFFFF"
}
```

#### Deploying to GitHub Pages
First off place all your files in root folder of your GitHub repo. Remember to also have a `index.html` which contains both your JS app & your `serviceWorker.js` and reference those scripts in `body`, e.g.
```html
<body>
...
<script src="NEW.js"></script>
<script src="serviceWorker.js"></script>
</body>
```

Then you need to activate GitHub Pages, whereas the [official documentation](https://pages.github.com/) is great! 
GitHub pages recently got their own tab in settings and all you need to do now is to head over there, `https://github.com/<USERNAME>/<REPO_NAME>/settings/pages` and activate GitHub pages. Make sure to also activate `https`-only if possible!

**And that's it**, simple as that. Now you've your PWA deployed through GitHub pages. The PWA should be available @ `<repo>.github.io`, but better check it in settings to be sure that it's set up that way.

### Alternatives
There exists a few alternatives that I'm aware off
- [Heroku](https://www.heroku.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Netlify](https://www.netlify.com/)

All which are supposed to be great and simple to use. The free versions of everyone is pretty darn good too!

**OBS** Please remember that it's not allowed to put up applications on GitHub Pages that are commercial according to the ToS.