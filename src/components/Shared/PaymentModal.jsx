import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';

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
        setTimeout(() => {
            setStep('success');
            setUserPlan(planName.toLowerCase());

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
