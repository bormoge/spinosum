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

    // Clean the forge repository URL, only keep user/repo
    function cleanForgeRepositoryURL(url) {
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

    // Clean the forge user URL, only keep user
    function cleanForgeUserURL(url) {
        try {
            let url_user = new URL(url);
            let substrings = url_user.pathname.split('/').filter(Boolean);

            if (substrings.length >= 1) {
                return `${url_user.origin}/${substrings[0]}`;
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // Store the forge repository url
    function storeForgeRepositoryURL(url) {
        let normalized_url = cleanForgeRepositoryURL(url);
        if (!normalized_url) return;

        let all_urls = JSON.parse(localStorage.getItem('forge_repositories') || '[]');
        if (!all_urls.includes(normalized_url)) {
            all_urls.push(normalized_url);
            localStorage.setItem('forge_repositories', JSON.stringify(all_urls));
            console.log(`Forge repository URL: ${normalized_url}`);
        }
    }

    // Store the forge user url
    function storeForgeUserURL(url) {
        let normalized_url = cleanForgeUserURL(url);
        if (!normalized_url) return;

        let all_urls = JSON.parse(localStorage.getItem('forge_users') || '[]');
        if (!all_urls.includes(normalized_url)) {
            all_urls.push(normalized_url);
            localStorage.setItem('forge_users', JSON.stringify(all_urls));
            console.log(`Forge user URL: ${normalized_url}`);
        }
    }

    // Create a reusable element to download the forge repository URLs
    function downloadForgeRepositoryURLs() {
        let all_urls = JSON.parse(localStorage.getItem('forge_repositories') || '[]');
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

    // Create a reusable element to download the forge user URLs
    function downloadForgeUserURLs() {
        let all_urls = JSON.parse(localStorage.getItem('forge_users') || '[]');
        if (all_urls.length === 0) {
            alert('There are no URLs yet.');
            return;
        }
        let blob = new Blob([all_urls.join('\n')], { type: 'text/plain' });
        let lambda = document.createElement('a');
        lambda.href = URL.createObjectURL(blob);
        lambda.download = 'user_urls.org';
        lambda.click();
        URL.revokeObjectURL(lambda.href);
    }

    // Reset stored forge URLs
    function clearForgeURLs() {
        if (confirm('Are you sure you want to clear all stored forge URLs?')) {
            localStorage.removeItem('forge_repositories');
            console.log('forge_repositories cleared');
            localStorage.removeItem('forge_users');
            console.log('forge_users cleared');
        }
    }

    // Store the current forge page URL
    storeForgeRepositoryURL(window.location.href);
    storeForgeUserURL(window.location.href);

    // Add a button to download forge repository URLs
    let downloadRepositoriesBtn = document.createElement('button');
    downloadRepositoriesBtn.textContent = 'Download repository URLs';
    downloadRepositoriesBtn.style.position = 'fixed';
    downloadRepositoriesBtn.style.bottom = '20px';
    downloadRepositoriesBtn.style.right = '20px';
    downloadRepositoriesBtn.style.zIndex = 10000;
    downloadRepositoriesBtn.style.padding = '7px';
    downloadRepositoriesBtn.style.background = '#ff0000';
    downloadRepositoriesBtn.style.color = 'white';
    downloadRepositoriesBtn.style.border = 'none';
    downloadRepositoriesBtn.style.borderRadius = '5px';
    downloadRepositoriesBtn.style.cursor = 'pointer';
    downloadRepositoriesBtn.onclick = downloadForgeRepositoryURLs;
    document.body.appendChild(downloadRepositoriesBtn);

    // Add a button to download forge user URLs
    let downloadUsersBtn = document.createElement('button');
    downloadUsersBtn.textContent = 'Download user URLs';
    downloadUsersBtn.style.position = 'fixed';
    downloadUsersBtn.style.bottom = '70px';
    downloadUsersBtn.style.right = '20px';
    downloadUsersBtn.style.zIndex = 10000;
    downloadUsersBtn.style.padding = '7px';
    downloadUsersBtn.style.background = '#2cc430';
    downloadUsersBtn.style.color = 'white';
    downloadUsersBtn.style.border = 'none';
    downloadUsersBtn.style.borderRadius = '5px';
    downloadUsersBtn.style.cursor = 'pointer';
    downloadUsersBtn.onclick = downloadForgeUserURLs;
    document.body.appendChild(downloadUsersBtn);

    // Add a button to clear the cache
    let resetBtn = document.createElement('button');
    resetBtn.textContent = 'Clear URLs';
    resetBtn.style.position = 'fixed';
    resetBtn.style.bottom = '120px';
    resetBtn.style.right = '20px';
    resetBtn.style.zIndex = 10000;
    resetBtn.style.padding = '7px';
    resetBtn.style.background = '#0080ff';
    resetBtn.style.color = 'white';
    resetBtn.style.border = 'none';
    resetBtn.style.borderRadius = '5px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.onclick = clearForgeURLs;
    document.body.appendChild(resetBtn);

})();
