// ==UserScript==
// @name         spinosum-forge-user-nested
// @namespace    Violentmonkey Scripts
// @version      0.1.0
// @description  Store nested forge user URLs as org files
// @author       bormoge
// @match        https://github.com/*
// @match        https://gitlab.com/*
// @match        https://codeberg.org/*
// @match        https://sr.ht/*
// @match        https://git.sr.ht/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Clean the forge user URL so only the user and repository names remain.
    function cleanForgeUserURL(url) {
        try {
            let urlObj = new URL(url);

            if (urlObj.origin !== window.location.origin)
              return null;

            let parts = urlObj.pathname.split('/').filter(Boolean);

            if (parts.length >= 1) {
                return `${urlObj.origin}/${parts[0]}`;
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // Store the forge user URL if it's valid.
    function storeForgeUserURL(url) {
        let normalized_url = cleanForgeUserURL(url);
        if (!normalized_url)
            return;

        let all_urls = JSON.parse(localStorage.getItem('forge_users') || '[]');

        if (!all_urls.includes(normalized_url)) {
            all_urls.push(normalized_url);
            localStorage.setItem('forge_users', JSON.stringify(all_urls));
            console.log(`Forge User URL: ${normalized_url}`);
        }
    }

    // Search the page for forge user links.
    function searchPageForUsers() {
        let forge_urls = Array.from(document.querySelectorAll('a'));
        forge_urls.forEach(forge_url => {
            storeForgeUserURL(forge_url.href);
        });
    }

    // Starting point.
    searchPageForUsers();

})();
