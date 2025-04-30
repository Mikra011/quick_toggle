import { mockChrome } from "../mocks/mockChrome";

// Detect if running inside a Chrome Extension
const isChromeExtension = typeof chrome !== "undefined" && !!chrome.runtime?.id;

export const getChrome = (): typeof chrome => {
    return isChromeExtension ? chrome : (mockChrome as any);
};
