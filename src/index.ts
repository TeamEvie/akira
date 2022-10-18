import { handleRequest } from "./bot";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleRequest(event.request));
  } catch (err) {
    console.error(err);
  }
});
