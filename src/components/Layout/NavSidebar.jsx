import React from 'react';

const NavSidebar = ({ activeView, onSwitchView, isCollapsed, toggleCollapse }) => {

    const navItems = [
        { id: 'landing', label: 'Overview', icon: 'fa-chart-pie' },
        { id: 'explore', label: 'Explore', icon: 'fa-compass' },
        { id: 'notes', label: 'Notes', icon: 'fa-sticky-note' },
        { id: 'places', label: 'Places to visit', icon: 'fa-map-pin' },
        { id: 'itinerary', label: 'Itinerary', icon: 'fa-route' },
        { id: 'budget', label: 'Budget', icon: 'fa-wallet' },
    ];

    return (
        <div className={`nav-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Logo removed as per request */}
            <div style={{ marginTop: '20px' }}></div>

            <div className="nav-action-btn">
                <button className="ai-assist-btn">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> {!isCollapsed && "AI Assistant"}
                </button>
            </div>

            <div className="nav-menu">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onSwitchView(item.id)}
                        title={isCollapsed ? item.label : ''}
                    >
                        <i className={`fa-solid ${item.icon}`}></i>
                        {!isCollapsed && <span>{item.label}</span>}
                    </div>
                ))}
            </div>

            <div className="sidebar-toggle" onClick={toggleCollapse}>
                <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                {!isCollapsed && <span>Collapse sidebar</span>}
            </div>

            <div className="nav-footer">
                {/* Placeholder for settings or user profile if needed */}
            </div>
        </div>
    );
};

export default NavSidebar;
