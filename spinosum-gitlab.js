// ==UserScript==
// @name         spinosum-gitlab
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Store GitLab URLs as org files
// @author       bormoge
// @match        https://gitlab.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Clean the GitLab URL, only keep user/repo
    function cleanGitLabURL(url) {
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
        let normalized_url = cleanGitLabURL(url);
        if (!normalized_url) return;

        let all_urls = JSON.parse(localStorage.getItem('gitlab_repos') || '[]');
        if (!all_urls.includes(normalized_url)) {
            all_urls.push(normalized_url);
            localStorage.setItem('gitlab_repos', JSON.stringify(all_urls));
            console.log(`GitLab URL: ${normalized_url}`);
        }
    }

    // Create a reusable element to download the GitLab URLs
    function downloadURLs() {
        let all_urls = JSON.parse(localStorage.getItem('gitlab_repos') || '[]');
        if (all_urls.length === 0) {
            alert('There are no URLs yet.');
            return;
        }
        let blob = new Blob([all_urls.join('\n')], { type: 'text/plain' });
        let lambda = document.createElement('a');
        lambda.href = URL.createObjectURL(blob);
        lambda.download = 'gitlab_repos.org';
        lambda.click();
        URL.revokeObjectURL(lambda.href);
    }

    // Store the current page URL (only if it is https://gitlab.com/)
    storeURL(window.location.href);

    // Add a small button to download URLs
    let btn = document.createElement('button');
    btn.textContent = 'Download GitLab URLs';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = 10000;
    btn.style.padding = '10px';
    btn.style.background = '#FF0000';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.onclick = downloadURLs;
    document.body.appendChild(btn);

})();
