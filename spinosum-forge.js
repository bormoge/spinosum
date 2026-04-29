// ==UserScript==
// @name         spinosum-forge
// @namespace    Violentmonkey Scripts
// @version      0.1.0
// @description  Store forge URLs as org files
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

    // Clean the forge URL, only keep user/repo
    function cleanForgeURL(url) {
        try {
            let url_repository = new URL(url);
            let substrings = url_repository.pathname.split('/').filter(Boolean);

            if (substrings.length >= 2) {
                return `${url_repository.origin}/${substrings[0]}/${substrings[1]}`;
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // Store the url
    function storeURL(url) {
        let normalized_url = cleanForgeURL(url);
        if (!normalized_url) return;

        let all_urls = JSON.parse(localStorage.getItem('forge_repos') || '[]');
        if (!all_urls.includes(normalized_url)) {
            all_urls.push(normalized_url);
            localStorage.setItem('forge_repos', JSON.stringify(all_urls));
            console.log(`Forge URL: ${normalized_url}`);
        }
    }

    // Create a reusable element to download the forge URLs
    function downloadURLs() {
        let all_urls = JSON.parse(localStorage.getItem('forge_repos') || '[]');
        if (all_urls.length === 0) {
            alert('There are no URLs yet.');
            return;
        }
        let blob = new Blob([all_urls.join('\n')], { type: 'text/plain' });
        let lambda = document.createElement('a');
        lambda.href = URL.createObjectURL(blob);
        lambda.download = 'repository_urls.org';
        lambda.click();
        URL.revokeObjectURL(lambda.href);
    }

    // Reset stored URLs
    function clearURLs() {
        if (confirm('Are you sure you want to clear all stored forge URLs?')) {
            localStorage.removeItem('forge_repos');
            console.log('forge_repos cleared');
        }
    }

    // Store the current forge page URL
    storeURL(window.location.href);

    // Add a button to download URLs
    let downloadBtn = document.createElement('button');
    btn.textContent = 'Download forge URLs';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = 10000;
    btn.style.padding = '7px';
    btn.style.background = '#ff0000';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.onclick = downloadURLs;
    document.body.appendChild(downloadBtn);

    // Add a button to clear the cache
    let resetBtn = document.createElement('button');
    resetBtn.textContent = 'Clear forge URLs';
    resetBtn.style.position = 'fixed';
    resetBtn.style.bottom = '70px';
    resetBtn.style.right = '20px';
    resetBtn.style.zIndex = 10000;
    resetBtn.style.padding = '7px';
    resetBtn.style.background = '#0080ff';
    resetBtn.style.color = 'white';
    resetBtn.style.border = 'none';
    resetBtn.style.borderRadius = '5px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.onclick = clearURLs;
    document.body.appendChild(resetBtn);

})();
