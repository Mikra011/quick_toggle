import React, { useEffect, useState } from "react";
import { Extension, GroupMap } from "../../../utils/types";
import { getChrome } from "../../../utils/getChrome";
import './HandleGroups.css'

const chrome = getChrome()

const HandleGroups: React.FC = () => {
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [groups, setGroups] = useState<GroupMap>({});
    const [newGroupName, setNewGroupName] = useState("");

    useEffect(() => {
        chrome.management.getAll((exts) => {
            const filtered = exts.filter(
                (ext) => ext.type === "extension" && ext.id !== chrome.runtime.id
            );
            setExtensions(filtered);
        });

        chrome.storage.local.get("groups", (result) => {
            setGroups(result.groups || {});
        });
    }, []);

    const saveGroups = (updatedGroups: GroupMap) => {
        setGroups(updatedGroups);
        chrome.storage.local.set({ groups: updatedGroups });
    };

    const handleGroupCreation = () => {
        if (!newGroupName.trim()) return;
        if (groups[newGroupName]) return; // already exists

        const updatedGroups = { ...groups, [newGroupName]: [] };
        saveGroups(updatedGroups);
        setNewGroupName("");
    };

    const handleDeleteGroup = (groupName: string) => {
        const updatedGroups = { ...groups };
        delete updatedGroups[groupName];
        saveGroups(updatedGroups);
    };

    const toggleExtensionInGroup = (groupName: string, extId: string) => {
        const group = groups[groupName] || [];
        const updated = group.includes(extId)
            ? group.filter((id) => id !== extId)
            : [...group, extId];

        const updatedGroups = { ...groups, [groupName]: updated };
        saveGroups(updatedGroups);
    };

    return (
        <div className="group-container">
            <h1>Manage Extension Groups</h1>

            <div className="group-input">
                <input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="New group name"
                />
                <button onClick={handleGroupCreation}>Create Group</button>
            </div>

            <div className="grid-container">
                {Object.entries(groups).map(([groupName, extIds]) => (
                    <div key={groupName} className="group-card">
                        <div className="group-card-header">
                            <h2>{groupName}</h2>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteGroup(groupName)}
                                title="Delete Group"
                            >
                                🗑️
                            </button>
                        </div>
                        {extensions.map((ext) => (
                            <label key={ext.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <input
                                    type="checkbox"
                                    checked={extIds.includes(ext.id)}
                                    onChange={() => toggleExtensionInGroup(groupName, ext.id)}
                                    className="custom-checkbox"
                                />
                                {ext.icons?.[0] && (
                                    <img src={ext.icons[0].url} alt="" width={16} height={16} />
                                )}
                                {ext.name}
                            </label>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HandleGroups;
