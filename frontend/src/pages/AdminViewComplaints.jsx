import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const AdminViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);

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
                        <th>User</th>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map(c => (
                        <tr key={c._id}>
                            <td>{c.enrollment}</td>
                            <td>{c.title}</td>
                            <td>{c.priority}</td>
                            <td>{new Date(c.date).toLocaleDateString()}</td>
                            <td>
                                <span style={{ 
                                    padding: '5px 10px', borderRadius: '5px', fontSize: '12px',
                                    background: c.status === 'Solved' ? '#2ecc71' : c.status === 'Processing' ? '#f39c12' : '#e74c3c',
                                    color: 'white'
                                }}>
                                    {c.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default AdminViewComplaints;
