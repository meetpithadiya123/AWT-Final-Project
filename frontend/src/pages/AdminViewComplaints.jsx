import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const AdminViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selected, setSelected] = useState(null);

    const fetchComplaints = async () => {
        const res = await axios.get("/api/admin/complaints");
        setComplaints(res.data.complaints);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <Layout title="All Complaints">
            <table>
                <thead>
                    <tr>
                        <th className="no-column">NO.</th>
                        <th>User</th>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((c, index) => (
                        <tr key={c._id}>
                            <td className="no-column">{index + 1}</td>
                            <td>{c.enrollment}</td>
                            <td>{c.title}</td>
                            <td>{c.priority}</td>
                            <td>{new Date(c.date).toLocaleDateString()}</td>
                            <td>
                                <span 
                                    onClick={() => setSelected(c)}
                                    style={{ 
                                        padding: '5px 10px', borderRadius: '5px', fontSize: '12px',
                                        background: c.status === 'Solved' ? '#2ecc71' : c.status === 'Processing' ? '#f39c12' : '#e74c3c',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {c.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selected && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="form-box" style={{ width: '500px', position: 'relative' }}>
                        <button 
                            onClick={() => setSelected(null)} 
                            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}
                        >
                            &times;
                        </button>
                        <div style={{ paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>Complaint Details</h3>
                        </div>
                        <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#2c3e50' }}>
                            <p><strong>User Enrollment:</strong> {selected.enrollment}</p>
                            <p><strong>Title:</strong> {selected.title}</p>
                            <p><strong>Description:</strong> {selected.description}</p>
                            <p><strong>Priority:</strong> <span style={{ color: selected.priority === 'High' ? '#e74c3c' : selected.priority === 'Medium' ? '#f39c12' : '#3498db', fontWeight: 'bold' }}>{selected.priority}</span></p>
                            <p><strong>Date:</strong> {new Date(selected.date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {selected.status}</p>
                            <p><strong>Solution:</strong> {selected.solution || "Not yet provided"}</p>
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button onClick={() => setSelected(null)} className="btn-primary" style={{ background: '#7f8c8d' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminViewComplaints;
