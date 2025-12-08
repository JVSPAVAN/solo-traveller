import React from 'react';

const ShareModal = ({ show, onClose, onSimulateAction }) => {
    if (!show) return null;

    const copyLink = () => {
        navigator.clipboard.writeText("https://solotraveller.app/trip/ab123");
        onSimulateAction("Link copied to clipboard!");
    };

    return (
        <div className="modal-overlay active" id="shareModal" onClick={(e) => e.target.id === 'shareModal' && onClose()}>
            <div className="modal-box" style={{ width: '450px' }}>
                <span className="close-auth" onClick={onClose}>&times;</span>
                <div className="modal-title">Share Trip</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '15px' }}>Invite friends or share a public link.</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input type="text" className="modern-input" value="https://solotraveller.app/trip/ab123" readOnly />
                    <button className="auth-btn" style={{ width: 'auto', margin: 0 }} onClick={copyLink}>Copy</button>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Share via</div>
                    <div className="social-share-grid">
                        <div className="social-btn s-wa" onClick={() => onSimulateAction('Shared to WhatsApp!')}><i className="fa-brands fa-whatsapp"></i></div>
                        <div className="social-btn s-fb" onClick={() => onSimulateAction('Shared to Facebook!')}><i className="fa-brands fa-facebook-f"></i></div>
                        <div className="social-btn s-in" onClick={() => onSimulateAction('Shared to Instagram!')}><i className="fa-brands fa-instagram"></i></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
