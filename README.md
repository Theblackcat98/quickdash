# GitHub Starred Repos Viewer

A simple, customizable, and clean web interface to display a GitHub user's starred repositories. This project is designed to be easily forked and deployed on GitHub Pages.

## Features

- **Dynamic User Configuration**: Easily switch between GitHub users.
- **PAT Support**: Use a Personal Access Token for higher API rate limits and to view private starred repos.
- **Clean UI**: A modern, dark-themed, and responsive layout.
- **Customizable Sidebar**: Add your own static content or additional user details.
- **Easy Deployment**: Ready for GitHub Pages with a simple setup.

## How to Use

1. **Fork this repository.**
2. **Enable GitHub Pages**: In your forked repository's settings, go to the "Pages" section and select the `main` branch as the source.
3. **Configure**: The first time you visit the page, a modal will prompt you to enter a GitHub username.

## Customization

- **`index.html`**: Modify the sidebar's `custom-info` section to add your own content.
- **`style.css`**: Change the CSS variables at the top of the file to alter the color scheme.
- **`script.js`**: Extend the `renderUserDetails` function to display more information from the GitHub user object.

## Security Note

When using a Personal Access Token (PAT), be aware that it will be stored in the browser's `localStorage`. For a public-facing site, it is highly recommended to use a server-side proxy to protect your token. This implementation is intended for personal or private use where the user understands the security implications.
