const PopUp: React.FC = () => {
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
        </div>
    );
};

export default PopUp;
