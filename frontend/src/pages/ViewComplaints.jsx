import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";

const ViewComplaints = () => {
    const { enrollment } = useParams();
    const [complaints, setComplaints] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(`/api/user/complaints/${enrollment}?page=${page}`);
            setComplaints(res.data.complaints);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [enrollment, page]);

    return (
        <Layout title="My Complaints">
            <table>
                <thead>
                    <tr>
                        <th className="no-column">NO.</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Solution</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.length > 0 ? complaints.map((c, index) => (
                        <tr key={c._id}>
                            <td className="no-column">{(page - 1) * 4 + index + 1}</td>
                            <td>{c.title}</td>
                            <td>{c.description}</td>
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
                            <td>{c.solution || "None"}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No complaints found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{
                            padding: '8px 15px',
                            background: page === p ? '#2c3e50' : 'white',
                            color: page === p ? 'white' : '#2c3e50',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </Layout>
    );
};

export default ViewComplaints;
