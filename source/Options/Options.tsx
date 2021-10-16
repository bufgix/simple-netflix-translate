import * as React from "react";

import { browser } from "webextension-polyfill-ts";

import "./styles.scss";

function Options() {
  const [key, setKey] = React.useState("");
  const [status, setStatus] = React.useState("Loading...");

  React.useEffect(() => {
    browser.storage.sync.get().then(({ API_KEY }) => {
      if (API_KEY) setKey(API_KEY as string);
      setStatus("Save");
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Loading");
    await browser.storage.sync.set({ API_KEY: key });
    setStatus("Saved");
  };

  return (
    <form className="options" onSubmit={onSubmit}>
      <label htmlFor="token">Google API Token</label>
      <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
      <button type="submit">{status}</button>
    </form>
  );
}

export default Options;
