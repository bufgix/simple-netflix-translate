import "../styles/index.scss";
import { browser, Runtime } from "webextension-polyfill-ts";
import { EVENTS, Message } from "../events";
import DomObserver from "./DomObserver";
import Panel from "./Panel";

class Injector {
  interval: NodeJS.Timeout;
  subtitleWrapper: HTMLElement;
  subtitle: string;
  panel: Panel;

  constructor() {
    this.panel = new Panel();
    browser.runtime.onMessage.addListener(this.handleMessage.bind(this));
    document.addEventListener("keyup", (ev) => {
      if (ev.key === "t") {
        this.panel.toggle();
      }
    });
  }

  handleMessage(message: Message, _sender: Runtime.MessageSender) {
    switch (message.type) {
      case EVENTS.TAB_UPDATE:
        if (this.checkNetflixWatch()) {
          if (!this.panel.isMounted) {
            (this.panel as Panel).render();
          }
          this.subtitleWrapper = document.querySelector(
            ".player-timedtext"
          ) as HTMLElement;
          const observe = new DomObserver(this.subtitleWrapper, () => {
            this.subtitle = this.subtitleWrapper.innerText;
            this.panel.words = this.subtitle.split(/[\n\s-]+/g);
          });
          observe.observe();
        }
        break;
    }
  }

  checkNetflixWatch() {
    return (
      window.location.hostname === "www.netflix.com" &&
      /\/watch\/*/g.test(window.location.pathname)
    );
  }
}

new Injector();

export {};
