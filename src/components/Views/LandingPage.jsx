import React, { useState } from 'react';
import Logo from '../Shared/Logo';
import { useApp } from '../../context/AppContext';

const LandingPage = ({ onStartPlanning, onOpenGeneric, onOpenAuth, onOpenPayment }) => {
    const { isLoggedIn } = useApp();
    const [showCopyright, setShowCopyright] = useState(true);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (section) => {
        setActiveAccordion(prev => prev === section ? null : section);
    };

    const openPayment = (name, price) => {
        if (!isLoggedIn) {
            onOpenAuth();
            return;
        }
        onOpenPayment(name, price);
    };

    const handleScroll = (e) => {
        const container = e.target;
        if (container.scrollHeight - container.scrollTop - container.clientHeight < 100) {
            setShowCopyright(false);
        } else {
            setShowCopyright(true);
        }
    };

    return (
        <>
            <div id="bg-slideshow">
                <div className="bg-overlay"></div>
                <div className="bg-slide slide-1"></div>
                <div className="bg-slide slide-2"></div>
                <div className="bg-slide slide-3"></div>
            </div>

            <div id="landing-container" onScroll={handleScroll}>
                <div className="landing-nav-spacer" style={{ height: '60px' }}></div>
                <div className="hero-section">
                    <div className="landing-card">
                        <div className="landing-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            <Logo width="60px" height="60px" /> SoloTraveller
                        </div>
                        <div className="landing-tagline">Plan your best trip ever.</div>
                        <p className="landing-desc">Build a complete itinerary in seconds. Import reservations, drag-and-drop stops, and collaborate.</p>
                        <button className="btn-start-hero" onClick={onStartPlanning}>Start Planning</button>
                    </div>
                </div>
                {/* ... content ... */}
                <div className="content-bg">
                    <div className="features-section">
                        <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-main)' }}>Why travelers love us</h2>
                        <div className="features-grid">
                            <div className="feature-box"><div className="feature-icon"><i className="fa-solid fa-map-location-dot"></i></div><div className="feature-title">Smart Mapping</div><div className="feature-text">We automatically place your stops on a map.</div></div>
                            <div className="feature-box"><div className="feature-icon"><i className="fa-solid fa-file-import"></i></div><div className="feature-title">Auto-Import</div><div className="feature-text">Forward your flight and hotel emails.</div></div>
                            <div className="feature-box"><div className="feature-icon"><i className="fa-solid fa-users"></i></div><div className="feature-title">Collaboration</div><div className="feature-text">Invite friends to edit with you.</div></div>
                        </div>
                    </div>

                    {/* PRO FEATURES SECTION */}
                    <div className="features-section pro-section">
                        <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-main)' }}>Maximize your trip planning with Pro</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '40px' }}>Experience the full potential of SoloTraveller with a Pro subscription.</p>
                        <div className="pro-grid">
                            <div className="pro-card">
                                <div className="pro-icon"><i className="fa-solid fa-plane-departure"></i></div>
                                <h3>Live flight updates</h3>
                                <p>Get notified and monitor your flight status to ensure a smooth travel experience.</p>
                            </div>
                            <div className="pro-card">
                                <div className="pro-icon"><i className="fa-solid fa-wifi"></i></div>
                                <h3>Offline access</h3>
                                <p>No wifi, no problem. Your trip plans are locally downloaded for access anywhere.</p>
                            </div>
                            <div className="pro-card">
                                <div className="pro-icon"><i className="fa-solid fa-envelope-open-text"></i></div>
                                <h3>Automatic Gmail scanning</h3>
                                <p>Get your travel reservations automatically synced into your trip plan.</p>
                            </div>
                            <div className="pro-card">
                                <div className="pro-icon"><i className="fa-solid fa-route"></i></div>
                                <h3>Optimize your route</h3>
                                <p>Perfect for road trips and saving $$$ on gas! Get the best route auto-rearranged.</p>
                            </div>
                            <div className="pro-card">
                                <div className="pro-icon"><i className="fa-solid fa-tags"></i></div>
                                <h3>Flight deals</h3>
                                <p>Cheap flight deals sent straight to your inbox so you can plan your next best trip.</p>
                            </div>
                            <div className="pro-card">
                                <div className="pro-icon"><i className="fa-solid fa-map"></i></div>
                                <h3>Export to Google Maps</h3>
                                <p>Get your places exported to Google Maps. Auto-updated when your plans change.</p>
                            </div>
                        </div>
                    </div>

                    {/* REPLACEMENT TOOLS */}
                    <div className="features-section alt-bg">
                        <h2 style={{ fontSize: '2rem', marginBottom: '40px', color: 'var(--text-main)' }}>Features to replace all your other tools</h2>
                        <div className="tool-grid">
                            <div className="tool-card">
                                <div className="tool-visual guide-visual">
                                    <div className="mini-badge">TripAdvisor</div>
                                    <div className="mini-badge">Lonely Planet</div>
                                    <button className="mini-add-btn">Add to plan</button>
                                </div>
                                <h3>Add places from guides with 1 click</h3>
                                <p>We crawled the web so you don't have to. Easily add mentioned places to your plan.</p>
                            </div>
                            <div className="tool-card">
                                <div className="tool-visual expense-visual">
                                    <div className="expense-row">
                                        <span>Burger</span>
                                        <span>$15.00</span>
                                    </div>
                                    <div className="expense-row">
                                        <span>Uber</span>
                                        <span>$24.50</span>
                                    </div>
                                </div>
                                <h3>Expense tracking and splitting</h3>
                                <p>Keep track of your budget and split the cost between your tripmates.</p>
                            </div>
                            <div className="tool-card">
                                <div className="tool-visual collab-visual">
                                    <div className="avatar-group">
                                        <div className="avatar">JD</div>
                                        <div className="avatar">AS</div>
                                        <div className="avatar">MK</div>
                                    </div>
                                </div>
                                <h3>Collaborate with friends in real time</h3>
                                <p>Plan along with your friends with live syncing and collaborative editing.</p>
                            </div>
                        </div>
                    </div>

                    {/* PRICING SECTION */}
                    <div className="features-section pricing-section">
                        <h2 style={{ fontSize: '2rem', marginBottom: '40px', color: 'var(--text-main)' }}>Simple, transparent pricing</h2>
                        <div className="pricing-grid">
                            <div className="pricing-card">
                                <div className="pricing-header">
                                    <h3>Free</h3>
                                    <div className="price">$0</div>
                                </div>
                                <ul className="pricing-features">
                                    <li><i className="fa-solid fa-check"></i> 5 Itineraries</li>
                                    <li><i className="fa-solid fa-check"></i> Unlimited stops</li>
                                    <li><i className="fa-solid fa-check"></i> Collaboration</li>
                                </ul>
                                <button className="btn-price outline" onClick={onStartPlanning}>Get Started</button>
                            </div>
                            <div className="pricing-card popular">
                                <div className="tag-popular">Most Popular</div>
                                <div className="pricing-header">
                                    <h3>Standard</h3>
                                    <div className="price">$10</div>
                                </div>
                                <ul className="pricing-features">
                                    <li><i className="fa-solid fa-check"></i> 10 Monthly Plans</li>
                                    <li><i className="fa-solid fa-check"></i> Email scanning</li>
                                    <li><i className="fa-solid fa-check"></i> Offline access</li>
                                </ul>
                                <button className="btn-price fill" onClick={() => openPayment('Standard', '$10')}>Choose Standard</button>
                            </div>
                            <div className="pricing-card">
                                <div className="pricing-header">
                                    <h3>Pro</h3>
                                    <div className="price">$20</div>
                                </div>
                                <ul className="pricing-features">
                                    <li><i className="fa-solid fa-check"></i> Unlimited Plans</li>
                                    <li><i className="fa-solid fa-check"></i> Route optimization</li>
                                    <li><i className="fa-solid fa-check"></i> Export to Google Maps</li>
                                    <li><i className="fa-solid fa-check"></i> Priority Support</li>
                                </ul>
                                <button className="btn-price outline" onClick={() => openPayment('Pro', '$20')}>Choose Pro</button>
                            </div>
                        </div>
                    </div>
                    {/* ... footer ... */}
                    <footer className="main-footer">
                        <div className="footer-content">
                            <div className="footer-col" style={{ flex: 1.5 }}>
                                <h4 style={{ color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fa-solid fa-route"></i> SoloTraveller</h4>
                                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>Your ultimate companion for exploring the world. Plan, track, and share your adventures with ease.</p>
                            </div>
                            <div className={`footer-col accordion-col ${activeAccordion === 'product' ? 'active' : ''}`}>
                                <h4 onClick={() => toggleAccordion('product')}>Product <i className="fa-solid fa-chevron-down accordion-icon"></i></h4>
                                <div className="footer-links">
                                    <a>Planner</a>
                                    <a>Budget Tracker</a>
                                    <a>Map View</a>
                                </div>
                            </div>
                            <div className={`footer-col accordion-col ${activeAccordion === 'company' ? 'active' : ''}`}>
                                <h4 onClick={() => toggleAccordion('company')}>Company <i className="fa-solid fa-chevron-down accordion-icon"></i></h4>
                                <div className="footer-links">
                                    <a>About Us</a>
                                    <a>Careers</a>
                                    <a>Press</a>
                                </div>
                            </div>
                            <div className={`footer-col accordion-col ${activeAccordion === 'support' ? 'active' : ''}`}>
                                <h4 onClick={() => toggleAccordion('support')}>Support <i className="fa-solid fa-chevron-down accordion-icon"></i></h4>
                                <div className="footer-links">
                                    <a onClick={() => onOpenGeneric('faq')}>Help Center</a>
                                    <a onClick={() => onOpenGeneric('support')}>Contact Us</a>
                                    <a>Privacy Policy</a>
                                </div>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <div>&copy; 2025 SoloTraveller Inc. All rights reserved.</div>
                            <div className="social-links">
                                <i className="fa-brands fa-twitter"></i>
                                <i className="fa-brands fa-instagram"></i>
                                <i className="fa-brands fa-linkedin"></i>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            <div id="sticky-copyright" className={!showCopyright ? 'hidden' : ''}>
                <span className="sticky-text">&copy; 2025 <span className="sticky-brand" style={{ fontWeight: 700 }}>SoloTraveller</span></span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Scroll to Explore <i className="fa-solid fa-arrow-down"></i></div>
            </div>
        </>
    );
};


export default LandingPage;
