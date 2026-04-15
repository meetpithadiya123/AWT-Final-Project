import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const HODDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, solved: 0 });
    const [recent, setRecent] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/hod/dashboard");
            setStats(res.data);
            setRecent(res.data.recentComplaints);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout title="HOD Dashboard">
            <div className="stats">
                <div className="stat-card total">
                    <i className="fas fa-file-alt" style={{ color: '#3498db' }}></i>
                    <h2>{stats.total}</h2>
                    <p>Total Complaints</p>
                </div>
                <div className="stat-card pending">
                    <i className="fas fa-clock" style={{ color: '#e74c3c' }}></i>
                    <h2>{stats.pending}</h2>
                    <p>Pending</p>
                </div>
                <div className="stat-card processing">
                    <i className="fas fa-spinner" style={{ color: '#f39c12' }}></i>
                    <h2>{stats.processing}</h2>
                    <p>Processing</p>
                </div>
                <div className="stat-card solved">
                    <i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i>
                    <h2>{stats.solved}</h2>
                    <p>Solved</p>
                </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <Link to="/hod/view-complaints" style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                    height: '100px', background: '#667eea', color: 'white', textDecoration: 'none',
                    borderRadius: '12px', fontSize: '20px', fontWeight: 'bold'
                }}>
                    <i className="fas fa-tasks"></i> View & Process Complaints
                </Link>
            </div>

            <div className="glass-card" style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                <h3>Recent Complaints</h3>
                <table style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recent.map(c => (
                            <tr key={c._id}>
                                <td>{c.enrollment}</td>
                                <td>{c.title}</td>
                                <td>
                                    <span style={{ 
                                        color: c.status === 'Solved' ? '#2ecc71' : c.status === 'Processing' ? '#f39c12' : '#e74c3c'
                                    }}>
                                        {c.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default HODDashboard;
