import './BlacklistDescription.css';

function BlacklistDescription() {
    return (
        <div className="blacklist-description">
            <p>
                You can blacklist extensions here.
            </p>
            <p>
                When an extension is blacklisted, it will stay unaffected by <span className="highlight">QuickToggle</span>.
            </p>
            <p>
                Meaning it will <span className="highlight">NOT</span> be toggled on or off with the rest of your extensions.
            </p>
        </div>
    );
}

export default BlacklistDescription;
