// src/components/LoadingOverlay.js
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import './LoadingOverlay.scss'; // Tạo file SCSS để style

const LoadingOverlay = () => {
    return (
        <div className="loading-overlay">
            <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
    );
};

export default LoadingOverlay;
