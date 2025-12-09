import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { login as apiLogin, register as apiRegister } from '../../services/authService';

const AuthModal = ({ show, onClose, onLoginSuccess }) => {
    const { login } = useApp();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                await apiRegister(name, email, password, location, bio);
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
            <div className="modal-box" style={!isLoginMode ? { maxHeight: '90vh', overflowY: 'auto' } : {}}>
                <span className="close-auth" onClick={onClose}><i className="fa-solid fa-xmark"></i></span>
                <div className="modal-title">{isLoginMode ? "Welcome Back" : "Create Account"}</div>
                <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-light)' }}>Access your trips and budget.</p>
                {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '10px' }}>{error}</p>}
                {!isLoginMode && (
                    <>
                        <input type="text" className="auth-input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="text" className="auth-input" placeholder="Location (Optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
                        <textarea className="auth-input" style={{ height: '80px', resize: 'none', paddingTop: '10px' }} placeholder="Bio (Optional)" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                    </>
                )}
                <input type="email" className="auth-input" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />

                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="auth-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingRight: '40px' }}
                    />
                    <i
                        className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            color: '#aaa',
                            fontSize: '0.9rem'
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                    ></i>
                </div>

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
