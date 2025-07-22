document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const appContainer = document.getElementById('app');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userBio = document.getElementById('user-bio');
    const userLocation = document.getElementById('user-location');
    const userBlog = document.getElementById('user-blog');
    const publicReposSpan = document.getElementById('public-repos');
    const followersSpan = document.getElementById('followers');
    const followingSpan = document.getElementById('following');
    const repoGrid = document.getElementById('repo-grid');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const noReposMessage = document.getElementById('no-repos-message');
    const configureBtn = document.getElementById('configure-btn');

    const configModal = document.getElementById('config-modal');
    const githubUsernameInput = document.getElementById('github-username');
    const githubTokenInput = document.getElementById('github-token');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const cancelConfigBtn = document.getElementById('cancel-config-btn');

    // --- Configuration Variables ---
    let GITHUB_USERNAME = localStorage.getItem('github_username') || '';
    let GITHUB_TOKEN = localStorage.getItem('github_token') || '';

    // --- Utility Functions ---
    const showElement = (element) => element.classList.remove('hidden');
    const hideElement = (element) => element.classList.add('hidden');
    const clearChildren = (element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    const showLoading = () => {
        hideElement(errorMessage);
        hideElement(noReposMessage);
        clearChildren(repoGrid);
        showElement(loadingMessage);
    };

    const hideLoading = () => hideElement(loadingMessage);

    const showError = (message) => {
        errorMessage.textContent = `Error: ${message}`;
        showElement(errorMessage);
        hideElement(loadingMessage);
        hideElement(noReposMessage);
        clearChildren(repoGrid);
    };

    const showNoRepos = () => {
        hideElement(loadingMessage);
        hideElement(errorMessage);
        clearChildren(repoGrid);
        showElement(noReposMessage);
    };

    // --- GitHub API Fetcher ---
    async function fetchGitHubData(url, token) {
        const headers = {
            'Accept': 'application/vnd.github.v3+json', // Default for most GitHub API calls
        };
        // For starred repos with starred_at timestamp
        if (url.includes('/starred')) {
            headers['Accept'] = 'application/vnd.github.v3.star+json';
        }
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch from GitHub API:', error);
            throw error; // Re-throw to be caught by the caller
        }
    }

    // --- Data Fetching Functions ---
    async function fetchUserDetails(username, token) {
        if (!username) return null;
        try {
            const url = `https://api.github.com/users/${username}`;
            return await fetchGitHubData(url, token);
        } catch (error) {
            showError(`Failed to load user details for ${username}. ${error.message}`);
            return null;
        }
    }

    async function fetchStarredRepos(username, token) {
        if (!username) return [];
        try {
            const url = `https://api.github.com/users/${username}/starred?per_page=100`; // Fetch up to 100 repos per page
            // You might need pagination for more than 100, but for a demo, this is fine.
            return await fetchGitHubData(url, token);
        } catch (error) {
            showError(`Failed to load starred repositories for ${username}. ${error.message}`);
            return [];
        }
    }

    // --- Rendering Functions ---
    function renderUserDetails(user) {
        if (!user) {
            userAvatar.src = '';
            hideElement(userAvatar);
            userName.textContent = 'User Not Found';
            userBio.textContent = '';
            userLocation.textContent = '';
            userBlog.href = '#';
            userBlog.textContent = '';
            hideElement(userBlog);
            publicReposSpan.textContent = 'N/A';
            followersSpan.textContent = 'N/A';
            followingSpan.textContent = 'N/A';
            return;
        }

        userAvatar.src = user.avatar_url;
        showElement(userAvatar);
        userName.textContent = user.name || user.login;
        userBio.textContent = user.bio || 'No bio available.';
        userLocation.textContent = user.location || 'No location specified.';
        publicReposSpan.textContent = user.public_repos;
        followersSpan.textContent = user.followers;
        followingSpan.textContent = user.following;

        if (user.blog) {
            userBlog.href = user.blog.startsWith('http') ? user.blog : `http://${user.blog}`;
            userBlog.textContent = user.blog;
            showElement(userBlog);
        } else {
            hideElement(userBlog);
        }

        // --- CUSTOMIZABLE INFO ---
        // You can add more user details here by accessing properties of the `user` object.
        // For example:
        // document.getElementById('user-company').textContent = user.company || '';
        // document.getElementById('user-email').textContent = user.email || '';
        // Remember to add corresponding <p> tags with these IDs in index.html!
    }

    function renderRepos(repos) {
        clearChildren(repoGrid);
        hideElement(noReposMessage);

        if (!repos || repos.length === 0) {
            showNoRepos();
            return;
        }

        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repo-card');

            // repo.repo contains the actual repository object when using Accept: application/vnd.github.v3.star+json
            const actualRepo = repo.repo || repo; // Fallback for older formats or direct repo lists

            const starredAtDate = repo.starred_at ? new Date(repo.starred_at).toLocaleDateString() : 'N/A';

            repoCard.innerHTML = `
                <h3><a href="${actualRepo.html_url}" target="_blank" rel="noopener noreferrer">${actualRepo.name}</a></h3>
                <p>${actualRepo.description || 'No description provided.'}</p>
                <div class="meta-info">
                    <span>
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star">
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 13.147l-3.763 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.55l-3.64.527L5.896 8.85l-.555 3.23 2.914-1.532L10.599 12.08l-.555-3.23 2.623-2.56-3.64-.527L8 2.695Z"></path>
                        </svg>
                        ${actualRepo.stargazers_count || 0}
                    </span>
                    <span>Language: ${actualRepo.language || 'N/A'}</span>
                    <span>Starred: ${starredAtDate}</span>
                </div>
            `;
            repoGrid.appendChild(repoCard);
        });
    }

    // --- Configuration Logic ---
    function saveConfig() {
        GITHUB_USERNAME = githubUsernameInput.value.trim();
        GITHUB_TOKEN = githubTokenInput.value.trim();

        localStorage.setItem('github_username', GITHUB_USERNAME);
        localStorage.setItem('github_token', GITHUB_TOKEN);
    }

    function loadConfig() {
        githubUsernameInput.value = GITHUB_USERNAME;
        githubTokenInput.value = GITHUB_TOKEN; // Pre-fill, but it's a password field
    }

    function showConfigModal() {
        loadConfig();
        showElement(configModal);
    }

    function hideConfigModal() {
        hideElement(configModal);
    }

    // --- Main Initialization Logic ---
    async function initializePage() {
        if (!GITHUB_USERNAME) {
            showConfigModal();
            return;
        }

        showLoading();
        try {
            const user = await fetchUserDetails(GITHUB_USERNAME, GITHUB_TOKEN);
            renderUserDetails(user);

            const starredRepos = await fetchStarredRepos(GITHUB_USERNAME, GITHUB_TOKEN);
            renderRepos(starredRepos);
            hideLoading();
        } catch (err) {
            // Error handling is done inside fetch functions, just ensure loading is hidden
            hideLoading();
        }
    }

    // --- Event Listeners ---
    configureBtn.addEventListener('click', showConfigModal);
    saveConfigBtn.addEventListener('click', () => {
        saveConfig();
        hideConfigModal();
        initializePage(); // Re-initialize with new config
    });
    cancelConfigBtn.addEventListener('click', hideConfigModal);

    // Initial load
    initializePage();
});
