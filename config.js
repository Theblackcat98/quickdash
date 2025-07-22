// --- App Configuration ---
const config = {
    // Default GitHub username to load
    DEFAULT_USERNAME: 'theblackcat98',

    // Number of starred repositories to fetch per page
    REPOS_PER_PAGE: 50,

    // --- Sidebar Customization ---
    // Section title for the custom information block
    CUSTOM_INFO_TITLE: 'My Starred Repos!',

    // Content for the custom information block (can be simple text or HTML)
    CUSTOM_INFO_CONTENT: `
        <p>This is a customizable area.</p>
        <p>You can add any text or static content here by editing <code>config.js</code>.</p>
    `,

    // --- Cache Configuration ---
    // Cache expiration time in milliseconds (e.g., 1 hour)
    CACHE_EXPIRATION_MS: 60 * 60 * 1000,
};
