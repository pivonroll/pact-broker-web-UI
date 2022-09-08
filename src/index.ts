// Conditional ESM module loading (Node.js and browser)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Property 'UrlPattern' does not exist
if (!globalThis.URLPattern) {
    await import('urlpattern-polyfill');
}

import('./bootstrap');

export {};
