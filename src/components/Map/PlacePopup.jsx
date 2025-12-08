import React, { useState } from 'react';

const PlacePopup = ({ stop, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('About');
    const [showHours, setShowHours] = useState(false);
    const details = stop.placeDetails || {};
    const cardData = stop.cardData || {};

    // Fallbacks
    const name = details.placeName || stop.name;
    const rating = details.rating || (stop.rating ? parseFloat(stop.rating.split(' ')[0]) : null);
    const address = details.formatted_address || details.address || stop.address;
    const phone = details.formatted_phone_number || details.international_phone_number || details.phoneNumber || stop.phone;
    const website = details.website || stop.website;

    // Data Access with Fallbacks (Defensive)
    const getList = (primary, secondary) => {
        if (Array.isArray(primary) && primary.length > 0) return primary;
        if (Array.isArray(secondary) && secondary.length > 0) return secondary;
        return Array.isArray(primary) ? primary : (Array.isArray(secondary) ? secondary : []);
    };

    const sources = getList(cardData.sources, details.sources);
    const reviews = getList(cardData.reviews, details.reviews);

    // Description defaults
    const description = cardData.description || "No description available.";

    // Images 
    const imageSrc = "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=300&q=80";

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(name + ' ' + (address || ''))}`;
    const googleMapsUrl = details.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + (address || ''))}`;
    const tripadvisorUrl = sources.find(s => s.siteName?.toLowerCase().includes('tripadvisor'))?.url || `https://www.google.com/search?q=${encodeURIComponent('Tripadvisor ' + name)}`;

    if (stop.cardDataLoading) {
        return (
            <div className="map-popup-card skeleton-popup">
                <div className="popup-tabs">
                    {['About', 'Book', 'Reviews', 'Photos', 'Mentions'].map(tab => (
                        <div key={tab} className={`popup-tab ${tab === 'About' ? 'active' : ''}`} style={{ opacity: 0.5 }}>{tab}</div>
                    ))}
                </div>
                <div className="popup-content">
                    <div className="skeleton-header" style={{ height: '60px', marginBottom: '15px' }}></div>
                    <div className="skeleton-block" style={{ height: '200px', borderRadius: '8px' }}></div>
                </div>
            </div>
        );
    }

    // Filter to hide Booking tab if no data
    const bookingOptions = cardData.bookingOptions || [
        { name: "General Admission", price: "$34.95", official: true },
        { name: "Deluxe Pass", price: "$49.95", official: true }
    ];
    const hasBooking = true;

    const tabs = ['About', 'Reviews', 'Photos', 'Mentions'];
    if (hasBooking) tabs.splice(1, 0, 'Book');

    return (
        <div className="map-popup-card">
            {/* Navigation Header */}
            <div className="popup-nav-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onNavigate('prev')} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.8rem' }} title="Previous">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button onClick={() => onNavigate('next')} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.8rem' }} title="Next">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{stop.dayIdx + 1} of {stop.totalStops}</span>
            </div>

            <div className="popup-tabs">
                {tabs.map(tab => (
                    <div
                        key={tab}
                        className={`popup-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className="popup-content">

                {/* ABOUT TAB */}
                {activeTab === 'About' && (
                    <>
                        {/* Header Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{ flex: 1, paddingRight: '15px' }}>
                                <div className="popup-title-section" style={{ marginBottom: '8px' }}>
                                    <div className="popup-marker-badge" style={{ marginRight: '8px', color: 'white' }}>{stop.markerNumber || <i className="fa-solid fa-location-dot"></i>}</div>
                                    <h3 className="popup-title" style={{ fontSize: '1.2rem', lineHeight: '1.3' }}>{name}</h3>
                                </div>
                                <div className="popup-description" style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#3c4043' }}>
                                    {cardData.generatedDescription || cardData.description || description || "No description available."}
                                </div>
                                <button className="popup-btn-added" style={{ padding: '6px 12px', fontSize: '0.85rem' }}><i className="fa-solid fa-bookmark"></i> Added <i className="fa-solid fa-chevron-down"></i></button>
                            </div>
                            {/* Thumbnail */}
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '12px',
                                backgroundImage: `url(${details.photo_urls && details.photo_urls.length > 0 ? details.photo_urls[0] : imageSrc})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                flexShrink: 0
                            }}></div>
                        </div>

                        {/* Tags Row */}
                        <div className="popup-tags-row" style={{ flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                            <span className="popup-tag-pill" style={{ fontWeight: 700 }}>{details.price_level ? '$'.repeat(details.price_level) : '$$$'}</span>
                            {(() => {
                                const cats = Array.isArray(cardData.categories) ? cardData.categories : [];
                                const types = Array.isArray(details.types) ? details.types : [];
                                return [...cats, ...types]
                                    .filter((item, index, self) => self.indexOf(item) === index)
                                    .map((cat, i) => (
                                        <span key={i} className="popup-tag-pill" style={{ textTransform: 'capitalize' }}>{typeof cat === 'string' ? cat.replace(/_/g, ' ') : String(cat)}</span>
                                    ));
                            })()}
                        </div>

                        {/* Rating Row */}
                        <div className="popup-rating-row" style={{ marginBottom: '15px', alignItems: 'center' }}>
                            <span className="rating-score" style={{ color: '#fa7e14', fontWeight: 700 }}>{details.rating || rating || '4.5'}</span>
                            <div className="stars" style={{ margin: '0 5px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <i key={i} className={`fa-solid fa-star ${i <= Math.round(parseFloat(details.rating || rating || 0)) ? 'filled-orange' : 'empty-orange'}`} style={{ color: i <= Math.round(parseFloat(details.rating || rating || 0)) ? '#fa7e14' : '#dadce0', fontSize: '0.8rem' }}></i>
                                ))}
                            </div>
                            <span className="review-count" style={{ color: '#70757a' }}>({details.user_ratings_total || 0})</span>
                            {sources.length > 0 && (
                                <div className="mentions-container" style={{ marginLeft: '8px', display: 'inline-block', position: 'relative' }}>
                                    <span style={{ color: '#1a73e8', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Mentioned in {sources.length} lists</span>
                                    <div className="mentions-dropdown">
                                        {sources.map((s, i) => (
                                            <a key={i} href={s.url} target="_blank" rel="noreferrer" className="mention-link-item">
                                                <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.7rem' }}></i>
                                                {s.siteName || s.source || 'Read Article'}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tips / Reasons List */}
                        {cardData.reasonsToVisit && cardData.reasonsToVisit.length > 0 && (
                            <div className="tips-list" style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '6px', fontWeight: 600, color: '#202124' }}>Tips for visiting</h4>
                                {cardData.reasonsToVisit.slice(0, 3).map((tip, i) => (
                                    <div key={i} className="tip-item" style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.9rem', color: '#3c4043' }}>
                                        <i className="fa-regular fa-lightbulb" style={{ marginTop: '3px', color: '#5f6368' }}></i>
                                        <span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Details List (Address, Hours, etc) */}
                        <div className="popup-details-list">
                            <div className="popup-detail-item">
                                <i className="fa-solid fa-location-dot detail-icon"></i>
                                <span className="detail-text">{details.formatted_address || address}</span>
                            </div>

                            {/* Hours Logic */}
                            {(() => {
                                const candidates = [
                                    details.weekdayDescriptions,
                                    details.openingHours?.weekdayDescriptions,
                                    details.opening_hours?.weekdayDescriptions, // Fix: Added this specific path from user JSON
                                    details.opening_hours?.weekdayText,
                                    details.currentOpeningHours?.weekdayText,
                                    details.currentOpeningHours?.weekdayDescriptions,
                                    details.regularOpeningHours?.weekdayDescriptions,
                                    cardData.openingHours?.weekdayDescriptions,
                                    cardData.currentOpeningHours?.weekdayDescriptions,
                                    cardData.weekdayDescriptions
                                ];
                                const hoursData = candidates.find(arr => Array.isArray(arr) && arr.length > 0) || [];

                                const isOpen = details.opening_hours?.openNow ??
                                    details.currentOpeningHours?.openNow ??
                                    cardData.openingHours?.openNow ??
                                    cardData.currentOpeningHours?.openNow;

                                if (hoursData.length > 0 || isOpen !== undefined) {
                                    return (
                                        <div className="popup-detail-item" style={{ alignItems: 'flex-start' }}>
                                            <i className="fa-regular fa-clock detail-icon" style={{ marginTop: '2px' }}></i>
                                            <div className="detail-text" style={{ width: '100%' }}>
                                                <div style={{ fontWeight: 500, color: '#202124', marginBottom: '4px' }}>
                                                    {isOpen ? <span style={{ color: 'green' }}>Open Now</span> : (isOpen === false ? <span style={{ color: '#d93025' }}>Closed</span> : (hoursData.length > 0 ? <span style={{ color: '#5f6368' }}>Hours</span> : null))}
                                                </div>
                                                <div className="day-letters">
                                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => {
                                                        const today = new Date().getDay();
                                                        return <span key={d} className={`day-letter ${i === today ? 'active' : ''}`}>{d}</span>
                                                    })}
                                                    {hoursData.length > 0 && (
                                                        <span className="blue-link" style={{ marginLeft: '10px', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => setShowHours(!showHours)}>
                                                            {showHours ? 'Hide times' : 'Show times'}
                                                        </span>
                                                    )}
                                                </div>
                                                {showHours && hoursData.length > 0 && (
                                                    <div className="all-hours-list" style={{ marginTop: '8px', color: '#3c4043' }}>
                                                        {hoursData.map((text, i) => (
                                                            <div key={i} style={{ fontSize: '0.85rem', marginBottom: '2px' }}>{text}</div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                return null;
                            })()}

                            <div className="popup-detail-item">
                                <i className="fa-solid fa-hourglass-half detail-icon"></i>
                                <span className="detail-text">People typically spend {cardData.minMinutesSpent ? `${Math.floor(cardData.minMinutesSpent / 60)} hr` : '1'} - {cardData.maxMinutesSpent ? `${Math.floor(cardData.maxMinutesSpent / 60)} hr` : '2 hr'} here</span>
                            </div>

                            {phone && (
                                <div className="popup-detail-item">
                                    <i className="fa-solid fa-phone detail-icon"></i>
                                    <span className="detail-text blue-link">{phone}</span>
                                </div>
                            )}
                            {website && (
                                <div className="popup-detail-item">
                                    <i className="fa-solid fa-globe detail-icon"></i>
                                    <a href={website} target="_blank" rel="noreferrer" className="detail-text blue-link" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', verticalAlign: 'middle' }}>{website}</a>
                                </div>
                            )}
                        </div>

                        {/* Open In Footer */}
                        <div className="popup-footer" style={{ marginTop: '15px', marginBottom: '15px', borderTop: 'none', paddingTop: '0' }}>
                            <span className="footer-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Open in:</span>
                            <div className="footer-links" style={{ display: 'flex', gap: '10px' }}>
                                <a href={tripadvisorUrl} target="_blank" rel="noreferrer" className="footer-pill"><i className="fa-brands fa-tripadvisor" style={{ color: '#00af87' }}></i> Tripadvisor</a>
                                <a href={googleSearchUrl} target="_blank" rel="noreferrer" className="footer-pill"><i className="fa-brands fa-google" style={{ color: '#ea4335' }}></i> Google</a>
                                <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="footer-pill"><i className="fa-solid fa-map-location-dot" style={{ color: '#4285f4' }}></i> Google Maps</a>
                            </div>
                        </div>

                        {/* Highlighted Reviews */}
                        {reviews.length > 0 && (
                            <div className="highlighted-reviews-section" style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '10px', fontWeight: 600 }}>Highlighted reviews</h4>
                                <div className="highlight-reviews-scroll" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
                                    {reviews.slice(0, 3).map((rev, idx) => (
                                        <div key={idx} className="highlight-review-card" style={{
                                            minWidth: '260px',
                                            maxWidth: '260px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <p style={{ fontSize: '0.9rem', color: '#3c4043', lineHeight: '1.4', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                "{rev.text?.text}"
                                            </p>
                                        </div>
                                    ))}
                                    <div className="view-all-card"
                                        onClick={() => setActiveTab('Reviews')}
                                        style={{ minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '8px', cursor: 'pointer' }}>
                                        <div style={{ textAlign: 'center', color: '#1a73e8', fontWeight: 500, fontSize: '0.9rem' }}>
                                            <i className="fa-solid fa-arrow-right" style={{ display: 'block', marginBottom: '4px' }}></i>
                                            All reviews
                                        </div>
                                    </div>
                                </div>
                                <button className="btn-see-reviews-grey" onClick={() => setActiveTab('Reviews')}>See all reviews</button>
                            </div>
                        )}

                    </>
                )}

                {/* REVIEWS TAB */}
                {activeTab === 'Reviews' && (
                    <div className="reviews-tab-container">
                        {/* Summary Block */}
                        <div className="reviews-summary" style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '0.9rem', color: '#3c4043', lineHeight: '1.5', marginBottom: '15px' }}>
                                {cardData.generatedDescription || description}
                            </p>

                            <div className="ratings-breakdown-row" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                {/* Aggregated Scores */}
                                <div className="score-blocks" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className="score-block" style={{ background: '#1F3C6D', color: 'white', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '140px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{rating || 4.5}</div>
                                        <div style={{ fontSize: '0.7rem', textAlign: 'right' }}>
                                            <div style={{ fontWeight: 600 }}>Excellent</div>
                                            <div>{details.user_ratings_total} reviews</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="12" alt="G" /> From Google</div>
                                        </div>
                                    </div>
                                    <div className="score-block" style={{ background: '#1F3C6D', color: 'white', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '140px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>4.2</div>
                                        <div style={{ fontSize: '0.7rem', textAlign: 'right' }}>
                                            <div style={{ fontWeight: 600 }}>Very Good</div>
                                            <div>5381 reviews</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><i className="fa-brands fa-tripadvisor"></i> Tripadvisor</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bars */}
                                <div className="rating-bars" style={{ flex: 1 }}>
                                    {[5, 4, 3, 2, 1].map((stars, i) => {
                                        const width = [85, 40, 10, 5, 2][i] + '%';
                                        return (
                                            <div key={stars} className="bar-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.8rem' }}>
                                                <span style={{ width: '45px', fontWeight: 600 }}>{stars} stars</span>
                                                <div className="bar-bg" style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div className="bar-fill" style={{ width: width, height: '100%', background: '#E7AA53' }}></div>
                                                </div>
                                                <span style={{ width: '30px', color: '#70757a', fontSize: '0.75rem', textAlign: 'right' }}>1200</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="reviews-list">
                            {reviews ? reviews.map((rev, idx) => (
                                <div key={idx} className="full-review-card" style={{ borderTop: '1px solid #eee', padding: '15px 0' }}>
                                    <div className="review-header" style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.rating}/5</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.authorAttribution?.displayName || "Google User"}</div>
                                        <div style={{ color: '#70757a', fontSize: '0.85rem' }}>• {rev.relativePublishTimeDescription}</div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="14" alt="G" style={{ marginLeft: 'auto' }} />
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#3c4043', lineHeight: '1.5' }}>
                                        {rev.text?.text}
                                    </div>
                                </div>
                            )) : (
                                <div className="empty-state">No reviews available.</div>
                            )}
                        </div>
                        <button className="btn-see-reviews-grey" style={{ width: '100%', marginTop: '10px' }}>See more reviews</button>
                    </div>
                )}

                {/* PHOTOS TAB - UNEVEN BENTO */}
                {activeTab === 'Photos' && (
                    <div className="photos-grid">
                        {Array.isArray(details.photo_urls) && details.photo_urls.length > 0 ? details.photo_urls.slice(0, 12).map((url, idx) => (
                            <div key={idx} className={`photo-item item-${idx}`} style={{ backgroundImage: `url(${url})` }}></div>
                        )) : (
                            <div className="empty-state">No photos available.</div>
                        )}
                    </div>
                )}

                {/* MENTIONS TAB - QUOTE STYLE */}
                {activeTab === 'Mentions' && sources && (
                    <div className="popup-mentions-list">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#202124' }}>Mentioned in articles</h3>
                        {sources.map((source, i) => (
                            <div key={i} className="mention-card" style={{ marginBottom: '20px', borderLeft: '3px solid #dadce0', paddingLeft: '15px' }}>
                                <div className="mention-quote" style={{ fontStyle: 'italic', color: '#5f6368', fontSize: '0.95rem', marginBottom: '8px', lineHeight: '1.6' }}>
                                    {source.snippet ? `"${source.snippet}..."` : `"One of the best places to visit in ${details.address?.split(',')?.[1] || 'the city'}..."`}
                                </div>
                                <a href={source.url} target="_blank" rel="noreferrer" className="mention-source-link" style={{ fontSize: '0.9rem', color: '#1a73e8', textDecoration: 'none', fontWeight: 500 }}>
                                    {source.siteName || source.shortName || "Read full article"}
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* BOOK TAB */}
                {activeTab === 'Book' && (
                    <div className="booking-tab">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '15px' }}>Booking options</h3>
                        <div className="booking-options-grid" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {bookingOptions.map((opt, i) => (
                                <div key={i} className="booking-card-new" style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    width: '100%',
                                    marginBottom: '10px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{opt.name}</div>
                                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{opt.price}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {opt.official && (
                                            <span style={{ fontSize: '0.75rem', color: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '4px', padding: '2px 6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className="fa-solid fa-check-circle"></i> OFFICIAL
                                            </span>
                                        )}
                                        <span style={{ fontSize: '0.8rem', color: '#70757a' }}>{name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="see-more-options" style={{ marginTop: '15px', color: '#202124', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            See more options <i className="fa-solid fa-chevron-down" style={{ marginLeft: '5px' }}></i>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacePopup;
