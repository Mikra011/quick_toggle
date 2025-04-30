const fakeExtensions = [
    { id: "ext1", name: "Ext 1", enabled: true, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext2", name: "Ext 2", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext3", name: "Ext 3", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext4", name: "Ext 4", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext5", name: "Ext 5", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext6", name: "Ext 6", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext7", name: "Ext 7", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext8", name: "Ext 8", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext9", name: "Ext 9", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },
    { id: "ext10", name: "Ext 10", enabled: false, type: "extension", mayDisable: true, icons: [{size: 128, url: "" }] },

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
        getAll: () => {
            return Promise.resolve(fakeExtensions);
        },
        setEnabled: async (id: string, enabled: boolean) => {
            const ext = fakeExtensions.find(e => e.id === id);
            if (ext) ext.enabled = enabled;
        },
    },
};
