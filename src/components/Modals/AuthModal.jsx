import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { login as apiLogin, register as apiRegister } from '../../services/authService';

const AuthModal = ({ show, onClose, onLoginSuccess }) => {
    const { login } = useApp();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('demo@solotraveller.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!show) return null;

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (isLoginMode) {
                const data = await apiLogin(email, password);
                login(data);
                onLoginSuccess("Successfully signed in.");
                onClose();
            } else {
                await apiRegister(email, password);
                // Auto login after register? Or ask to login?
                // For now, let's ask to sign in or auto-login if token provided (it's not).
                // Let's just switch to login mode and fill creds
                setIsLoginMode(true);
                setError("Account created! Please sign in.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" id="authModal">
            <div className="modal-box">
                <span className="close-auth" onClick={onClose}><i className="fa-solid fa-xmark"></i></span>
                <div className="modal-title">{isLoginMode ? "Welcome Back" : "Create Account"}</div>
                <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-light)' }}>Access your trips and budget.</p>
                {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '10px' }}>{error}</p>}
                {!isLoginMode && (
                    <input type="text" className="auth-input" placeholder="Full Name" />
                )}
                <input type="email" className="auth-input" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="auth-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {!isLoginMode && (
                    <input type="password" className="auth-input" placeholder="Confirm Password" />
                )}
                <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Processing..." : (isLoginMode ? "Sign In" : "Sign Up")}
                </button>
                <div className="auth-switch" onClick={() => setIsLoginMode(!isLoginMode)}>
                    {isLoginMode ? "New here? Create an account" : "Already have an account? Sign In"}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
