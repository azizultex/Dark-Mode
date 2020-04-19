const cookieName = 'wordpress_dark_mode';
const darkModeEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.cookie = `${cookieName}=${darkModeEnabled}`;