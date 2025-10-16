import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Reusing the login page wrapper styles for a consistent look

const PrivacyPolicyPage = () => {
    return (
        // Use login wrapper for dark background/centering
        <div className="login-container-wrapper" style={{ alignItems: 'flex-start', paddingTop: '50px' }}>
            <div className="login-container" style={{ display: 'block', minHeight: 'auto', padding: '40px' }}>
                <div className="left-panel" style={{ flex: 'none', padding: '0', maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Privacy Policy</h1>
                    
                    <p><strong>Effective Date: October 2025</strong></p>
                    
                    <p>InvestIQ is committed to protecting the privacy of its users. This policy outlines how we collect, use, and safeguard your information.</p>

                    <h3>1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as your name, email address, and investment data when you use our Scorecard tool. We also collect automated data, including IP address and usage patterns, to improve our service.</p>

                    <h3>2. How We Use Your Information</h3>
                    <p>Your information is used to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Communicate with you regarding your account.</li>
                        <li>Analyze market and startup data to refine our AI models.</li>
                    </ul>

                    <h3>3. Data Sharing and Disclosure</h3>
                    <p>We do not sell your personal data. We may share data with trusted third-party service providers (e.g., cloud hosting) necessary to run our service, under strict confidentiality agreements.</p>
                    
                    <p style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Link to="/" className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px', backgroundColor: '#3c5a77' }}>
                            Go Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;