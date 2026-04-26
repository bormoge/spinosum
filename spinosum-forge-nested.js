// ==UserScript==
// @name         spinosum-forge-nested
// @namespace    Violentmonkey Scripts
// @version      0.1.0
// @description  Store nested forge URLs as org files
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

    // Clean the forge URL so only the user and repository names remain.
    function cleanForgeURL(url) {
        try {
            let urlObj = new URL(url);

            if (urlObj.origin !== window.location.origin)
              return null;

            let parts = urlObj.pathname.split('/').filter(Boolean);

            if (parts.length >= 2) {
                return `${urlObj.origin}/${parts[0]}/${parts[1]}`;
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // Store the URL if it's valid.
    function storeURL(url) {
        let normalized_url = cleanForgeURL(url);
        if (!normalized_url)
            return;

        let all_urls = JSON.parse(localStorage.getItem('forge_repos') || '[]');

        if (!all_urls.includes(normalized_url)) {
            all_urls.push(normalized_url);
            localStorage.setItem('forge_repos', JSON.stringify(all_urls));
            console.log(`Forge URL: ${normalized_url}`);
        }
    }

    // Search the page for repository links.
    function searchPageForRepos() {
        let links = Array.from(document.querySelectorAll('a'));
        links.forEach(link => {
            storeURL(link.href);
        });
    }

    // Starting point.
    searchPageForRepos();

})();
