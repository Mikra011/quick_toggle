import React, { useEffect, useState } from 'react';
import { Extension } from '../../../utils/types';
import { getChrome } from '../../../utils/getChrome';

const chrome = getChrome()

const Blacklist: React.FC = () => {
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [blacklist, setBlacklist] = useState<string[]>([]);

    useEffect(() => {
        chrome.management.getAll((exts) => {
            setExtensions(exts.filter(ext => ext.type === 'extension' && ext.id !== chrome.runtime.id));
        });

        chrome.storage.local.get('blacklist', (result) => {
            setBlacklist(result.blacklist || []);
        });
    }, []);

    const toggleBlacklist = (id: string) => {
        const newList = blacklist.includes(id)
            ? blacklist.filter(item => item !== id)
            : [...blacklist, id];

        setBlacklist(newList);
        chrome.storage.local.set({ blacklist: newList });
    };

    return (
        <div style={{ padding: 16 }}>
            <h1>Blacklist Extensions</h1>
            {extensions.map(ext => (
                <div key={ext.id} style={{ marginBottom: 8 }}>
                    {ext.icons?.[0] && (
                        <img
                            src={ext.icons[0].url}
                            alt={`${ext.name} icon`}
                            width={16}
                            height={16}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <span>{ext.name}</span>
                    <button onClick={() => toggleBlacklist(ext.id)} style={{ marginLeft: 10 }}>
                        {blacklist.includes(ext.id) ? 'Remove from Blacklist' : 'Blacklist'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Blacklist;
