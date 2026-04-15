import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [enrollment, setEnrollment] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(enrollment, password);
            if (user.role === "admin") navigate("/admin");
            else if (user.role === "hod") navigate("/hod");
            else navigate(`/user/${user.enrollment}`);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Enrollment or Password");
        }
    };

    return (
        <div style={{ background: '#f4f6f9', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '400px', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
                    <i className="fas fa-user-circle"></i> Login
                </h2>
                {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Enrollment NO.</label>
                        <input 
                            type="text" 
                            placeholder="Enter your ER. No." 
                            value={enrollment}
                            onChange={(e) => setEnrollment(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="login-btn" style={{ 
                        width: '100%', padding: '12px', background: '#2c3e50', border: 'none', 
                        color: 'white', fontSize: '15px', borderRadius: '8px', cursor: 'pointer' 
                    }}>
                        <i className="fas fa-sign-in-alt"></i> Login
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: 'gray' }}>
                    Complaint Management System
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
