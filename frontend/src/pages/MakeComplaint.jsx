import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const MakeComplaint = () => {
    const { enrollment } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Low",
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/user/complaint/${enrollment}`, formData);
            navigate(`/user/${enrollment}/view-complaints`);
        } catch (err) {
            alert("Error submitting complaint");
        }
    };

    return (
        <Layout title="Make Complaint">
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
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Priority</label>
                            <select 
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
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
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">
                        <i className="fas fa-paper-plane"></i> Submit Complaint
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default MakeComplaint;
