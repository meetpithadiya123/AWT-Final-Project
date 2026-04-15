import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const MakeComplaint = () => {
    const { enrollment } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Low",
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`/api/user/complaint/${enrollment}`, formData);
            setShowSuccess(true);
            setTimeout(() => {
                navigate(`/user/${enrollment}/view-complaints`);
            }, 2500); // Show animation for 2.5 seconds
        } catch (err) {
            alert("Error submitting complaint");
            setSubmitting(false);
        }
    };

    return (
        <Layout title="Make Complaint">
            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-icon">
                        <i className="fas fa-check"></i>
                    </div>
                    <h2>Successfully Submitted!</h2>
                    <p>Your record has been stored in our system.</p>
                </div>
            )}
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Complaint Title</label>
                        <input 
                            type="text" 
                            placeholder="Brief title of your issue"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required 
                            disabled={submitting}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            rows="5" 
                            placeholder="Detailed description of the problem..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                            disabled={submitting}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Priority</label>
                            <select 
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                disabled={submitting}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Date</label>
                            <input 
                                type="date" 
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                required 
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        <i className={submitting ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i> 
                        {submitting ? " Submitting..." : " Submit Complaint"}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default MakeComplaint;
