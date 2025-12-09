import React from 'react';
import { useApp } from '../../context/AppContext';

const PlanTypeModal = ({ show, onClose, onStartManual, onOpenTemplate, onUpgrade }) => {
    const { myTrips, userPlan } = useApp();
    if (!show) return null;

    const limit = 5;
    const tripCount = myTrips ? myTrips.length : 0;
    const isFree = userPlan === 'free';
    const limitReached = isFree && tripCount >= limit;

    return (
        <div className="modal-overlay active" id="planTypeModal" onClick={(e) => e.target.id === 'planTypeModal' && onClose()}>
            <div className="modal-box" style={{ width: '800px', maxWidth: '95vw' }}>
                <span className="close-auth" onClick={onClose}>&times;</span>
                <div className="modal-title">Start Planning</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>How would you like to begin your adventure?</p>

                <div className="plan-type-grid">
                    {limitReached ? (
                        <div className="plan-card-option" style={{ gridColumn: '1 / -1', borderColor: 'var(--primary-orange)', background: '#fff5f5' }} onClick={onUpgrade}>
                            <div className="plan-icon"><i className="fa-solid fa-crown" style={{ color: 'var(--primary-orange)' }}></i></div>
                            <div className="plan-title" style={{ color: 'var(--primary-orange)' }}>Limit Reached</div>
                            <div className="plan-desc">You have used {tripCount}/{limit} free trips. Upgrade to create more!</div>
                            <button className="btn-price fill" style={{ marginTop: '10px', width: '100%', padding: '8px', fontSize: '0.9rem' }}>Upgrade Now</button>
                        </div>
                    ) : (
                        <>
                            <div className="plan-card-option" onClick={onStartManual}>
                                <div className="plan-icon"><i className="fa-regular fa-calendar-plus"></i></div>
                                <div className="plan-title">Start from Scratch</div>
                                <div className="plan-desc">Build your itinerary day by day manually.</div>
                            </div>
                            <div className="plan-card-option" onClick={() => onOpenTemplate('template')}>
                                <div className="plan-icon"><i className="fa-solid fa-list-check"></i></div>
                                <div className="plan-title">Use Template</div>
                                <div className="plan-desc">Modify a pre-built popular itinerary.</div>
                            </div>
                            <div className="plan-card-option" onClick={() => onOpenTemplate('ai')}>
                                <div className="plan-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                                <div className="plan-title">Plan with AI</div>
                                <div className="plan-desc">Auto-generate a custom plan in seconds.</div>
                            </div>
                        </>
                    )}
                </div >
                {isFree && !limitReached && (
                    <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        Free Plan Usage: <b>{tripCount} / {limit}</b> trips
                    </div>
                )}
            </div >
        </div >
    );
};

export default PlanTypeModal;
