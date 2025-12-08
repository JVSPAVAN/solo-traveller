import React from 'react';

const GenericModal = ({ show, onClose, type, onSimulateAction }) => {
    if (!show) return null;

    let title = "Title";
    let content = null;

    const [isEditing, setIsEditing] = React.useState(false);

    if (type === 'account') {
        title = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span>Account Details</span>
                <i className="fa-solid fa-pen-to-square" style={{ cursor: 'pointer', fontSize: '1rem', color: 'var(--text-light)' }} onClick={() => setIsEditing(!isEditing)}></i>
            </div>
        );
        content = (
            <>
                <div className="info-row"><div className="info-label">Full Name</div><div className="info-val">{isEditing ? <input className="modern-input" defaultValue="John Doe" /> : "John Doe"}</div></div>
                <div className="info-row"><div className="info-label">Email Address</div><div className="info-val">{isEditing ? <input className="modern-input" defaultValue="john.doe@example.com" /> : "john.doe@example.com"}</div></div>
                <div className="info-row"><div className="info-label">Phone</div><div className="info-val">{isEditing ? <input className="modern-input" defaultValue="+1 (555) 123-4567" /> : "+1 (555) 123-4567"}</div></div>
                <div className="info-row"><div className="info-label">Location</div><div className="info-val">{isEditing ? <input className="modern-input" defaultValue="New York, USA" /> : "New York, USA"}</div></div>
                <div className="info-row" style={{ alignItems: 'flex-start' }}><div className="info-label">Bio</div><div className="info-val">{isEditing ? <textarea className="modern-input" defaultValue="Avid solo traveller. Love hiking and photography." /> : "Avid solo traveller. Love hiking and photography."}</div></div>
                {isEditing && <button className="auth-btn" onClick={() => { onSimulateAction('Profile updated successfully!'); setIsEditing(false); }}>Save Profile</button>}
            </>
        );
    } else if (type === 'friends') {
        title = "Friends & Travel Buddies";
        content = (
            <>
                <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                    <input type="text" className="modern-input" placeholder="Invite by email..." />
                    <button onClick={() => onSimulateAction('Friend request sent!')} style={{ background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px', fontWeight: 700 }}>Add</button>
                </div>
                <div className="friend-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt="friend" />
                        <span style={{ fontWeight: 600 }}>Alex M.</span>
                    </div>
                    <span className="friend-btn-remove" onClick={() => onSimulateAction('Removed friend.', 'info')}>Remove</span>
                </div>
                <div className="friend-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt="friend" />
                        <span style={{ fontWeight: 600 }}>Sarah J.</span>
                    </div>
                    <span className="friend-btn-remove" onClick={() => onSimulateAction('Removed friend.', 'info')}>Remove</span>
                </div>
            </>
        );
    } else if (type === 'faq') {
        title = "Frequently Asked Questions";
        content = (
            <>
                <details className="faq-item"><summary>How do I share a trip?</summary><p>Click the invite icon at the top of your itinerary view.</p></details>
                <details className="faq-item"><summary>Is the map offline?</summary><p>Currently, maps require an internet connection.</p></details>
            </>
        );
    } else if (type === 'support') {
        title = "Contact Support";
        content = (
            <>
                <div className="form-group"><label>Your Email</label><input type="email" className="modern-input" placeholder="name@example.com" defaultValue="john.doe@example.com" /></div>
                <div className="form-group"><label>Message</label><textarea className="modern-input" style={{ height: '100px', resize: 'none' }} placeholder="Describe your issue..."></textarea></div>
                <button className="auth-btn" onClick={() => onSimulateAction('Message sent to support!')}>Send Message</button>
            </>
        );
    }

    return (
        <div className="modal-overlay active" id="genericModal" onClick={(e) => e.target.id === 'genericModal' && onClose()}>
            <div className="modal-box" style={{ width: '500px' }}>
                <span className="close-auth" onClick={onClose}><i className="fa-solid fa-xmark"></i></span>
                <div className="modal-title">{title}</div>
                <div className="generic-modal-content">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default GenericModal;
