# LME Trade Request Generator

This repository contains a small web application that helps build standardized text for London Metal Exchange (LME) trade requests. It is a single page built with HTML and Tailwind CSS.

## Running the app

Because the page registers a service worker, it needs to be served over HTTP. You can use any simple static server. Examples:

```bash
# Using Python
python -m http.server 8000
# or using Node
npx http-server -p 8000
```

After the server starts, open `http://localhost:8000/index.html` in a modern browser.

## Building

No build step is required. The repository only contains static files (`index.html`, `main.js`, `manifest.json` and `service-worker.js`). If you modify the code you simply refresh the browser to see the changes.

## Service worker

`service-worker.js` caches `index.html` when the app is installed. This allows the app to continue working when offline after the first visit.

## Prerequisites

- A modern browser that supports service workers.
- Any local HTTP server (Python 3, Node.js, etc.) if you want to run it locally.

## License

This project is licensed under the [MIT License](LICENSE).
