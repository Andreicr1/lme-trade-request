# LME Trade Request Generator

This repository contains a small web application that helps build standardized text for London Metal Exchange (LME) trade requests. It is a single page built with HTML and Tailwind CSS.
Tailwind is bundled locally as `tailwind.min.css`, so the interface works without a network connection after the first visit.

## Running the app

Because the page registers a service worker, it needs to be served over HTTP. You can use any simple static server. Examples:

```bash
# Using Python
python -m http.server 8000
# or using Node
npx http-server -p 8000
```

After the server starts, open `http://localhost:8000/index.html` in a modern browser.
Make sure to visit the full path to `index.html` (not just `/`) because the service worker only caches that file.

## Calendar selector

Use the dropdown at the top of the page to choose between the standard Gregorian calendar and the Chinese lunar calendar. Dates shown in the fixing field will reflect the selected calendar, and calculations such as PPT dates will adapt automatically.

## Building

No build step is required. The repository only contains static files (`index.html`, `main.js`, `manifest.json` and `service-worker.js`). If you modify the code you simply refresh the browser to see the changes.

## Service worker

`service-worker.js` caches the essential files (`index.html`, `main.js`, `calendar-utils.js`, `solarlunar.min.js`, `tailwind.min.css` and the service worker itself) when the app is installed. This lets the app continue working offline after the first visit.

If you update the service worker (for example when the cache name changes), refresh the site in your browser so the new worker can take control and clear the previous cache.

## Prerequisites

- A modern browser that supports service workers.
- Any local HTTP server (Python 3, Node.js, etc.) if you want to run it locally.

## License

This project is licensed under the [MIT License](LICENSE).
