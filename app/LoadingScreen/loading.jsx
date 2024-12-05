import React from 'react';
import './loading.scss'; 

const LoadingScreen = ({ progress }) => {
    return (
        <div className="loading-screen">
            <img src="cary.png" alt="Заставка игры" className="loading-image" />
            <h1>Загрузка...</h1>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default LoadingScreen;