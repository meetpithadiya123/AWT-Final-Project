import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const HODViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selected, setSelected] = useState(null);
    const [update, setUpdate] = useState({ status: "Processing", solution: "" });

    const fetchComplaints = async () => {
        const res = await axios.get("/api/hod/complaints");
        setComplaints(res.data.complaints);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        await axios.post("/api/hod/update-complaint", {
            complaintId: selected._id,
            ...update
        });
        setSelected(null);
        setUpdate({ status: "Processing", solution: "" });
        fetchComplaints();
    };

    return (
        <Layout title="Process Complaints">
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map(c => (
                        <tr key={c._id}>
                            <td>{c.enrollment}</td>
                            <td>{c.title}</td>
                            <td>{c.priority}</td>
                            <td>
                                <span style={{ 
                                    padding: '5px 10px', borderRadius: '5px', fontSize: '12px',
                                    background: c.status === 'Solved' ? '#2ecc71' : c.status === 'Processing' ? '#f39c12' : '#e74c3c',
                                    color: 'white'
                                }}>
                                    {c.status}
                                </span>
                            </td>
                            <td>
                                <button 
                                    onClick={() => { setSelected(c); setUpdate({ status: c.status, solution: c.solution || "" }); }} 
                                    className="btn-primary" 
                                    style={{ padding: '5px 10px', fontSize: '12px' }}
                                >
                                    Process
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selected && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="form-box" style={{ width: '500px' }}>
                        <h3>Process Complaint</h3>
                        <p style={{ margin: '10px 0', color: '#666' }}>From: {selected.enrollment}</p>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={update.status} onChange={e => setUpdate({...update, status: e.target.value})}>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Solved">Solved</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Solution / Remarks</label>
                                <textarea 
                                    rows="4" 
                                    value={update.solution} 
                                    onChange={e => setUpdate({...update, solution: e.target.value})}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Update</button>
                                <button type="button" onClick={() => setSelected(null)} className="btn-primary" style={{ flex: 1, background: '#7f8c8d' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default HODViewComplaints;
