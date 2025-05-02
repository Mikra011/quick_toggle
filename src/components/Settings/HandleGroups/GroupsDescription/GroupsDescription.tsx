import './GroupsDescription.css';

function GroupsDescription() {
    return (
        <div className="groups-description">
            <p>
                Here you can create custom extension groups.
            </p>
            <p>
                Each group appears in the popup, allowing you to quickly turn ON / OFF <span className="highlight">all the extensions within</span> it.
            </p>
            <p>
                When a group is no longer needed, use the 🗑️ icon to remove it.
            </p>
        </div>
    );
}

export default GroupsDescription;
