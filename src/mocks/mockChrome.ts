// src/mocks/mockChrome.ts

import { Extension } from "../utils/types";

const fakeExtensions = [
    { id: "ext1", name: "Ext 1", enabled: true, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext2", name: "Ext 2", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
];

let fakeStorage: Record<string, any> = {
    blacklist: [],
    groups: {
        DevTools: ["ext1"],
    },
};

export const mockChrome = {
    runtime: {
        id: "mocked-extension",
        openOptionsPage: () => window.location.href = "/settings.html",
    },
    storage: {
        local: {
            get: (keys: any, callback: (result: any) => void) => {
                if (typeof keys === "string") {
                    callback({ [keys]: fakeStorage[keys] });
                } else if (Array.isArray(keys)) {
                    const result = keys.reduce((acc, key) => {
                        acc[key] = fakeStorage[key];
                        return acc;
                    }, {} as any);
                    callback(result);
                } else {
                    callback(fakeStorage);
                }
            },
            set: (items: any, callback?: () => void) => {
                fakeStorage = { ...fakeStorage, ...items };
                console.log("Mock storage updated:", fakeStorage);
                if (callback) callback();
            },
        },
    },
    management: {
        getAll: (callback: (exts: Extension[]) => void) => {
            callback(fakeExtensions);
        },
        setEnabled: async (id: string, enabled: boolean) => {
            const ext = fakeExtensions.find(e => e.id === id);
            if (ext) ext.enabled = enabled;
            console.log(`Mock: Set ${id} to ${enabled ? "enabled" : "disabled"}`);
        },
    },
};
