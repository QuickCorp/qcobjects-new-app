/**
 * QCObjects Framework
 * ____________________________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
"use strict";
// eslint-disable-next-line no-undef

/* eslint-disable no-undef */
// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "qcobjectsnewapp-offline-page";

importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

const offlineFallbackPage = "index-fallback.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  // eslint-disable-next-line prefer-regex-literals
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});


const version = "1.0.0";
const appName = "qcobjectsnewapp";
const cacheSufix = (Math.round(Date.now()/(1000*3600))).toString(); // 1 hour
const cacheName = `qcobjects-app-${appName}-${version}-${cacheSufix}`;
const startUrl = "/?homescreen=1";
caches.delete(cacheName); // force to reload cache for the first time the sw is loaded
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([`${startUrl}`,
	"/",
	"404.html",
	"_redirects",
	"css/body-layout.css",
	"css/components/button.css",
	"css/components/card.css",
	"css/components/hero/hero-call-to-action.css",
	"css/components/hero/hero-overlay.css",
	"css/components/hero/hero-two-column-form.css",
	"css/components/modal.css",
	"css/desktop/components/deploy-grid.css",
	"css/desktop/components/github-grid.css",
	"css/desktop/container.css",
	"css/desktop/content.css",
	"css/desktop/footer.css",
	"css/desktop/index.css",
	"css/desktop/navbar.css",
	"css/desktop/sidebar.css",
	"css/index.css",
	"css/mobile/components/deploy-grid.css",
	"css/mobile/components/github-grid.css",
	"css/mobile/content.css",
	"css/mobile/footer.css",
	"css/mobile/index.css",
	"css/mobile/navbar.css",
	"css/mobile/sidebar.css",
	"css/modern-base.css",
	"css/theme/basic/style.css",
	"css/theme/cyan/style.css",
	"css/theme/redlight/style.css",
	"css/theme/xtra/style.css",
	"favicon.ico",
	"humans.txt",
	"img/Q_web copy.png",
	"img/Q_web-white.png",
	"img/Q_web.png",
	"img/Q_web.svg",
	"img/awsmplogo3.svg",
	"img/icons/icon-128x128.png",
	"img/icons/icon-144x144.png",
	"img/icons/icon-152x152.png",
	"img/icons/icon-192x192.png",
	"img/icons/icon-384x384.png",
	"img/icons/icon-512x512.png",
	"img/icons/icon-72x72.png",
	"img/icons/icon-96x96.png",
	"img/logo-qcobjects-version.svg",
	"img/logo-qcobjects-white-powered-quickcorp.svg",
	"img/logo-qcobjects-white.svg",
	"img/logo.png",
	"img/netlify-button.svg",
	"img/octocat.svg",
	"img/placeholder.svg",
	"img/screenshots/screenshot1.png",
	"img/screenshots/screenshot1.webp",
	"img/screenshots/screenshot2.png",
	"img/screenshots/screenshot2.webp",
	"index-fallback.html",
	"index.html",
	"js/config.d.ts",
	"js/config.ts",
	"js/customWidgets.d.ts",
	"js/customWidgets.ts",
	"js/init.d.ts",
	"js/init.ts",
	"js/packages/com.qcobjects.installer.d.ts",
	"js/packages/com.qcobjects.installer.ts",
	"js/packages/com.qcobjects.services.github.d.ts",
	"js/packages/com.qcobjects.services.github.ts",
	"js/packages/org.quickcorp.custom.components.d.ts",
	"js/packages/org.quickcorp.custom.components.ts",
	"js/packages/org.quickcorp.custom.controllers.d.ts",
	"js/packages/org.quickcorp.custom.controllers.ts",
	"js/packages/org.quickcorp.custom.d.ts",
	"js/packages/org.quickcorp.custom.effects.d.ts",
	"js/packages/org.quickcorp.custom.effects.ts",
	"js/packages/org.quickcorp.custom.models.d.ts",
	"js/packages/org.quickcorp.custom.models.ts",
	"js/packages/org.quickcorp.custom.ts",
	"js/packages/org.quickcorp.custom.views.d.ts",
	"js/packages/org.quickcorp.custom.views.ts",
	"manifest.json",
	"robots.txt",
	"templates/components/article1.tpl.html",
	"templates/components/article2.tpl.html",
	"templates/components/aws-button.tpl.html",
	"templates/components/blank.tpl.html",
	"templates/components/card.tpl.html",
	"templates/components/codespaces-button.tpl.html",
	"templates/components/contentblock.tpl.html",
	"templates/components/footer.tpl.html",
	"templates/components/footer2.tpl.html",
	"templates/components/github-button.tpl.html",
	"templates/components/github-card.tpl.html",
	"templates/components/gitpod-button.tpl.html",
	"templates/components/header.tpl.html",
	"templates/components/hero/hero-call-to-action.tpl.html",
	"templates/components/hero/hero-overlay.tpl.html",
	"templates/components/hero/hero-two-column-form.tpl.html",
	"templates/components/install-button.tpl.html",
	"templates/components/layout-basic.tpl.html",
	"templates/components/loading.tpl.html",
	"templates/components/loadingfooter.tpl.html",
	"templates/components/login-button.tpl.html",
	"templates/components/login2.tpl.html",
	"templates/components/loginform.tpl.html",
	"templates/components/modal.tpl.html",
	"templates/components/nav.tpl.html",
	"templates/components/netlify-button.tpl.html",
	"templates/components/octocat-icon.tpl.html",
	"templates/components/pages/about-of.tpl.html",
	"templates/components/pages/author.tpl.html",
	"templates/components/pages/page1.tpl.html",
	"templates/components/pages/page2.tpl.html",
	"templates/components/pages/page3.tpl.html",
	"templates/components/pages/qcobjects-forks-stars.tpl.html",
	"templates/components/product.tpl.html",
	"templates/components/profile.tpl.html",
	"templates/components/section1.tpl.html",
	"templates/components/section2.tpl.html",
	"templates/components/shadowed-card.tpl.html",
	"templates/components/signin-button.tpl.html",
	"templates/components/signup-form.tpl.html",
	"templates/components/signup.tpl.html",
	"templates/components/signupbuttons.tpl.html",
	"templates/components/signupform.tpl.html",
	"templates/components/signuppage.tpl.html",
	"templates/components/signupsuccessful.tpl.html",
	"templates/components/signupsuccessfulfooter.tpl.html",
	"templates/components/splashscreen.tpl.html",
	"templates/components/topmenu.tpl.html"])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
