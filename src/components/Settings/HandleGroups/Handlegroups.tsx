import React, { useEffect, useState } from "react";
import { Extension, GroupMap } from "../../../utils/types";

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

    const toggleExtensionInGroup = (groupName: string, extId: string) => {
        const group = groups[groupName] || [];
        const updated = group.includes(extId)
            ? group.filter((id) => id !== extId)
            : [...group, extId];

        const updatedGroups = { ...groups, [groupName]: updated };
        saveGroups(updatedGroups);
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>Manage Extension Groups</h2>

            <div style={{ marginBottom: 16 }}>
                <input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="New group name"
                    style={{ marginRight: 8 }}
                />
                <button onClick={handleGroupCreation}>Create Group</button>
            </div>

            {Object.entries(groups).map(([groupName, extIds]) => (
                <div key={groupName} style={{ marginBottom: 16 }}>
                    <h3>{groupName}</h3>
                    {extensions.map((ext) => (
                        <label key={ext.id} style={{ display: "block", marginLeft: 8 }}>
                            <input
                                type="checkbox"
                                checked={extIds.includes(ext.id)}
                                onChange={() => toggleExtensionInGroup(groupName, ext.id)}
                            />
                            {ext.name}
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default HandleGroups;
