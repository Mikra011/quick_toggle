import { useEffect, useState } from "react";
import { GroupMap } from "../../utils/types";
import { getChrome } from "../../utils/getChrome";

const chrome = getChrome()

const PopUp: React.FC = () => {
    const [groups, setGroups] = useState<GroupMap>({});

    useEffect(() => {
        chrome.storage.local.get("groups", (result) => {
            setGroups(result.groups || {});
        });
    }, []);

    const handleToggleGroup = async (groupName: string) => {
        const extensions = await chrome.management.getAll();
        const { blacklist = [], groups = {} } = await chrome.storage.local.get(["blacklist", "groups"]);
        const groupExtIds = groups[groupName] || [];

        const relevant = extensions.filter(
            (ext) =>
                groupExtIds.includes(ext.id) &&
                ext.type === "extension" &&
                ext.id !== chrome.runtime.id &&
                ext.mayDisable &&
                !blacklist.includes(ext.id)
        );

        const anyEnabled = relevant.some((ext) => ext.enabled);

        for (const ext of relevant) {
            await chrome.management.setEnabled(ext.id, !anyEnabled);
        }
    };

    const handleToggleAll = async () => {
        const extensions: chrome.management.ExtensionInfo[] = await chrome.management.getAll();
        const { blacklist = [] }: { blacklist: string[] } = await chrome.storage.local.get('blacklist');

        const anyEnabled = extensions.some(
            (ext) =>
                ext.enabled &&
                ext.type === 'extension' &&
                ext.id !== chrome.runtime.id &&
                !blacklist.includes(ext.id)
        );

        for (const ext of extensions) {
            if (
                ext.type === 'extension' &&
                ext.id !== chrome.runtime.id &&
                ext.mayDisable &&
                !blacklist.includes(ext.id)
            ) {
                await chrome.management.setEnabled(ext.id, !anyEnabled);
            }
        }
    };

    const openSettings = () => {
        chrome.runtime.openOptionsPage();
    };

    return (
        <div style={{ width: 300, padding: 16 }}>
            <h1>QuickToggle</h1>
            <p>Toggle your extensions here 🚀</p>
            <button onClick={handleToggleAll} style={{ marginBottom: 10 }}>Toggle All Extensions</button>
            <button onClick={openSettings}>Settings</button>
            {Object.keys(groups).map((groupName) => (
                <button key={groupName} onClick={() => handleToggleGroup(groupName)} style={{ marginBottom: 6 }}>
                    Toggle {groupName}
                </button>
            ))}
        </div>
    );
};

export default PopUp;
