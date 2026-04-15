import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const AdminManageHOD = () => {
    const [hods, setHods] = useState([]);

    const fetchHODs = async () => {
        const res = await axios.get("/api/admin/hods");
        setHods(res.data.hods);
    };

    useEffect(() => {
        fetchHODs();
    }, []);

    const handleDelete = async (hodId) => {
        if (!window.confirm("Delete this HOD?")) return;
        await axios.post("/api/admin/delete-hod", { hodId });
        fetchHODs();
    };

    return (
        <Layout title="Manage HODs">
            <div className="glass-card" style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                <h3>Head of Departments</h3>
                <table style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th>Enrollment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hods.map(h => (
                            <tr key={h._id}>
                                <td>{h.enrollment}</td>
                                <td>
                                    <button onClick={() => handleDelete(h._id)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }}>
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminManageHOD;
