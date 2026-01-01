import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        views: 0,
        revenue: 0,
        lessons: 0
    });
    const [activeSection, setActiveSection] = useState('dashboard');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Load data mirroring the legacy logic
        const loadData = () => {
            const getLocal = (key) => JSON.parse(localStorage.getItem(`tensor_${key}`) || '[]');

            const localUsers = getLocal('users');
            const pageviews = getLocal('pageviews');
            const payments = getLocal('payments');
            const lessons = getLocal('lessons');

            setUsers(localUsers);

            setStats({
                users: localUsers.length,
                views: pageviews.length,
                revenue: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
                lessons: lessons.length
            });
        };

        loadData();
    }, []);

    const sidebarItems = [
        { id: 'dashboard', icon: '📊', label: 'Overview' },
        { id: 'users', icon: '👥', label: 'Users' },
        { id: 'analytics', icon: '📈', label: 'Analytics' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', marginTop: '80px' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', background: 'rgba(19, 19, 31, 0.8)', borderRight: '1px solid rgba(212, 175, 55, 0.2)', padding: '20px' }}>
                <h3 style={{ color: '#8892b0', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Admin Controls</h3>
                {sidebarItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        style={{
                            padding: '12px 15px',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            cursor: 'pointer',
                            background: activeSection === item.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                            color: activeSection === item.id ? '#f2d184' : '#e6f1ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px' }}>
                <h1 style={{ marginBottom: '30px', color: '#f2d184' }}>Dashboard Overview</h1>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ color: '#8892b0', fontSize: '0.9rem' }}>TOTAL USERS</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.users}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ color: '#8892b0', fontSize: '0.9rem' }}>PAGE VIEWS</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.views}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ color: '#8892b0', fontSize: '0.9rem' }}>REVENUE</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${stats.revenue}</div>
                    </div>
                </div>

                {/* Users Table (Only visible if Users section active) */}
                {activeSection === 'users' && (
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px', color: '#f2d184' }}>Registered Users</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e6f1ff' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Name</th>
                                    <th style={{ padding: '10px' }}>Email</th>
                                    <th style={{ padding: '10px' }}>Role</th>
                                    <th style={{ padding: '10px' }}>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#8892b0' }}>No users found locally.</td>
                                    </tr>
                                ) : (
                                    users.map((u, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '10px' }}>{u.name}</td>
                                            <td style={{ padding: '10px' }}>{u.email}</td>
                                            <td style={{ padding: '10px' }}>{u.type || 'Student'}</td>
                                            <td style={{ padding: '10px' }}>{new Date(u.created).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
