import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const AuthModal = ({ show, onClose, onLoginSuccess }) => {
    const { login } = useApp();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('john.doe@example.com');

    if (!show) return null;

    const handleSubmit = () => {
        login(email);
        onLoginSuccess(isLoginMode ? "Successfully signed in." : "Welcome! Account created successfully.");
        onClose();
    };

    return (
        <div className="modal-overlay active" id="authModal">
            <div className="modal-box">
                <span className="close-auth" onClick={onClose}><i className="fa-solid fa-xmark"></i></span>
                <div className="modal-title">{isLoginMode ? "Welcome Back" : "Create Account"}</div>
                <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-light)' }}>Access your trips and budget.</p>
                {!isLoginMode && (
                    <input type="text" className="auth-input" placeholder="Full Name" />
                )}
                <input type="email" className="auth-input" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="auth-input" placeholder="Password" />
                {!isLoginMode && (
                    <input type="password" className="auth-input" placeholder="Confirm Password" />
                )}
                <button className="auth-btn" onClick={handleSubmit}>{isLoginMode ? "Sign In" : "Sign Up"}</button>
                <div className="auth-switch" onClick={() => setIsLoginMode(!isLoginMode)}>
                    {isLoginMode ? "New here? Create an account" : "Already have an account? Sign In"}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
