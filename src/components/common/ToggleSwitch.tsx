import React from 'react';
import './ToggleSwitch.css';

type ToggleSwitchProps = {
    isOn: boolean;
    onToggle: () => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
    return (
        <div className={`toggle-switch ${isOn ? 'on' : ''}`} onClick={onToggle}>
            <div className={`slider ${isOn ? 'on' : ''}`} />
        </div>
    );
};

export default ToggleSwitch;
