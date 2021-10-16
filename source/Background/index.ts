import { browser, Runtime } from "webextension-polyfill-ts";

import { EVENTS, Message, SNFError } from "../events";

class Translator {
  apiKey: string | null;

  constructor() {
    browser.runtime.onMessage.addListener(this.messageHandler.bind(this));
    browser.tabs.onUpdated.addListener((tabId) => {
      browser.tabs.sendMessage(tabId, { type: EVENTS.TAB_UPDATE } as Message);
    });
    browser.storage.sync.get().then(({ API_KEY }) => {
      this.apiKey = API_KEY;
    });
    browser.storage.onChanged.addListener(({ API_KEY: { newValue } }) => {
      this.apiKey = newValue;
    });
  }

  messageHandler(
    message: Message,
    _sender: Runtime.MessageSender
  ): Promise<unknown> | void {
    switch (message.type) {
      case EVENTS.TRANSLATE:
        return this.translate(message.payload as string);
    }
  }

  async translate(word: string) {
    if (!this.apiKey) return Promise.reject(new SNFError("TOKEN_NOT_FOUND"));

    const apiUrl = new URL("https://www.googleapis.com/language/translate/v2");
    apiUrl.searchParams.append("key", this.apiKey);
    apiUrl.searchParams.append("source", "en");
    apiUrl.searchParams.append("target", "tr");
    apiUrl.searchParams.append("q", word);
    try {
      const resp = await fetch(apiUrl.href).then((r) => r.json());
      return Promise.resolve(resp.data.translations[0].translatedText);
    } catch (error) {
      return Promise.reject(new SNFError("TRANSLATE_FETCH_ERROR"));
    }
  }
}

browser.runtime.onInstalled.addListener((): void => {
  new Translator();
});
