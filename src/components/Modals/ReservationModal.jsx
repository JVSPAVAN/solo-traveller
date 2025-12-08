import React from 'react';

const ReservationModal = ({ show, onClose, type, onSimulateAction }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay active" id="reservationModal" onClick={(e) => e.target.id === 'reservationModal' && onClose()}>
            <div className="modal-box" style={{ width: '500px' }}>
                <span className="close-auth" onClick={onClose}>&times;</span>
                <div className="modal-title">Add {type}</div>
                <div className="generic-modal-content">
                    <div className="form-group"><label>Name / Title</label><input className="modern-input" placeholder="Enter details..." /></div>
                    <div className="form-group"><label>Notes</label><textarea className="modern-input" style={{ height: '80px' }}></textarea></div>
                    <button className="auth-btn" onClick={() => onSimulateAction(`${type} added successfully!`)}>Save {type}</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
