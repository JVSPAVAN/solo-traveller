import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { updateProfile } from '../../services/authService';

const PaymentModal = ({ planName, price, isOpen, onClose }) => {
    const { setUserPlan } = useApp();
    const [step, setStep] = useState('form'); // 'form', 'processing', 'success'
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep('processing');

        // Simulate API delay
        setTimeout(async () => {
            setStep('success');
            const newPlan = planName.toLowerCase();
            setUserPlan(newPlan);
            try {
                await updateProfile({ plan: newPlan });
            } catch (err) {
                console.error("Failed to update plan on backend", err);
            }

            // Close after showing success
            setTimeout(() => {
                onClose();
                setStep('form');
                setCardName('');
                setCardNumber('');
                setExpiry('');
                setCvc('');
            }, 2000);
        }, 2000);
    };

    return createPortal(
        <div className="modal-overlay-v2">
            <div className="payment-modal-v2">
                <button className="close-modal-btn" onClick={onClose} disabled={step !== 'form'}><i className="fa-solid fa-xmark"></i></button>

                {step === 'form' && (
                    <>
                        <div className="modal-header">
                            <h2>Upgrade to {planName}</h2>
                            <p className="modal-price-tag">{price}</p>
                        </div>
                        {planName === 'Standard' ? (
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <img src="/qr-pay.png" alt="Scan to Pay" style={{ width: '180px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <p style={{ marginTop: '10px', fontWeight: 500, color: 'var(--text-secondary)' }}>Scan via Mobile</p>
                                </div>
                                <div style={{ height: '200px', borderLeft: '1px solid var(--border-color)', margin: '0 10px' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <stripe-buy-button
                                        buy-button-id="buy_btn_1ScFQ5AgUlooxUeiKBvLJbTk"
                                        publishable-key="pk_live_51Sbr9lAgUlooxUeiDuLoLQ9GNUk9EhiK1DcgNcxJSKckDvQVRpnu8fS5okRaS6qu40yLreAOYfUonTqIefnNCPQi00tmPicRXC"
                                    >
                                    </stripe-buy-button>
                                </div>
                            </div>
                        ) : planName === 'Pro' ? (
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <img src="/qr-pay-pro.png" alt="Scan to Pay" style={{ width: '180px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <p style={{ marginTop: '10px', fontWeight: 500, color: 'var(--text-secondary)' }}>Scan via Mobile</p>
                                </div>
                                <div style={{ height: '200px', borderLeft: '1px solid var(--border-color)', margin: '0 10px' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <stripe-buy-button
                                        buy-button-id="buy_btn_1ScG3jAgUlooxUeigBXoPzdx"
                                        publishable-key="pk_live_51Sbr9lAgUlooxUeiDuLoLQ9GNUk9EhiK1DcgNcxJSKckDvQVRpnu8fS5okRaS6qu40yLreAOYfUonTqIefnNCPQi00tmPicRXC"
                                    >
                                    </stripe-buy-button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="payment-form">
                                <div className="form-group">
                                    <label>Cardholder Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="modern-input"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <div className="input-with-icon">
                                        <i className="fa-regular fa-credit-card"></i>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            className="modern-input"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                                            required
                                            maxLength={16}
                                        />
                                    </div>
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="modern-input"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            required
                                            maxLength={5}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CVC</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="modern-input"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                            required
                                            maxLength={3}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="pay-btn">Pay {price}</button>
                                <p className="secure-text"><i className="fa-solid fa-lock"></i> Payments are secure and encrypted.</p>
                            </form>
                        )}
                    </>
                )}

                {step === 'processing' && (
                    <div className="modal-status">
                        <div className="spinner"></div>
                        <h3>Processing Payment...</h3>
                        <p>Please do not close this window.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="modal-status success">
                        <div className="success-icon"><i className="fa-solid fa-check"></i></div>
                        <h3>Payment Successful!</h3>
                        <p>You are now on the {planName} plan.</p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default PaymentModal;
