import React, { useEffect, useState } from 'react';
import { Extension } from '../../../utils/types';
import { getChrome } from '../../../utils/getChrome';
import ToggleSwitch from '../../common/ToggleSwitch';
import "./Blacklist.css"

const chrome = getChrome()

const Blacklist: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  console.log(extensions)

  useEffect(() => {
    chrome.management.getAll().then(exts => {
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
    <div className="blacklist-container">
      <h1>Blacklist Extensions</h1>
      <div className="grid-container">
        {extensions.map(ext => (
          <div key={ext.id} className="card">
            {ext.icons?.[0] && (
              <img
                src={ext.icons[0].url}
                alt={`${ext.name} icon`}
                width={16}
                height={16}
              />
            )}
            <span>{ext.name}</span>
            <ToggleSwitch
              isOn={blacklist.includes(ext.id)}
              onToggle={() => toggleBlacklist(ext.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );

};

export default Blacklist;
