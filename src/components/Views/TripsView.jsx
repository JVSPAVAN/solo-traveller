import React from 'react';
import { useApp } from '../../context/AppContext';

const TripsView = () => {
    const { myTrips } = useApp();

    return (
        <div id="view-explore" className="view-section active">
            <div style={{ padding: '20px', fontWeight: 700, fontSize: '1.1rem' }}>My Trips</div>
            <div className="trip-list" id="tripsListContainer">
                {myTrips.map((trip, index) => (
                    <div className="trip-card" key={index}>
                        {trip.isUpcoming && <span className="upcoming-badge">UPCOMING</span>}
                        <div className="trip-img" style={{ backgroundImage: `url('${trip.img}')` }}></div>
                        <div className="trip-info">
                            <div className="trip-name">{trip.title}</div>
                            <div className="trip-dates">{trip.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TripsView;
