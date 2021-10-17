import * as React from "react";
import { browser, Tabs } from "webextension-polyfill-ts";

import "./styles.scss";

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}

const Popup: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState<Tabs.Tab>();
  React.useEffect(() => {
    browser.runtime.onMessage.addListener((message) => {
      console.log(message);
    });
  }, []);

  const isNetflixWatch = React.useMemo(() => {
    if (currentTab && currentTab.url) {
      const url = new URL(currentTab.url);
      return (
        url.hostname === "www.netflix.com" && /\/watch\/*/g.test(url.pathname)
      );
    }
    return false;
  }, [currentTab?.url]);

  React.useEffect(() => {
    browser.tabs
      .query({ active: true, lastFocusedWindow: true })
      .then((tabs) => {
        setCurrentTab(tabs[0]);
      });
    browser.tabs.onUpdated.addListener((_, __, tabInfo) => {
      setCurrentTab(tabInfo);
    });
  }, []);

  return (
    <section id="popup">
      <img
        width={50}
        height={50}
        alt="Logo"
        src={browser.runtime.getURL("assets/simple_netflix_translte_logo.png")}
      />
      <h2>Simple Netflix Translate</h2>
      {isNetflixWatch ? (
        <p>
          Press <code>t</code> key to open translator
        </p>
      ) : (
        <p>
          Open{" "}
          <a
            href="#"
            onClick={() => openWebPage("https://www.netflix.com/browse")}
          >
            Netflix
          </a>{" "}
          and watch some video
        </p>
      )}
    </section>
  );
};

export default Popup;
