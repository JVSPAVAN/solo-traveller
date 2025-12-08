import React from 'react';

const BudgetView = ({ onAddExpense }) => {
    return (
        <div id="view-budget" className="view-section active">
            <div style={{ padding: '20px', fontWeight: 700, fontSize: '1.1rem' }}>Trip Budget</div>
            <div className="budget-container">
                <div className="bank-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>SoloTraveller Bank</span> <i className="fa-solid fa-building-columns" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <div className="card-chip" style={{ marginTop: '20px' }}></div>
                    <div className="bank-details-row">
                        <div>
                            <div className="bank-label">Available Balance</div>
                            <div className="bank-balance">$4,250.00</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <div>
                            <div className="bank-label">Total Budget</div>
                            <div className="bank-sub">$5,000.00</div>
                        </div>
                        <div>
                            <div className="bank-label">Spent</div>
                            <div className="bank-sub">$750.00</div>
                        </div>
                    </div>
                </div>
                <div className="splitwise-container">
                    <div className="splitwise-header">
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Group Splits</h3>
                        <button onClick={onAddExpense} style={{ border: 'none', background: 'none', color: 'var(--primary-blue)', fontWeight: 600, cursor: 'pointer' }}>Add Expense</button>
                    </div>
                    <div className="split-card">
                        <div className="split-item">
                            <div className="friend-info">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100" className="friend-avatar" alt="avatar" />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Alex M.</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Dinner at Best Friend</div>
                                </div>
                            </div>
                            <div className="split-balance owes-you">owes you $45.00</div>
                        </div>
                        <div className="split-item">
                            <div className="friend-info">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100" className="friend-avatar" alt="avatar" />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sarah J.</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Uber to Airport</div>
                                </div>
                            </div>
                            <div className="split-balance you-owe">you owe $12.50</div>
                        </div>
                        <div className="split-item">
                            <div className="friend-info">
                                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100" className="friend-avatar" alt="avatar" />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mike T.</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>All settled up</div>
                                </div>
                            </div>
                            <div className="split-balance settled">settled</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetView;
