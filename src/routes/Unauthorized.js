// Unauthorized.js
import React from 'react';
import './Unauthorized.scss'

const Unauthorized = () => {
    return (
        <div className="not-found-page">
            <div className="content">
                <h1 className="title">404</h1>
                <p className="message">Oops! The page you're looking for doesn't exist.</p>

                <div className="actions">
                    {/* <Link to="/" className="btn home-btn">Back to Home</Link>
                    <Link to="/contact" className="btn contact-btn">Contact Us</Link> */}
                </div>

                {/* <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search for what you need..."
                    />
                    <button className="search-btn">Search</button>
                </div> */}
            </div>
        </div>
    );
};

export default Unauthorized;
