import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ enrollment: "", password: "", role: "user" });

    const fetchUsers = async () => {
        const res = await axios.get("/api/admin/users");
        setUsers(res.data.users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/admin/add-user", formData);
            setFormData({ enrollment: "", password: "", role: "user" });
            fetchUsers();
            alert("User added successfully");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add user");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Delete this user?")) return;
        await axios.post("/api/admin/delete-user", { userId });
        fetchUsers();
    };

    return (
        <Layout title="Manage Users">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                <div className="form-box" style={{ height: 'fit-content' }}>
                    <h3>Add New User</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
                        <div className="form-group">
                            <label>Enrollment NO.</label>
                            <input 
                                type="text"
                                value={formData.enrollment}
                                onChange={e => setFormData({...formData, enrollment: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="user">User</option>
                                <option value="hod">HOD</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add User</button>
                    </form>
                </div>

                <div className="glass-card" style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h3>Existing Users</h3>
                    <table style={{ marginTop: '15px' }}>
                        <thead>
                            <tr>
                                <th>Enrollment</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.enrollment}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button onClick={() => handleDelete(u._id)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default AdminManageUsers;
