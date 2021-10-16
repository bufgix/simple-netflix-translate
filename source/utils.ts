import { browser } from "webextension-polyfill-ts";

import { Message } from "./events";

export function sendMessage(message: Message) {
  return browser.runtime.sendMessage(message);
}
