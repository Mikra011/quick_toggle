import { useEffect, useState } from "react";
import { GroupMap } from "../../utils/types";
import { getChrome } from "../../utils/getChrome";
import ToggleSwitch from "../common/ToggleSwitch";
import "./PopUp.css"

const chrome = getChrome();

const PopUp: React.FC = () => {
    const [groups, setGroups] = useState<GroupMap>({});
    const [allEnabled, setAllEnabled] = useState(true);
    const [groupStates, setGroupStates] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        chrome.storage.local.get("groups", (result) => {
            const groupsData = result.groups as { [key: string]: string[] } || {};
            setGroups(groupsData);

            // Determine initial toggle state for each group
            chrome.management.getAll().then((extensions) => {
                const groupToggles: { [key: string]: boolean } = {};
                Object.entries(groupsData).forEach(([groupName, ids]) => {
                    const relevant = extensions.filter((ext) => ids.includes(ext.id));
                    groupToggles[groupName] = relevant.every((ext) => ext.enabled);
                });
                setGroupStates(groupToggles);
            });
        });

        chrome.management.getAll().then((exts) => {
            chrome.storage.local.get("blacklist", ({ blacklist = [] }) => {
                const anyEnabled = exts.some(
                    (ext) =>
                        ext.enabled &&
                        ext.type === "extension" &&
                        ext.id !== chrome.runtime.id &&
                        !blacklist.includes(ext.id)
                );
                setAllEnabled(anyEnabled);
            });
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
        setGroupStates({ ...groupStates, [groupName]: !anyEnabled });
    };

    const handleToggleAll = async () => {
        const extensions = await chrome.management.getAll();
        const { blacklist = [] } = await chrome.storage.local.get("blacklist");

        const newState = !allEnabled;
        for (const ext of extensions) {
            if (
                ext.type === "extension" &&
                ext.id !== chrome.runtime.id &&
                ext.mayDisable &&
                !blacklist.includes(ext.id)
            ) {
                await chrome.management.setEnabled(ext.id, newState);
            }
        }
        setAllEnabled(newState);
    };

    return (
        <div className="popup-container">
            <h1>QuickToggle</h1>
            <p>Toggle your extensions here 🚀</p>
            <button
                className={`toggle-all-btn ${allEnabled ? "green" : "red"}`}
                onClick={handleToggleAll}
            >
                Turn All {allEnabled ? "Off" : "On"}
            </button>
            {Object.keys(groups).map((groupName) => (
                <div className="group-row" key={groupName}>
                    <span className="group-name">{groupName}</span>
                    <ToggleSwitch
                        isOn={groupStates[groupName]}
                        onToggle={() => handleToggleGroup(groupName)}
                    />
                </div>
            ))}
            <button className="options-btn" onClick={() => chrome.runtime.openOptionsPage()}>
                Options
            </button>
        </div>
    );
};

export default PopUp;
