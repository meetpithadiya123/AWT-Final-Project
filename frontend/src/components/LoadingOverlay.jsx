import React from "react";

const LoadingOverlay = ({ text = "Loading..." }) => {
    return (
        <div className="loading-overlay">
            <div className="loading-box">
                <div className="loading-spinner"></div>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
