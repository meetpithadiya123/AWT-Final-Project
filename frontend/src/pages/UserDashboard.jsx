import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";

const UserDashboard = () => {
    const { enrollment } = useParams();
    const [stats, setStats] = useState({ total: 0, processing: 0, solved: 0 });

    const fetchDashboard = async () => {
        try {
            const res = await axios.get(`/api/user/dashboard/${enrollment}`);
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [enrollment]);

    return (
        <Layout title="Dashboard">
            <div className="stats">
                <div className="stat-card total">
                    <i className="fas fa-file-alt" style={{ color: '#3498db' }}></i>
                    <h2>{stats.total}</h2>
                    <p>Total Complaints</p>
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

            <div style={{ display: 'flex', gap: '30px' }}>
                <Link to={`/user/${enrollment}/make-complaint`} style={{ 
                    flex: 1, height: '160px', background: '#667eea', color: 'white', 
                    borderRadius: '12px', display: 'flex', flexDirection: 'column', 
                    justifyContent: 'center', alignItems: 'center', textDecoration: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                }}>
                    <i className="fas fa-edit" style={{ fontSize: '30px', marginBottom: '10px' }}></i>
                    <h3>Make Complaint</h3>
                </Link>

                <Link to={`/user/${enrollment}/view-complaints`} style={{ 
                    flex: 1, height: '160px', background: '#667eea', color: 'white', 
                    borderRadius: '12px', display: 'flex', flexDirection: 'column', 
                    justifyContent: 'center', alignItems: 'center', textDecoration: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                }}>
                    <i className="fas fa-eye" style={{ fontSize: '30px', marginBottom: '10px' }}></i>
                    <h3>View Complaints</h3>
                </Link>
            </div>
        </Layout>
    );
};

export default UserDashboard;
