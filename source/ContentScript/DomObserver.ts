export default class DomObserver {
  config: MutationObserverInit = {
    childList: true,
    subtree: true,
  };
  observer: MutationObserver;
  el: HTMLElement;
  constructor(el: HTMLElement, callback: MutationCallback) {
    this.el = el;
    this.observer = new MutationObserver(callback);
  }

  observe() {
    this.observer.observe(this.el, this.config);
  }
}
