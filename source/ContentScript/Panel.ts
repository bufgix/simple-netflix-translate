import { isEqual } from "lodash";
import { EVENTS, SNFError } from "../events";
import { sendMessage } from "../utils";

export default class Panel {
  panel: HTMLElement | null;
  _words: string[] = [];
  domListElement: HTMLElement;

  constructor() {}

  set words(value: string[]) {
    const temp = value.filter((word) => word);

    if (this._words.length === 0 || !isEqual(this._words, temp)) {
      this._words = temp;
      this.update();
      return;
    }
  }

  get isMounted() {
    return !!this.panel;
  }

  get isHide() {
    return this.panel?.classList.contains("snt-panel-hide");
  }

  hide() {
    if (this.isMounted) this.panel?.classList.add("snt-panel-hide");
  }
  show() {
    if (this.isMounted) this.panel?.classList.remove("snt-panel-hide");
  }

  toggle() {
    if (this.isHide) {
      this.show();
    } else {
      this.hide();
    }
  }

  create() {
    this.panel = document.querySelector("div.snt-panel");
    if (this.panel) return;
    this.panel = document.createElement("div");
    this.panel.setAttribute("class", "snt-panel");

    const videoDom = document.querySelector(".watch-video");
    if (videoDom) videoDom.appendChild(this.panel);
    this.panel.innerHTML = `<p>No subtitles detected</p >`;
  }

  update() {
    if (!this.panel) return;
    if (this._words.length === 0) return;

    this.domListElement = document.createElement("ul");
    this.panel.innerHTML = "";
    const elements = this._words.map((word) => {
      const listElement = document.createElement("li");
      const key = document.createElement("span");
      const value = document.createElement("button");

      value.addEventListener("click", () => {
        sendMessage({ type: EVENTS.TRANSLATE, payload: word })
          .then((translated) => {
            value.style.textDecoration = "none";
            value.innerText = translated;
          })
          .catch((e: SNFError) => {
            if (e.message === "TOKEN_NOT_FOUND") {
              console.log("No token");
            } else if (e.message === "TRANSLATE_FETCH_ERROR") {
              console.log("Error fetcing data");
            } else {
              console.error(e);
            }
          });
      });

      key.innerText = word;
      value.innerText = "Translate";
      listElement.appendChild(key);
      listElement.appendChild(value);

      return listElement;
    });
    elements.forEach((element) => this.domListElement.appendChild(element));
    this.panel.appendChild(this.domListElement);
  }

  render() {
    this.create();
    this.update();
  }
}
