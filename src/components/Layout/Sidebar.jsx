import React from 'react';

const Sidebar = ({ children, className }) => {
    return (
        <div className={`sidebar ${className || ''}`}>
            {children}
        </div>
    );
};

export default Sidebar;
