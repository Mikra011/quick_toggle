import React from "react";
import Blacklist from "./Blacklist/Blacklist";
import HandleGroups from "./HandleGroups/Handlegroups";

const Settings: React.FC = () => {
    return (
        <>
            <Blacklist />
            <hr />
            <HandleGroups />
        </>
    )
}

export default Settings